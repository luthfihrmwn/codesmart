/**
 * Admin Module Management Integration
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

let allModules = [];
let currentModule = null;
let currentEditModuleId = null;
let currentEditMaterialId = null;

// Initialize
async function initModuleManagement() {
    try {
        showLoading(true);

        // Load modules
        await loadAllModules();

        // Render modules table
        renderModulesTable();

        showLoading(false);
    } catch (error) {
        console.error('Init module management error:', error);
        alert('Failed to load modules: ' + error.message);
        showLoading(false);
    }
}

// Load all modules
async function loadAllModules() {
    try {
        const response = await apiService.getAllModules();

        if (response.success) {
            allModules = response.data;
        } else {
            throw new Error(response.message || 'Failed to load modules');
        }
    } catch (error) {
        console.error('Load modules error:', error);
        throw error;
    }
}

// Render modules table
function renderModulesTable() {
    const container = document.getElementById('modulesTableBody');
    if (!container) return;

    if (allModules.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #888;">No modules found</td></tr>';
        return;
    }

    let html = '';
    allModules.forEach(module => {
        const createdDate = new Date(module.created_at).toLocaleDateString('id-ID');
        const levelBadge = getLevelBadge(module.level);
        const classCount = module.class_count || 0;

        html += `
            <tr>
                <td>${module.id}</td>
                <td>
                    <div style="font-weight: 600;">${module.name}</div>
                    <div style="font-size: 1.3rem; color: #888;">${module.slug}</div>
                </td>
                <td>${levelBadge}</td>
                <td>${module.duration || '-'}</td>
                <td>${classCount} classes</td>
                <td>${createdDate}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-icon-btn" onclick="viewModuleDetails(${module.id})" title="View Classes">
                            <i class='bx bx-list-ul'></i>
                        </button>
                        <button class="action-icon-btn" onclick="openEditModuleModal(${module.id})" title="Edit">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button class="action-icon-btn delete" onclick="deleteModule(${module.id}, '${module.name}')" title="Delete">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;

    // Update count
    const countEl = document.getElementById('totalModulesCount');
    if (countEl) {
        countEl.textContent = allModules.length;
    }
}

// Get level badge
function getLevelBadge(level) {
    const badges = {
        'fundamental': '<span class="badge badge-info">Fundamental</span>',
        'intermediate': '<span class="badge badge-warning">Intermediate</span>',
        'advance': '<span class="badge badge-danger">Advance</span>'
    };
    return badges[level] || badges['fundamental'];
}

// Open create module modal
function openCreateModuleModal() {
    currentEditModuleId = null;

    // Reset form
    document.getElementById('moduleForm').reset();
    document.getElementById('moduleModalTitle').textContent = 'Create New Module';
    document.getElementById('moduleId').value = '';

    // Show modal
    document.getElementById('moduleModal').style.display = 'flex';
}

// Open edit module modal
function openEditModuleModal(moduleId) {
    const module = allModules.find(m => m.id === moduleId);
    if (!module) {
        alert('Module not found!');
        return;
    }

    currentEditModuleId = moduleId;

    // Fill form
    document.getElementById('moduleModalTitle').textContent = 'Edit Module';
    document.getElementById('moduleId').value = module.id;
    document.getElementById('moduleName').value = module.name;
    document.getElementById('moduleSlug').value = module.slug;
    document.getElementById('moduleDescription').value = module.description || '';
    document.getElementById('moduleLevel').value = module.level;
    document.getElementById('moduleDuration').value = module.duration || '';

    // Show modal
    document.getElementById('moduleModal').style.display = 'flex';
}

// Close module modal
function closeModuleModal() {
    document.getElementById('moduleModal').style.display = 'none';
    document.getElementById('moduleForm').reset();
    currentEditModuleId = null;
}

// Handle module form submit
async function handleModuleFormSubmit(event) {
    event.preventDefault();

    try {
        showLoading(true);

        const formData = {
            name: document.getElementById('moduleName').value.trim(),
            slug: document.getElementById('moduleSlug').value.trim(),
            description: document.getElementById('moduleDescription').value.trim(),
            level: document.getElementById('moduleLevel').value,
            duration: document.getElementById('moduleDuration').value.trim()
        };

        let response;
        if (currentEditModuleId) {
            // Update existing module
            response = await apiService.updateModule(currentEditModuleId, formData);
        } else {
            // Create new module
            response = await apiService.createModule(formData);
        }

        if (response.success) {
            alert(currentEditModuleId ? 'Module updated successfully!' : 'Module created successfully!');
            closeModuleModal();

            // Reload data
            await loadAllModules();
            renderModulesTable();
        } else {
            throw new Error(response.message || 'Failed to save module');
        }

        showLoading(false);
    } catch (error) {
        console.error('Save module error:', error);
        alert('Failed to save module: ' + error.message);
        showLoading(false);
    }
}

// Delete module
async function deleteModule(moduleId, moduleName) {
    if (!confirm(`Are you sure you want to delete module "${moduleName}"?\n\nThis will also delete all associated classes and enrollments!\n\nThis action cannot be undone!`)) {
        return;
    }

    try {
        showLoading(true);

        const response = await apiService.deleteModule(moduleId);

        if (response.success) {
            alert('Module deleted successfully!');

            // Reload data
            await loadAllModules();
            renderModulesTable();
        } else {
            throw new Error(response.message || 'Failed to delete module');
        }

        showLoading(false);
    } catch (error) {
        console.error('Delete module error:', error);
        alert('Failed to delete module: ' + error.message);
        showLoading(false);
    }
}

// View module details (classes)
async function viewModuleDetails(moduleId) {
    const module = allModules.find(m => m.id === moduleId);
    if (!module) {
        alert('Module not found!');
        return;
    }

    try {
        showLoading(true);

        // Load module details with classes
        const response = await apiService.getModuleBySlug(module.slug);

        if (response.success) {
            currentModule = response.data;
            renderModuleDetails();

            // Show details section
            document.getElementById('moduleDetailsSection').style.display = 'block';

            // Scroll to details
            document.getElementById('moduleDetailsSection').scrollIntoView({ behavior: 'smooth' });
        } else {
            throw new Error(response.message || 'Failed to load module details');
        }

        showLoading(false);
    } catch (error) {
        console.error('Load module details error:', error);
        alert('Failed to load module details: ' + error.message);
        showLoading(false);
    }
}

// Render module details
function renderModuleDetails() {
    if (!currentModule) return;

    // Module info
    document.getElementById('detailModuleName').textContent = currentModule.name;
    document.getElementById('detailModuleLevel').textContent = currentModule.level;
    document.getElementById('detailModuleDuration').textContent = currentModule.duration || '-';
    document.getElementById('detailModuleDescription').textContent = currentModule.description || 'No description';

    // Classes table
    const container = document.getElementById('classesTableBody');
    if (!container) return;

    if (!currentModule.classes || currentModule.classes.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #888;">No classes found</td></tr>';
        return;
    }

    let html = '';
    currentModule.classes.forEach((cls, index) => {
        html += `
            <tr>
                <td>${cls.order_index || index + 1}</td>
                <td>
                    <div style="font-weight: 600;">${cls.title}</div>
                    <div style="font-size: 1.3rem; color: #888;">${cls.description || 'No description'}</div>
                </td>
                <td>${cls.duration || '-'}</td>
                <td>
                    ${cls.video_url ? '<span class="badge badge-success">Yes</span>' : '<span class="badge badge-secondary">No</span>'}
                </td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-icon-btn" onclick="openEditMaterialModal(${cls.id})" title="Edit">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button class="action-icon-btn delete" onclick="deleteMaterial(${cls.id}, '${cls.title}')" title="Delete">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;
}

// Close module details
function closeModuleDetails() {
    document.getElementById('moduleDetailsSection').style.display = 'none';
    currentModule = null;
}

// Open create material modal
function openCreateMaterialModal() {
    if (!currentModule) {
        alert('Please select a module first!');
        return;
    }

    currentEditMaterialId = null;

    // Reset form
    document.getElementById('materialForm').reset();
    document.getElementById('materialModalTitle').textContent = 'Create New Class';
    document.getElementById('materialId').value = '';
    document.getElementById('materialModuleId').value = currentModule.id;

    // Show modal
    document.getElementById('materialModal').style.display = 'flex';
}

// Open edit material modal
function openEditMaterialModal(materialId) {
    if (!currentModule || !currentModule.classes) {
        alert('Module not loaded!');
        return;
    }

    const material = currentModule.classes.find(c => c.id === materialId);
    if (!material) {
        alert('Class not found!');
        return;
    }

    currentEditMaterialId = materialId;

    // Fill form
    document.getElementById('materialModalTitle').textContent = 'Edit Class';
    document.getElementById('materialId').value = material.id;
    document.getElementById('materialModuleId').value = currentModule.id;
    document.getElementById('materialTitle').value = material.title;
    document.getElementById('materialDescription').value = material.description || '';
    document.getElementById('materialContent').value = material.content || '';
    document.getElementById('materialVideoUrl').value = material.video_url || '';
    document.getElementById('materialDuration').value = material.duration || '';
    document.getElementById('materialOrderIndex').value = material.order_index || '';

    // Show modal
    document.getElementById('materialModal').style.display = 'flex';
}

// Close material modal
function closeMaterialModal() {
    document.getElementById('materialModal').style.display = 'none';
    document.getElementById('materialForm').reset();
    currentEditMaterialId = null;
}

// Handle material form submit
async function handleMaterialFormSubmit(event) {
    event.preventDefault();

    try {
        showLoading(true);

        const formData = {
            module_id: document.getElementById('materialModuleId').value,
            title: document.getElementById('materialTitle').value.trim(),
            description: document.getElementById('materialDescription').value.trim(),
            content: document.getElementById('materialContent').value.trim(),
            video_url: document.getElementById('materialVideoUrl').value.trim(),
            duration: document.getElementById('materialDuration').value.trim(),
            order_index: parseInt(document.getElementById('materialOrderIndex').value) || 1
        };

        let response;
        if (currentEditMaterialId) {
            // Update existing material
            response = await apiService.updateLearningMaterial(currentEditMaterialId, formData);
        } else {
            // Create new material
            response = await apiService.createLearningMaterial(formData);
        }

        if (response.success) {
            alert(currentEditMaterialId ? 'Class updated successfully!' : 'Class created successfully!');
            closeMaterialModal();

            // Reload module details
            await viewModuleDetails(currentModule.id);
        } else {
            throw new Error(response.message || 'Failed to save class');
        }

        showLoading(false);
    } catch (error) {
        console.error('Save class error:', error);
        alert('Failed to save class: ' + error.message);
        showLoading(false);
    }
}

// Delete material
async function deleteMaterial(materialId, materialTitle) {
    if (!confirm(`Are you sure you want to delete class "${materialTitle}"?\n\nThis action cannot be undone!`)) {
        return;
    }

    try {
        showLoading(true);

        const response = await apiService.deleteLearningMaterial(materialId);

        if (response.success) {
            alert('Class deleted successfully!');

            // Reload module details
            await viewModuleDetails(currentModule.id);
        } else {
            throw new Error(response.message || 'Failed to delete class');
        }

        showLoading(false);
    } catch (error) {
        console.error('Delete class error:', error);
        alert('Failed to delete class: ' + error.message);
        showLoading(false);
    }
}

// Search modules
function searchModules() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const filteredModules = allModules.filter(module => {
        return module.name.toLowerCase().includes(searchTerm) ||
               module.slug.toLowerCase().includes(searchTerm) ||
               module.level.toLowerCase().includes(searchTerm);
    });

    renderFilteredModules(filteredModules);
}

// Render filtered modules
function renderFilteredModules(modules) {
    const container = document.getElementById('modulesTableBody');
    if (!container) return;

    if (modules.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #888;">No modules found</td></tr>';
        return;
    }

    let html = '';
    modules.forEach(module => {
        const createdDate = new Date(module.created_at).toLocaleDateString('id-ID');
        const levelBadge = getLevelBadge(module.level);
        const classCount = module.class_count || 0;

        html += `
            <tr>
                <td>${module.id}</td>
                <td>
                    <div style="font-weight: 600;">${module.name}</div>
                    <div style="font-size: 1.3rem; color: #888;">${module.slug}</div>
                </td>
                <td>${levelBadge}</td>
                <td>${module.duration || '-'}</td>
                <td>${classCount} classes</td>
                <td>${createdDate}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-icon-btn" onclick="viewModuleDetails(${module.id})" title="View Classes">
                            <i class='bx bx-list-ul'></i>
                        </button>
                        <button class="action-icon-btn" onclick="openEditModuleModal(${module.id})" title="Edit">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button class="action-icon-btn delete" onclick="deleteModule(${module.id}, '${module.name}')" title="Delete">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;
}

// Filter by level
function filterByLevel(level) {
    if (level === 'all') {
        renderModulesTable();
        return;
    }

    const filteredModules = allModules.filter(module => module.level === level);
    renderFilteredModules(filteredModules);
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
    document.addEventListener('DOMContentLoaded', initModuleManagement);
} else {
    initModuleManagement();
}
