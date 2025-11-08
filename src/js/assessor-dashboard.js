/**
 * Assessor Dashboard Integration
 * CodeSmart LMS - Supabase Backend
 */

// Check authentication and assessor role
if (!authService.requireAuth()) {
    window.location.href = '/index.html';
}

const currentUser = authService.getCurrentUser();
if (currentUser.role !== 'assessor' && currentUser.role !== 'admin') {
    alert('Access denied! Assessor or Admin only.');
    window.location.href = '/src/pages/user/dashboard-new.html';
}

let statistics = null;
let pendingSubmissions = [];

// Initialize
async function initAssessorDashboard() {
    try {
        showLoading(true);

        // Load statistics and pending submissions
        await Promise.all([
            loadStatistics(),
            loadPendingSubmissions()
        ]);

        // Render dashboard
        renderStatistics();
        renderPendingSubmissions();

        showLoading(false);
    } catch (error) {
        console.error('Init assessor dashboard error:', error);
        alert('Failed to load dashboard: ' + error.message);
        showLoading(false);
    }
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await apiService.getAssessorStatistics();

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

// Load pending submissions
async function loadPendingSubmissions() {
    try {
        const response = await apiService.getPendingSubmissions();

        if (response.success) {
            pendingSubmissions = response.data || [];
        } else {
            throw new Error(response.message || 'Failed to load pending submissions');
        }
    } catch (error) {
        console.error('Load pending submissions error:', error);
        throw error;
    }
}

// Render statistics
function renderStatistics() {
    if (!statistics) return;

    // Overview stats
    document.getElementById('totalSubmissions').textContent = statistics.totalSubmissions || 0;
    document.getElementById('pendingCount').textContent = statistics.pendingSubmissions || 0;
    document.getElementById('gradedCount').textContent = statistics.gradedSubmissions || 0;
    document.getElementById('averageScore').textContent = (statistics.averageScore || 0).toFixed(1);

    // Grading stats
    renderGradingStats();

    // Recent activities
    renderRecentActivities();
}

// Render grading stats
function renderGradingStats() {
    const container = document.getElementById('gradingStats');
    if (!container || !statistics) return;

    const passed = statistics.passedSubmissions || 0;
    const failed = statistics.failedSubmissions || 0;
    const total = passed + failed;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    const html = `
        <div class="stat-item">
            <div class="stat-label">Passed</div>
            <div class="stat-value" style="color: #28a745;">${passed}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${total > 0 ? (passed / total) * 100 : 0}%; background: #28a745;"></div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Failed</div>
            <div class="stat-value" style="color: #dc3545;">${failed}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${total > 0 ? (failed / total) * 100 : 0}%; background: #dc3545;"></div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-label">Pass Rate</div>
            <div class="stat-value" style="color: ${passRate >= 70 ? '#28a745' : '#ffc107'};">${passRate}%</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${passRate}%; background: ${passRate >= 70 ? '#28a745' : '#ffc107'};"></div>
            </div>
        </div>
    `;

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
    statistics.recentActivities.slice(0, 5).forEach(activity => {
        const time = formatTimeAgo(activity.created_at);

        html += `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class='bx bx-file'></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.description || 'New activity'}</div>
                    <div class="activity-time">${time}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Render pending submissions
function renderPendingSubmissions() {
    const container = document.getElementById('pendingSubmissionsTable');
    if (!container) return;

    if (pendingSubmissions.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #888;">No pending submissions</td></tr>';
        return;
    }

    let html = '';
    pendingSubmissions.slice(0, 10).forEach(submission => {
        const submittedDate = new Date(submission.submitted_at).toLocaleDateString('id-ID');
        const timeAgo = formatTimeAgo(submission.submitted_at);

        html += `
            <tr>
                <td>
                    <div style="font-weight: 600;">${submission.user_name}</div>
                    <div style="font-size: 1.3rem; color: #888;">${submission.user_email || ''}</div>
                </td>
                <td>
                    <div style="font-weight: 600;">${submission.assignment_title}</div>
                    <div style="font-size: 1.3rem; color: #888;">${submission.module_name || ''}</div>
                </td>
                <td>${submittedDate}</td>
                <td>
                    <span class="time-ago">${timeAgo}</span>
                </td>
                <td>
                    <button class="btn-grade" onclick="navigateToGrading(${submission.id})">
                        <i class='bx bx-edit'></i> Grade
                    </button>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;
}

// Format time ago
function formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' min ago';
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago';
    if (diffInSeconds < 604800) return Math.floor(diffInSeconds / 86400) + ' days ago';
    return date.toLocaleDateString('id-ID');
}

// Navigate to grading page
function navigateToGrading(submissionId) {
    window.location.href = `/src/pages/assessor/grade-submissions-new.html?id=${submissionId}`;
}

// Navigate to all submissions
function viewAllPending() {
    window.location.href = '/src/pages/assessor/grade-submissions-new.html';
}

// Navigate to students
function viewAllStudents() {
    window.location.href = '/src/pages/assessor/student-progress-new.html';
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
    document.addEventListener('DOMContentLoaded', initAssessorDashboard);
} else {
    initAssessorDashboard();
}
