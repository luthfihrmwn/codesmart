// Utility Functions for CodeSmart Platform

// Profile Photo Upload and Preview
function handlePhotoUpload(inputElement, previewElement) {
    const file = inputElement.files[0];

    if (!file) {
        return null;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Format file tidak valid. Gunakan JPG, PNG, GIF, atau WEBP.');
        inputElement.value = '';
        return null;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
        alert('Ukuran file terlalu besar. Maksimal 2MB.');
        inputElement.value = '';
        return null;
    }

    // Read file and convert to base64
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(e) {
            const base64String = e.target.result;

            // Update preview if element provided
            if (previewElement) {
                previewElement.src = base64String;
                previewElement.style.display = 'block';
            }

            resolve(base64String);
        };

        reader.onerror = function(error) {
            alert('Gagal membaca file. Silakan coba lagi.');
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

// Phone Number Validation (Indonesian format)
function validatePhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Check if empty (optional field)
    if (!cleaned) {
        return { valid: true, message: '' };
    }

    // Indonesian phone format: 08xx-xxxx-xxxx or +62xxx-xxxx-xxxx
    // Minimum 10 digits, maximum 15 digits
    if (cleaned.length < 10) {
        return { valid: false, message: 'Nomor telepon terlalu pendek (minimal 10 digit)' };
    }

    if (cleaned.length > 15) {
        return { valid: false, message: 'Nomor telepon terlalu panjang (maksimal 15 digit)' };
    }

    // Check if starts with valid Indonesian prefix
    const validPrefixes = ['08', '62'];
    const hasValidPrefix = validPrefixes.some(prefix => cleaned.startsWith(prefix));

    if (!hasValidPrefix) {
        return { valid: false, message: 'Nomor telepon harus dimulai dengan 08 atau 62' };
    }

    return { valid: true, message: '' };
}

// Format phone number for display
function formatPhoneNumber(phone) {
    if (!phone) return '';

    const cleaned = phone.replace(/\D/g, '');

    // Format: 0812-3456-7890
    if (cleaned.startsWith('0')) {
        const match = cleaned.match(/^(\d{4})(\d{4})(\d+)$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
    }

    // Format: +62-812-3456-7890
    if (cleaned.startsWith('62')) {
        const match = cleaned.match(/^(62)(\d{3})(\d{4})(\d+)$/);
        if (match) {
            return `+${match[1]}-${match[2]}-${match[3]}-${match[4]}`;
        }
    }

    return phone;
}

// Profile Completion Check
function isProfileComplete(user) {
    const requiredFields = ['name', 'email', 'phone', 'photoUrl'];
    const missingFields = [];

    for (const field of requiredFields) {
        if (!user[field] || user[field].trim() === '') {
            missingFields.push(field);
        }
    }

    return {
        complete: missingFields.length === 0,
        missingFields: missingFields,
        percentage: Math.round(((requiredFields.length - missingFields.length) / requiredFields.length) * 100)
    };
}

// Get field label in Indonesian
function getFieldLabel(field) {
    const labels = {
        name: 'Nama',
        email: 'Email',
        phone: 'Nomor Handphone',
        photoUrl: 'Foto Profil'
    };
    return labels[field] || field;
}

// Show profile completion alert
function showProfileCompletionAlert(missingFields) {
    const fieldLabels = missingFields.map(field => getFieldLabel(field)).join(', ');
    const message = `Profil Anda belum lengkap. Mohon lengkapi: ${fieldLabels}`;

    // Create custom alert modal
    const existingAlert = document.getElementById('profileCompletionAlert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertHTML = `
        <div id="profileCompletionAlert" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 99999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 3rem; border-radius: 1rem; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 1rem 3rem rgba(0,0,0,0.3);">
                <div style="font-size: 6rem; color: #f39c12; margin-bottom: 1.5rem;">
                    <i class='bx bx-error-circle'></i>
                </div>
                <h3 style="font-size: 2.2rem; color: #333; margin-bottom: 1.5rem;">Profil Belum Lengkap</h3>
                <p style="font-size: 1.6rem; color: #666; margin-bottom: 2.5rem;">${message}</p>
                <button onclick="document.getElementById('profileCompletionAlert').remove()" style="padding: 1.2rem 3rem; font-size: 1.6rem; border-radius: 0.8rem; border: none; background: #754ef9; color: white; cursor: pointer; font-weight: 600;">
                    Mengerti
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', alertHTML);
}

// Initialize profile completion indicator
function initProfileCompletionIndicator(user) {
    const profileStatus = isProfileComplete(user);

    // Find or create profile indicator element
    let indicator = document.getElementById('profileCompletionIndicator');

    if (!indicator && !profileStatus.complete) {
        // Create indicator in header if profile is incomplete
        const header = document.querySelector('.dashboard-header') || document.querySelector('.admin-header') || document.querySelector('.user-header');

        if (header) {
            const indicatorHTML = `
                <div id="profileCompletionIndicator" style="display: flex; align-items: center; gap: 1rem; padding: 0.8rem 1.5rem; background: #fff3cd; border: 0.2rem solid #ffc107; border-radius: 0.8rem; margin-right: 2rem;">
                    <i class='bx bx-error-circle' style="font-size: 2.4rem; color: #f39c12;"></i>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 1.4rem; font-weight: 600; color: #856404;">Profil ${profileStatus.percentage}% Lengkap</span>
                        <span style="font-size: 1.2rem; color: #856404;">Klik Profil untuk melengkapi</span>
                    </div>
                </div>
            `;

            // Insert before user info or at end of header
            const userInfo = header.querySelector('.user-info');
            if (userInfo) {
                userInfo.insertAdjacentHTML('beforebegin', indicatorHTML);
            } else {
                header.insertAdjacentHTML('beforeend', indicatorHTML);
            }
        }
    } else if (indicator && profileStatus.complete) {
        // Remove indicator if profile is now complete
        indicator.remove();
    }

    return profileStatus;
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.trim() === '') {
        return { valid: false, message: 'Email tidak boleh kosong' };
    }

    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Format email tidak valid' };
    }

    return { valid: true, message: '' };
}

// Name validation
function validateName(name) {
    if (!name || name.trim() === '') {
        return { valid: false, message: 'Nama tidak boleh kosong' };
    }

    if (name.trim().length < 3) {
        return { valid: false, message: 'Nama minimal 3 karakter' };
    }

    if (name.trim().length > 100) {
        return { valid: false, message: 'Nama maksimal 100 karakter' };
    }

    return { valid: true, message: '' };
}

// Generate avatar URL from name (for default avatar)
function generateAvatarUrl(name) {
    if (!name) return 'https://ui-avatars.com/api/?name=User&size=200&background=754ef9&color=fff&bold=true';

    const initials = name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=200&background=754ef9&color=fff&bold=true`;
}

// Update all avatar displays on page
function updateAvatarDisplays(photoUrl, name) {
    const avatarUrl = photoUrl || generateAvatarUrl(name);

    // Update all avatar images on the page
    const avatars = document.querySelectorAll('.user-avatar, .profile-avatar, [data-avatar]');
    avatars.forEach(avatar => {
        if (avatar.tagName === 'IMG') {
            avatar.src = avatarUrl;
        } else {
            avatar.style.backgroundImage = `url(${avatarUrl})`;
        }
    });
}
