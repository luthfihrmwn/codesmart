const { pool } = require('../config/database');

// Get all classes
exports.getClasses = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                c.*,
                u.name as assessor_name,
                u.email as assessor_email,
                u.photo_url as assessor_photo,
                0 as enrolled_students
            FROM classes c
            LEFT JOIN users u ON c.assessor_id = u.id
            ORDER BY c.level, c.code
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching classes',
            error: error.message
        });
    }
};

// Get single class by ID
exports.getClassById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT
                c.*,
                u.name as assessor_name,
                u.email as assessor_email,
                u.photo_url as assessor_photo,
                0 as enrolled_students
            FROM classes c
            LEFT JOIN users u ON c.assessor_id = u.id
            WHERE c.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching class:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching class',
            error: error.message
        });
    }
};

// Create new class
exports.createClass = async (req, res) => {
    try {
        const { name, code, level, description, capacity, schedule, assessor_id } = req.body;

        const result = await pool.query(`
            INSERT INTO classes (name, code, level, description, capacity, schedule, assessor_id, is_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, true)
            RETURNING *
        `, [name, code, level, description, capacity || 30, schedule || 'Flexible', assessor_id]);

        res.status(201).json({
            success: true,
            message: 'Class created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating class',
            error: error.message
        });
    }
};

// Update class
exports.updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, level, description, capacity, schedule, assessor_id, is_active } = req.body;

        const result = await pool.query(`
            UPDATE classes
            SET name = COALESCE($1, name),
                code = COALESCE($2, code),
                level = COALESCE($3, level),
                description = COALESCE($4, description),
                capacity = COALESCE($5, capacity),
                schedule = COALESCE($6, schedule),
                assessor_id = COALESCE($7, assessor_id),
                is_active = COALESCE($8, is_active),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING *
        `, [name, code, level, description, capacity, schedule, assessor_id, is_active, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        res.json({
            success: true,
            message: 'Class updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating class',
            error: error.message
        });
    }
};

// Delete class
exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM classes WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        res.json({
            success: true,
            message: 'Class deleted successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting class',
            error: error.message
        });
    }
};
