/**
 * User Profile Integration
 * CodeSmart LMS - Supabase Backend
 */

// Check authentication
if (!authService.requireAuth()) {
    window.location.href = '/index.html';
}

let currentUser = null;

// Initialize profile page
async function initProfile() {
    try {
        showLoading(true);

        // Load user profile from API
        await loadUserProfile();

        // Render profile data
        renderProfile();

        showLoading(false);
    } catch (error) {
        console.error('Init profile error:', error);
        alert('Gagal memuat profil: ' + error.message);
        showLoading(false);
    }
}

// Load user profile from API
async function loadUserProfile() {
    try {
        const response = await apiService.getUserProfile();

        if (response.success) {
            currentUser = response.data.user;
            // Update local storage
            authService.updateUser(currentUser);
        } else {
            throw new Error(response.message || 'Failed to load profile');
        }
    } catch (error) {
        console.error('Load profile error:', error);
        throw error;
    }
}

// Render profile data
function renderProfile() {
    // Set header username
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = currentUser.name;
    }

    // Set profile avatar
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        if (currentUser.photo_url) {
            profileAvatar.src = currentUser.photo_url;
        } else {
            profileAvatar.src = generateDefaultAvatar(currentUser.name);
        }
    }

    // Set profile name and role
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = currentUser.role.toUpperCase();

    // Set view mode data
    document.getElementById('viewName').textContent = currentUser.name;
    document.getElementById('viewUsername').textContent = currentUser.username;
    document.getElementById('viewEmail').textContent = currentUser.email;
    document.getElementById('viewPhone').textContent = currentUser.phone || '-';
    document.getElementById('viewRole').textContent = currentUser.role.toUpperCase();

    // Set edit mode data
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('editPhone').value = currentUser.phone || '';

    // Set edit photo preview
    const editPhotoPreview = document.getElementById('editPhotoPreview');
    if (editPhotoPreview) {
        if (currentUser.photo_url) {
            editPhotoPreview.src = currentUser.photo_url;
        } else {
            editPhotoPreview.src = generateDefaultAvatar(currentUser.name);
        }
    }

    // Set pretest results
    document.getElementById('pretestScore').textContent = currentUser.pretest_score || 0;
    document.getElementById('pretestLevel').textContent =
        `Level: ${(currentUser.current_level || 'N/A').toUpperCase()}`;

    // Set pretest message based on score
    const score = currentUser.pretest_score || 0;
    let message = '';
    if (score === 0) {
        message = 'Anda belum mengikuti pretest.';
    } else if (score <= 45) {
        message = 'Mulai dari dasar untuk membangun fondasi yang kuat!';
    } else if (score <= 65) {
        message = 'Tingkatkan skill Anda ke level menengah!';
    } else {
        message = 'Selamat! Anda siap untuk materi advanced!';
    }
    document.getElementById('pretestMessage').textContent = message;
}

// Generate default avatar from name
function generateDefaultAvatar(name) {
    const initial = name.charAt(0).toUpperCase();
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#754ef9';
    ctx.fillRect(0, 0, 200, 200);

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initial, 100, 100);

    return canvas.toDataURL();
}

// Toggle edit mode
function toggleEditMode() {
    const viewMode = document.getElementById('viewMode');
    const editMode = document.getElementById('editMode');
    const btnEdit = document.getElementById('btnEdit');

    if (editMode.classList.contains('active')) {
        cancelEdit();
    } else {
        viewMode.style.display = 'none';
        editMode.classList.add('active');
        btnEdit.style.display = 'none';
    }
}

// Cancel edit
function cancelEdit() {
    const viewMode = document.getElementById('viewMode');
    const editMode = document.getElementById('editMode');
    const btnEdit = document.getElementById('btnEdit');

    viewMode.style.display = 'block';
    editMode.classList.remove('active');
    btnEdit.style.display = 'block';

    // Reset form
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('editPhone').value = currentUser.phone || '';
    document.getElementById('editPassword').value = '';

    // Hide phone error
    document.getElementById('phoneError').style.display = 'none';
}

