/**
 * Admin Reports & Analytics Integration
 * CodeSmart LMS - Supabase Backend
 */

// Check authentication and admin role
if (!authService.requireAuth()) {
    window.location.href = '/index.html';
}

const currentUser = authService.getCurrentUser();
if (currentUser.role !== 'admin') {
    alert('Access denied! Admin only.');
    window.location.href = '/src/pages/user/dashboard-new.html';
}

let statistics = null;
let allUsers = [];
let allSubmissions = [];

// Initialize
async function initReports() {
    try {
        showLoading(true);

        // Load statistics
        await loadStatistics();

        // Render statistics
        renderStatistics();

        showLoading(false);
    } catch (error) {
        console.error('Init reports error:', error);
        alert('Failed to load reports: ' + error.message);
        showLoading(false);
    }
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await apiService.getAdminStatistics();

        if (response.success) {
            statistics = response.data;
        } else {
            throw new Error(response.message || 'Failed to load statistics');
        }
    } catch (error) {
        console.error('Load statistics error:', error);
        throw error;
    }
}

// Render statistics
function renderStatistics() {
    if (!statistics) return;

    // Overview stats
    document.getElementById('totalUsers').textContent = statistics.totalUsers || 0;
    document.getElementById('totalModules').textContent = statistics.totalModules || 0;
    document.getElementById('totalAssignments').textContent = statistics.totalAssignments || 0;
    document.getElementById('totalEnrollments').textContent = statistics.totalEnrollments || 0;
    document.getElementById('totalSubmissions').textContent = statistics.totalSubmissions || 0;
    document.getElementById('completionRate').textContent = (statistics.completionRate || 0) + '%';

    // User stats by role
    renderUsersByRole();

    // User stats by level
    renderUsersByLevel();

    // Module stats by level
    renderModulesByLevel();

    // Recent activities
    renderRecentActivities();

    // Submission statistics
    renderSubmissionStats();
}

