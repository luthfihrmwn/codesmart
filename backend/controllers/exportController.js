const ExcelJS = require('exceljs');
const { pool } = require('../config/database');

/**
 * Export grades to Excel
 */
exports.exportGrades = async (req, res) => {
    try {
        const { module_id, assignment_id, format = 'xlsx' } = req.query;

        // Build query
        let query = `
            SELECT
                s.id as submission_id,
                s.submitted_at,
                s.graded_at,
                s.score,
                s.grade,
                s.feedback,
                u.id as student_id,
                u.name as student_name,
                u.email as student_email,
                u.current_level,
                a.id as assignment_id,
                a.title as assignment_title,
                a.max_score,
                a.class_number,
                m.id as module_id,
                m.name as module_name,
                m.level as module_level,
                grader.name as graded_by_name
            FROM submissions s
            JOIN users u ON s.user_id = u.id
            JOIN assignments a ON s.assignment_id = a.id
            JOIN modules m ON a.module_id = m.id
            LEFT JOIN users grader ON s.graded_by = grader.id
            WHERE s.status = 'graded'
        `;

        const params = [];

        if (module_id) {
            params.push(module_id);
            query += ` AND m.id = $${params.length}`;
        }

        if (assignment_id) {
            params.push(assignment_id);
            query += ` AND a.id = $${params.length}`;
        }

        query += ` ORDER BY m.level, a.class_number, u.name`;

        const result = await pool.query(query, params);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'No graded submissions found'
            });
        }

        if (format === 'csv') {
            return exportToCSV(res, result.rows);
        } else {
            return exportToExcel(res, result.rows);
        }

    } catch (error) {
        console.error('Error exporting grades:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting grades',
            error: error.message
        });
    }
};

/**
 * Export student progress report
 */
exports.exportStudentProgress = async (req, res) => {
    try {
        const { student_id, module_id } = req.query;

        if (!student_id) {
            return res.status(400).json({
                success: false,
                message: 'Student ID is required'
            });
        }

        // Get student info
        const studentResult = await pool.query(
            'SELECT id, name, email, current_level, pretest_score FROM users WHERE id = $1',
            [student_id]
        );

        if (studentResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const student = studentResult.rows[0];

        // Get submissions
        let query = `
            SELECT
                s.*,
                a.title as assignment_title,
                a.max_score,
                a.class_number,
                m.name as module_name,
                m.level as module_level
            FROM submissions s
            JOIN assignments a ON s.assignment_id = a.id
            JOIN modules m ON a.module_id = m.id
            WHERE s.user_id = $1
        `;

        const params = [student_id];

        if (module_id) {
            params.push(module_id);
            query += ` AND m.id = $${params.length}`;
        }

        query += ` ORDER BY m.level, a.class_number, s.submitted_at`;

        const submissionsResult = await pool.query(query, params);

        return exportStudentProgressToExcel(res, student, submissionsResult.rows);

    } catch (error) {
        console.error('Error exporting student progress:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting student progress',
            error: error.message
        });
    }
};

/**
 * Export class summary/statistics
 */
exports.exportClassSummary = async (req, res) => {
    try {
        const { module_id } = req.query;

        if (!module_id) {
            return res.status(400).json({
                success: false,
                message: 'Module ID is required'
            });
        }

        // Get module info
        const moduleResult = await pool.query(
            'SELECT * FROM modules WHERE id = $1',
            [module_id]
        );

        if (moduleResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        const module = moduleResult.rows[0];

        // Get statistics
        const statsQuery = `
            SELECT
                u.id as student_id,
                u.name as student_name,
                u.email,
                COUNT(s.id) as total_submissions,
                COUNT(CASE WHEN s.status = 'graded' THEN 1 END) as graded_submissions,
                COUNT(CASE WHEN s.status = 'submitted' THEN 1 END) as pending_submissions,
                ROUND(AVG(CASE WHEN s.status = 'graded' THEN s.score END), 2) as average_score,
                MIN(CASE WHEN s.status = 'graded' THEN s.score END) as min_score,
                MAX(CASE WHEN s.status = 'graded' THEN s.score END) as max_score
            FROM users u
            LEFT JOIN submissions s ON u.id = s.user_id
            LEFT JOIN assignments a ON s.assignment_id = a.id
            WHERE u.role = 'student'
                AND a.module_id = $1
            GROUP BY u.id, u.name, u.email
            HAVING COUNT(s.id) > 0
            ORDER BY average_score DESC NULLS LAST, u.name
        `;

        const statsResult = await pool.query(statsQuery, [module_id]);

        return exportClassSummaryToExcel(res, module, statsResult.rows);

    } catch (error) {
        console.error('Error exporting class summary:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting class summary',
            error: error.message
        });
    }
};

/**
 * Helper: Export to Excel
 */
