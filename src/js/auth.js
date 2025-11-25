// Authentication and Session Management
// Updated to work with Backend API

class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadSession();
    }

    // Login user with backend API
    async login(username, password) {
        try {
            const response = await apiService.login(username, password);

            if (response.success) {
                this.currentUser = response.data.user;
                this.saveSession();
                return { success: true, user: response.data.user };
            }

            return { success: false, message: response.message || 'Login gagal' };

        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Terjadi kesalahan. Silakan coba lagi.'
            };
        }
    }

    // Logout user
    async logout() {
        try {
            await apiService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.currentUser = null;
        localStorage.removeItem('codesmart_session');
        window.location.href = '/index.html';
    }

    // Register new user with backend API
    async register(userData) {
        try {
            const response = await apiService.register(userData);

            if (response.success) {
                return {
                    success: true,
                    user: response.data.user,
                    message: response.message
                };
            }

            return {
                success: false,
                message: response.message || 'Registrasi gagal'
            };

        } catch (error) {
            console.error('Register error:', error);

            // Handle specific error messages
            if (error.message.includes('email')) {
                return { success: false, message: 'Email sudah digunakan' };
            } else if (error.message.includes('username')) {
                return { success: false, message: 'Username sudah digunakan' };
            }

            return {
                success: false,
                message: error.message || 'Terjadi kesalahan. Silakan coba lagi.'
            };
        }
    }

    // Save session to localStorage
    saveSession() {
        if (this.currentUser) {
            localStorage.setItem('codesmart_session', JSON.stringify(this.currentUser));
        }
    }

    // Load session from localStorage
    loadSession() {
        const session = localStorage.getItem('codesmart_session');
        if (session) {
            try {
                this.currentUser = JSON.parse(session);
            } catch (error) {
                console.error('Failed to parse session:', error);
                localStorage.removeItem('codesmart_session');
            }
        }
    }

    // Refresh current user data from API
    async refreshUser() {
        try {
            const response = await apiService.getMe();
            if (response.success) {
                this.currentUser = response.data.user;
                this.saveSession();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to refresh user:', error);
            return false;
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null && apiService.getToken() !== null;
    }

    // Check if user has completed pretest
    hasCompletedPretest() {
        return this.currentUser && this.currentUser.pretest_score !== null;
    }

    // Check user role
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    isAssessor() {
        return this.currentUser && this.currentUser.role === 'assessor';
    }

    isUser() {
        return this.currentUser && this.currentUser.role === 'student';
    }

    // Update current user data via API
    async updateCurrentUser(updates) {
        try {
            const response = await apiService.updateProfile(updates);

            if (response.success) {
                // Merge updates with current user
                this.currentUser = {
                    ...this.currentUser,
                    ...response.data.user
                };
                this.saveSession();
                return { success: true, user: this.currentUser };
            }

            return { success: false, message: response.message || 'Gagal mengupdate profile' };

        } catch (error) {
            console.error('Update user error:', error);
            return {
                success: false,
                message: error.message || 'Terjadi kesalahan saat mengupdate profile'
            };
        }
    }

    // Update password
    async updatePassword(currentPassword, newPassword) {
        try {
            const response = await apiService.updatePassword(currentPassword, newPassword);

            if (response.success) {
                return { success: true, message: response.message };
            }

            return { success: false, message: response.message || 'Gagal mengupdate password' };

        } catch (error) {
            console.error('Update password error:', error);
            return {
                success: false,
                message: error.message || 'Terjadi kesalahan saat mengupdate password'
            };
        }
    }

    // Forgot password
    async forgotPassword(email) {
        try {
            const response = await apiService.forgotPassword(email);
            return response;
        } catch (error) {
            console.error('Forgot password error:', error);
            return {
                success: false,
                message: error.message || 'Terjadi kesalahan'
            };
        }
    }

    // Verify security answer
    async verifySecurityAnswer(email, answer) {
        try {
            const response = await apiService.verifySecurityAnswer(email, answer);
            return response;
        } catch (error) {
            console.error('Verify security answer error:', error);
            return {
                success: false,
                message: error.message || 'Jawaban salah'
            };
        }
    }

    // Reset password
    async resetPassword(email, newPassword, resetToken) {
        try {
            const response = await apiService.resetPassword(email, newPassword, resetToken);
            return response;
        } catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
                message: error.message || 'Gagal reset password'
            };
        }
    }

    // Check access to module based on pretest score and level
    canAccessModule(moduleLevel) {
        if (!this.currentUser) return false;

        // Admin and assessor can access all modules
        if (this.isAdmin() || this.isAssessor()) return true;

        // User must complete pretest first
        if (!this.hasCompletedPretest()) return false;

        // Get current level from user data
        const currentLevel = this.currentUser.current_level || 'fundamental';

        // Level hierarchy: fundamental < intermediate < advance
        const levelOrder = {
            'fundamental': 1,
            'intermediate': 2,
            'advance': 3
        };

        // User can access modules up to their current level
        return levelOrder[moduleLevel] <= levelOrder[currentLevel];
    }

    // Get pretest score
    getPretestScore() {
        return this.currentUser ? this.currentUser.pretest_score : null;
    }

    // Get current level
    getCurrentLevel() {
        return this.currentUser ? this.currentUser.current_level : 'fundamental';
    }

    // Redirect based on role
    redirectToDashboard() {
        if (!this.isLoggedIn()) {
            window.location.href = '/index.html';
            return;
        }

        if (this.isAdmin()) {
            window.location.href = '/src/pages/admin/dashboard-sidebar.html';
        } else if (this.isAssessor()) {
            window.location.href = '/src/pages/assessor/dashboard-sidebar.html';
        } else {
            // Check if user needs to take pretest
            if (!this.hasCompletedPretest()) {
                window.location.href = '/src/pages/user/pretest-new.html';
            } else {
                window.location.href = '/src/pages/user/dashboard-new.html';
            }
        }
    }

    // Require authentication (call this on protected pages)
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/src/pages/auth/login.html';
            return false;
        }
        return true;
    }

    // Require specific role
    requireRole(role) {
        if (!this.requireAuth()) return false;

        if (this.currentUser.role !== role) {
            this.redirectToDashboard();
            return false;
        }
        return true;
    }

    // Check if token is valid (not expired)
    async validateSession() {
        if (!this.isLoggedIn()) return false;

        try {
            // Try to get current user from API
            await this.refreshUser();
            return true;
        } catch (error) {
            // Token is invalid or expired
            console.error('Session validation failed:', error);
            this.logout();
            return false;
        }
    }
}

// Create global auth service instance
const authService = new AuthService();

// Export to window for use in other files
window.authService = authService;
