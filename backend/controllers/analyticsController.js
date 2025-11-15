const { pool } = require('../config/database');

/**
 * Get comprehensive dashboard analytics
 */
exports.getDashboardAnalytics = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user.id;

        let analytics = {};

        if (userRole === 'assessor' || userRole === 'admin') {
            analytics = await getAssessorAnalytics(userId, userRole);
        } else if (userRole === 'student') {
            analytics = await getStudentAnalytics(userId);
        }

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard analytics',
            error: error.message
        });
    }
};

/**
 * Get student performance over time
 */
exports.getStudentPerformance = async (req, res) => {
    try {
        const { student_id, module_id, days = 30 } = req.query;

        if (!student_id) {
            return res.status(400).json({
                success: false,
                message: 'Student ID is required'
            });
        }

        let query = `
            SELECT
                DATE(s.graded_at) as date,
                COUNT(*) as submissions_count,
                ROUND(AVG(s.score), 2) as average_score,
                MIN(s.score) as min_score,
                MAX(s.score) as max_score,
                m.name as module_name,
                m.level
            FROM submissions s
            JOIN assignments a ON s.assignment_id = a.id
            JOIN modules m ON a.module_id = m.id
            WHERE s.user_id = $1
                AND s.status = 'graded'
                AND s.graded_at >= NOW() - INTERVAL '${days} days'
        `;

        const params = [student_id];

        if (module_id) {
            params.push(module_id);
            query += ` AND m.id = $${params.length}`;
        }

        query += `
            GROUP BY DATE(s.graded_at), m.name, m.level
            ORDER BY date ASC
        `;

        const result = await pool.query(query, params);

        res.json({
            success: true,
            data: {
                performance: result.rows,
                total_days: parseInt(days)
            }
        });
    } catch (error) {
        console.error('Error fetching student performance:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student performance',
            error: error.message
        });
    }
};

/**
 * Get module completion rates
 */
exports.getModuleCompletionRates = async (req, res) => {
    try {
        const query = `
            SELECT
                m.id,
                m.name,
                m.level,
                COUNT(DISTINCT a.id) as total_assignments,
                COUNT(DISTINCT e.user_id) as enrolled_students,
                COUNT(DISTINCT s.user_id) as active_students,
                COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END) as completed_submissions,
                COUNT(DISTINCT s.id) as total_submissions,
                ROUND(
                    (COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END)::float /
                     NULLIF(COUNT(DISTINCT a.id) * COUNT(DISTINCT e.user_id), 0)) * 100,
                    2
                ) as completion_rate
            FROM modules m
            LEFT JOIN assignments a ON m.id = a.module_id
            LEFT JOIN enrollments e ON m.id = e.module_id
            LEFT JOIN submissions s ON a.id = s.assignment_id AND e.user_id = s.user_id
            WHERE m.is_active = true
            GROUP BY m.id, m.name, m.level
            ORDER BY
                CASE m.level
                    WHEN 'fundamental' THEN 1
                    WHEN 'intermediate' THEN 2
                    WHEN 'advance' THEN 3
                END
        `;

        const result = await pool.query(query);

        res.json({
            success: true,
            data: {
                modules: result.rows
            }
        });
    } catch (error) {
        console.error('Error fetching module completion rates:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching module completion rates',
            error: error.message
        });
    }
};

/**
 * Get grade distribution
 */
exports.getGradeDistribution = async (req, res) => {
    try {
        const { module_id, assignment_id } = req.query;

        let query = `
            SELECT
                CASE
                    WHEN s.grade >= 90 THEN 'A (90-100)'
                    WHEN s.grade >= 80 THEN 'B (80-89)'
                    WHEN s.grade >= 70 THEN 'C (70-79)'
                    WHEN s.grade >= 60 THEN 'D (60-69)'
                    ELSE 'F (0-59)'
                END as grade_range,
                COUNT(*) as count,
                ROUND(AVG(s.score), 2) as avg_score
            FROM submissions s
            JOIN assignments a ON s.assignment_id = a.id
            WHERE s.status = 'graded'
        `;

        const params = [];

        if (module_id) {
            params.push(module_id);
            query += ` AND a.module_id = $${params.length}`;
        }

        if (assignment_id) {
            params.push(assignment_id);
            query += ` AND a.id = $${params.length}`;
        }

        query += `
            GROUP BY grade_range
            ORDER BY
                CASE grade_range
                    WHEN 'A (90-100)' THEN 1
                    WHEN 'B (80-89)' THEN 2
                    WHEN 'C (70-79)' THEN 3
                    WHEN 'D (60-69)' THEN 4
                    ELSE 5
                END
        `;

        const result = await pool.query(query, params);

        // Calculate statistics
        const statsQuery = `
            SELECT
                COUNT(*) as total_graded,
                ROUND(AVG(s.grade), 2) as average_grade,
                MIN(s.grade) as min_grade,
                MAX(s.grade) as max_grade,
                ROUND(STDDEV(s.grade), 2) as std_deviation
            FROM submissions s
            JOIN assignments a ON s.assignment_id = a.id
            WHERE s.status = 'graded'
            ${module_id ? `AND a.module_id = $1` : ''}
            ${assignment_id ? `AND a.id = $${params.length}` : ''}
        `;

        const statsResult = await pool.query(statsQuery, params);

        res.json({
            success: true,
            data: {
                distribution: result.rows,
                statistics: statsResult.rows[0]
            }
        });
    } catch (error) {
        console.error('Error fetching grade distribution:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching grade distribution',
            error: error.message
        });
    }
};

