/**
 * User Dashboard Integration v2 - Simplified
 * CodeSmart LMS
 */

// Check authentication
if (!authService.requireAuth()) {
    window.location.href = '/index.html';
}

let currentUser = null;
let userProgress = null;
let enrolledModules = [];
let allModules = [];

// Initialize
async function initDashboard() {
    try {
        showLoading(true);
        currentUser = authService.getCurrentUser();

        // Check if pretest completed
        if (!currentUser.pretest_score) {
            window.location.href = 'pretest.html';
            return;
        }

        // Load all data
        await loadUserData();

        // Render
        renderUI();

        showLoading(false);
    } catch (error) {
        console.error('Init error:', error);
        alert('Gagal memuat dashboard: ' + error.message);
        showLoading(false);
    }
}

// Load all user data
async function loadUserData() {
    try {
        const [profile, progress, enrollments, modules] = await Promise.all([
            apiService.getUserProfile(),
            apiService.getUserProgress(),
            apiService.getUserEnrollments(),
            apiService.getModules()
        ]);

        if (profile.success) {
            currentUser = profile.data;
            authService.updateUser(currentUser);
        }

        if (progress.success) {
            userProgress = progress.data;
        } else {
            userProgress = {
                totalModulesEnrolled: 0,
                totalClassesCompleted: 0,
                totalAssignmentsSubmitted: 0,
                averageScore: 0
            };
        }

        if (enrollments.success) {
            enrolledModules = enrollments.data;
        }

        if (modules.success) {
            allModules = modules.data;
        }
    } catch (error) {
        console.error('Load data error:', error);
        throw error;
    }
}

// Render all UI
function renderUI() {
    renderUserInfo();
    renderStats();
    renderModules();
    renderProgress();
}

// Render user info
function renderUserInfo() {
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const welcomeText = document.getElementById('welcomeText');
    const welcomeSubtext = document.getElementById('welcomeSubtext');

    if (userName) userName.textContent = currentUser.name;
    if (userAvatar) userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    if (welcomeText) welcomeText.textContent = `Selamat Datang, ${currentUser.name}!`;
    if (welcomeSubtext) {
        const level = (currentUser.current_level || 'fundamental').toUpperCase();
        welcomeSubtext.textContent = `Level Anda: ${level} - Terus semangat belajar!`;
    }
}

// Render stats
function renderStats() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    const modulesCompleted = document.getElementById('modulesCompleted');
    const assignmentsSubmitted = document.getElementById('assignmentsSubmitted');
    const averageScore = document.getElementById('averageScore');

    if (scoreDisplay) scoreDisplay.textContent = currentUser.pretest_score || 0;
    if (modulesCompleted) modulesCompleted.textContent = userProgress.totalModulesEnrolled || 0;
    if (assignmentsSubmitted) assignmentsSubmitted.textContent = userProgress.totalAssignmentsSubmitted || 0;
    if (averageScore) averageScore.textContent = Math.round(userProgress.averageScore || 0);
}

// Render modules
function renderModules() {
    const modulesGrid = document.getElementById('modulesGrid');
    if (!modulesGrid) return;

    const userLevel = currentUser.current_level || 'fundamental';
    const levels = ['fundamental', 'intermediate', 'advance'];
    const userLevelIndex = levels.indexOf(userLevel);

    let html = '';

    levels.forEach((level, index) => {
        const levelModules = allModules.filter(m => m.level === level);
        const hasAccess = index <= userLevelIndex;
        const moduleCount = levelModules.length;
        const isEnrolled = enrolledModules.some(e => e.level === level);

        html += `
            <div class="module-card ${!hasAccess ? 'locked' : ''}">
                <h3>${level.toUpperCase()}</h3>
                <p>${moduleCount} module${moduleCount !== 1 ? 's' : ''} available</p>
                ${!hasAccess ? `
                    <p style="color: #dc3545; margin: 1rem 0;">
                        🔒 Locked - Complete ${levels[index-1]} level first
                    </p>
                    ${index === userLevelIndex + 1 ? `
                        <button class="btn btn-secondary" onclick="requestPromotion('${level}')">
                            Request Promotion
                        </button>
                    ` : ''}
                ` : `
                    <button class="btn" onclick="openModules('${level}')">
                        ${isEnrolled ? 'Continue Learning' : 'Start Learning'}
                    </button>
                `}
            </div>
        `;
    });

    modulesGrid.innerHTML = html;
}

// Render progress
function renderProgress() {
    const progressList = document.getElementById('recentProgressList');
    if (!progressList) return;

    if (enrolledModules.length === 0) {
        progressList.innerHTML = '<p style="text-align: center; color: #888; font-size: 1.6rem;">Belum ada progress pembelajaran</p>';
        return;
    }

    let html = '';
    enrolledModules.slice(0, 5).forEach(enrollment => {
        const progress = enrollment.progress_percentage || 0;
        const statusColor = enrollment.status === 'completed' ? '#28a745' : '#ffc107';

        html += `
            <div style="margin-bottom: 2rem; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 .5rem 1rem rgba(0,0,0,.1);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <h4 style="font-size: 1.8rem;">${enrollment.module_name || 'Module'}</h4>
                    <span style="color: var(--main-color); font-weight: 600; font-size: 1.6rem;">${Math.round(progress)}%</span>
                </div>
                <div style="background: #f0f0f0; height: 1rem; border-radius: 1rem; overflow: hidden;">
                    <div style="background: var(--main-color); height: 100%; width: ${progress}%; transition: width 0.3s ease;"></div>
                </div>
                <p style="margin-top: 1rem; font-size: 1.4rem; color: #666;">
                    Status: <span style="color: ${statusColor}; font-weight: 600;">${enrollment.status}</span>
                </p>
            </div>
        `;
    });

    progressList.innerHTML = html;
}

// Open modules page
function openModules(level) {
    window.location.href = `modules.html?level=${level}`;
}

// Request promotion
async function requestPromotion(level) {
    if (!confirm(`Ajukan naik ke level ${level.toUpperCase()}?`)) return;

    try {
        showLoading(true);
        const response = await apiService.requestPromotion(level);

        if (response.success) {
            alert('Permintaan naik tingkat berhasil diajukan!');
            await loadUserData();
            renderUI();
        } else {
            alert('Gagal: ' + (response.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Promotion error:', error);
        alert('Terjadi kesalahan saat mengajukan permintaan');
    } finally {
        showLoading(false);
    }
}

// Toggle user menu
function toggleUserMenu() {
    alert('User menu - Coming soon!\nFor now, use navigation links.');
}

// Logout
async function logout() {
    if (confirm('Yakin ingin keluar?')) {
        await authService.logout();
        window.location.href = '/index.html';
    }
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
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