// Show alert
function showAlert(message, type = 'success') {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    alert.style.display = 'block';

    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

// Handle profile photo upload
async function handleProfilePhotoUpload(input) {
    const preview = document.getElementById('editPhotoPreview');

    if (!input.files || !input.files[0]) {
        return;
    }

    const file = input.files[0];

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showAlert('Format file tidak valid! Gunakan JPG, PNG, GIF, atau WEBP.', 'error');
        return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
        showAlert('Ukuran file terlalu besar! Maksimal 2MB.', 'error');
        return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        preview.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // Convert to base64 and save
    try {
        const base64 = await convertToBase64(file);

        // Update via API
        const response = await apiService.updateUserProfile({
            photo_url: base64
        });

        if (response.success) {
            currentUser.photo_url = base64;
            document.getElementById('profileAvatar').src = base64;
            showAlert('Foto profil berhasil diupload!', 'success');
        } else {
            showAlert('Gagal menyimpan foto: ' + (response.message || 'Unknown error'), 'error');
            preview.src = currentUser.photo_url || generateDefaultAvatar(currentUser.name);
        }
    } catch (error) {
        console.error('Photo upload error:', error);
        showAlert('Gagal mengupload foto. Silakan coba lagi.', 'error');
    }
}

// Convert file to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Validate phone number
function validatePhone(phone) {
    if (!phone) return { valid: true };

    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');

    // Check if starts with +62 or 08
    const phoneRegex = /^(\+62|62|08)\d{8,12}$/;

    if (!phoneRegex.test(cleaned)) {
        return {
            valid: false,
            message: 'Format nomor telepon tidak valid. Contoh: 08123456789 atau +628123456789'
        };
    }

    return { valid: true };
}

// Handle profile form submit
document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const password = document.getElementById('editPassword').value;

    // Validate name
    if (!name || name.length < 3) {
        showAlert('Nama harus minimal 3 karakter!', 'error');
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showAlert('Format email tidak valid!', 'error');
        return;
    }

    // Validate phone if provided
    if (phone) {
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
            const phoneError = document.getElementById('phoneError');
            phoneError.textContent = phoneValidation.message;
            phoneError.style.display = 'block';
            return;
        } else {
            document.getElementById('phoneError').style.display = 'none';
        }
    }

    // Validate password if provided
    if (password && password.length < 6) {
        showAlert('Password harus minimal 6 karakter!', 'error');
        return;
    }

    const updates = {
        name: name,
        email: email,
        phone: phone || null,
        photo_url: currentUser.photo_url || null
    };

    // Note: Password update needs separate endpoint (not implemented yet)
    // For now, we'll ignore password updates

    try {
        showLoading(true);

        const response = await apiService.updateUserProfile(updates);

        if (response.success) {
            showAlert('Profile berhasil diupdate!', 'success');

            // Update current user
            currentUser = response.data.user;
            authService.updateUser(currentUser);

            // Re-render profile
            renderProfile();
            cancelEdit();
        } else {
            showAlert('Gagal mengupdate profile: ' + (response.message || 'Unknown error'), 'error');
        }

        showLoading(false);
    } catch (error) {
        console.error('Update profile error:', error);
        showAlert('Terjadi kesalahan saat mengupdate profile!', 'error');
        showLoading(false);
    }
});

// Retake pretest
function retakePretest() {
    if (confirm('Apakah Anda yakin ingin mengulang pretest? Hasil pretest sebelumnya akan dihapus.')) {
        // Note: Backend doesn't have endpoint to reset pretest yet
        // For now, just redirect to pretest page
        window.location.href = 'pretest-new.html';
    }
}

// Loading spinner
function showLoading(show) {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
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

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfile);
} else {
    initProfile();
}