/**
 * Get engagement metrics
 */
exports.getEngagementMetrics = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        // Daily active users
        const dailyActiveQuery = `
            SELECT
                DATE(created_at) as date,
                COUNT(DISTINCT user_id) as active_users
            FROM (
                SELECT user_id, created_at FROM submissions
                UNION ALL
                SELECT user_id, created_at FROM discussions
                UNION ALL
                SELECT user_id, created_at FROM discussion_replies
            ) as activities
            WHERE created_at >= NOW() - INTERVAL '${days} days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `;

        const dailyActiveResult = await pool.query(dailyActiveQuery);

        // Activity breakdown
        const activityBreakdownQuery = `
            SELECT
                'Submissions' as activity_type,
                COUNT(*) as count
            FROM submissions
            WHERE created_at >= NOW() - INTERVAL '${days} days'
            UNION ALL
            SELECT
                'Discussions' as activity_type,
                COUNT(*) as count
            FROM discussions
            WHERE created_at >= NOW() - INTERVAL '${days} days'
            UNION ALL
            SELECT
                'Discussion Replies' as activity_type,
                COUNT(*) as count
            FROM discussion_replies
            WHERE created_at >= NOW() - INTERVAL '${days} days'
        `;

        const activityBreakdownResult = await pool.query(activityBreakdownQuery);

        // Most active students
        const activeStudentsQuery = `
            SELECT
                u.id,
                u.name,
                u.email,
                COUNT(DISTINCT s.id) as submissions_count,
                COUNT(DISTINCT d.id) as discussions_count,
                COUNT(DISTINCT dr.id) as replies_count,
                (COUNT(DISTINCT s.id) + COUNT(DISTINCT d.id) + COUNT(DISTINCT dr.id)) as total_activities
            FROM users u
            LEFT JOIN submissions s ON u.id = s.user_id
                AND s.created_at >= NOW() - INTERVAL '${days} days'
            LEFT JOIN discussions d ON u.id = d.user_id
                AND d.created_at >= NOW() - INTERVAL '${days} days'
            LEFT JOIN discussion_replies dr ON u.id = dr.user_id
                AND dr.created_at >= NOW() - INTERVAL '${days} days'
            WHERE u.role = 'student'
            GROUP BY u.id, u.name, u.email
            HAVING (COUNT(DISTINCT s.id) + COUNT(DISTINCT d.id) + COUNT(DISTINCT dr.id)) > 0
            ORDER BY total_activities DESC
            LIMIT 10
        `;

        const activeStudentsResult = await pool.query(activeStudentsQuery);

        res.json({
            success: true,
            data: {
                daily_active_users: dailyActiveResult.rows,
                activity_breakdown: activityBreakdownResult.rows,
                most_active_students: activeStudentsResult.rows,
                period_days: parseInt(days)
            }
        });
    } catch (error) {
        console.error('Error fetching engagement metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching engagement metrics',
            error: error.message
        });
    }
};

/**
 * Get at-risk students (predictive analytics)
 */
