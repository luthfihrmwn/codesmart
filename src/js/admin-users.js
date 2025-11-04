/**
 * Admin User Management Integration
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

let allUsers = [];
let pendingApprovals = [];
let currentEditUserId = null;

// Initialize
async function initUserManagement() {
    try {
        showLoading(true);

        // Load users and pending approvals
        await Promise.all([
            loadAllUsers(),
            loadPendingApprovals()
        ]);

        // Render tables
        renderUsersTable();
        renderPendingApprovalsTable();

        showLoading(false);
    } catch (error) {
        console.error('Init user management error:', error);
        alert('Failed to load users: ' + error.message);
        showLoading(false);
    }
}

// Load all users
async function loadAllUsers() {
    try {
        const response = await apiService.getAllUsers();

        if (response.success) {
            allUsers = response.data;
        } else {
            throw new Error(response.message || 'Failed to load users');
        }
    } catch (error) {
        console.error('Load users error:', error);
        throw error;
    }
}

// Load pending approvals
async function loadPendingApprovals() {
    try {
        const response = await apiService.getPendingApprovals();

        if (response.success) {
            pendingApprovals = response.data;
        } else {
            throw new Error(response.message || 'Failed to load pending approvals');
        }
    } catch (error) {
        console.error('Load pending approvals error:', error);
        throw error;
    }
}

// Render users table
function renderUsersTable() {
    const container = document.getElementById('usersTableBody');
    if (!container) return;

    if (allUsers.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #888;">No users found</td></tr>';
        return;
    }

    let html = '';
    allUsers.forEach(user => {
        const joinDate = new Date(user.created_at).toLocaleDateString('id-ID');
        const statusBadge = getStatusBadge(user.status);
        const roleBadge = getRoleBadge(user.role);

        html += `
            <tr>
                <td>${user.id}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="${user.photo_url || '/src/assets/default-avatar.png'}"
                             alt="${user.name}"
                             style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <div>
                            <div style="font-weight: 600;">${user.name}</div>
                            <div style="font-size: 1.3rem; color: #888;">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>${roleBadge}</td>
                <td>${user.level || '-'}</td>
                <td>${statusBadge}</td>
                <td>${joinDate}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-icon-btn" onclick="openEditModal(${user.id})" title="Edit">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button class="action-icon-btn delete" onclick="deleteUser(${user.id}, '${user.name}')" title="Delete">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;

    // Update count
    const countEl = document.getElementById('totalUsersCount');
    if (countEl) {
        countEl.textContent = allUsers.length;
    }
}

// Render pending approvals table
function renderPendingApprovalsTable() {
    const container = document.getElementById('pendingApprovalsBody');
    if (!container) return;

    if (pendingApprovals.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #888;">No pending approvals</td></tr>';

        // Update count
        const countEl = document.getElementById('pendingApprovalsCount');
        if (countEl) {
            countEl.textContent = '0';
        }
        return;
    }

    let html = '';
    pendingApprovals.forEach(request => {
        const requestDate = new Date(request.created_at).toLocaleDateString('id-ID');

        html += `
            <tr>
                <td>
                    <div>
                        <div style="font-weight: 600;">${request.user_name}</div>
                        <div style="font-size: 1.3rem; color: #888;">${request.user_email}</div>
                    </div>
                </td>
                <td>
                    <span class="badge badge-info">${request.current_level || 'fundamental'}</span>
                </td>
                <td>
                    <span class="badge badge-success">${request.requested_level}</span>
                </td>
                <td>${requestDate}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn-approve" onclick="approvePromotion(${request.user_id})">
                            <i class='bx bx-check'></i> Approve
                        </button>
                        <button class="btn-reject" onclick="rejectPromotion(${request.user_id})">
                            <i class='bx bx-x'></i> Reject
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;

    // Update count
    const countEl = document.getElementById('pendingApprovalsCount');
    if (countEl) {
        countEl.textContent = pendingApprovals.length;
    }
}

// Get status badge
function getStatusBadge(status) {
    const badges = {
        'active': '<span class="badge badge-success">Active</span>',
        'inactive': '<span class="badge badge-secondary">Inactive</span>',
        'suspended': '<span class="badge badge-danger">Suspended</span>'
    };
    return badges[status] || badges['active'];
}

// Get role badge
function getRoleBadge(role) {
    const badges = {
        'admin': '<span class="badge badge-danger">Admin</span>',
        'assessor': '<span class="badge badge-warning">Assessor</span>',
        'user': '<span class="badge badge-info">User</span>'
    };
    return badges[role] || badges['user'];
}

// Open create modal
function openCreateModal() {
    currentEditUserId = null;

    // Reset form
    document.getElementById('userForm').reset();
    document.getElementById('modalTitle').textContent = 'Create New User';
    document.getElementById('userId').value = '';

    // Show modal
    document.getElementById('userModal').style.display = 'flex';
}

// Open edit modal
function openEditModal(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
        alert('User not found!');
        return;
    }

    currentEditUserId = userId;

    // Fill form
    document.getElementById('modalTitle').textContent = 'Edit User';
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPhone').value = user.phone || '';
    document.getElementById('userRole').value = user.role;
    document.getElementById('userLevel').value = user.level || 'fundamental';
    document.getElementById('userStatus').value = user.status || 'active';

    // Show modal
    document.getElementById('userModal').style.display = 'flex';
}

// Close modal
function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('userForm').reset();
    currentEditUserId = null;
}

// Handle form submit
async function handleUserFormSubmit(event) {
    event.preventDefault();

    try {
        showLoading(true);

        const formData = {
            name: document.getElementById('userName').value.trim(),
            email: document.getElementById('userEmail').value.trim(),
            phone: document.getElementById('userPhone').value.trim(),
            role: document.getElementById('userRole').value,
            level: document.getElementById('userLevel').value,
            status: document.getElementById('userStatus').value
        };

        // Add password only if creating new user or if password field is filled
        const passwordField = document.getElementById('userPassword');
        if (passwordField && passwordField.value) {
            formData.password = passwordField.value;
        }

        let response;
        if (currentEditUserId) {
            // Update existing user
            response = await apiService.updateUser(currentEditUserId, formData);
        } else {
            // Create new user - password is required
            if (!formData.password) {
                alert('Password is required for new users!');
                showLoading(false);
                return;
            }
            response = await apiService.createUser(formData);
        }

        if (response.success) {
            alert(currentEditUserId ? 'User updated successfully!' : 'User created successfully!');
            closeUserModal();

            // Reload data
            await loadAllUsers();
            renderUsersTable();
        } else {
            throw new Error(response.message || 'Failed to save user');
        }

        showLoading(false);
    } catch (error) {
        console.error('Save user error:', error);
        alert('Failed to save user: ' + error.message);
        showLoading(false);
    }
}

// Delete user
async function deleteUser(userId, userName) {
    if (!confirm(`Are you sure you want to delete user "${userName}"?\n\nThis action cannot be undone!`)) {
        return;
    }

    try {
        showLoading(true);

        const response = await apiService.deleteUser(userId);

        if (response.success) {
            alert('User deleted successfully!');

            // Reload data
            await loadAllUsers();
            renderUsersTable();
        } else {
            throw new Error(response.message || 'Failed to delete user');
        }

        showLoading(false);
    } catch (error) {
        console.error('Delete user error:', error);
        alert('Failed to delete user: ' + error.message);
        showLoading(false);
    }
}

// Approve promotion
async function approvePromotion(userId) {
    if (!confirm('Approve this promotion request?')) {
        return;
    }

    try {
        showLoading(true);

        const response = await apiService.approveUser(userId);

        if (response.success) {
            alert('Promotion approved successfully!');

            // Reload data
            await Promise.all([
                loadAllUsers(),
                loadPendingApprovals()
            ]);

            renderUsersTable();
            renderPendingApprovalsTable();
        } else {
            throw new Error(response.message || 'Failed to approve promotion');
        }

        showLoading(false);
    } catch (error) {
        console.error('Approve promotion error:', error);
        alert('Failed to approve promotion: ' + error.message);
        showLoading(false);
    }
}

// Reject promotion
async function rejectPromotion(userId) {
    if (!confirm('Reject this promotion request?')) {
        return;
    }

    try {
        showLoading(true);

        const response = await apiService.rejectUser(userId);

        if (response.success) {
            alert('Promotion rejected successfully!');

            // Reload data
            await Promise.all([
                loadAllUsers(),
                loadPendingApprovals()
            ]);

            renderUsersTable();
            renderPendingApprovalsTable();
        } else {
            throw new Error(response.message || 'Failed to reject promotion');
        }

        showLoading(false);
    } catch (error) {
        console.error('Reject promotion error:', error);
        alert('Failed to reject promotion: ' + error.message);
        showLoading(false);
    }
}

// Search users
function searchUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const filteredUsers = allUsers.filter(user => {
        return user.name.toLowerCase().includes(searchTerm) ||
               user.email.toLowerCase().includes(searchTerm) ||
               user.role.toLowerCase().includes(searchTerm);
    });

    renderFilteredUsers(filteredUsers);
}

// Render filtered users
function renderFilteredUsers(users) {
    const container = document.getElementById('usersTableBody');
    if (!container) return;

    if (users.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #888;">No users found</td></tr>';
        return;
    }

    let html = '';
    users.forEach(user => {
        const joinDate = new Date(user.created_at).toLocaleDateString('id-ID');
        const statusBadge = getStatusBadge(user.status);
        const roleBadge = getRoleBadge(user.role);

        html += `
            <tr>
                <td>${user.id}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <img src="${user.photo_url || '/src/assets/default-avatar.png'}"
                             alt="${user.name}"
                             style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <div>
                            <div style="font-weight: 600;">${user.name}</div>
                            <div style="font-size: 1.3rem; color: #888;">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>${roleBadge}</td>
                <td>${user.level || '-'}</td>
                <td>${statusBadge}</td>
                <td>${joinDate}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-icon-btn" onclick="openEditModal(${user.id})" title="Edit">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button class="action-icon-btn delete" onclick="deleteUser(${user.id}, '${user.name}')" title="Delete">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;
}

// Filter by role
function filterByRole(role) {
    if (role === 'all') {
        renderUsersTable();
        return;
    }

    const filteredUsers = allUsers.filter(user => user.role === role);
    renderFilteredUsers(filteredUsers);
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
    document.addEventListener('DOMContentLoaded', initUserManagement);
} else {
    initUserManagement();
}