async function exportToExcel(res, data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Grades');

    // Set column widths and headers
    worksheet.columns = [
        { header: 'Student Name', key: 'student_name', width: 25 },
        { header: 'Email', key: 'student_email', width: 30 },
        { header: 'Level', key: 'current_level', width: 15 },
        { header: 'Module', key: 'module_name', width: 25 },
        { header: 'Assignment', key: 'assignment_title', width: 35 },
        { header: 'Class #', key: 'class_number', width: 10 },
        { header: 'Score', key: 'score', width: 10 },
        { header: 'Max Score', key: 'max_score', width: 12 },
        { header: 'Grade (%)', key: 'grade', width: 12 },
        { header: 'Submitted', key: 'submitted_at', width: 20 },
        { header: 'Graded', key: 'graded_at', width: 20 },
        { header: 'Graded By', key: 'graded_by_name', width: 20 },
        { header: 'Feedback', key: 'feedback', width: 40 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add data
    data.forEach(row => {
        worksheet.addRow({
            ...row,
            submitted_at: row.submitted_at ? new Date(row.submitted_at).toLocaleString() : '-',
            graded_at: row.graded_at ? new Date(row.graded_at).toLocaleString() : '-',
            score: row.score || '-',
            grade: row.grade || '-'
        });
    });

    // Auto-filter
    worksheet.autoFilter = {
        from: 'A1',
        to: 'M1'
    };

    // Set response headers
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=grades_export_${Date.now()}.xlsx`
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
}

/**
 * Helper: Export to CSV
 */
function exportToCSV(res, data) {
    const headers = [
        'Student Name', 'Email', 'Level', 'Module', 'Assignment',
        'Class #', 'Score', 'Max Score', 'Grade (%)', 'Submitted', 'Graded',
        'Graded By', 'Feedback'
    ];

    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        const rowData = [
            row.student_name,
            row.student_email,
            row.current_level,
            row.module_name,
            row.assignment_title,
            row.class_number,
            row.score || '-',
            row.max_score,
            row.grade || '-',
            row.submitted_at ? new Date(row.submitted_at).toLocaleString() : '-',
            row.graded_at ? new Date(row.graded_at).toLocaleString() : '-',
            row.graded_by_name || '-',
            `"${row.feedback || '-'}"`
        ];
        csv += rowData.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=grades_export_${Date.now()}.csv`
    );
    res.send(csv);
}

/**
 * Helper: Export student progress to Excel
 */
async function exportStudentProgressToExcel(res, student, submissions) {
    const workbook = new ExcelJS.Workbook();

    // Student Info Sheet
    const infoSheet = workbook.addWorksheet('Student Info');
    infoSheet.columns = [
        { header: 'Field', key: 'field', width: 20 },
        { header: 'Value', key: 'value', width: 40 }
    ];

    infoSheet.addRow({ field: 'Name', value: student.name });
    infoSheet.addRow({ field: 'Email', value: student.email });
    infoSheet.addRow({ field: 'Current Level', value: student.current_level });
    infoSheet.addRow({ field: 'Pretest Score', value: student.pretest_score || 'N/A' });
    infoSheet.getRow(1).font = { bold: true };

    // Submissions Sheet
    const submissionsSheet = workbook.addWorksheet('Submissions');
    submissionsSheet.columns = [
        { header: 'Module', key: 'module_name', width: 25 },
        { header: 'Level', key: 'module_level', width: 15 },
        { header: 'Assignment', key: 'assignment_title', width: 35 },
        { header: 'Class #', key: 'class_number', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Score', key: 'score', width: 10 },
        { header: 'Max Score', key: 'max_score', width: 12 },
        { header: 'Grade (%)', key: 'grade', width: 12 },
        { header: 'Submitted', key: 'submitted_at', width: 20 },
        { header: 'Graded', key: 'graded_at', width: 20 },
        { header: 'Feedback', key: 'feedback', width: 40 }
    ];

    submissionsSheet.getRow(1).font = { bold: true };
    submissionsSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
    };
    submissionsSheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    submissions.forEach(row => {
        submissionsSheet.addRow({
            ...row,
            submitted_at: row.submitted_at ? new Date(row.submitted_at).toLocaleString() : '-',
            graded_at: row.graded_at ? new Date(row.graded_at).toLocaleString() : '-'
        });
    });

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=student_progress_${student.name}_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
}

/**
 * Helper: Export class summary to Excel
 */
async function exportClassSummaryToExcel(res, module, students) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Class Summary');

    // Module info at top
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = `Module: ${module.name} (${module.level.toUpperCase()})`;
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.addRow([]);

    // Headers
    worksheet.addRow([
        'Student Name',
        'Email',
        'Total Submissions',
        'Graded',
        'Pending',
        'Average Score',
        'Min Score',
        'Max Score'
    ]);

    worksheet.getRow(3).font = { bold: true };
    worksheet.getRow(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(3).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Data
    students.forEach(student => {
        worksheet.addRow([
            student.student_name,
            student.email,
            student.total_submissions,
            student.graded_submissions,
            student.pending_submissions,
            student.average_score || '-',
            student.min_score || '-',
            student.max_score || '-'
        ]);
    });

    // Column widths
    worksheet.columns = [
        { width: 25 },
        { width: 30 },
        { width: 18 },
        { width: 12 },
        { width: 12 },
        { width: 15 },
        { width: 12 },
        { width: 12 }
    ];

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=class_summary_${module.slug}_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
}
