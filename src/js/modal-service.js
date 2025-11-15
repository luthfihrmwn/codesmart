/**
 * Modal Service untuk CodeSmart
 * Modern, responsive modal system with notification support
 */

class ModalService {
    constructor() {
        this.activeModals = new Map();
        this.notifications = [];
        this.buttonCallbacks = new Map();
        this.init();
    }

    init() {
        // Notification bell is now handled by notification-bell.js
        // this.createNotificationBell(); // DISABLED - using new notification-bell.js

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTopModal();
            }
        });
    }

    createNotificationBell() {
        // Will be added dynamically to header
        const bellHTML = `
            <div class="notification-bell" id="notificationBell" onclick="modalService.showNotifications()">
                <i class='bx bx-bell'></i>
                <span class="notification-badge" id="notificationBadge" style="display: none;">0</span>
            </div>
        `;
        return bellHTML;
    }

    /**
     * Create and show a modal
     */
    show(options = {}) {
        const {
            title = 'Modal',
            content = '',
            size = '', // sm, lg, xl
            showClose = true,
            showFooter = true,
            buttons = [],
            onClose = null,
            className = ''
        } = options;

        const modalId = 'modal-' + Date.now();

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = modalId;

        const sizeClass = size ? `modal-${size}` : '';

        modal.innerHTML = `
            <div class="modal-container ${sizeClass} ${className}">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    ${showClose ? `
                        <button class="modal-close" onclick="modalService.close('${modalId}')">
                            <i class='bx bx-x'></i>
                        </button>
                    ` : ''}
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${showFooter ? `
                    <div class="modal-footer">
                        ${this.renderButtons(buttons, modalId)}
                    </div>
                ` : ''}
            </div>
        `;

        document.body.appendChild(modal);

        // Trigger animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Store modal reference
        this.activeModals.set(modalId, {
            element: modal,
            onClose: onClose
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close(modalId);
            }
        });

        return modalId;
    }

    renderButtons(buttons, modalId) {
        if (buttons.length === 0) {
            return `<button class="btn-modal btn-secondary" onclick="modalService.close('${modalId}')">Close</button>`;
        }

        return buttons.map((btn, index) => {
            const btnClass = btn.className || 'btn-secondary';
            const btnText = btn.text || 'Button';
            const btnIcon = btn.icon ? `<i class='bx ${btn.icon}'></i>` : '';

            // Store callback and create unique ID
            const callbackId = `${modalId}-btn-${index}`;
            if (btn.onClick) {
                this.buttonCallbacks.set(callbackId, btn.onClick);
            }

            const onclick = btn.onClick ? `onclick="modalService.handleButtonClick('${callbackId}')"` : '';

            return `<button class="btn-modal ${btnClass}" ${onclick}>${btnIcon}${btnText}</button>`;
        }).join('');
    }

    handleButtonClick(callbackId) {
        const callback = this.buttonCallbacks.get(callbackId);
        if (callback && typeof callback === 'function') {
            callback();
            // Clean up callback after use
            this.buttonCallbacks.delete(callbackId);
        }
    }

    /**
     * Close modal
     */
    close(modalId) {
        const modalData = this.activeModals.get(modalId);
        if (!modalData) return;

        const modal = modalData.element;
        modal.classList.remove('active');

        setTimeout(() => {
            modal.remove();
            this.activeModals.delete(modalId);

            if (modalData.onClose) {
                modalData.onClose();
            }
        }, 300);
    }

    /**
     * Close top-most modal
     */
    closeTopModal() {
        const modals = Array.from(this.activeModals.keys());
        if (modals.length > 0) {
            this.close(modals[modals.length - 1]);
        }
    }

    /**
     * Close all modals
     */
    closeAll() {
        this.activeModals.forEach((_, modalId) => {
            this.close(modalId);
        });
    }

    /**
     * Show confirmation dialog
     */
    confirm(options = {}) {
        const {
            title = 'Confirm',
            message = 'Are you sure?',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            onConfirm = null,
            onCancel = null,
            danger = false,
            success = false
        } = options;

        let className = '';
        if (danger) className = 'danger-modal';
        else if (success) className = 'success-modal';

        const modalId = this.show({
            title: title,
            content: `<p style="font-size: 16px; color: #334155; line-height: 1.8;">${message}</p>`,
            size: 'sm',
            className: className,
            buttons: [
                {
                    text: cancelText,
                    className: 'btn-secondary',
                    onClick: () => {
                        this.close(modalId);
                        if (onCancel) onCancel();
                    }
                },
                {
                    text: confirmText,
                    className: danger ? 'btn-danger' : (success ? 'btn-success' : 'btn-primary'),
                    onClick: () => {
                        this.close(modalId);
                        if (onConfirm) onConfirm();
                    }
                }
            ]
        });

        return modalId;
    }

    /**
     * Show alert dialog
     */
    alert(options = {}) {
        const {
            title = 'Alert',
            message = '',
            type = 'info', // success, error, warning, info
            onClose = null
        } = options;

        const icons = {
            success: 'bx-check-circle',
            error: 'bx-error-circle',
            warning: 'bx-error',
            info: 'bx-info-circle'
        };

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        const modalId = this.show({
            title: `<i class='bx ${icons[type]}' style="color: ${colors[type]}"></i>${title}`,
            content: `<p style="font-size: 16px; color: #4b5563; line-height: 1.6;">${message}</p>`,
            size: 'sm',
            buttons: [
                {
                    text: 'OK',
                    className: 'btn-primary',
                    onClick: () => {
                        this.close(modalId);
                        if (onClose) onClose();
                    }
                }
            ]
        });

        return modalId;
    }

    /**
     * Show loading modal
     */
    loading(message = 'Loading...') {
        const modalId = this.show({
            title: '<i class=\'bx bx-loader-alt bx-spin\'></i>Please Wait',
            content: `
                <div style="text-align: center; padding: 20px;">
                    <div class="spinner" style="margin: 0 auto 16px;"></div>
                    <p style="color: #6b7280;">${message}</p>
                </div>
            `,
            showClose: false,
            showFooter: false
        });

        return modalId;
    }

    /**
     * Add notification
     */
    addNotification(notification) {
        const {
            title = 'Notification',
            message = '',
            type = 'info', // success, error, warning, info
            time = new Date(),
            read = false
        } = notification;

        this.notifications.unshift({
            id: Date.now(),
            title,
            message,
            type,
            time,
            read
        });

        // Update badge
        this.updateNotificationBadge();

        // Show toast
        if (window.notificationService) {
            const methods = {
                success: 'success',
                error: 'error',
                warning: 'warning',
                info: 'info'
            };
            notificationService[methods[type]](message);
        }
    }

    /**
     * Update notification badge
     */
    updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        if (!badge) return;

        const unreadCount = this.notifications.filter(n => !n.read).length;

        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }

    /**
     * Show notifications modal
     * DEPRECATED: This method is disabled. Use notification-bell.js instead.
     */
    showNotifications() {
        // Notification modal is now handled by notification-bell.js
        // This old modal system is deprecated to prevent conflicts
        console.warn('modalService.showNotifications() is deprecated. Notification bell is now handled by notification-bell.js');
        return;

        // Old code commented out below:
        /*
        const notificationsList = this.notifications.length > 0
            ? this.notifications.map(n => this.renderNotificationItem(n)).join('')
            : `
                <div class="notification-empty">
                    <i class='bx bx-bell-off'></i>
                    <p>No notifications yet</p>
                </div>
            `;

        const modalId = this.show({
            title: '<i class=\'bx bx-bell\'></i>Notifications',
            content: `
                <div class="notification-list" id="notificationList">
                    ${notificationsList}
                </div>
            `,
            className: 'notification-modal',
            buttons: this.notifications.length > 0 ? [
                {
                    text: 'Mark all as read',
                    className: 'btn-secondary',
                    icon: 'bx-check-double',
                    onClick: () => {
                        this.markAllAsRead();
                        this.updateNotificationBadge();
                        // Update modal content to show all as read
                        const notifList = document.getElementById('notificationList');
                        if (notifList) {
                            notifList.innerHTML = this.notifications.map(n => this.renderNotificationItem(n)).join('');
                        }
                        // Show success message
                        this.success({
                            message: 'All notifications marked as read',
                            duration: 2000
                        });
                    }
                },
                {
                    text: 'Clear all',
                    className: 'btn-outline',
                    icon: 'bx-trash',
                    onClick: () => {
                        // Show confirmation before clearing
                        this.confirm({
                            title: '<i class="bx bx-trash"></i> Clear All Notifications',
                            message: 'Are you sure you want to clear all notifications? This action cannot be undone.',
                            confirmText: 'Yes, Clear All',
                            cancelText: 'Cancel',
                            danger: true,
                            onConfirm: () => {
                                this.clearAllNotifications();
                                this.updateNotificationBadge();
                                this.close(modalId);
                                // Show success message
                                this.success({
                                    message: 'All notifications cleared',
                                    duration: 2000
                                });
                            }
                        });
                    }
                }
            ] : []
        });

        // Mark notifications as read when opening
        this.notifications.forEach(n => n.read = true);
        this.updateNotificationBadge();

        // Add click event listeners to notification items
        setTimeout(() => {
            const notifList = document.getElementById('notificationList');
            if (notifList) {
                notifList.addEventListener('click', (e) => {
                    const notifItem = e.target.closest('.notification-item');
                    if (notifItem && notifItem.dataset.notifId) {
                        e.preventDefault();
                        e.stopPropagation();
                        const notifId = parseInt(notifItem.dataset.notifId);
                        this.markAsRead(notifId);
                    }
                });
            }
        }, 100);
        */
    }

    renderNotificationItem(notification) {
        const timeAgo = this.getTimeAgo(notification.time);
        const readClass = notification.read ? '' : 'unread';
        const typeClass = notification.type;

        const icons = {
            success: 'bx-check-circle',
            error: 'bx-error-circle',
            warning: 'bx-error',
            info: 'bx-info-circle'
        };

        return `
            <div class="notification-item ${readClass} ${typeClass}" data-notif-id="${notification.id}">
                <div class="notification-icon">
                    <i class='bx ${icons[notification.type]}'></i>
                </div>
                <div class="notification-content">
                    <div class="notification-header">
                        <span class="notification-title">${notification.title}</span>
                        <span class="notification-time">${timeAgo}</span>
                    </div>
                    <p class="notification-message">${notification.message}</p>
                </div>
            </div>
        `;
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.updateNotificationBadge();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.updateNotificationBadge();
    }

    clearAllNotifications() {
        this.notifications = [];
        this.updateNotificationBadge();
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return interval + ' ' + unit + (interval > 1 ? 's' : '') + ' ago';
            }
        }

        return 'Just now';
    }

    /**
     * Create custom form modal
     */
    form(options = {}) {
        const {
            title = 'Form',
            fields = [],
            onSubmit = null,
            submitText = 'Submit',
            cancelText = 'Cancel'
        } = options;

        const formHTML = fields.map(field => this.renderFormField(field)).join('');

        const modalId = this.show({
            title,
            content: `<form id="modalForm-${modalId}" onsubmit="return false;">${formHTML}</form>`,
            buttons: [
                {
                    text: cancelText,
                    className: 'btn-secondary',
                    onClick: () => this.close(modalId)
                },
                {
                    text: submitText,
                    className: 'btn-primary',
                    icon: 'bx-check',
                    onClick: () => {
                        const formData = this.getFormData(modalId);
                        if (onSubmit) {
                            onSubmit(formData);
                        }
                        this.close(modalId);
                    }
                }
            ]
        });

        return modalId;
    }

    renderFormField(field) {
        const {
            name,
            label,
            type = 'text',
            placeholder = '',
            required = false,
            value = '',
            options = [],
            help = ''
        } = field;

        const requiredClass = required ? 'required' : '';
        const requiredAttr = required ? 'required' : '';

        let inputHTML = '';

        switch (type) {
            case 'textarea':
                inputHTML = `<textarea class="form-textarea" name="${name}" placeholder="${placeholder}" ${requiredAttr}>${value}</textarea>`;
                break;
            case 'select':
                const optionsHTML = options.map(opt =>
                    `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`
                ).join('');
                inputHTML = `<select class="form-select" name="${name}" ${requiredAttr}>${optionsHTML}</select>`;
                break;
            default:
                inputHTML = `<input type="${type}" class="form-input" name="${name}" placeholder="${placeholder}" value="${value}" ${requiredAttr}>`;
        }

        return `
            <div class="form-group">
                <label class="form-label ${requiredClass}">${label}</label>
                ${inputHTML}
                ${help ? `<div class="form-help">${help}</div>` : ''}
            </div>
        `;
    }

    getFormData(modalId) {
        const form = document.getElementById(`modalForm-${modalId}`);
        if (!form) return {};

        const formData = new FormData(form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }
}

// Create singleton instance
const modalService = new ModalService();

// Export for use in other files
window.modalService = modalService;
