/**
 * Admin Dashboard Integration
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

// Initialize
async function initAdminDashboard() {
    try {
        showLoading(true);

        // Load statistics
        await loadStatistics();

        // Render dashboard
        renderDashboard();

        showLoading(false);
    } catch (error) {
        console.error('Init admin dashboard error:', error);
        alert('Failed to load dashboard: ' + error.message);
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

// Render dashboard
function renderDashboard() {
    // Set admin name
    const adminName = document.getElementById('adminName');
    if (adminName) {
        adminName.textContent = currentUser.name;
    }

    // Render statistics cards
    renderStatistics();

    // Render recent activities
    renderRecentActivities();

    // Render charts (placeholder for now)
    renderCharts();
}

// Render statistics
function renderStatistics() {
    if (!statistics) return;

    // Total Users
    const totalUsersEl = document.getElementById('totalUsers');
    if (totalUsersEl) {
        totalUsersEl.textContent = statistics.totalUsers || 0;
    }

    // Total Modules
    const totalModulesEl = document.getElementById('totalModules');
    if (totalModulesEl) {
        totalModulesEl.textContent = statistics.totalModules || 0;
    }

    // Total Assignments
    const totalAssignmentsEl = document.getElementById('totalAssignments');
    if (totalAssignmentsEl) {
        totalAssignmentsEl.textContent = statistics.totalAssignments || 0;
    }

    // Pending Submissions
    const pendingSubmissionsEl = document.getElementById('pendingSubmissions');
    if (pendingSubmissionsEl) {
        pendingSubmissionsEl.textContent = statistics.pendingSubmissions || 0;
    }

    // Active Enrollments
    const activeEnrollmentsEl = document.getElementById('activeEnrollments');
    if (activeEnrollmentsEl) {
        activeEnrollmentsEl.textContent = statistics.activeEnrollments || 0;
    }

    // Completion Rate
    const completionRateEl = document.getElementById('completionRate');
    if (completionRateEl) {
        const rate = statistics.completionRate || 0;
        completionRateEl.textContent = Math.round(rate) + '%';
    }
}

// Render recent activities
function renderRecentActivities() {
    const container = document.getElementById('recentActivities');
    if (!container || !statistics || !statistics.recentActivities) return;

    if (statistics.recentActivities.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem;">No recent activities</p>';
        return;
    }

    let html = '<ul style="list-style: none; padding: 0;">';
    statistics.recentActivities.slice(0, 10).forEach(activity => {
        const timeAgo = getTimeAgo(activity.created_at);
        html += `
            <li style="padding: 1rem 0; border-bottom: 1px solid rgba(117, 78, 249, 0.1);">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="bx bx-user-circle" style="font-size: 2rem; color: var(--main-color);"></i>
                    <div>
                        <p style="font-size: 1.4rem; margin-bottom: 0.3rem;">
                            <strong>${activity.user_name || 'User'}</strong> ${activity.action || 'performed an action'}
                        </p>
                        <span style="font-size: 1.2rem; color: #888;">${timeAgo}</span>
                    </div>
                </div>
            </li>
        `;
    });
    html += '</ul>';

    container.innerHTML = html;
}

// Render charts placeholder
function renderCharts() {
    const userGrowthChart = document.getElementById('userGrowthChart');
    if (userGrowthChart && statistics && statistics.userGrowth) {
        // Simple text representation (can be replaced with chart library)
        let html = '<div style="padding: 2rem;">';
        html += '<h4 style="margin-bottom: 1.5rem; color: var(--main-color);">User Growth (Last 7 Days)</h4>';

        const maxValue = Math.max(...statistics.userGrowth.map(d => d.count));

        statistics.userGrowth.forEach(data => {
            const percentage = maxValue > 0 ? (data.count / maxValue) * 100 : 0;
            html += `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.3rem;">${formatDate(data.date)}</span>
                        <span style="font-size: 1.3rem; font-weight: 600;">${data.count} users</span>
                    </div>
                    <div style="width: 100%; height: 1rem; background: #f0f0f0; border-radius: 1rem; overflow: hidden;">
                        <div style="width: ${percentage}%; height: 100%; background: var(--main-color);"></div>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        userGrowthChart.innerHTML = html;
    }

    const moduleStatsChart = document.getElementById('moduleStatsChart');
    if (moduleStatsChart && statistics && statistics.moduleStats) {
        let html = '<div style="padding: 2rem;">';
        html += '<h4 style="margin-bottom: 1.5rem; color: var(--main-color);">Module Statistics</h4>';

        statistics.moduleStats.forEach(stat => {
            html += `
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(117, 78, 249, 0.05); border-radius: 0.8rem;">
                    <p style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">${stat.module_name}</p>
                    <div style="display: flex; gap: 2rem; font-size: 1.3rem;">
                        <span><i class="bx bx-user"></i> ${stat.enrollments || 0} enrolled</span>
                        <span><i class="bx bx-check"></i> ${stat.completed || 0} completed</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        moduleStatsChart.innerHTML = html;
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
}

// Get time ago
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + ' minutes ago';
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + ' hours ago';
    if (diffInSeconds < 604800) return Math.floor(diffInSeconds / 86400) + ' days ago';
    return date.toLocaleDateString('id-ID');
}

// Navigate to pages
function navigateToUsers() {
    window.location.href = 'users-new.html';
}

function navigateToModules() {
    window.location.href = 'modules-new.html';
}

function navigateToAssignments() {
    window.location.href = 'assignments-new.html';
}

function navigateToReports() {
    alert('Reports page - Coming soon!');
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
    document.addEventListener('DOMContentLoaded', initAdminDashboard);
} else {
    initAdminDashboard();
}
