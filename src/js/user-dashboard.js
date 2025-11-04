/**
 * User Dashboard Integration with Backend API
 * CodeSmart LMS
 */

// Check authentication on page load
if (!authService.requireAuth()) {
    window.location.href = '/index.html';
}

let currentUser = null;
let userProgress = null;
let enrolledModules = [];

// Initialize dashboard
async function initDashboard() {
    try {
        showLoading(true);

        // Get current user from auth service
        currentUser = authService.getCurrentUser();

        // Check if user has taken pretest
        if (!currentUser.pretest_score) {
            window.location.href = 'pretest.html';
            return;
        }

        // Load user data from API
        await Promise.all([
            loadUserProfile(),
            loadUserProgress(),
            loadEnrolledModules()
        ]);

        // Render dashboard
        renderUserInfo();
        renderStats();
        renderModules();
        renderRecentProgress();

        showLoading(false);
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showError('Gagal memuat dashboard. Silakan refresh halaman.');
        showLoading(false);
    }
}

// Load user profile
async function loadUserProfile() {
    try {
        const response = await apiService.getUserProfile();
        if (response.success) {
            currentUser = response.data;
            // Update local storage
            authService.updateUser(currentUser);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        throw error;
    }
}

// Load user progress
async function loadUserProgress() {
    try {
        const response = await apiService.getUserProgress();
        if (response.success) {
            userProgress = response.data;
        }
    } catch (error) {
        console.error('Error loading progress:', error);
        userProgress = {
            totalModulesEnrolled: 0,
            totalClassesCompleted: 0,
            totalAssignmentsSubmitted: 0,
            averageScore: 0,
            completionRate: 0
        };
    }
}

// Load enrolled modules
async function loadEnrolledModules() {
    try {
        const response = await apiService.getUserEnrollments();
        if (response.success) {
            enrolledModules = response.data;
        }
    } catch (error) {
        console.error('Error loading enrollments:', error);
        enrolledModules = [];
    }
}

// Render user info
function renderUserInfo() {
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const welcomeText = document.getElementById('welcomeText');
    const welcomeSubtext = document.getElementById('welcomeSubtext');

    if (userName) userName.textContent = currentUser.name;
    if (userAvatar) {
        if (currentUser.photo_url) {
            userAvatar.innerHTML = `<img src="${currentUser.photo_url}" alt="${currentUser.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
            userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        }
    }
    if (welcomeText) welcomeText.textContent = `Selamat Datang, ${currentUser.name}!`;
    if (welcomeSubtext) {
        const level = currentUser.current_level || 'fundamental';
        welcomeSubtext.textContent = `Level Anda: ${level.toUpperCase()} - Terus semangat belajar!`;
    }
}

// Render stats
function renderStats() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    const moduleLevel = document.getElementById('moduleLevel');
    const modulesCompleted = document.getElementById('modulesCompleted');
    const assignmentsSubmitted = document.getElementById('assignmentsSubmitted');
    const averageScore = document.getElementById('averageScore');

    if (scoreDisplay) scoreDisplay.textContent = currentUser.pretest_score || 0;
    if (moduleLevel) moduleLevel.textContent = (currentUser.current_level || 'fundamental').toUpperCase();

    if (userProgress) {
        if (modulesCompleted) modulesCompleted.textContent = userProgress.totalModulesEnrolled || 0;
        if (assignmentsSubmitted) assignmentsSubmitted.textContent = userProgress.totalAssignmentsSubmitted || 0;
        if (averageScore) averageScore.textContent = Math.round(userProgress.averageScore || 0);
    }
}

// Render modules
async function renderModules() {
    try {
        // Get all available modules
        const response = await apiService.getModules();
        if (!response.success) {
            throw new Error('Failed to load modules');
        }

        const modules = response.data;
        const userLevel = currentUser.current_level || 'fundamental';

        // Group modules by level
        const modulesByLevel = {
            fundamental: modules.filter(m => m.level === 'fundamental'),
            intermediate: modules.filter(m => m.level === 'intermediate'),
            advance: modules.filter(m => m.level === 'advance')
        };

        // Render each level
        ['fundamental', 'intermediate', 'advance'].forEach(level => {
            const moduleCard = document.getElementById(`module-${level}`);
            const unlockNotice = document.getElementById(`unlock-notice-${level}`);
            const requestBtn = document.getElementById(`request-btn-${level}`);
            const moduleBtn = document.getElementById(`btn-module-${level}`);

            if (!moduleCard) return;

            // Check if user has access to this level
            const hasAccess = canAccessLevel(level, userLevel);
            const isEnrolled = enrolledModules.some(e => e.level === level);

            if (!hasAccess) {
                moduleCard.classList.add('locked');
                if (unlockNotice) {
                    unlockNotice.textContent = getUnlockMessage(level);
                    unlockNotice.style.display = 'block';
                }
                if (requestBtn) {
                    requestBtn.style.display = canRequestPromotion(level, userLevel) ? 'inline-flex' : 'none';
                }
                if (moduleBtn) {
                    moduleBtn.style.display = 'none';
                }
            } else {
                moduleCard.classList.remove('locked');
                if (unlockNotice) unlockNotice.style.display = 'none';
                if (requestBtn) requestBtn.style.display = 'none';
                if (moduleBtn) moduleBtn.style.display = 'inline-flex';

                // Auto-enroll if not enrolled yet
                if (!isEnrolled && modulesByLevel[level].length > 0) {
                    autoEnrollInLevel(level, modulesByLevel[level][0].id);
                }
            }
        });
    } catch (error) {
        console.error('Error rendering modules:', error);
    }
}

// Check if user can access level
function canAccessLevel(targetLevel, userLevel) {
    const levels = ['fundamental', 'intermediate', 'advance'];
    const userLevelIndex = levels.indexOf(userLevel);
    const targetLevelIndex = levels.indexOf(targetLevel);
    return targetLevelIndex <= userLevelIndex;
}

// Get unlock message
function getUnlockMessage(level) {
    if (level === 'intermediate') {
        return 'Modul ini terkunci. Selesaikan modul Fundamental dan ajukan naik tingkat kepada assessor.';
    } else if (level === 'advance') {
        return 'Modul ini terkunci. Selesaikan modul Intermediate dan ajukan naik tingkat kepada assessor.';
    }
    return '';
}

// Check if user can request promotion
function canRequestPromotion(targetLevel, userLevel) {
    const levels = ['fundamental', 'intermediate', 'advance'];
    const userLevelIndex = levels.indexOf(userLevel);
    const targetLevelIndex = levels.indexOf(targetLevel);

    // Can request if target is exactly one level above current
    return targetLevelIndex === userLevelIndex + 1;
}

// Auto-enroll in level
async function autoEnrollInLevel(level, moduleId) {
    try {
        const response = await apiService.enrollInModule(moduleId);
        if (response.success) {
            console.log(`Auto-enrolled in ${level} module`);
            // Reload enrollments
            await loadEnrolledModules();
        }
    } catch (error) {
        console.error('Auto-enroll error:', error);
    }
}

// Render recent progress
function renderRecentProgress() {
    const progressList = document.getElementById('recentProgressList');
    if (!progressList) return;

    if (enrolledModules.length === 0) {
        progressList.innerHTML = '<p style="text-align: center; color: #888;">Belum ada progress pembelajaran</p>';
        return;
    }

    let html = '';
    enrolledModules.slice(0, 5).forEach(enrollment => {
        const progress = enrollment.progress_percentage || 0;
        html += `
            <div class="progress-item" style="margin-bottom: 2rem; padding: 1.5rem; background: var(--bg-color); border-radius: 1rem; box-shadow: 0 .1rem .5rem var(--shadow-color);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <h4>${enrollment.module_name}</h4>
                    <span style="color: var(--main-color); font-weight: 600;">${progress}%</span>
                </div>
                <div style="background: #f0f0f0; height: 0.8rem; border-radius: 1rem; overflow: hidden;">
                    <div style="background: var(--main-color); height: 100%; width: ${progress}%; transition: width 0.3s ease;"></div>
                </div>
                <p style="margin-top: 1rem; font-size: 1.4rem; color: #666;">
                    Status: <span style="color: ${enrollment.status === 'completed' ? 'green' : 'orange'};">${enrollment.status}</span>
                </p>
            </div>
        `;
    });

    progressList.innerHTML = html;
}

// Request promotion
async function requestPromotion(level) {
    try {
        const confirmation = confirm(`Anda yakin ingin mengajukan naik ke level ${level.toUpperCase()}?`);
        if (!confirmation) return;

        showLoading(true);
        const response = await apiService.requestPromotion(level);

        if (response.success) {
            showSuccess('Permintaan naik tingkat berhasil diajukan! Tunggu persetujuan dari assessor.');
            // Reload dashboard
            await initDashboard();
        } else {
            showError(response.message || 'Gagal mengajukan permintaan');
        }
    } catch (error) {
        console.error('Promotion request error:', error);
        showError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        showLoading(false);
    }
}

// Open module
function openModule(level) {
    window.location.href = `modules.html?level=${level}`;
}

// User menu toggle
function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Close dropdown when clicking outside
window.addEventListener('click', function (e) {
    if (!e.target.closest('.user-menu')) {
        const dropdown = document.getElementById('userMenuDropdown');
        if (dropdown) dropdown.style.display = 'none';
    }
});

// Logout
async function logout() {
    if (confirm('Yakin ingin keluar?')) {
        await authService.logout();
        window.location.href = '/index.html';
    }
}

// Utility functions
function showLoading(show) {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

function showError(message) {
    alert('Error: ' + message);
}

function showSuccess(message) {
    alert('Success: ' + message);
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

    darkModeToggle.addEventListener('click', function (e) {
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

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
