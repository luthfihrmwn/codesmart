/**
 * Assessor Student Progress Integration
 * CodeSmart LMS - Supabase Backend
 */

// Check authentication and assessor role
if (!authService.requireAuth()) {
    window.location.href = '/index.html';
}

const currentUser = authService.getCurrentUser();
if (currentUser.role !== 'assessor' && currentUser.role !== 'admin') {
    alert('Access denied! Assessor or Admin only.');
    window.location.href = '/src/pages/user/dashboard-new.html';
}

let allStudents = [];
let selectedStudent = null;

// Initialize
async function initStudentProgress() {
    try {
        showLoading(true);

        // Load all students
        await loadAllStudents();

        // Render students table
        renderStudentsTable();

        showLoading(false);
    } catch (error) {
        console.error('Init student progress error:', error);
        alert('Failed to load students: ' + error.message);
        showLoading(false);
    }
}

// Load all students
async function loadAllStudents() {
    try {
        const response = await apiService.getStudents();

        if (response.success) {
            allStudents = response.data || [];
        } else {
            throw new Error(response.message || 'Failed to load students');
        }
    } catch (error) {
        console.error('Load students error:', error);
        throw error;
    }
}

// Render students table
function renderStudentsTable() {
    const container = document.getElementById('studentsTableBody');
    if (!container) return;

    if (allStudents.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #888;">No students found</td></tr>';

        // Update count
        const countEl = document.getElementById('totalStudentsCount');
        if (countEl) {
            countEl.textContent = '0';
        }
        return;
    }

    let html = '';
    allStudents.forEach(student => {
        const levelBadge = getLevelBadge(student.level);
        const enrollmentCount = student.enrollment_count || 0;
        const completionRate = student.completion_rate || 0;

        html += `
            <tr>
                <td>${student.id}</td>
                <td>
                    <div style="font-weight: 600;">${student.name}</div>
                    <div style="font-size: 1.3rem; color: #888;">${student.email}</div>
                </td>
                <td>${levelBadge}</td>
                <td>${enrollmentCount} modules</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="flex: 1; height: 1rem; background: rgba(117, 78, 249, 0.1); border-radius: .5rem; overflow: hidden;">
                            <div style="width: ${completionRate}%; height: 100%; background: ${getCompletionColor(completionRate)}; transition: width .3s ease;"></div>
                        </div>
                        <span style="font-weight: 600; min-width: 4rem;">${completionRate}%</span>
                    </div>
                </td>
                <td>
                    <button class="action-icon-btn" onclick="viewStudentProgress(${student.id})" title="View Progress">
                        <i class='bx bx-show'></i>
                    </button>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;

    // Update count
    const countEl = document.getElementById('totalStudentsCount');
    if (countEl) {
        countEl.textContent = allStudents.length;
    }
}

// Get level badge
function getLevelBadge(level) {
    const badges = {
        'fundamental': '<span class="badge badge-info">Fundamental</span>',
        'intermediate': '<span class="badge badge-warning">Intermediate</span>',
        'advance': '<span class="badge badge-danger">Advance</span>'
    };
    return badges[level] || badges['fundamental'];
}

// Get completion color
function getCompletionColor(rate) {
    if (rate >= 80) return '#28a745'; // Green
    if (rate >= 50) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
}

// View student progress
async function viewStudentProgress(studentId) {
    try {
        showLoading(true);

        // Find student
        selectedStudent = allStudents.find(s => s.id === studentId);
        if (!selectedStudent) {
            throw new Error('Student not found');
        }

        // Load student progress details
        const response = await apiService.getStudentProgress(studentId);

        if (response.success) {
            selectedStudent.progress = response.data;
            populateProgressModal();
            document.getElementById('progressModal').style.display = 'flex';
        } else {
            throw new Error(response.message || 'Failed to load student progress');
        }

        showLoading(false);
    } catch (error) {
        console.error('View student progress error:', error);
        alert('Failed to load student progress: ' + error.message);
        showLoading(false);
    }
}

// Populate progress modal
function populateProgressModal() {
    if (!selectedStudent || !selectedStudent.progress) return;

    const progress = selectedStudent.progress;

    // Student info
    document.getElementById('modalStudentName').textContent = selectedStudent.name;
    document.getElementById('modalStudentEmail').textContent = selectedStudent.email;
    document.getElementById('modalStudentLevel').textContent = selectedStudent.level || 'fundamental';

    // Overall stats
    document.getElementById('modalTotalEnrollments').textContent = progress.totalEnrollments || 0;
    document.getElementById('modalCompletedModules').textContent = progress.completedModules || 0;
    document.getElementById('modalTotalSubmissions').textContent = progress.totalSubmissions || 0;
    document.getElementById('modalAverageScore').textContent = (progress.averageScore || 0).toFixed(1);

    // Enrollments table
    renderEnrollmentsTable(progress.enrollments || []);

    // Submissions table
    renderSubmissionsTable(progress.submissions || []);
}

// Render enrollments table
function renderEnrollmentsTable(enrollments) {
    const container = document.getElementById('enrollmentsTableBody');
    if (!container) return;

    if (enrollments.length === 0) {
        container.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #888;">No enrollments</td></tr>';
        return;
    }

    let html = '';
    enrollments.forEach(enrollment => {
        const enrolledDate = new Date(enrollment.enrolled_at).toLocaleDateString('id-ID');
        const completionRate = enrollment.completion_rate || 0;
        const statusBadge = enrollment.completed ?
            '<span class="badge badge-success">Completed</span>' :
            '<span class="badge badge-warning">In Progress</span>';

        html += `
            <tr>
                <td>${enrollment.module_name}</td>
                <td>${enrolledDate}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="flex: 1; height: .8rem; background: rgba(117, 78, 249, 0.1); border-radius: .5rem; overflow: hidden;">
                            <div style="width: ${completionRate}%; height: 100%; background: ${getCompletionColor(completionRate)};"></div>
                        </div>
                        <span style="min-width: 4rem;">${completionRate}%</span>
                    </div>
                </td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });

    container.innerHTML = html;
}

