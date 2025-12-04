/**
 * Assessor Data Loader
 * Loads real data from database for all assessor pages
 */

class AssessorDataLoader {
    constructor() {
        this.apiService = window.apiService;
        this.authService = window.authService;
    }

    /**
     * Check if user is logged in and is an assessor
     */
    checkAuth() {
        if (!this.authService || !this.authService.isLoggedIn()) {
            window.location.href = '/src/pages/auth/login.html';
            return false;
        }

        const user = this.authService.getCurrentUser();
        if (user && user.role !== 'assessor') {
            console.warn('User is not an assessor');
            return false;
        }

        return true;
    }

    /**
     * Load Dashboard Stats
     */
    async loadDashboardStats() {
        try {
            const response = await this.apiService.request('/assessor/statistics', 'GET');

            if (response.success) {
                this.updateDashboardStats(response.data);
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    /**
     * Update Dashboard Stats in DOM
     */
    updateDashboardStats(data) {
        // Update pending submissions from API response
        const pendingSubmissionsEl = document.getElementById('pendingSubmissions');
        if (pendingSubmissionsEl) {
            pendingSubmissionsEl.textContent = data.pending?.total_pending || 0;
        }

        // Update graded this week from API response
        const gradedThisWeekEl = document.getElementById('gradedThisWeek');
        if (gradedThisWeekEl) {
            gradedThisWeekEl.textContent = data.grading?.graded_last_week || 0;
        }

        // Note: totalStudents and classesAssigned are loaded separately in dashboard-sidebar.html
    }

    /**
     * Load Recent Submissions
     */
    async loadRecentSubmissions() {
        try {
            const response = await this.apiService.request('/assessor/submissions/pending', 'GET');

            if (response.success) {
                this.renderRecentSubmissions(response.data.submissions || response.data || []);
            }
        } catch (error) {
            console.error('Error loading recent submissions:', error);
            this.showEmptyState('submissionsTable', 'No pending submissions');
        }
    }

    /**
     * Render Recent Submissions Table
     */
    renderRecentSubmissions(submissions) {
        const tbody = document.querySelector('#submissionsTable tbody');
        if (!tbody) return;

        if (submissions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No pending submissions</td></tr>';
            return;
        }

        tbody.innerHTML = submissions.map(submission => {
            return `
            <tr>
                <td>${this.escapeHtml(submission.student_name || 'Unknown')}</td>
                <td>${this.escapeHtml(submission.assignment_title || 'N/A')}</td>
                <td>${this.escapeHtml(submission.module_name || 'N/A')}</td>
                <td>${this.formatDate(submission.submitted_at)}</td>
                <td>
                    <span class="badge badge-${this.getStatusBadgeClass(submission.status)}">
                        ${this.escapeHtml(submission.status)}
                    </span>
                </td>
            </tr>
        `;
        }).join('');
    }

    /**
     * Load Assignments
     */
    async loadAssignments() {
        try {
            const response = await this.apiService.request('/assessor/assignments', 'GET');

            if (response.success) {
                this.renderAssignments(response.data.assignments || response.data || []);
            }
        } catch (error) {
            console.error('Error loading assignments:', error);
            this.showEmptyState('assignmentsContainer', 'Failed to load assignments');
        }
    }

    /**
     * Render Assignments
     */
    renderAssignments(assignments) {
        const container = document.getElementById('assignmentsContainer');
        if (!container) return;

        if (assignments.length === 0) {
            container.innerHTML = this.getEmptyStateHTML('No assignments found');
            return;
        }

        container.innerHTML = assignments.map(assignment => {
            return `
            <div class="assignment-card fade-in">
                <div class="assignment-header">
                    <h3>${this.escapeHtml(assignment.title)}</h3>
                    <span class="badge badge-${assignment.type === 'quiz' ? 'info' : 'primary'}">
                        ${this.escapeHtml(assignment.type || 'assignment')}
                    </span>
                </div>
                <p class="assignment-description">${this.escapeHtml(assignment.description || 'No description')}</p>
                <div class="assignment-meta">
                    <div class="meta-item">
                        <i class='bx bx-calendar'></i>
                        <span>Due: ${this.formatDate(assignment.due_date)}</span>
                    </div>
                    <div class="meta-item">
                        <i class='bx bx-user'></i>
                        <span>${assignment.submissions_count || 0} submissions</span>
                    </div>
                </div>
                <div class="assignment-actions">
                    <button class="btn-modern btn-modern-primary" onclick="viewAssignment(${assignment.id})">
                        <i class='bx bx-show'></i> View
                    </button>
                    <button class="btn-modern btn-modern-secondary" onclick="editAssignment(${assignment.id})">
                        <i class='bx bx-edit'></i> Edit
                    </button>
                </div>
            </div>
        `;
        }).join('');
    }

    /**
     * Load Students
     */
    async loadStudents() {
        try {
            const response = await this.apiService.request('/assessor/students', 'GET');

            if (response.success) {
                this.renderStudents(response.data.students || response.data || []);
            }
        } catch (error) {
            console.error('Error loading students:', error);
            this.showEmptyState('studentsTable', 'Failed to load students');
        }
    }

    /**
     * Render Students Table
     */
    renderStudents(students) {
        const tbody = document.querySelector('#studentsTable tbody');
        if (!tbody) return;

        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No students found</td></tr>';
            return;
        }

        tbody.innerHTML = students.map(student => {
            return `
            <tr>
                <td>${this.escapeHtml(student.name || 'N/A')}</td>
                <td>${this.escapeHtml(student.email || 'N/A')}</td>
                <td>${this.escapeHtml(student.current_level || 'Not assessed')}</td>
                <td>${student.pretest_score !== null ? student.pretest_score : 'N/A'}</td>
                <td>
                    <span class="badge badge-${student.status === 'active' ? 'success' : 'warning'}">
                        ${this.escapeHtml(student.status || 'unknown')}
                    </span>
                </td>
                <td>
                    <button class="btn-modern btn-modern-primary btn-sm" onclick="viewStudent(${student.id})">
                        <i class='bx bx-show'></i>
                    </button>
                </td>
            </tr>
        `;
        }).join('');
    }

    /**
     * Load Discussions
     */
    async loadDiscussions() {
        try {
            const response = await this.apiService.request('/discussions', 'GET');

            if (response.success) {
                this.renderDiscussions(response.data || []);
            }
        } catch (error) {
            console.error('Error loading discussions:', error);
            this.showEmptyState('discussionsContainer', 'Failed to load discussions');
        }
    }

    /**
     * Render Discussions
     */
    renderDiscussions(discussions) {
        const container = document.getElementById('discussionsContainer');
        if (!container) return;

        if (discussions.length === 0) {
            container.innerHTML = this.getEmptyStateHTML('No discussions yet');
            return;
        }

        container.innerHTML = discussions.map(discussion => {
            const avatarHTML = discussion.author_photo ?
                `<img src="${discussion.author_photo}" alt="${discussion.author_name}">` :
                `<div class="avatar-placeholder">${this.getInitials(discussion.author_name)}</div>`;

            return `
            <div class="discussion-item fade-in" onclick="viewDiscussion(${discussion.id})">
                <div class="discussion-avatar">
                    ${avatarHTML}
                </div>
                <div class="discussion-content">
                    <h3>${this.escapeHtml(discussion.title)}</h3>
                    <p>${this.escapeHtml(discussion.content.substring(0, 150))}...</p>
                    <div class="discussion-meta">
                        <span><i class='bx bx-user'></i> ${this.escapeHtml(discussion.author_name)}</span>
                        <span><i class='bx bx-time'></i> ${this.formatRelativeTime(discussion.created_at)}</span>
                        <span><i class='bx bx-message'></i> ${discussion.replies_count || 0} replies</span>
                    </div>
                </div>
            </div>
        `;
        }).join('');
    }

    /**
     * Load Announcements
     */
    async loadAnnouncements() {
        try {
            const response = await this.apiService.request('/announcements', 'GET');

            if (response.success) {
                this.renderAnnouncements(response.data || []);
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
            this.showEmptyState('announcementsContainer', 'Failed to load announcements');
        }
    }

    /**
     * Render Announcements
     */
    renderAnnouncements(announcements) {
        const container = document.getElementById('announcementsContainer');
        if (!container) return;

        if (announcements.length === 0) {
            container.innerHTML = this.getEmptyStateHTML('No announcements yet');
            return;
        }

        container.innerHTML = announcements.map(announcement => {
            return `
            <div class="announcement-card fade-in">
                <div class="announcement-header">
                    <h3>${this.escapeHtml(announcement.title)}</h3>
                    <span class="announcement-date">${this.formatDate(announcement.created_at)}</span>
                </div>
                <p class="announcement-content">${this.escapeHtml(announcement.content)}</p>
                <div class="announcement-footer">
                    <span class="announcement-author">
                        <i class='bx bx-user-circle'></i> ${this.escapeHtml(announcement.author_name)}
                    </span>
                </div>
            </div>
        `;
        }).join('');
    }

    /**
     * Utility: Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Utility: Format Date
     */
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Utility: Format Relative Time
     */
    formatRelativeTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return this.formatDate(dateString);
    }

    /**
     * Utility: Get Status Badge Class
     */
    getStatusBadgeClass(status) {
        const statusMap = {
            'pending': 'warning',
            'graded': 'success',
            'late': 'danger',
            'active': 'success',
            'inactive': 'secondary'
        };
        return statusMap[status] || 'secondary';
    }

    /**
     * Utility: Get Initials
     */
    getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    /**
     * Utility: Show Empty State
     */
    showEmptyState(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.getEmptyStateHTML(message);
        }
    }

    /**
     * Utility: Get Empty State HTML
     */
    getEmptyStateHTML(message) {
        return `
            <div class="empty-state">
                <i class='bx bx-inbox'></i>
                <h3>No Data</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.assessorDataLoader = new AssessorDataLoader();
    });
} else {
    window.assessorDataLoader = new AssessorDataLoader();
}
