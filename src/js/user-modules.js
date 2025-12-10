/**
 * User Modules List Integration
 * CodeSmart LMS - Supabase Backend
 */

// Check authentication
if (!authService.requireAuth()) {
    window.location.href = '/index.html';
}

let currentUser = null;
let allModules = [];
let userEnrollments = [];
let selectedLevel = 'all'; // all, fundamental, intermediate, advance

// Initialize
async function initModules() {
    try {
        showLoading(true);

        currentUser = authService.getCurrentUser();

        // Check if pretest completed
        if (!currentUser.pretest_score) {
            alert('Anda harus menyelesaikan pretest terlebih dahulu!');
            window.location.href = 'pretest.html';
            return;
        }

        // Load modules and enrollments
        await loadData();

        // Render UI
        renderModules();

        showLoading(false);
    } catch (error) {
        console.error('Init modules error:', error);
        alert('Gagal memuat modules: ' + error.message);
        showLoading(false);
    }
}

// Load data from API
async function loadData() {
    try {
        const [modulesResponse, enrollmentsResponse] = await Promise.all([
            apiService.getModules(),
            apiService.getUserEnrollments()
        ]);

        if (modulesResponse.success) {
            allModules = modulesResponse.data;
        }

        if (enrollmentsResponse.success) {
            userEnrollments = enrollmentsResponse.data;
        }
    } catch (error) {
        console.error('Load data error:', error);
        throw error;
    }
}

// Render modules
function renderModules() {
    // Set user info in header
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = currentUser.name;
    }

    // Set current level info
    const currentLevelEl = document.getElementById('currentLevel');
    if (currentLevelEl) {
        currentLevelEl.textContent = (currentUser.current_level || 'fundamental').toUpperCase();
    }

    // Filter modules by selected level
    let filteredModules = allModules;
    if (selectedLevel !== 'all') {
        filteredModules = allModules.filter(m => m.level === selectedLevel);
    }

    // Group modules by level
    const modulesByLevel = {
        fundamental: filteredModules.filter(m => m.level === 'fundamental'),
        intermediate: filteredModules.filter(m => m.level === 'intermediate'),
        advance: filteredModules.filter(m => m.level === 'advance')
    };

    const container = document.getElementById('modulesContainer');
    if (!container) return;

    let html = '';

    // Render each level
    Object.keys(modulesByLevel).forEach(level => {
        const modules = modulesByLevel[level];
        if (modules.length === 0) return;

        // Check if user has access to this level
        const userLevel = currentUser.current_level || 'fundamental';
        const levels = ['fundamental', 'intermediate', 'advance'];
        const userLevelIndex = levels.indexOf(userLevel);
        const levelIndex = levels.indexOf(level);
        const hasAccess = levelIndex <= userLevelIndex;

        html += `
            <div class="level-section">
                <div class="level-header">
                    <h2>${level.toUpperCase()} Level</h2>
                    ${!hasAccess ? '<span class="locked-badge">🔒 Locked</span>' : ''}
                </div>
                <div class="modules-grid">
                    ${modules.map(module => renderModuleCard(module, hasAccess)).join('')}
                </div>
            </div>
        `;
    });

    if (html === '') {
        html = '<p style="text-align: center; font-size: 1.8rem; color: #888;">Tidak ada modul tersedia.</p>';
    }

    container.innerHTML = html;

    // Update filter buttons
    updateFilterButtons();
}

// Render single module card
function renderModuleCard(module, hasAccess) {
    // Check if user enrolled
    const enrollment = userEnrollments.find(e => e.module_id === module.id);
    const isEnrolled = !!enrollment;
    const progress = enrollment ? enrollment.progress_percentage || 0 : 0;

    return `
        <div class="module-card ${!hasAccess ? 'locked' : ''}">
            <div class="module-icon">
                <i class='bx bx-book-open'></i>
            </div>
            <h3>${module.title}</h3>
            <p class="module-description">${module.description || 'No description available'}</p>

            <div class="module-meta">
                <span><i class='bx bx-time'></i> ${module.duration || 'N/A'}</span>
                <span><i class='bx bx-layer'></i> ${module.level}</span>
            </div>

            ${isEnrolled ? `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <p class="progress-text">${Math.round(progress)}% Complete</p>
            ` : ''}

            <div class="module-actions">
                ${hasAccess ? `
                    ${isEnrolled ? `
                        <button class="btn btn-primary" onclick="continueModule('${module.slug}')">
                            <i class='bx bx-play'></i> Lanjutkan
                        </button>
                    ` : `
                        <button class="btn btn-secondary" onclick="enrollModule(${module.id}, '${module.slug}')">
                            <i class='bx bx-plus'></i> Enroll
                        </button>
                    `}
                    <button class="btn btn-outline" onclick="viewModuleDetail('${module.slug}')">
                        <i class='bx bx-info-circle'></i> Detail
                    </button>
                ` : `
                    <button class="btn btn-disabled" disabled>
                        <i class='bx bx-lock'></i> Terkunci
                    </button>
                    <p class="locked-text">Selesaikan level sebelumnya untuk membuka</p>
                `}
            </div>
        </div>
    `;
}

// Filter modules by level
function filterByLevel(level) {
    selectedLevel = level;
    renderModules();
}

// Update filter buttons
function updateFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        const btnLevel = btn.getAttribute('data-level');
        if (btnLevel === selectedLevel) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Enroll in module
async function enrollModule(moduleId, moduleSlug) {
    if (!confirm('Apakah Anda yakin ingin enroll di modul ini?')) {
        return;
    }

    try {
        showLoading(true);

        const response = await apiService.enrollInModule(moduleId);

        if (response.success) {
            alert('Berhasil enroll! Anda akan diarahkan ke halaman modul.');

            // Reload data
            await loadData();
            renderModules();

            // Redirect to module detail
            setTimeout(() => {
                window.location.href = `class-new.html?module=${moduleSlug}`;
            }, 1000);
        } else {
            alert('Gagal enroll: ' + (response.message || 'Unknown error'));
        }

        showLoading(false);
    } catch (error) {
        console.error('Enroll error:', error);
        alert('Terjadi kesalahan saat enroll: ' + error.message);
        showLoading(false);
    }
}

// Continue module (go to first incomplete class)
function continueModule(moduleSlug) {
    window.location.href = `class-new.html?module=${moduleSlug}`;
}

// View module detail
function viewModuleDetail(moduleSlug) {
    window.location.href = `class-new.html?module=${moduleSlug}`;
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
    document.addEventListener('DOMContentLoaded', initModules);
} else {
    initModules();
}
