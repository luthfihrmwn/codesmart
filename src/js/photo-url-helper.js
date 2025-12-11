/**
 * Photo URL Helper for CodeSmart
 * Provides utility functions for constructing photo URLs
 * Works with both localhost development and Nginx production
 */

class PhotoURLHelper {
    /**
     * Construct full photo URL from relative path
     * @param {string} photoPath - Photo path from database (e.g., /uploads/profile-123.jpg)
     * @returns {string} Full URL (e.g., https://codesmart.my.id/uploads/profile-123.jpg)
     */
    static getPhotoURL(photoPath) {
        if (!photoPath) {
            return null;
        }

        // If already a full URL, return as is
        if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
            return photoPath;
        }

        // Construct URL using current domain (works with Nginx and localhost)
        return `${window.location.protocol}//${window.location.host}${photoPath}`;
    }

    /**
     * Get user avatar URL with fallback
     * @param {object} user - User object with photo_url
     * @returns {string|null} Photo URL or null if no photo
     */
    static getUserAvatarURL(user) {
        if (!user || !user.photo_url) {
            return null;
        }

        return this.getPhotoURL(user.photo_url);
    }

    /**
     * Generate default avatar (first letter)
     * @param {string} name - User name
     * @returns {string} First letter uppercase
     */
    static getDefaultAvatar(name) {
        if (!name || name.length === 0) {
            return 'A';
        }

        return name[0].toUpperCase();
    }

    /**
     * Get avatar HTML element (photo or initial)
     * @param {object} user - User object
     * @param {object} options - Options for styling
     * @returns {string} HTML string
     */
    static getAvatarHTML(user, options = {}) {
        const {
            size = '40px',
            borderRadius = '50%',
            className = '',
            showInitial = true
        } = options;

        const photoURL = this.getUserAvatarURL(user);

        if (photoURL) {
            const initial = this.getDefaultAvatar(user.name);
            return `
                <img src="${photoURL}"
                     alt="${user.name || 'User'}"
                     class="${className}"
                     style="width: ${size}; height: ${size}; border-radius: ${borderRadius}; object-fit: cover;"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                ${showInitial ? `
                <div style="display: none; width: ${size}; height: ${size}; border-radius: ${borderRadius}; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); align-items: center; justify-content: center; color: white; font-weight: 600;">
                    ${initial}
                </div>
                ` : ''}
            `;
        } else if (showInitial) {
            const initial = this.getDefaultAvatar(user.name);
            return `
                <div style="width: ${size}; height: ${size}; border-radius: ${borderRadius}; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                    ${initial}
                </div>
            `;
        }

        return '';
    }
}

// Export to window for global use
window.PhotoURLHelper = PhotoURLHelper;
