/**
 * User Profile Loader
 * Loads user profile data and updates navbar avatar across all pages
 */

class UserProfileLoader {
    constructor() {
        // No need for retries, we'll use setTimeout
    }

    /**
     * Load and update user profile in navbar
     */
    async loadAndUpdateNavbar() {
        try {
            // Simple check - if services exist, use them
            if (!window.apiService || !window.authService) {
                console.log('UserProfileLoader: Services not available yet');
                return;
            }

            // Check if user is logged in
            if (!window.authService.isLoggedIn()) {
                console.log('UserProfileLoader: User not logged in');
                return;
            }

            // Get user profile
            const response = await window.apiService.getUserProfile();

            if (response.success && response.data) {
                const user = response.data;
                console.log('UserProfileLoader: Got user data', user.name, user.photo_url);
                this.updateNavbarAvatar(user);
            } else {
                console.log('UserProfileLoader: Failed to get profile', response.message);
            }
        } catch (error) {
            console.error('UserProfileLoader: Error loading profile:', error);
        }
    }

    /**
     * Update navbar avatar with user photo or initial
     */
    updateNavbarAvatar(user) {
        // Try multiple possible ID names for avatar element
        const userAvatar = document.getElementById('userAvatar') ||
                          document.getElementById('userAvatarNav');
        const userName = document.getElementById('userName') ||
                        document.getElementById('userNameNav');

        if (!userAvatar) {
            console.log('UserProfileLoader: Avatar element not found');
            return;
        }

        // Update user name if element exists
        if (userName && user.name) {
            userName.textContent = user.name;
        }

        // Update avatar
        if (user.photo_url) {
            // User has a photo - display it
            const photoUrl = user.photo_url.startsWith('http')
                ? user.photo_url
                : `http://localhost:5000${user.photo_url}`;

            console.log('UserProfileLoader: Setting photo URL:', photoUrl);

            // Clear text content and add image
            userAvatar.innerHTML = '';
            userAvatar.textContent = '';

            // Create img element for better control
            const img = document.createElement('img');
            img.src = photoUrl;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '10px';
            img.style.display = 'block';

            // Add error handler in case image fails to load
            img.onerror = function() {
                console.log('UserProfileLoader: Image failed to load, using initial');
                const initial = (user.name || 'A')[0].toUpperCase();
                userAvatar.innerHTML = '';
                userAvatar.textContent = initial;
                userAvatar.style.removeProperty('background');
                userAvatar.style.color = 'white';
            };

            userAvatar.appendChild(img);
            userAvatar.style.setProperty('background', 'transparent', 'important');
            userAvatar.style.padding = '0';
            userAvatar.style.overflow = 'hidden';
        } else {
            // No photo - show initial
            const initial = (user.name || 'A')[0].toUpperCase();
            userAvatar.innerHTML = '';
            userAvatar.textContent = initial;
            userAvatar.style.removeProperty('background');
            userAvatar.style.padding = '';
            userAvatar.style.color = 'white'; // White text
        }
    }
}

// Initialize when DOM and all scripts are ready
(function initUserProfileLoader() {
    let retryCount = 0;
    const maxRetries = 20; // 20 retries × 200ms = 4 seconds max wait

    // Function to initialize the loader
    function init() {
        retryCount++;
        console.log(`UserProfileLoader: Initializing... (attempt ${retryCount}/${maxRetries})`);

        // Debug: Check what's on window
        console.log('UserProfileLoader: Checking services...', {
            apiService: !!window.apiService,
            authService: !!window.authService
        });

        // Check if services are available
        if (!window.apiService || !window.authService) {
            if (retryCount < maxRetries) {
                console.log('UserProfileLoader: Services not ready, retrying in 200ms...');
                setTimeout(init, 200); // Retry after 200ms
            } else {
                console.error('UserProfileLoader: Services failed to load after', maxRetries, 'attempts');
            }
            return;
        }

        console.log('UserProfileLoader: Services ready!');
        const loader = new UserProfileLoader();
        window.userProfileLoader = loader;
        loader.loadAndUpdateNavbar();
    }

    // Start initialization after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 100); // Small delay after DOM ready
        });
    } else {
        // DOM already loaded, init immediately with small delay
        setTimeout(init, 100);
    }
})();