exports.getAtRiskStudents = async (req, res) => {
    try {
        const query = `
            SELECT
                u.id,
                u.name,
                u.email,
                u.current_level,
                COUNT(DISTINCT s.id) as total_submissions,
                COUNT(DISTINCT CASE WHEN s.status = 'submitted' THEN s.id END) as pending_submissions,
                ROUND(AVG(CASE WHEN s.status = 'graded' THEN s.score END), 2) as average_score,
                COUNT(DISTINCT CASE
                    WHEN s.status = 'submitted'
                    AND s.submitted_at < NOW() - INTERVAL '7 days'
                    THEN s.id
                END) as overdue_pending,
                MAX(s.submitted_at) as last_submission_date,
                CASE
                    WHEN MAX(s.submitted_at) < NOW() - INTERVAL '14 days' THEN 'high'
                    WHEN MAX(s.submitted_at) < NOW() - INTERVAL '7 days' THEN 'medium'
                    WHEN AVG(CASE WHEN s.status = 'graded' THEN s.score END) < 60 THEN 'medium'
                    WHEN COUNT(DISTINCT CASE WHEN s.status = 'submitted' AND s.submitted_at < NOW() - INTERVAL '7 days' THEN s.id END) > 3 THEN 'high'
                    ELSE 'low'
                END as risk_level
            FROM users u
            LEFT JOIN submissions s ON u.id = s.user_id
            WHERE u.role = 'student'
            GROUP BY u.id, u.name, u.email, u.current_level
            HAVING
                MAX(s.submitted_at) < NOW() - INTERVAL '7 days'
                OR AVG(CASE WHEN s.status = 'graded' THEN s.score END) < 60
                OR COUNT(DISTINCT CASE WHEN s.status = 'submitted' AND s.submitted_at < NOW() - INTERVAL '7 days' THEN s.id END) > 2
            ORDER BY
                CASE risk_level
                    WHEN 'high' THEN 1
                    WHEN 'medium' THEN 2
                    ELSE 3
                END,
                last_submission_date ASC NULLS FIRST
        `;

        const result = await pool.query(query);

        res.json({
            success: true,
            data: {
                at_risk_students: result.rows,
                total_count: result.rowCount
            }
        });
    } catch (error) {
        console.error('Error fetching at-risk students:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching at-risk students',
            error: error.message
        });
    }
};

/**
 * Helper: Get assessor analytics
 */
async function getAssessorAnalytics(userId, userRole) {
    // Overview stats
    const overviewQuery = `
        SELECT
            COUNT(DISTINCT CASE WHEN s.status = 'submitted' THEN s.id END) as pending_submissions,
            COUNT(DISTINCT CASE WHEN s.status = 'graded' AND s.graded_at >= NOW() - INTERVAL '7 days' THEN s.id END) as graded_this_week,
            COUNT(DISTINCT CASE WHEN s.status = 'graded' AND s.graded_at >= NOW() - INTERVAL '30 days' THEN s.id END) as graded_this_month,
            ROUND(AVG(CASE WHEN s.status = 'graded' THEN s.score END), 2) as average_score,
            COUNT(DISTINCT u.id) as total_students,
            COUNT(DISTINCT a.id) as total_assignments,
            COUNT(DISTINCT d.id) as total_discussions
        FROM submissions s
        LEFT JOIN users u ON s.user_id = u.id AND u.role = 'student'
        LEFT JOIN assignments a ON s.assignment_id = a.id
        LEFT JOIN discussions d ON d.created_at >= NOW() - INTERVAL '30 days'
        ${userRole === 'assessor' ? 'WHERE s.graded_by = $1 OR s.graded_by IS NULL' : ''}
    `;

    const overviewResult = await pool.query(
        overviewQuery,
        userRole === 'assessor' ? [userId] : []
    );

    // Recent activity
    const recentActivityQuery = `
        SELECT
            'submission' as type,
            s.id,
            u.name as student_name,
            a.title as assignment_title,
            s.submitted_at as date
        FROM submissions s
        JOIN users u ON s.user_id = u.id
        JOIN assignments a ON s.assignment_id = a.id
        WHERE s.status = 'submitted'
        ORDER BY s.submitted_at DESC
        LIMIT 5
    `;

    const recentActivityResult = await pool.query(recentActivityQuery);

    return {
        overview: overviewResult.rows[0],
        recent_activity: recentActivityResult.rows
    };
}

/**
 * Helper: Get student analytics
 */
async function getStudentAnalytics(userId) {
    const query = `
        SELECT
            COUNT(DISTINCT s.id) as total_submissions,
            COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END) as graded_count,
            COUNT(DISTINCT CASE WHEN s.status = 'submitted' THEN s.id END) as pending_count,
            ROUND(AVG(CASE WHEN s.status = 'graded' THEN s.score END), 2) as average_score,
            MAX(CASE WHEN s.status = 'graded' THEN s.score END) as highest_score,
            MIN(CASE WHEN s.status = 'graded' THEN s.score END) as lowest_score,
            COUNT(DISTINCT e.module_id) as enrolled_modules
        FROM submissions s
        LEFT JOIN enrollments e ON e.user_id = $1
        WHERE s.user_id = $1
    `;

    const result = await pool.query(query, [userId]);

    return {
        overview: result.rows[0]
    };
}
