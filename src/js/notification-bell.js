/**
 * Notification Bell System for Assessor Dashboard - Standalone Version
 * Handles notification bell panel, fetching, and interactions
 * Uses mock data - no apiService dependency
 */

class NotificationBell {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.panel = null;
        this.isOpen = false;
    }

    init() {
        console.log('NotificationBell: Initializing...');
        this.createPanel();
        this.attachEventListeners();
        this.loadNotifications();
        console.log('NotificationBell: Initialized');

        setInterval(() => {
            if (!this.isOpen) {
                this.loadNotifications();
            }
        }, 30000);
    }

    createPanel() {
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

    attachEventListeners() {
        const bellBtn = document.getElementById('notificationBellBtn');
        if (bellBtn) {
            bellBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePanel();
            });
        }

        document.addEventListener('click', (e) => {
            if (this.isOpen && this.panel && !this.panel.contains(e.target) && !e.target.closest('#notificationBellBtn')) {
                this.closePanel();
            }
        });
    }

    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        if (!this.panel) return;

        this.panel.style.display = 'block';
        this.isOpen = true;

        const bellBtn = document.getElementById('notificationBellBtn');
        if (bellBtn) {
            const rect = bellBtn.getBoundingClientRect();
            this.panel.style.top = (rect.bottom + 10) + 'px';
            this.panel.style.right = '20px';
        }

        this.loadNotifications();
    }

    closePanel() {
        if (!this.panel) return;
        this.panel.style.display = 'none';
        this.isOpen = false;
    }

    async loadNotifications() {
        this.loadMockNotifications();
    }

    loadMockNotifications() {
        console.log('NotificationBell: Loading mock notifications...');
        this.notifications = [
            {
                id: 1,
                type: 'submission',
                title: 'New Submission',
                message: 'A student submitted Assignment 3 - JavaScript Basics',
                is_read: false,
                created_at: new Date(Date.now() - 5 * 60000).toISOString(),
                link: 'submissions-sidebar.html'
            },
            {
                id: 2,
                type: 'assignment',
                title: 'Assignment Deadline',
                message: 'Assignment "Functions & Scope" is due in 2 days',
                is_read: false,
                created_at: new Date(Date.now() - 3600000).toISOString(),
                link: 'assignments-sidebar.html'
            },
            {
                id: 3,
                type: 'grade',
                title: 'Grading Complete',
                message: 'You have completed grading 15 submissions today',
                is_read: true,
                created_at: new Date(Date.now() - 7200000).toISOString(),
                link: null
            },
            {
                id: 4,
                type: 'comment',
                title: 'New Discussion Reply',
                message: 'Someone replied to your discussion post',
                is_read: false,
                created_at: new Date(Date.now() - 14400000).toISOString(),
                link: 'discussions-sidebar.html'
            },
            {
                id: 5,
                type: 'info',
                title: 'System Update',
                message: 'New grading features are now available',
                is_read: true,
                created_at: new Date(Date.now() - 172800000).toISOString(),
                link: null
            }
        ];
        console.log('NotificationBell: Loaded', this.notifications.length, 'mock notifications');
        this.updateBadge();
        this.renderNotifications();
    }

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

    handleNotificationClick(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        if (!notification.is_read) {
            notification.is_read = true;
            this.updateBadge();
            this.renderNotifications();
        }

        if (notification.link) {
            window.location.href = notification.link;
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.is_read = true);
        this.updateBadge();
        this.renderNotifications();
    }
}

const notificationBell = new NotificationBell();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        notificationBell.init();
    });
} else {
    notificationBell.init();
}

window.notificationBell = notificationBell;
