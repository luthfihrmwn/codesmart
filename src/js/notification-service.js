/**
 * Notification Service untuk CodeSmart
 * Modern toast notification system
 */

class NotificationService {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('notification-container');
        }
    }

    /**
     * Show notification
     * @param {string} message - Message to display
     * @param {string} type - Type: success, error, warning, info
     * @param {number} duration - Duration in milliseconds (default: 3000)
     */
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        // Icon based on type
        const icons = {
            success: 'bx-check-circle',
            error: 'bx-error-circle',
            warning: 'bx-error',
            info: 'bx-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-icon">
                <i class='bx ${icons[type]}'></i>
            </div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class='bx bx-x'></i>
            </button>
        `;

        this.container.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    /**
     * Remove notification with animation
     */
    remove(notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    /**
     * Show success notification
     */
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    /**
     * Show error notification
     */
    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    }

    /**
     * Show warning notification
     */
    warning(message, duration = 3500) {
        return this.show(message, 'warning', duration);
    }

    /**
     * Show info notification
     */
    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        const notifications = this.container.querySelectorAll('.notification');
        notifications.forEach(notification => {
            this.remove(notification);
        });
    }

    /**
     * Show loading notification
     */
    loading(message = 'Loading...') {
        const notification = document.createElement('div');
        notification.className = 'notification notification-loading';
        notification.innerHTML = `
            <div class="notification-icon">
                <div class="loader-small"></div>
            </div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
        `;

        this.container.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        return notification;
    }

    /**
     * Show confirmation dialog
     */
    confirm(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'notification-overlay';

        const dialog = document.createElement('div');
        dialog.className = 'notification-dialog';
        dialog.innerHTML = `
            <div class="notification-dialog-content">
                <div class="notification-dialog-icon">
                    <i class='bx bx-question-mark'></i>
                </div>
                <div class="notification-dialog-message">${message}</div>
                <div class="notification-dialog-buttons">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-confirm">Confirm</button>
                </div>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);

        // Handle confirm
        dialog.querySelector('.btn-confirm').onclick = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
            }, 300);
            if (onConfirm) onConfirm();
        };

        // Handle cancel
        dialog.querySelector('.btn-cancel').onclick = () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
            }, 300);
            if (onCancel) onCancel();
        };

        // Handle overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('show');
                setTimeout(() => {
                    overlay.remove();
                }, 300);
                if (onCancel) onCancel();
            }
        };
    }
}

// Create singleton instance
const notificationService = new NotificationService();

// Export for use in other files
window.notificationService = notificationService;

// Helper functions for backward compatibility
window.showSuccess = (message) => notificationService.success(message);
window.showError = (message) => notificationService.error(message);
window.showWarning = (message) => notificationService.warning(message);
window.showInfo = (message) => notificationService.info(message);
window.showLoading = (message) => notificationService.loading(message);