// Render submissions table
function renderSubmissionsTable(submissions) {
    const container = document.getElementById('submissionsTableBody');
    if (!container) return;

    if (submissions.length === 0) {
        container.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: #888;">No submissions</td></tr>';
        return;
    }

    let html = '';
    submissions.forEach(submission => {
        const submittedDate = new Date(submission.submitted_at).toLocaleDateString('id-ID');
        const statusBadge = getStatusBadge(submission.status);
        const score = submission.score !== null && submission.score !== undefined ? submission.score : '-';

        html += `
            <tr>
                <td>${submission.assignment_title}</td>
                <td>${submittedDate}</td>
                <td>${statusBadge}</td>
                <td>${score}</td>
            </tr>
        `;
    });

    container.innerHTML = html;
}

// Get status badge
function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-warning">Pending</span>',
        'submitted': '<span class="badge badge-warning">Submitted</span>',
        'graded': '<span class="badge badge-success">Graded</span>',
        'passed': '<span class="badge badge-success">Passed</span>',
        'failed': '<span class="badge badge-danger">Failed</span>'
    };
    return badges[status] || badges['pending'];
}

// Close progress modal
function closeProgressModal() {
    document.getElementById('progressModal').style.display = 'none';
    selectedStudent = null;
}

// Search students
function searchStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const filteredStudents = allStudents.filter(student => {
        return student.name.toLowerCase().includes(searchTerm) ||
               student.email.toLowerCase().includes(searchTerm);
    });

    renderFilteredStudents(filteredStudents);
}

// Render filtered students
function renderFilteredStudents(students) {
    const container = document.getElementById('studentsTableBody');
    if (!container) return;

    if (students.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #888;">No students found</td></tr>';
        return;
    }

    let html = '';
    students.forEach(student => {
        const levelBadge = getLevelBadge(student.level);
        const enrollmentCount = student.enrollment_count || 0;
        const completionRate = student.completion_rate || 0;

        html += `
            <tr>
                <td>${student.id}</td>
                <td>
                    <div style="font-weight: 600;">${student.name}</div>
                    <div style="font-size: 1.3rem; color: #888;">${student.email}</div>
                </td>
                <td>${levelBadge}</td>
                <td>${enrollmentCount} modules</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="flex: 1; height: 1rem; background: rgba(117, 78, 249, 0.1); border-radius: .5rem; overflow: hidden;">
                            <div style="width: ${completionRate}%; height: 100%; background: ${getCompletionColor(completionRate)}; transition: width .3s ease;"></div>
                        </div>
                        <span style="font-weight: 600; min-width: 4rem;">${completionRate}%</span>
                    </div>
                </td>
                <td>
                    <button class="action-icon-btn" onclick="viewStudentProgress(${student.id})" title="View Progress">
                        <i class='bx bx-show'></i>
                    </button>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;
}

// Filter by level
function filterByLevel(level) {
    if (level === 'all') {
        renderStudentsTable();
        return;
    }

    const filteredStudents = allStudents.filter(student => student.level === level);
    renderFilteredStudents(filteredStudents);
}

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
    const body = document.body;
    const savedMode = localStorage.getItem('darkMode');

    if (savedMode === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="bx bx-sun"></i>';
    }

    darkModeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.innerHTML = '<i class="bx bx-sun"></i>';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.innerHTML = '<i class="bx bx-moon"></i>';
        }
    });
}

// Loading spinner
function showLoading(show) {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudentProgress);
} else {
    initStudentProgress();
}