// Render users by role
function renderUsersByRole() {
    const container = document.getElementById('usersByRole');
    if (!container || !statistics.usersByRole) return;

    let html = '';
    const roles = ['admin', 'assessor', 'user'];
    const roleLabels = { admin: 'Admins', assessor: 'Assessors', user: 'Users' };
    const roleColors = { admin: '#dc3545', assessor: '#ffc107', user: '#17a2b8' };

    roles.forEach(role => {
        const count = statistics.usersByRole[role] || 0;
        const percentage = statistics.totalUsers > 0 ? Math.round((count / statistics.totalUsers) * 100) : 0;

        html += `
            <div class="stat-item">
                <div class="stat-label">${roleLabels[role]}</div>
                <div class="stat-value">${count}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%; background: ${roleColors[role]};"></div>
                </div>
                <div class="stat-percent">${percentage}%</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Render users by level
function renderUsersByLevel() {
    const container = document.getElementById('usersByLevel');
    if (!container || !statistics.usersByLevel) return;

    let html = '';
    const levels = ['fundamental', 'intermediate', 'advance'];
    const levelLabels = { fundamental: 'Fundamental', intermediate: 'Intermediate', advance: 'Advance' };
    const levelColors = { fundamental: '#17a2b8', intermediate: '#ffc107', advance: '#dc3545' };

    levels.forEach(level => {
        const count = statistics.usersByLevel[level] || 0;
        const percentage = statistics.totalUsers > 0 ? Math.round((count / statistics.totalUsers) * 100) : 0;

        html += `
            <div class="stat-item">
                <div class="stat-label">${levelLabels[level]}</div>
                <div class="stat-value">${count}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%; background: ${levelColors[level]};"></div>
                </div>
                <div class="stat-percent">${percentage}%</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Render modules by level
function renderModulesByLevel() {
    const container = document.getElementById('modulesByLevel');
    if (!container || !statistics.modulesByLevel) return;

    let html = '';
    const levels = ['fundamental', 'intermediate', 'advance'];
    const levelLabels = { fundamental: 'Fundamental', intermediate: 'Intermediate', advance: 'Advance' };
    const levelColors = { fundamental: '#17a2b8', intermediate: '#ffc107', advance: '#dc3545' };

    levels.forEach(level => {
        const count = statistics.modulesByLevel[level] || 0;
        const percentage = statistics.totalModules > 0 ? Math.round((count / statistics.totalModules) * 100) : 0;

        html += `
            <div class="stat-item">
                <div class="stat-label">${levelLabels[level]}</div>
                <div class="stat-value">${count} modules</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%; background: ${levelColors[level]};"></div>
                </div>
                <div class="stat-percent">${percentage}%</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Render recent activities
function renderRecentActivities() {
    const container = document.getElementById('recentActivities');
    if (!container || !statistics.recentActivities) return;

    if (statistics.recentActivities.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem;">No recent activities</p>';
        return;
    }

    let html = '';
    statistics.recentActivities.slice(0, 10).forEach(activity => {
        const time = formatTimeAgo(activity.created_at);
        const icon = getActivityIcon(activity.type);

        html += `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">${icon}</div>
                <div class="activity-content">
                    <div class="activity-text">${activity.description || activity.type}</div>
                    <div class="activity-time">${time}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Render submission stats
function renderSubmissionStats() {
    const container = document.getElementById('submissionStats');
    if (!container || !statistics.submissionStats) return;

    const stats = statistics.submissionStats;

    const html = `
        <div class="stat-item">
            <div class="stat-label">Pending Review</div>
            <div class="stat-value" style="color: #ffc107;">${stats.pending || 0}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Graded</div>
            <div class="stat-value" style="color: #28a745;">${stats.graded || 0}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Passed</div>
            <div class="stat-value" style="color: #28a745;">${stats.passed || 0}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Failed</div>
            <div class="stat-value" style="color: #dc3545;">${stats.failed || 0}</div>
        </div>
    `;

    container.innerHTML = html;
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        'enrollment': '<i class="bx bx-book-add"></i>',
        'submission': '<i class="bx bx-file"></i>',
        'completion': '<i class="bx bx-check-circle"></i>',
        'user_created': '<i class="bx bx-user-plus"></i>',
        'module_created': '<i class="bx bx-book-add"></i>',
        'assignment_created': '<i class="bx bx-file-plus"></i>'
    };
    return icons[type] || '<i class="bx bx-info-circle"></i>';
}

// Format time ago
function formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' minutes ago';
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago';
    if (diffInSeconds < 604800) return Math.floor(diffInSeconds / 86400) + ' days ago';
    return date.toLocaleDateString('id-ID');
}

// Export users
async function exportUsers() {
    try {
        showLoading(true);

        const response = await apiService.exportUsers();

        if (response.success && response.data) {
            // Convert to CSV
            const csvData = convertToCSV(response.data, ['id', 'name', 'email', 'role', 'level', 'status', 'created_at']);
            downloadCSV(csvData, 'users_export.csv');

            alert('Users exported successfully!');
        } else {
            throw new Error(response.message || 'Failed to export users');
        }

        showLoading(false);
    } catch (error) {
        console.error('Export users error:', error);
        alert('Failed to export users: ' + error.message);
        showLoading(false);
    }
}

// Export submissions
async function exportSubmissions() {
    try {
        showLoading(true);

        const response = await apiService.exportSubmissions();

        if (response.success && response.data) {
            // Convert to CSV
            const csvData = convertToCSV(response.data, ['id', 'user_name', 'assignment_title', 'module_name', 'status', 'score', 'submitted_at']);
            downloadCSV(csvData, 'submissions_export.csv');

            alert('Submissions exported successfully!');
        } else {
            throw new Error(response.message || 'Failed to export submissions');
        }

        showLoading(false);
    } catch (error) {
        console.error('Export submissions error:', error);
        alert('Failed to export submissions: ' + error.message);
        showLoading(false);
    }
}

// Convert array to CSV
function convertToCSV(data, columns) {
    if (!data || data.length === 0) return '';

    // Header row
    let csv = columns.join(',') + '\n';

    // Data rows
    data.forEach(row => {
        const values = columns.map(col => {
            const value = row[col] || '';
            // Escape quotes and wrap in quotes if contains comma
            return typeof value === 'string' && value.includes(',')
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        });
        csv += values.join(',') + '\n';
    });

    return csv;
}

// Download CSV file
function downloadCSV(csvData, filename) {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Refresh statistics
async function refreshStatistics() {
    try {
        showLoading(true);

        await loadStatistics();
        renderStatistics();

        alert('Statistics refreshed successfully!');

        showLoading(false);
    } catch (error) {
        console.error('Refresh statistics error:', error);
        alert('Failed to refresh statistics: ' + error.message);
        showLoading(false);
    }
}

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
    const body = document.body;
    const savedMode = localStorage.getItem('darkMode');

    if (savedMode === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="bx bx-sun"></i>';
    }

    darkModeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.innerHTML = '<i class="bx bx-sun"></i>';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.innerHTML = '<i class="bx bx-moon"></i>';
        }
    });
}

// Loading spinner
function showLoading(show) {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReports);
} else {
    initReports();
}
