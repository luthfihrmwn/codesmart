// PWA Installation and Service Worker Management

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('PWA is installed');
        }

        // Register Service Worker
        this.registerServiceWorker();

        // Listen for install prompt
        this.setupInstallPrompt();

        // Check for updates
        this.checkForUpdates();

        // Setup offline detection
        this.setupOfflineDetection();
    }

    // Register Service Worker
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });

                console.log('Service Worker registered:', registration);

                // Check for updates on page load
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('New Service Worker found');

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });

                // Auto-update check every hour
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000);

            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    // Setup install prompt
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;

            // Show custom install button
            this.showInstallButton();

            console.log('Install prompt ready');
        });

        // Detect if app was installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showInstalledNotification();
        });
    }

    // Show install button
    showInstallButton() {
        const installButton = document.getElementById('pwa-install-btn');
        if (installButton) {
            installButton.style.display = 'flex';
            installButton.addEventListener('click', () => this.promptInstall());
        } else {
            // Create floating install button if doesn't exist
            this.createInstallButton();
        }
    }

    // Create floating install button
    createInstallButton() {
        if (this.isInstalled) return;

        const button = document.createElement('button');
        button.id = 'pwa-install-btn';
        button.className = 'pwa-install-floating';
        button.innerHTML = `
            <i class='bx bx-download'></i>
            <span>Install App</span>
        `;
        button.addEventListener('click', () => this.promptInstall());

        document.body.appendChild(button);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .pwa-install-floating {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                padding: 1.5rem 2.5rem;
                background: var(--main-color);
                color: var(--white-color);
                border: none;
                border-radius: 5rem;
                font-size: 1.6rem;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 .5rem 2rem rgba(117, 78, 249, 0.4);
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 9999;
                transition: all 0.3s ease;
                animation: pulse 2s infinite;
            }

            .pwa-install-floating:hover {
                transform: translateY(-0.5rem);
                box-shadow: 0 1rem 3rem rgba(117, 78, 249, 0.6);
            }

            .pwa-install-floating i {
                font-size: 2.4rem;
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            @media (max-width: 768px) {
                .pwa-install-floating {
                    bottom: 1rem;
                    right: 1rem;
                    padding: 1.2rem 2rem;
                    font-size: 1.4rem;
                }

                .pwa-install-floating span {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Hide install button
    hideInstallButton() {
        const installButton = document.getElementById('pwa-install-btn');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }

    // Prompt install
    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('Install prompt not available');
            return;
        }

        this.deferredPrompt.prompt();

        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        this.deferredPrompt = null;
    }

    // Show update notification
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="pwa-notification-content">
                <i class='bx bx-info-circle'></i>
                <div>
                    <strong>Update Available</strong>
                    <p>A new version of CodeSmart is available!</p>
                </div>
                <button onclick="pwaManager.updateApp()">Update Now</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .pwa-update-notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: var(--bg-color);
                padding: 2rem;
                border-radius: 1.5rem;
                box-shadow: 0 1rem 3rem var(--shadow-color);
                z-index: 10000;
                border-left: .5rem solid var(--main-color);
                animation: slideIn 0.5s ease;
            }

            .pwa-notification-content {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .pwa-notification-content i {
                font-size: 3rem;
                color: var(--main-color);
            }

            .pwa-notification-content strong {
                display: block;
                font-size: 1.6rem;
                color: var(--text-color);
                margin-bottom: 0.5rem;
            }

            .pwa-notification-content p {
                font-size: 1.4rem;
                color: var(--text-color);
                opacity: 0.8;
                margin: 0;
            }

            .pwa-notification-content button {
                padding: 1rem 2rem;
                background: var(--main-color);
                color: var(--white-color);
                border: none;
                border-radius: 0.8rem;
                font-size: 1.4rem;
                font-weight: 600;
                cursor: pointer;
                white-space: nowrap;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(40rem);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .pwa-update-notification {
                    top: 1rem;
                    right: 1rem;
                    left: 1rem;
                    padding: 1.5rem;
                }

                .pwa-notification-content {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Update app
    updateApp() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration && registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                }
            });
        }
    }

    // Show installed notification
    showInstalledNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-success-notification';
        notification.innerHTML = `
            <i class='bx bx-check-circle'></i>
            <span>CodeSmart installed successfully!</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .pwa-success-notification {
                position: fixed;
                top: 2rem;
                left: 50%;
                transform: translateX(-50%);
                background: #28a745;
                color: white;
                padding: 1.5rem 3rem;
                border-radius: 5rem;
                font-size: 1.6rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10001;
                box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.3);
                animation: slideDown 0.5s ease;
            }

            .pwa-success-notification i {
                font-size: 2.4rem;
            }

            @keyframes slideDown {
                from {
                    transform: translateX(-50%) translateY(-10rem);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Check for updates
    checkForUpdates() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.update();
            });
        }
    }

    // Setup offline detection
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showOnlineStatus('You are back online!', 'success');
        });

        window.addEventListener('offline', () => {
            this.showOnlineStatus('You are offline. Some features may be limited.', 'warning');
        });
    }

    // Show online/offline status
    showOnlineStatus(message, type) {
        const notification = document.createElement('div');
        notification.className = `pwa-status-notification pwa-status-${type}`;
        notification.innerHTML = `
            <i class='bx ${type === 'success' ? 'bx-wifi' : 'bx-wifi-off'}'></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .pwa-status-notification {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%);
                padding: 1.5rem 3rem;
                border-radius: 5rem;
                font-size: 1.6rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10001;
                box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.3);
                animation: slideUp 0.5s ease;
            }

            .pwa-status-success {
                background: #28a745;
                color: white;
            }

            .pwa-status-warning {
                background: #ffc107;
                color: #333;
            }

            .pwa-status-notification i {
                font-size: 2.4rem;
            }

            @keyframes slideUp {
                from {
                    transform: translateX(-50%) translateY(10rem);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                console.log('Notification permission granted');
                return true;
            } else {
                console.log('Notification permission denied');
                return false;
            }
        }
        return false;
    }

    // Send notification
    sendNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    icon: '/src/images/icon-192x192.png',
                    badge: '/src/images/icon-72x72.png',
                    vibrate: [200, 100, 200],
                    ...options
                });
            });
        }
    }
}

// Initialize PWA Manager
const pwaManager = new PWAManager();

// Make it globally available
window.pwaManager = pwaManager;
