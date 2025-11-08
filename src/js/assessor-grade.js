/**
 * Assessor Grade Submissions Integration
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

let allSubmissions = [];
let currentFilter = 'pending';
let selectedSubmission = null;

// Initialize
async function initGradeSubmissions() {
    try {
        showLoading(true);

        // Check if specific submission ID in URL
        const urlParams = new URLSearchParams(window.location.search);
        const submissionId = urlParams.get('id');

        if (submissionId) {
            // Load specific submission for grading
            await loadSubmissionDetails(submissionId);
            openGradeModal();
        } else {
            // Load pending submissions by default
            await loadSubmissions('pending');
            renderSubmissions();
        }

        showLoading(false);
    } catch (error) {
        console.error('Init grade submissions error:', error);
        alert('Failed to load submissions: ' + error.message);
        showLoading(false);
    }
}

// Load submissions
async function loadSubmissions(filter) {
    try {
        currentFilter = filter;
        let response;

        if (filter === 'pending') {
            response = await apiService.getPendingSubmissions();
        } else if (filter === 'graded') {
            response = await apiService.getGradedSubmissions();
        }

        if (response.success) {
            allSubmissions = response.data || [];
        } else {
            throw new Error(response.message || 'Failed to load submissions');
        }
    } catch (error) {
        console.error('Load submissions error:', error);
        throw error;
    }
}

// Load submission details
async function loadSubmissionDetails(id) {
    try {
        const response = await apiService.getSubmissionDetails(id);

        if (response.success) {
            selectedSubmission = response.data;
        } else {
            throw new Error(response.message || 'Failed to load submission details');
        }
    } catch (error) {
        console.error('Load submission details error:', error);
        throw error;
    }
}

// Render submissions
function renderSubmissions() {
    const container = document.getElementById('submissionsTableBody');
    if (!container) return;

    // Update filter buttons
    updateFilterButtons();

    if (allSubmissions.length === 0) {
        container.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #888;">No submissions found</td></tr>';

        // Update count
        const countEl = document.getElementById('submissionsCount');
        if (countEl) {
            countEl.textContent = '0';
        }
        return;
    }

    let html = '';
    allSubmissions.forEach(submission => {
        const submittedDate = new Date(submission.submitted_at).toLocaleDateString('id-ID');
        const statusBadge = getStatusBadge(submission.status);

        html += `
            <tr>
                <td>${submission.id}</td>
                <td>
                    <div style="font-weight: 600;">${submission.user_name}</div>
                    <div style="font-size: 1.3rem; color: #888;">${submission.user_email || ''}</div>
                </td>
                <td>
                    <div style="font-weight: 600;">${submission.assignment_title}</div>
                    <div style="font-size: 1.3rem; color: #888;">${submission.module_name || ''}</div>
                </td>
                <td>${submittedDate}</td>
                <td>${statusBadge}</td>
                <td>${submission.score !== null && submission.score !== undefined ? submission.score : '-'}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-icon-btn" onclick="viewSubmission(${submission.id})" title="View">
                            <i class='bx bx-show'></i>
                        </button>
                        ${submission.status === 'pending' || submission.status === 'submitted' ?
                            `<button class="action-icon-btn" onclick="gradeSubmissionModal(${submission.id})" title="Grade">
                                <i class='bx bx-edit'></i>
                            </button>` :
                            `<button class="action-icon-btn" onclick="gradeSubmissionModal(${submission.id})" title="Edit Grade">
                                <i class='bx bx-edit'></i>
                            </button>`
                        }
                    </div>
                </td>
            </tr>
        `;
    });

    container.innerHTML = html;

    // Update count
    const countEl = document.getElementById('submissionsCount');
    if (countEl) {
        countEl.textContent = allSubmissions.length;
    }
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

// Update filter buttons
function updateFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === currentFilter) {
            btn.classList.add('active');
        }
    });
}

// Filter submissions
async function filterSubmissions(filter) {
    try {
        showLoading(true);

        await loadSubmissions(filter);
        renderSubmissions();

        showLoading(false);
    } catch (error) {
        console.error('Filter submissions error:', error);
        alert('Failed to filter submissions: ' + error.message);
        showLoading(false);
    }
}

// View submission (open modal to view)
async function viewSubmission(id) {
    await gradeSubmissionModal(id, true); // view-only mode
}

// Grade submission modal
async function gradeSubmissionModal(id, viewOnly = false) {
    try {
        showLoading(true);

        // Load submission details
        await loadSubmissionDetails(id);

        // Populate modal
        populateGradeModal(viewOnly);

        // Show modal
        document.getElementById('gradeModal').style.display = 'flex';

        showLoading(false);
    } catch (error) {
        console.error('Grade submission modal error:', error);
        alert('Failed to load submission: ' + error.message);
        showLoading(false);
    }
}

// Populate grade modal
function populateGradeModal(viewOnly = false) {
    if (!selectedSubmission) return;

    // Student info
    document.getElementById('modalStudentName').textContent = selectedSubmission.user_name;
    document.getElementById('modalAssignmentTitle').textContent = selectedSubmission.assignment_title;
    document.getElementById('modalModuleName').textContent = selectedSubmission.module_name || '-';
    document.getElementById('modalSubmittedDate').textContent = new Date(selectedSubmission.submitted_at).toLocaleDateString('id-ID');

    // File info
    if (selectedSubmission.file_url) {
        document.getElementById('modalFileInfo').style.display = 'block';
        const fileLink = document.getElementById('modalFileLink');
        fileLink.href = selectedSubmission.file_url;
        fileLink.textContent = selectedSubmission.file_url.split('/').pop() || 'Download File';
    } else {
        document.getElementById('modalFileInfo').style.display = 'none';
    }

    // Grade form
    document.getElementById('gradeScore').value = selectedSubmission.score || '';
    document.getElementById('gradeFeedback').value = selectedSubmission.feedback || '';
    document.getElementById('gradeStatus').value = selectedSubmission.status || 'pending';

    // If already graded, show graded info
    if (selectedSubmission.graded_at) {
        document.getElementById('modalGradedInfo').style.display = 'block';
        document.getElementById('modalGradedBy').textContent = selectedSubmission.graded_by_name || 'Unknown';
        document.getElementById('modalGradedDate').textContent = new Date(selectedSubmission.graded_at).toLocaleDateString('id-ID');
    } else {
        document.getElementById('modalGradedInfo').style.display = 'none';
    }

    // Update modal title
    const modalTitle = viewOnly ? 'View Submission' : (selectedSubmission.status === 'pending' || selectedSubmission.status === 'submitted' ? 'Grade Submission' : 'Update Grade');
    document.getElementById('gradeModalTitle').textContent = modalTitle;

    // Show/hide submit button based on view mode
    const submitBtn = document.querySelector('#gradeModal button[type="submit"]');
    if (submitBtn) {
        submitBtn.style.display = viewOnly ? 'none' : 'inline-flex';
    }
}

// Open grade modal (for initial load from URL)
function openGradeModal() {
    populateGradeModal(false);
    document.getElementById('gradeModal').style.display = 'flex';
}

// Close grade modal
function closeGradeModal() {
    document.getElementById('gradeModal').style.display = 'none';
    selectedSubmission = null;

    // Remove ID from URL if present
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.replaceState({}, '', url);

    // Reload submissions
    filterSubmissions(currentFilter);
}

// Handle grade form submit
async function handleGradeSubmit(event) {
    event.preventDefault();

    if (!selectedSubmission) return;

    try {
        showLoading(true);

        const gradeData = {
            score: parseFloat(document.getElementById('gradeScore').value),
            feedback: document.getElementById('gradeFeedback').value.trim(),
            status: document.getElementById('gradeStatus').value
        };

        // Validate score
        if (isNaN(gradeData.score) || gradeData.score < 0 || gradeData.score > 100) {
            alert('Please enter a valid score between 0 and 100');
            showLoading(false);
            return;
        }

        // Auto-set status based on score if not manually changed
        if (gradeData.score >= 70 && gradeData.status === 'pending') {
            gradeData.status = 'passed';
        } else if (gradeData.score < 70 && gradeData.status === 'pending') {
            gradeData.status = 'failed';
        }

        let response;
        if (selectedSubmission.status === 'pending' || selectedSubmission.status === 'submitted') {
            // New grading
            response = await apiService.gradeSubmission(selectedSubmission.id, gradeData);
        } else {
            // Update existing grade
            response = await apiService.updateGrade(selectedSubmission.id, gradeData);
        }

        if (response.success) {
            alert('Submission graded successfully!');
            closeGradeModal();
        } else {
            throw new Error(response.message || 'Failed to grade submission');
        }

        showLoading(false);
    } catch (error) {
        console.error('Grade submission error:', error);
        alert('Failed to grade submission: ' + error.message);
        showLoading(false);
    }
}

// Auto-update status based on score
function updateStatusByScore() {
    const score = parseFloat(document.getElementById('gradeScore').value);
    const statusSelect = document.getElementById('gradeStatus');

    if (!isNaN(score)) {
        if (score >= 70) {
            statusSelect.value = 'passed';
        } else {
            statusSelect.value = 'failed';
        }
    }
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
    document.addEventListener('DOMContentLoaded', initGradeSubmissions);
} else {
    initGradeSubmissions();
}
