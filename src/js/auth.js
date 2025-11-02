// Authentication and Session Management

class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadSession();
    }

    // Login user
    login(username, password) {
        loadFromLocalStorage();
        const user = Database.authenticateUser(username, password);

        if (user) {
            // Check if user is approved (admins and assessors are auto-approved)
            if (!user.approved && user.role === 'user') {
                return {
                    success: false,
                    message: 'Akun Anda masih menunggu persetujuan dari administrator. Silakan coba lagi nanti.'
                };
            }

            this.currentUser = user;
            this.saveSession();
            return { success: true, user: user };
        }

        return { success: false, message: 'Username atau password salah' };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('codesmart_session');
        window.location.href = '/index.html';
    }

    // Register new user
    register(userData) {
        loadFromLocalStorage();

        // Check if username already exists
        if (Database.findUserByUsername(userData.username)) {
            return { success: false, message: 'Username sudah digunakan' };
        }

        // Check if email already exists
        const emailExists = Database.users.find(u => u.email === userData.email);
        if (emailExists) {
            return { success: false, message: 'Email sudah digunakan' };
        }

        const newUser = Database.addUser({
            ...userData,
            role: 'user' // Default role
        });

        saveToLocalStorage();

        return { success: true, user: newUser };
    }

    // Save session to localStorage
    saveSession() {
        localStorage.setItem('codesmart_session', JSON.stringify(this.currentUser));
    }

    // Load session from localStorage
    loadSession() {
        const session = localStorage.getItem('codesmart_session');
        if (session) {
            this.currentUser = JSON.parse(session);
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Check if user has completed pretest
    hasCompletedPretest() {
        return this.currentUser && this.currentUser.pretestCompleted;
    }

    // Check user role
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    isAssessor() {
        return this.currentUser && this.currentUser.role === 'assessor';
    }

    isUser() {
        return this.currentUser && this.currentUser.role === 'user';
    }

    // Update current user data
    updateCurrentUser(updates) {
        if (this.currentUser) {
            loadFromLocalStorage();
            const updatedUser = Database.updateUser(this.currentUser.id, updates);
            if (updatedUser) {
                this.currentUser = updatedUser;
                this.saveSession();
                saveToLocalStorage();
                return { success: true, user: updatedUser };
            }
        }
        return { success: false, message: 'Gagal mengupdate user' };
    }

    // Check access to module based on pretest score
    canAccessModule(moduleLevel) {
        if (!this.currentUser) return false;

        // Admin and assessor can access all modules
        if (this.isAdmin() || this.isAssessor()) return true;

        // User must complete pretest first
        if (!this.hasCompletedPretest()) return false;

        const score = this.currentUser.pretestScore;

        switch (moduleLevel) {
            case 'fundamental':
                return score >= 0 && score <= 45;
            case 'intermediate':
                return score >= 46 && score <= 65;
            case 'advance':
                return score >= 66 && score <= 100;
            default:
                return false;
        }
    }

    // Redirect based on role
    redirectToDashboard() {
        if (!this.isLoggedIn()) {
            window.location.href = '/index.html';
            return;
        }

        if (this.isAdmin()) {
            window.location.href = '/src/pages/admin/dashboard.html';
        } else if (this.isAssessor()) {
            window.location.href = '/src/pages/assessor/dashboard.html';
        } else {
            // Check if user needs to take pretest
            if (!this.hasCompletedPretest()) {
                window.location.href = '/src/pages/user/pretest.html';
            } else {
                window.location.href = '/src/pages/user/dashboard.html';
            }
        }
    }

    // Require authentication (call this on protected pages)
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/index.html';
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
}

// Create global auth service instance
const authService = new AuthService();
