/**
 * Admin Assignment Management Integration
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
let allAssignments = [];
let currentEditAssignmentId = null;

// Initialize
async function initAssignmentManagement() {
    try {
        showLoading(true);

        // Load modules first
        await loadAllModules();

        // Load all assignments from all modules
        await loadAllAssignments();

        // Render assignments table
        renderAssignmentsTable();

        showLoading(false);
    } catch (error) {
        console.error('Init assignment management error:', error);
        alert('Failed to load assignments: ' + error.message);
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

// Load all assignments from all modules
async function loadAllAssignments() {
    try {
        allAssignments = [];

        // Load assignments for each module
        for (const module of allModules) {
            const response = await apiService.getModuleAssignments(module.slug);

            if (response.success && response.data && response.data.length > 0) {
                // Add module info to each assignment
                response.data.forEach(assignment => {
                    assignment.module_name = module.name;
                    assignment.module_slug = module.slug;
                });
                allAssignments.push(...response.data);
            }
        }

    } catch (error) {
        console.error('Load assignments error:', error);
        throw error;
    }
}

// Render assignments table
function renderAssignmentsTable() {
    const container = document.getElementById('assignmentsTableBody');
    if (!container) return;

    if (allAssignments.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #888;">No assignments found</td></tr>';

        // Update count
        const countEl = document.getElementById('totalAssignmentsCount');
        if (countEl) {
            countEl.textContent = '0';
        }
        return;
    }

    let html = '';
    allAssignments.forEach(assignment => {
        const createdDate = new Date(assignment.created_at).toLocaleDateString('id-ID');
        const dueDate = assignment.due_date ? new Date(assignment.due_date).toLocaleDateString('id-ID') : 'No deadline';

        html += `
            <tr>
                <td>${assignment.id}</td>
                <td>
                    <div style="font-weight: 600;">${assignment.title}</div>
                    <div style="font-size: 1.3rem; color: #888;">${assignment.description || 'No description'}</div>
                </td>
                <td>
                    <span class="badge badge-info">${assignment.module_name}</span>
                </td>
                <td>${dueDate}</td>
                <td>${assignment.submission_count || 0} submissions</td>
                <td>${createdDate}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-icon-btn" onclick="openEditAssignmentModal(${assignment.id})" title="Edit">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button class="action-icon-btn delete" onclick="deleteAssignment(${assignment.id}, '${assignment.title}')" title="Delete">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;

    // Update count
    const countEl = document.getElementById('totalAssignmentsCount');
    if (countEl) {
        countEl.textContent = allAssignments.length;
    }
}

// Open create assignment modal
function openCreateAssignmentModal() {
    currentEditAssignmentId = null;

    // Reset form
    document.getElementById('assignmentForm').reset();
    document.getElementById('assignmentModalTitle').textContent = 'Create New Assignment';
    document.getElementById('assignmentId').value = '';

    // Populate module dropdown
    populateModuleDropdown();

    // Show modal
    document.getElementById('assignmentModal').style.display = 'flex';
}

// Open edit assignment modal
function openEditAssignmentModal(assignmentId) {
    const assignment = allAssignments.find(a => a.id === assignmentId);
    if (!assignment) {
        alert('Assignment not found!');
        return;
    }

    currentEditAssignmentId = assignmentId;

    // Populate module dropdown first
    populateModuleDropdown();

    // Fill form
    document.getElementById('assignmentModalTitle').textContent = 'Edit Assignment';
    document.getElementById('assignmentId').value = assignment.id;
    document.getElementById('assignmentTitle').value = assignment.title;
    document.getElementById('assignmentDescription').value = assignment.description || '';
    document.getElementById('assignmentModuleId').value = assignment.module_id;

    // Format date for input (YYYY-MM-DD)
    if (assignment.due_date) {
        const dueDate = new Date(assignment.due_date);
        const formattedDate = dueDate.toISOString().split('T')[0];
        document.getElementById('assignmentDueDate').value = formattedDate;
    }

    // Show modal
    document.getElementById('assignmentModal').style.display = 'flex';
}

// Populate module dropdown
function populateModuleDropdown() {
    const dropdown = document.getElementById('assignmentModuleId');
    if (!dropdown) return;

    let html = '<option value="">Select Module</option>';

    allModules.forEach(module => {
        html += `<option value="${module.id}">${module.name} (${module.level})</option>`;
    });

    dropdown.innerHTML = html;
}

// Close assignment modal
function closeAssignmentModal() {
    document.getElementById('assignmentModal').style.display = 'none';
    document.getElementById('assignmentForm').reset();
    currentEditAssignmentId = null;
}

// Handle assignment form submit
async function handleAssignmentFormSubmit(event) {
    event.preventDefault();

    try {
        showLoading(true);

        const formData = {
            module_id: parseInt(document.getElementById('assignmentModuleId').value),
            title: document.getElementById('assignmentTitle').value.trim(),
            description: document.getElementById('assignmentDescription').value.trim(),
            due_date: document.getElementById('assignmentDueDate').value || null
        };

        // Validate module selection
        if (!formData.module_id) {
            alert('Please select a module!');
            showLoading(false);
            return;
        }

        let response;
        if (currentEditAssignmentId) {
            // Update existing assignment
            response = await apiService.updateAssignment(currentEditAssignmentId, formData);
        } else {
            // Create new assignment
            response = await apiService.createAssignment(formData);
        }

        if (response.success) {
            alert(currentEditAssignmentId ? 'Assignment updated successfully!' : 'Assignment created successfully!');
            closeAssignmentModal();

            // Reload data
            await loadAllAssignments();
            renderAssignmentsTable();
        } else {
            throw new Error(response.message || 'Failed to save assignment');
        }

        showLoading(false);
    } catch (error) {
        console.error('Save assignment error:', error);
        alert('Failed to save assignment: ' + error.message);
        showLoading(false);
    }
}

// Delete assignment
async function deleteAssignment(assignmentId, assignmentTitle) {
    if (!confirm(`Are you sure you want to delete assignment "${assignmentTitle}"?\n\nThis will also delete all student submissions!\n\nThis action cannot be undone!`)) {
        return;
    }

    try {
        showLoading(true);

        const response = await apiService.deleteAssignment(assignmentId);

        if (response.success) {
            alert('Assignment deleted successfully!');

            // Reload data
            await loadAllAssignments();
            renderAssignmentsTable();
        } else {
            throw new Error(response.message || 'Failed to delete assignment');
        }

        showLoading(false);
    } catch (error) {
        console.error('Delete assignment error:', error);
        alert('Failed to delete assignment: ' + error.message);
        showLoading(false);
    }
}

// Search assignments
function searchAssignments() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const filteredAssignments = allAssignments.filter(assignment => {
        return assignment.title.toLowerCase().includes(searchTerm) ||
               (assignment.description && assignment.description.toLowerCase().includes(searchTerm)) ||
               assignment.module_name.toLowerCase().includes(searchTerm);
    });

    renderFilteredAssignments(filteredAssignments);
}

// Render filtered assignments
function renderFilteredAssignments(assignments) {
    const container = document.getElementById('assignmentsTableBody');
    if (!container) return;

    if (assignments.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #888;">No assignments found</td></tr>';
        return;
    }

    let html = '';
    assignments.forEach(assignment => {
        const createdDate = new Date(assignment.created_at).toLocaleDateString('id-ID');
        const dueDate = assignment.due_date ? new Date(assignment.due_date).toLocaleDateString('id-ID') : 'No deadline';

        html += `
            <tr>
                <td>${assignment.id}</td>
                <td>
                    <div style="font-weight: 600;">${assignment.title}</div>
                    <div style="font-size: 1.3rem; color: #888;">${assignment.description || 'No description'}</div>
                </td>
                <td>
                    <span class="badge badge-info">${assignment.module_name}</span>
                </td>
                <td>${dueDate}</td>
                <td>${assignment.submission_count || 0} submissions</td>
                <td>${createdDate}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-icon-btn" onclick="openEditAssignmentModal(${assignment.id})" title="Edit">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button class="action-icon-btn delete" onclick="deleteAssignment(${assignment.id}, '${assignment.title}')" title="Delete">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;
}

// Filter by module
function filterByModule(moduleId) {
    if (moduleId === 'all') {
        renderAssignmentsTable();
        return;
    }

    const filteredAssignments = allAssignments.filter(assignment => assignment.module_id === parseInt(moduleId));
    renderFilteredAssignments(filteredAssignments);
}

// Populate module filter dropdown
function populateModuleFilter() {
    const filterDropdown = document.getElementById('moduleFilter');
    if (!filterDropdown) return;

    let html = '<option value="all">All Modules</option>';

    allModules.forEach(module => {
        html += `<option value="${module.id}">${module.name}</option>`;
    });

    filterDropdown.innerHTML = html;
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
    document.addEventListener('DOMContentLoaded', async () => {
        await initAssignmentManagement();
        populateModuleFilter();
    });
} else {
    initAssignmentManagement().then(() => {
        populateModuleFilter();
    });
}
