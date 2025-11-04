/**
 * User Class Detail Integration
 * CodeSmart LMS - Supabase Backend
 */

// Check authentication
if (!authService.requireAuth()) {
    window.location.href = '/index.html';
}

let currentUser = null;
let moduleData = null;
let classMaterials = [];
let currentClassIndex = 0;
let userProgress = [];

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Initialize
async function initClass() {
    try {
        showLoading(true);

        currentUser = authService.getCurrentUser();

        // Get module slug from URL
        const moduleSlug = getUrlParameter('module');
        if (!moduleSlug) {
            alert('Module tidak ditemukan!');
            window.location.href = 'modules-new.html';
            return;
        }

        // Load module and materials
        await loadModuleData(moduleSlug);

        // Render UI
        renderClassPage();

        showLoading(false);
    } catch (error) {
        console.error('Init class error:', error);
        alert('Gagal memuat kelas: ' + error.message);
        showLoading(false);
    }
}

// Load module data
async function loadModuleData(moduleSlug) {
    try {
        // Get module details
        const moduleResponse = await apiService.getModuleBySlug(moduleSlug);
        if (!moduleResponse.success) {
            throw new Error('Module not found');
        }

        moduleData = moduleResponse.data;

        // Check if enrolled
        if (!moduleData.enrollment) {
            alert('Anda belum enroll di modul ini!');
            window.location.href = 'modules-new.html';
            return;
        }

        // Get class materials
        const materialsResponse = await apiService.getModuleMaterials(moduleSlug);
        if (materialsResponse.success) {
            classMaterials = materialsResponse.data.materials || [];
        }

        // Get user progress for this module
        const progressResponse = await apiService.getUserProgress();
        if (progressResponse.success) {
            userProgress = progressResponse.data.classProgress || [];
        }

    } catch (error) {
        console.error('Load module data error:', error);
        throw error;
    }
}

// Render class page
function renderClassPage() {
    // Set module info
    document.getElementById('moduleName').textContent = moduleData.module.name;
    document.getElementById('moduleLevel').textContent = moduleData.module.level.toUpperCase();

    // Render class list
    renderClassList();

    // Render current class
    if (classMaterials.length > 0) {
        renderClassContent(0);
    } else {
        document.getElementById('classContent').innerHTML =
            '<p style="text-align: center; font-size: 1.8rem; color: #888;">Belum ada materi tersedia untuk modul ini.</p>';
    }
}

// Render class list (sidebar)
function renderClassList() {
    const container = document.getElementById('classList');
    if (!container) return;

    if (classMaterials.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888;">Tidak ada kelas</p>';
        return;
    }

    let html = '';
    classMaterials.forEach((classItem, index) => {
        const isCompleted = userProgress.some(p => p.class_id === classItem.id && p.status === 'completed');
        const isCurrent = index === currentClassIndex;

        html += `
            <div class="class-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
                 onclick="selectClass(${index})">
                <div class="class-number">
                    ${isCompleted ? '<i class="bx bx-check-circle"></i>' : classItem.class_number}
                </div>
                <div class="class-info">
                    <h4>${classItem.title}</h4>
                    <span><i class="bx bx-time"></i> ${classItem.estimated_duration || '30 min'}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Render class content
function renderClassContent(index) {
    currentClassIndex = index;

    const classItem = classMaterials[index];
    if (!classItem) return;

    const isCompleted = userProgress.some(p => p.class_id === classItem.id && p.status === 'completed');

    const content = `
        <div class="class-header">
            <div>
                <h2>${classItem.title}</h2>
                <p class="class-meta">
                    <span><i class="bx bx-layer"></i> Class ${classItem.class_number}</span>
                    <span><i class="bx bx-time"></i> ${classItem.estimated_duration || '30 min'}</span>
                    ${isCompleted ? '<span class="completed-badge"><i class="bx bx-check"></i> Completed</span>' : ''}
                </p>
            </div>
            ${!isCompleted ? `
                <button class="btn btn-primary" onclick="markAsComplete(${classItem.id})">
                    <i class="bx bx-check"></i> Mark as Complete
                </button>
            ` : ''}
        </div>

        ${classItem.video_url ? `
            <div class="video-container">
                <iframe
                    src="${classItem.video_url}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
        ` : ''}

        <div class="class-description">
            <h3>Description</h3>
            <p>${classItem.description || 'No description available'}</p>
        </div>

        <div class="class-navigation">
            <button class="btn btn-secondary" onclick="previousClass()"
                    ${index === 0 ? 'disabled' : ''}>
                <i class="bx bx-chevron-left"></i> Previous
            </button>
            <button class="btn btn-primary" onclick="nextClass()"
                    ${index === classMaterials.length - 1 ? 'disabled' : ''}>
                Next <i class="bx bx-chevron-right"></i>
            </button>
        </div>
    `;

    document.getElementById('classContent').innerHTML = content;

    // Update class list active state
    renderClassList();
}

// Select class
function selectClass(index) {
    renderClassContent(index);
}

// Previous class
function previousClass() {
    if (currentClassIndex > 0) {
        renderClassContent(currentClassIndex - 1);
    }
}

// Next class
function nextClass() {
    if (currentClassIndex < classMaterials.length - 1) {
        renderClassContent(currentClassIndex + 1);
    }
}

// Mark class as complete
async function markAsComplete(classId) {
    if (!confirm('Mark this class as complete?')) {
        return;
    }

    try {
        showLoading(true);

        const response = await apiService.markClassComplete(classId);

        if (response.success) {
            alert('Class marked as complete!');

            // Reload progress
            const progressResponse = await apiService.getUserProgress();
            if (progressResponse.success) {
                userProgress = progressResponse.data.classProgress || [];
            }

            // Re-render current class
            renderClassContent(currentClassIndex);

            // Auto advance to next class
            if (currentClassIndex < classMaterials.length - 1) {
                setTimeout(() => {
                    renderClassContent(currentClassIndex + 1);
                }, 1000);
            }
        } else {
            alert('Failed to mark as complete: ' + (response.message || 'Unknown error'));
        }

        showLoading(false);
    } catch (error) {
        console.error('Mark complete error:', error);
        alert('Error marking class as complete: ' + error.message);
        showLoading(false);
    }
}

// Back to modules
function backToModules() {
    window.location.href = 'modules-new.html';
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
    document.addEventListener('DOMContentLoaded', initClass);
} else {
    initClass();
}
