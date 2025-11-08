const { query } = require('../config/database');

// @desc    Get all active modules
// @route   GET /api/v1/modules
// @access  Public
exports.getModules = async (req, res, next) => {
    try {
        const { level } = req.query;

        let whereClause = 'WHERE m.is_active = true';
        let params = [];

        if (level) {
            whereClause += ' AND m.level = $1';
            params.push(level);
        }

        const result = await query(
            `SELECT m.id, m.name, m.slug, m.description, m.level,
                    COUNT(DISTINCT lm.id) as total_classes,
                    COUNT(DISTINCT a.id) as total_assignments
             FROM modules m
             LEFT JOIN learning_materials lm ON m.id = lm.module_id AND lm.is_published = true
             LEFT JOIN assignments a ON m.id = a.module_id AND a.is_active = true
             ${whereClause}
             GROUP BY m.id
             ORDER BY
                CASE m.level
                    WHEN 'fundamental' THEN 1
                    WHEN 'intermediate' THEN 2
                    WHEN 'advance' THEN 3
                END,
                m.name`,
            params
        );

        res.json({
            success: true,
            data: {
                modules: result.rows
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get module by slug
// @route   GET /api/v1/modules/:slug
// @access  Public
exports.getModuleBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const result = await query(
            `SELECT m.id, m.name, m.slug, m.description, m.level, m.is_active,
                    COUNT(DISTINCT lm.id) as total_classes,
                    COUNT(DISTINCT a.id) as total_assignments,
                    COUNT(DISTINCT e.id) as total_enrollments
             FROM modules m
             LEFT JOIN learning_materials lm ON m.id = lm.module_id
             LEFT JOIN assignments a ON m.id = a.module_id AND a.is_active = true
             LEFT JOIN enrollments e ON m.id = e.module_id
             WHERE m.slug = $1 AND m.is_active = true
             GROUP BY m.id`,
            [slug]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        // Check if user is enrolled (if authenticated)
        let enrollment = null;
        if (req.user) {
            const enrollmentResult = await query(
                `SELECT id, status, progress, enrolled_at
                 FROM enrollments
                 WHERE user_id = $1 AND module_id = $2`,
                [req.user.id, result.rows[0].id]
            );

            if (enrollmentResult.rows.length > 0) {
                enrollment = enrollmentResult.rows[0];
            }
        }

        res.json({
            success: true,
            data: {
                module: result.rows[0],
                enrollment: enrollment
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get module learning materials
// @route   GET /api/v1/modules/:slug/materials
// @access  Private
exports.getModuleMaterials = async (req, res, next) => {
    try {
        const { slug } = req.params;

        // Get module
        const moduleResult = await query(
            'SELECT id, name, slug, level FROM modules WHERE slug = $1 AND is_active = true',
            [slug]
        );

        if (moduleResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        const module = moduleResult.rows[0];

        // Check if user is enrolled
        const enrollmentCheck = await query(
            'SELECT id FROM enrollments WHERE user_id = $1 AND module_id = $2',
            [req.user.id, module.id]
        );

        if (enrollmentCheck.rows.length === 0 && req.user.role === 'user') {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled in this module to access materials'
            });
        }

        // Get all learning materials
        const materials = await query(
            `SELECT id, class_number, title, description, video_url,
                    content_type, estimated_duration, created_at
             FROM learning_materials
             WHERE module_id = $1
             ORDER BY class_number`,
            [module.id]
        );

        res.json({
            success: true,
            data: {
                module: module,
                materials: materials.rows
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get specific class material
// @route   GET /api/v1/modules/:slug/materials/:classNumber
// @access  Private
exports.getClassMaterial = async (req, res, next) => {
    try {
        const { slug, classNumber } = req.params;

        // Get module
        const moduleResult = await query(
            'SELECT id, name, slug, level FROM modules WHERE slug = $1 AND is_active = true',
            [slug]
        );

        if (moduleResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        const module = moduleResult.rows[0];

        // Check if user is enrolled (unless admin/assessor)
        if (req.user.role === 'user') {
            const enrollmentCheck = await query(
                'SELECT id, progress FROM enrollments WHERE user_id = $1 AND module_id = $2',
                [req.user.id, module.id]
            );

            if (enrollmentCheck.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'You must be enrolled in this module'
                });
            }
        }

        // Get class material
        const materialResult = await query(
            `SELECT id, class_number, title, description, video_url,
                    content_type, content_data, code_examples, estimated_duration,
                    created_at, updated_at
             FROM learning_materials
             WHERE module_id = $1 AND class_number = $2`,
            [module.id, classNumber]
        );

        if (materialResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Class material not found'
            });
        }

        // Get related assignment (if any)
        const assignmentResult = await query(
            `SELECT id, title, description, due_date, total_points
             FROM assignments
             WHERE module_id = $1 AND class_number = $2 AND is_active = true`,
            [module.id, classNumber]
        );

        res.json({
            success: true,
            data: {
                module: module,
                material: materialResult.rows[0],
                assignment: assignmentResult.rows.length > 0 ? assignmentResult.rows[0] : null
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Create learning material (Admin)
// @route   POST /api/v1/modules/:slug/materials
// @access  Admin
exports.createLearningMaterial = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const {
            class_number,
            title,
            description,
            video_url,
            content_type,
            content_data,
            code_examples,
            estimated_duration
        } = req.body;

        // Get module
        const moduleResult = await query(
            'SELECT id FROM modules WHERE slug = $1',
            [slug]
        );

        if (moduleResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        const moduleId = moduleResult.rows[0].id;

        // Check if class number already exists
        const existingClass = await query(
            'SELECT id FROM learning_materials WHERE module_id = $1 AND class_number = $2',
            [moduleId, class_number]
        );

        if (existingClass.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Class number already exists for this module'
            });
        }

        // Create learning material
        const result = await query(
            `INSERT INTO learning_materials
             (module_id, class_number, title, description, video_url, content_type,
              content_data, code_examples, estimated_duration)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                moduleId,
                class_number,
                title,
                description || null,
                video_url || null,
                content_type || 'video',
                JSON.stringify(content_data || {}),
                JSON.stringify(code_examples || []),
                estimated_duration || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Learning material created successfully',
            data: {
                material: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update learning material (Admin)
// @route   PUT /api/v1/modules/:slug/materials/:id
// @access  Admin
exports.updateLearningMaterial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            video_url,
            content_type,
            content_data,
            code_examples,
            estimated_duration
        } = req.body;

        const fieldsToUpdate = {};
        if (title !== undefined) fieldsToUpdate.title = title;
        if (description !== undefined) fieldsToUpdate.description = description;
        if (video_url !== undefined) fieldsToUpdate.video_url = video_url;
        if (content_type !== undefined) fieldsToUpdate.content_type = content_type;
        if (content_data !== undefined) fieldsToUpdate.content_data = JSON.stringify(content_data);
        if (code_examples !== undefined) fieldsToUpdate.code_examples = JSON.stringify(code_examples);
        if (estimated_duration !== undefined) fieldsToUpdate.estimated_duration = estimated_duration;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        const setClause = Object.keys(fieldsToUpdate)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');

        const values = [...Object.values(fieldsToUpdate), id];

        const result = await query(
            `UPDATE learning_materials SET ${setClause} WHERE id = $${values.length}
             RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Learning material not found'
            });
        }

        res.json({
            success: true,
            message: 'Learning material updated successfully',
            data: {
                material: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete learning material (Admin)
// @route   DELETE /api/v1/modules/:slug/materials/:id
// @access  Admin
exports.deleteLearningMaterial = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            'DELETE FROM learning_materials WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Learning material not found'
            });
        }

        res.json({
            success: true,
            message: 'Learning material deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;
