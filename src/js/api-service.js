/**
 * API Service Layer untuk CodeSmart
 * Handles all communication with backend API
 */

// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api/v1',
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
            method: 'POST',
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
        return this.put('/auth/update-details', data);
    }

    async updatePassword(currentPassword, newPassword) {
        return this.put('/auth/update-password', { currentPassword, newPassword });
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

    async getAdminStatistics() {
        return this.get('/admin/statistics');
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
}

// Create singleton instance
const apiService = new APIService();

// Export for use in other files
window.apiService = apiService;
