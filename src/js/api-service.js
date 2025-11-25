/**
 * API Service Layer untuk CodeSmart
 * Handles all communication with backend API
 */

// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api/v1', // Main backend
    ML_URL: 'http://localhost:5000/api/v1',   // ML service for SVM predictions
    TIMEOUT: 30000, // 30 seconds
};

/**
 * API Service Class
 */
class APIService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    /**
     * Get stored JWT token
     */
    getToken() {
        return localStorage.getItem('codesmart_token');
    }

    /**
     * Get stored refresh token
     */
    getRefreshToken() {
        return localStorage.getItem('codesmart_refresh_token');
    }

    /**
     * Set tokens
     */
    setTokens(token, refreshToken) {
        localStorage.setItem('codesmart_token', token);
        if (refreshToken) {
            localStorage.setItem('codesmart_refresh_token', refreshToken);
        }
    }

    /**
     * Clear tokens
     */
    clearTokens() {
        localStorage.removeItem('codesmart_token');
        localStorage.removeItem('codesmart_refresh_token');
    }

    /**
     * Generic request method with timeout
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        // Setup headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        // Add authorization token if available
        const token = this.getToken();
        if (token && !options.skipAuth) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Setup request options
        const requestOptions = {
            ...options,
            headers,
        };

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...requestOptions,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Parse response
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            // Handle token expiration
            if (data.expired && this.getRefreshToken()) {
                // Try to refresh token
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    // Retry original request
                    return this.request(endpoint, options);
                } else {
                    // Refresh failed, logout user
                    this.clearTokens();
                    window.location.href = '/src/pages/auth/login.html';
                    throw new Error('Session expired. Please login again.');
                }
            }

            // Handle HTTP errors
            if (!response.ok) {
                throw new Error(data.message || `HTTP Error: ${response.status}`);
            }

            return data;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Request timeout. Please try again.');
            }

            throw error;
        }
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken() {
        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) return false;

            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await response.json();

            if (data.success && data.data.token) {
                this.setTokens(data.data.token, refreshToken);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    /**
     * GET request
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'GET',
            ...options,
        });
    }

    /**
     * POST request
     */
    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options,
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'DELETE',
            ...options,
        });
    }

    /**
     * Upload file
     */
    async upload(endpoint, formData, options = {}) {
        const token = this.getToken();
        const headers = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Don't set Content-Type, let browser set it with boundary
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: options.method || 'POST',
            headers,
            body: formData,
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }

        return data;
    }

    // ==========================================
    // AUTHENTICATION ENDPOINTS
    // ==========================================

    async register(userData) {
        return this.post('/auth/register', userData, { skipAuth: true });
    }

    async login(username, password) {
        const data = await this.post('/auth/login', { username, password }, { skipAuth: true });

        if (data.success) {
            this.setTokens(data.data.token, data.data.refreshToken);
            localStorage.setItem('codesmart_session', JSON.stringify(data.data.user));
        }

        return data;
    }

    async logout() {
        const refreshToken = this.getRefreshToken();
        await this.post('/auth/logout', { refreshToken });
        this.clearTokens();
        localStorage.removeItem('codesmart_session');
    }

    async getMe() {
        return this.get('/auth/me');
    }

    async updateProfile(data) {
        return this.put('/users/profile', data);
    }

    async uploadProfilePhoto(formData) {
        const token = this.getToken();
        const response = await fetch(`${this.baseURL}/users/profile/photo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        return await response.json();
    }

    async updatePassword(data) {
        return this.put('/users/profile/password', data);
    }

    async forgotPassword(email) {
        return this.post('/auth/forgot-password', { email }, { skipAuth: true });
    }

    async verifySecurityAnswer(email, answer) {
        return this.post('/auth/verify-security-answer', { email, answer }, { skipAuth: true });
    }

    async resetPassword(email, newPassword, resetToken) {
        return this.post('/auth/reset-password', { email, newPassword, resetToken }, { skipAuth: true });
    }

    // ==========================================
    // USER ENDPOINTS
    // ==========================================

    async getUserProfile() {
        return this.get('/users/profile');
    }

    async submitPretest(answers) {
        return this.post('/users/pretest/submit', { answers });
    }

    async getPretestResult() {
        return this.get('/users/pretest/result');
    }

    async getUserEnrollments() {
        return this.get('/users/enrollments');
    }

    async enrollInModule(moduleId) {
        return this.post('/users/enrollments', { moduleId });
    }

    async getUserProgress() {
        return this.get('/users/progress');
    }

    async markClassComplete(classId) {
        return this.post(`/users/progress/class/${classId}`);
    }

    async requestPromotion(moduleId) {
        return this.post('/users/promotion/request', { moduleId });
    }

    // ==========================================
    // MODULE ENDPOINTS
    // ==========================================

    async getModules() {
        return this.get('/modules');
    }

    async getModuleBySlug(slug) {
        return this.get(`/modules/${slug}`);
    }

    async getModuleMaterials(slug) {
        return this.get(`/modules/${slug}/materials`);
    }

    async getClassMaterial(slug, classNumber) {
        return this.get(`/modules/${slug}/materials/${classNumber}`);
    }

    // ==========================================
    // ASSIGNMENT ENDPOINTS
    // ==========================================

    async getModuleAssignments(moduleSlug) {
        return this.get(`/assignments/module/${moduleSlug}`);
    }

    async getAllAssignments() {
        return this.get('/assignments');
    }

    async getAssignment(id) {
        return this.get(`/assignments/${id}`);
    }

    async getMyAssignments() {
        return this.get('/assignments/user/my-assignments');
    }

    // ==========================================
    // SUBMISSION ENDPOINTS
    // ==========================================

    async submitAssignment(formData) {
        return this.upload('/submissions', formData);
    }

    async getMySubmissions() {
        return this.get('/submissions/my-submissions');
    }

    async getSubmission(id) {
        return this.get(`/submissions/${id}`);
    }

    async resubmitAssignment(id, formData) {
        return this.upload(`/submissions/${id}`, formData);
    }

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================

    async getAllUsers() {
        return this.get('/admin/users');
    }

    async getUserById(id) {
        return this.get(`/admin/users/${id}`);
    }

    async createUser(userData) {
        return this.post('/admin/users', userData);
    }

    async updateUser(id, userData) {
        return this.put(`/admin/users/${id}`, userData);
    }

    async deleteUser(id) {
        return this.delete(`/admin/users/${id}`);
    }

    async getPendingApprovals() {
        return this.get('/admin/users/pending/approvals');
    }

    async approveUser(id) {
        return this.post(`/admin/users/${id}/approve`);
    }

    async rejectUser(id) {
        return this.post(`/admin/users/${id}/reject`);
    }

    async getAllModules() {
        return this.get('/admin/modules');
    }

    async createModule(moduleData) {
        return this.post('/admin/modules', moduleData);
    }

    async updateModule(id, moduleData) {
        return this.put(`/admin/modules/${id}`, moduleData);
    }

    async deleteModule(id) {
        return this.delete(`/admin/modules/${id}`);
    }

    // Learning Materials (Classes) Management
    async createLearningMaterial(materialData) {
        return this.post('/admin/materials', materialData);
    }

    async updateLearningMaterial(id, materialData) {
        return this.put(`/admin/materials/${id}`, materialData);
    }

    async deleteLearningMaterial(id) {
        return this.delete(`/admin/materials/${id}`);
    }

    // Alias methods for Classes (same as Learning Materials)
    async createClass(moduleSlug, classData) {
        return this.createLearningMaterial({ ...classData, module_slug: moduleSlug });
    }

    async updateClass(moduleSlug, classId, classData) {
        return this.updateLearningMaterial(classId, classData);
    }

    async deleteClass(moduleSlug, classId) {
        return this.deleteLearningMaterial(classId);
    }

    async getModuleClasses(moduleSlug) {
        return this.get(`/modules/${moduleSlug}/materials`);
    }

    // Assignment Management
    async createAssignment(moduleSlugOrData, assignmentData) {
        // Support both patterns:
        // createAssignment(assignmentData) - old pattern
        // createAssignment(moduleSlug, assignmentData) - new pattern
        // createAssignment(formData) - with file upload
        if (moduleSlugOrData instanceof FormData) {
            // FormData upload pattern
            return this.upload('/assignments', moduleSlugOrData);
        } else if (typeof moduleSlugOrData === 'string') {
            // Get module ID from slug
            const module = await this.getModuleBySlug(moduleSlugOrData);
            if (!module.success) {
                return module;
            }
            assignmentData.module_id = module.data.id;

            // Check if assignmentData has file
            if (assignmentData instanceof FormData) {
                return this.upload('/assignments', assignmentData);
            }
            return this.post('/assignments', assignmentData);
        } else {
            // Old pattern - data is in first parameter
            if (moduleSlugOrData instanceof FormData) {
                return this.upload('/assignments', moduleSlugOrData);
            }
            return this.post('/assignments', moduleSlugOrData);
        }
    }

    async updateAssignment(moduleSlugOrId, idOrData, assignmentData) {
        // Support both patterns:
        // updateAssignment(id, assignmentData) - old pattern
        // updateAssignment(moduleSlug, id, assignmentData) - new pattern
        // updateAssignment(id, formData) - with file upload
        if (assignmentData) {
            // New pattern with 3 parameters
            if (assignmentData instanceof FormData) {
                return this.upload(`/assignments/${idOrData}`, assignmentData, { method: 'PUT' });
            }
            return this.put(`/assignments/${idOrData}`, assignmentData);
        } else {
            // Old pattern with 2 parameters
            if (idOrData instanceof FormData) {
                return this.upload(`/assignments/${moduleSlugOrId}`, idOrData, { method: 'PUT' });
            }
            return this.put(`/assignments/${moduleSlugOrId}`, idOrData);
        }
    }

    async deleteAssignment(moduleSlugOrId, id) {
        // Support both patterns
        if (id) {
            // New pattern: deleteAssignment(moduleSlug, id)
            return this.delete(`/assignments/${id}`);
        } else {
            // Old pattern: deleteAssignment(id)
            return this.delete(`/assignments/${moduleSlugOrId}`);
        }
    }

    async getAdminStatistics() {
        return this.get('/admin/statistics');
    }

    async getAssignmentSubmissions(assignmentId) {
        return this.get(`/admin/assignments/${assignmentId}/submissions`);
    }

    async exportUsers() {
        return this.get('/admin/export/users');
    }

    async exportSubmissions() {
        return this.get('/admin/export/submissions');
    }

    // ==========================================
    // ASSESSOR ENDPOINTS
    // ==========================================

    async getPendingSubmissions() {
        return this.get('/assessor/submissions/pending');
    }

    async getGradedSubmissions() {
        return this.get('/assessor/submissions/graded');
    }

    async getSubmissionDetails(id) {
        return this.get(`/assessor/submissions/${id}`);
    }

    async gradeSubmission(id, gradeData) {
        return this.post(`/assessor/submissions/${id}/grade`, gradeData);
    }

    async updateGrade(id, gradeData) {
        return this.put(`/assessor/submissions/${id}/grade`, gradeData);
    }

    async getStudents() {
        return this.get('/assessor/students');
    }

    async getStudentProgress(id) {
        return this.get(`/assessor/students/${id}/progress`);
    }

    async getPendingPromotions() {
        return this.get('/assessor/promotions/pending');
    }

    async approvePromotion(id) {
        return this.post(`/assessor/promotions/${id}/approve`);
    }

    async rejectPromotion(id) {
        return this.post(`/assessor/promotions/${id}/reject`);
    }

    async getAssessorStatistics() {
        return this.get('/assessor/statistics');
    }

    async getAssessorAssignments() {
        return this.get('/assessor/assignments');
    }

    async getAssessorMaterials() {
        return this.get('/assessor/materials');
    }

    async getAssessorMaterial(id) {
        return this.get(`/assessor/materials/${id}`);
    }

    async createAssessorMaterial(materialData) {
        return this.post('/assessor/materials', materialData);
    }

    async updateAssessorMaterial(id, materialData) {
        return this.put(`/assessor/materials/${id}`, materialData);
    }

    async deleteAssessorMaterial(id) {
        return this.delete(`/assessor/materials/${id}`);
    }

    // ===== Notifications API =====
    async getNotifications() {
        return this.get('/notifications');
    }

    async getUnreadNotifications() {
        return this.get('/notifications/unread');
    }

    async markNotificationAsRead(notificationId) {
        return this.put(`/notifications/${notificationId}/read`);
    }

    async markAllNotificationsAsRead() {
        return this.put('/notifications/mark-all-read');
    }

    async deleteNotification(notificationId) {
        return this.delete(`/notifications/${notificationId}`);
    }

    // ===== Discussions API =====
    async getDiscussions(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/discussions${queryString ? '?' + queryString : ''}`);
    }

    async getDiscussion(id) {
        return this.get(`/discussions/${id}`);
    }

    async createDiscussion(discussionData) {
        return this.post('/discussions', discussionData);
    }

    async createDiscussionReply(discussionId, replyData) {
        return this.post(`/discussions/${discussionId}/replies`, replyData);
    }

    async toggleDiscussionPin(id) {
        return this.put(`/discussions/${id}/pin`);
    }

    async toggleDiscussionLock(id) {
        return this.put(`/discussions/${id}/lock`);
    }

    async markReplyAsSolution(replyId) {
        return this.put(`/discussions/replies/${replyId}/solution`);
    }

    async deleteDiscussion(id) {
        return this.delete(`/discussions/${id}`);
    }

    // ===== Announcements API =====
    async getAnnouncements(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/announcements${queryString ? '?' + queryString : ''}`);
    }

    async getAnnouncement(id) {
        return this.get(`/announcements/${id}`);
    }

    async createAnnouncement(announcementData) {
        return this.post('/announcements', announcementData);
    }

    async updateAnnouncement(id, announcementData) {
        return this.put(`/announcements/${id}`, announcementData);
    }

    async deleteAnnouncement(id) {
        return this.delete(`/announcements/${id}`);
    }

    // ===== Analytics API =====
    async getDashboardAnalytics(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/analytics/dashboard${queryString ? '?' + queryString : ''}`);
    }

    async getStudentPerformance(studentId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/analytics/student-performance/${studentId}${queryString ? '?' + queryString : ''}`);
    }

    async getModuleCompletionRates() {
        return this.get('/analytics/module-completion');
    }

    async getGradeDistribution(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/analytics/grade-distribution${queryString ? '?' + queryString : ''}`);
    }

    async getEngagementMetrics(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/analytics/engagement${queryString ? '?' + queryString : ''}`);
    }

    async getAtRiskStudents() {
        return this.get('/analytics/at-risk-students');
    }

    // ===== Exports API =====
    async exportGrades(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/exports/grades${queryString ? '?' + queryString : ''}`);
    }

    async exportStudentProgress(studentId) {
        return this.get(`/exports/student-progress/${studentId}`);
    }

    async exportClassSummary(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/exports/class-summary${queryString ? '?' + queryString : ''}`);
    }

    /**
     * Generic authenticated fetch method
     * Used by SVM analytics and other pages
     * @param {string} endpoint - API endpoint (e.g., '/ml/stats')
     * @param {object} options - Fetch options (method, body, etc.)
     */
    async fetchWithAuth(endpoint, options = {}) {
        return this.request(endpoint, options);
    }

    // ==========================================
    // ML SERVICE ENDPOINTS (SVM Predictions)
    // ==========================================

    /**
     * ML request method - uses ML_URL instead of BASE_URL
     */
    async mlRequest(endpoint, options = {}) {
        const url = `${API_CONFIG.ML_URL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const token = this.getToken();
        if (token && !options.skipAuth) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const requestOptions = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP Error: ${response.status}`);
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    async getSVMPredictions() {
        return this.mlRequest('/ml/predictions');
    }

    async getSVMStats() {
        return this.mlRequest('/ml/stats');
    }

    async getSVMPrediction(studentId) {
        return this.mlRequest(`/ml/predict/${studentId}`);
    }

    async trainSVMModel() {
        return this.mlRequest('/ml/train', { method: 'POST' });
    }

    async getSVMModelInfo() {
        return this.mlRequest('/ml/info');
    }

    // ==========================================
    // ADMIN SUBMISSION MANAGEMENT
    // ==========================================

    async getAdminSubmissions(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get('/admin/submissions' + (queryString ? '?' + queryString : ''));
    }

    async adminOverrideGrade(submissionId, gradeData) {
        return this.put('/admin/submissions/' + submissionId + '/grade', gradeData);
    }

    // ==========================================
    // ADMIN MATERIALS MANAGEMENT
    // ==========================================

    async getAdminMaterials(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.get('/admin/materials' + (queryString ? '?' + queryString : ''));
    }

    async approveMaterial(materialId) {
        return this.put('/admin/materials/' + materialId + '/approve');
    }

    async rejectMaterial(materialId, reason) {
        return this.put('/admin/materials/' + materialId + '/reject', { reason });
    }

    async downloadMaterial(materialId) {
        return this.get('/admin/materials/' + materialId + '/download');
    }
}

// Create singleton instance
const apiService = new APIService();

// Export for use in other files
window.apiService = apiService;
