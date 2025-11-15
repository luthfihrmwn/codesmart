/**
 * Notification Bell System for Assessor Dashboard
 * Handles notification bell panel, fetching, and interactions
 */

class NotificationBell {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.panel = null;
        this.isOpen = false;
    }

    /**
     * Initialize notification bell
     */
    init() {
        console.log('NotificationBell: Initializing...');
        this.createPanel();
        this.attachEventListeners();
        this.loadNotifications();
        console.log('NotificationBell: Initialized with', this.notifications.length, 'notifications');

        // Auto refresh every 30 seconds
        setInterval(() => {
            if (!this.isOpen) {
                this.loadNotifications();
            }
        }, 30000);
    }

    /**
     * Create notification panel HTML
     */
    createPanel() {
        // Check if panel already exists
        if (document.getElementById('notificationPanel')) {
            this.panel = document.getElementById('notificationPanel');
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'notificationPanel';
        panel.className = 'notification-panel';
        panel.style.display = 'none';

        panel.innerHTML = `
            <div class="notification-panel-header">
                <h3><i class='bx bx-bell'></i> Notifications</h3>
                <button class="mark-all-read-btn" onclick="notificationBell.markAllAsRead()">
                    <i class='bx bx-check-double'></i> Mark all as read
                </button>
            </div>
            <div class="notification-panel-body" id="notificationPanelBody">
                <div class="notification-loading">
                    <i class='bx bx-loader-alt bx-spin'></i>
                    <p>Loading notifications...</p>
                </div>
            </div>
            <div class="notification-panel-footer">
                <a href="#" onclick="notificationBell.togglePanel(); return false;">Close</a>
            </div>
        `;

        document.body.appendChild(panel);
        this.panel = panel;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const bellBtn = document.getElementById('notificationBellBtn');
        if (bellBtn) {
            bellBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePanel();
            });
        }

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && this.panel && !this.panel.contains(e.target) && !e.target.closest('#notificationBellBtn')) {
                this.closePanel();
            }
        });
    }

    /**
     * Toggle notification panel
     */
    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    /**
     * Open notification panel
     */
    openPanel() {
        if (!this.panel) return;

        this.panel.style.display = 'block';
        this.isOpen = true;

        // Position panel below bell icon
        const bellBtn = document.getElementById('notificationBellBtn');
        if (bellBtn) {
            const rect = bellBtn.getBoundingClientRect();
            this.panel.style.top = (rect.bottom + 10) + 'px';
            this.panel.style.right = '20px';
        }

        // Refresh notifications when opening
        this.loadNotifications();
    }

    /**
     * Close notification panel
     */
    closePanel() {
        if (!this.panel) return;
        this.panel.style.display = 'none';
        this.isOpen = false;
    }

    /**
     * Load notifications from API
     */
    async loadNotifications() {
        // For now, use mock data until backend notification API is ready
        // TODO: Uncomment when backend /api/v1/notifications endpoint is ready
        /*
        try {
            const response = await apiService.getNotifications();

            if (response.success) {
                this.notifications = response.data.notifications || response.data || [];
                this.updateBadge();
                this.renderNotifications();
                return;
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
        */

        // Load mock data for demo
        this.loadMockNotifications();
    }

    /**
     * Load mock notifications for demo
     */
    loadMockNotifications() {
        console.log('NotificationBell: Loading mock notifications...');
        this.notifications = [
            {
                id: 1,
                type: 'submission',
                title: 'New Submission',
                message: 'A student submitted Assignment 3 - JavaScript Basics',
                is_read: false,
                created_at: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
                link: 'submissions-sidebar.html'
            },
            {
                id: 2,
                type: 'assignment',
                title: 'Assignment Deadline',
                message: 'Assignment "Functions & Scope" is due in 2 days',
                is_read: false,
                created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                link: 'assignments-sidebar.html'
            },
            {
                id: 3,
                type: 'grade',
                title: 'Grading Complete',
                message: 'You have completed grading 15 submissions today',
                is_read: true,
                created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                link: null
            },
            {
                id: 4,
                type: 'comment',
                title: 'Student Comment',
                message: 'A student asked a question on their submission',
                is_read: true,
                created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                link: 'submissions-sidebar.html'
            },
            {
                id: 5,
                type: 'info',
                title: 'System Update',
                message: 'New grading features are now available',
                is_read: true,
                created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                link: null
            }
        ];
        console.log('NotificationBell: Loaded', this.notifications.length, 'mock notifications');
        this.updateBadge();
        this.renderNotifications();
    }

    /**
     * Update notification badge
     */
    updateBadge() {
        const badge = document.getElementById('notificationBadge');
        if (!badge) {
            console.warn('NotificationBell: Badge element not found');
            return;
        }

        this.unreadCount = this.notifications.filter(n => !n.is_read).length;

        if (this.unreadCount > 0) {
            badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
            badge.style.display = 'flex';
            console.log('NotificationBell: Badge updated -', this.unreadCount, 'unread');
        } else {
            badge.style.display = 'none';
            console.log('NotificationBell: No unread notifications');
        }
    }

    /**
     * Render notifications in panel
     */
    renderNotifications() {
        const body = document.getElementById('notificationPanelBody');
        if (!body) {
            console.warn('NotificationBell: Panel body not found, retrying...');
            setTimeout(() => this.renderNotifications(), 100);
            return;
        }

        if (this.notifications.length === 0) {
            this.showEmptyState('No notifications yet');
            return;
        }

        console.log('NotificationBell: Rendering', this.notifications.length, 'notifications');

        body.innerHTML = this.notifications.map(notification => {
            const isUnread = !notification.is_read;
            const timeAgo = this.formatTimeAgo(notification.created_at);
            const icon = this.getNotificationIcon(notification.type);

            return `
                <div class="notification-item ${isUnread ? 'unread' : ''}"
                     data-id="${notification.id}"
                     onclick="notificationBell.handleNotificationClick(${notification.id})">
                    <div class="notification-item-icon ${notification.type}">
                        <i class='bx ${icon}'></i>
                    </div>
                    <div class="notification-item-content">
                        <div class="notification-item-title">${notification.title}</div>
                        <div class="notification-item-message">${notification.message}</div>
                        <div class="notification-item-time">
                            <i class='bx bx-time-five'></i> ${timeAgo}
                        </div>
                    </div>
                    ${isUnread ? '<div class="notification-unread-dot"></div>' : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Show empty state
     */
    showEmptyState(message) {
        const body = document.getElementById('notificationPanelBody');
        if (!body) return;

        body.innerHTML = `
            <div class="notification-empty">
                <i class='bx bx-bell-off'></i>
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Get icon based on notification type
     */
    getNotificationIcon(type) {
        const icons = {
            'submission': 'bx-file',
            'assignment': 'bx-task',
            'grade': 'bx-check-circle',
            'comment': 'bx-comment',
            'system': 'bx-info-circle',
            'warning': 'bx-error',
            'success': 'bx-check',
            'info': 'bx-info-circle'
        };
        return icons[type] || 'bx-bell';
    }

    /**
     * Format time ago
     */
    formatTimeAgo(dateString) {
        if (!dateString) return 'Just now';

        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

        return date.toLocaleDateString();
    }

    /**
     * Handle notification click
     */
    async handleNotificationClick(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        // Mark as read
        if (!notification.is_read) {
            await this.markAsRead(notificationId);
        }

        // Handle navigation based on type
        if (notification.link) {
            window.location.href = notification.link;
        }
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId) {
        // For demo: just update local state
        // TODO: Uncomment when backend API is ready
        /*
        try {
            const response = await apiService.markNotificationAsRead(notificationId);
            if (response.success) {
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.is_read = true;
                }
                this.updateBadge();
                this.renderNotifications();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
        */

        // Update local state for demo
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.is_read = true;
        }
        this.updateBadge();
        this.renderNotifications();
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead() {
        // For demo: just update local state
        // TODO: Uncomment when backend API is ready
        /*
        try {
            const response = await apiService.markAllNotificationsAsRead();
            if (response.success) {
                this.notifications.forEach(n => n.is_read = true);
                this.updateBadge();
                this.renderNotifications();
                notificationService.success('All notifications marked as read');
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
            notificationService.error('Failed to mark all as read');
        }
        */

        // Update local state for demo
        this.notifications.forEach(n => n.is_read = true);
        this.updateBadge();
        this.renderNotifications();
        notificationService.success('All notifications marked as read');
    }
}

// Create singleton instance
const notificationBell = new NotificationBell();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        notificationBell.init();
    });
} else {
    notificationBell.init();
}

// Export for global use
window.notificationBell = notificationBell;
