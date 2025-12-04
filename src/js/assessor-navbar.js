/**
 * Assessor Navbar Handler
 * Handles mobile menu toggle and responsive behavior
 */

class AssessorNavbar {
    constructor() {
        this.init();
    }

    init() {
        // Add mobile menu toggle button if not exists
        this.addMobileMenuToggle();

        // Setup event listeners
        this.setupEventListeners();

        // Handle window resize
        this.handleResize();
    }

    addMobileMenuToggle() {
        // Check if header exists
        const header = document.querySelector('.admin-header');
        if (!header) return;

        // Check if toggle already exists
        if (document.querySelector('.mobile-menu-toggle')) return;

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.innerHTML = '<i class="bx bx-menu"></i>';
        toggleBtn.setAttribute('aria-label', 'Toggle Menu');

        // Insert at the beginning of header-left
        const headerLeft = header.querySelector('.header-left');
        if (headerLeft) {
            headerLeft.insertBefore(toggleBtn, headerLeft.firstChild);
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        const toggleBtn = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.admin-sidebar');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.admin-sidebar');
            const toggleBtn = document.querySelector('.mobile-menu-toggle');

            if (window.innerWidth <= 768 &&
                sidebar &&
                sidebar.classList.contains('mobile-open') &&
                !sidebar.contains(e.target) &&
                !toggleBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Close sidebar when clicking nav links on mobile
        const navLinks = document.querySelectorAll('.admin-sidebar .nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.admin-sidebar');

        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
            document.body.classList.toggle('sidebar-open');

            // Update toggle button icon
            const toggleBtn = document.querySelector('.mobile-menu-toggle');
            const icon = toggleBtn.querySelector('i');

            if (sidebar.classList.contains('mobile-open')) {
                icon.className = 'bx bx-x';
            } else {
                icon.className = 'bx bx-menu';
            }
        }
    }

    closeMobileMenu() {
        const sidebar = document.querySelector('.admin-sidebar');
        const toggleBtn = document.querySelector('.mobile-menu-toggle');

        if (sidebar) {
            sidebar.classList.remove('mobile-open');
            document.body.classList.remove('sidebar-open');

            // Reset toggle button icon
            if (toggleBtn) {
                const icon = toggleBtn.querySelector('i');
                icon.className = 'bx bx-menu';
            }
        }
    }

    handleResize() {
        // Close mobile menu when resizing to desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AssessorNavbar();
    });
} else {
    new AssessorNavbar();
}
