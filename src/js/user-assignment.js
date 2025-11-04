/**
 * User Assignment Submission Integration
 * CodeSmart LMS - Supabase Backend
 */

// Check authentication
if (!authService.requireAuth()) {
    window.location.href = '/index.html';
}

let currentUser = null;
let assignments = [];
let mySubmissions = [];
let selectedAssignment = null;

// Initialize
async function initAssignment() {
    try {
        showLoading(true);

        currentUser = authService.getCurrentUser();

        // Load assignments and submissions
        await loadData();

        // Render UI
        renderAssignments();

        showLoading(false);
    } catch (error) {
        console.error('Init assignment error:', error);
        alert('Gagal memuat assignments: ' + error.message);
        showLoading(false);
    }
}

// Load data
async function loadData() {
    try {
        const [assignmentsResponse, submissionsResponse] = await Promise.all([
            apiService.getMyAssignments(),
            apiService.getMySubmissions()
        ]);

        if (assignmentsResponse.success) {
            assignments = assignmentsResponse.data || [];
        }

        if (submissionsResponse.success) {
            mySubmissions = submissionsResponse.data || [];
        }
    } catch (error) {
        console.error('Load data error:', error);
        throw error;
    }
}

// Render assignments
function renderAssignments() {
    // Set user info
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = currentUser.name;
    }

    const container = document.getElementById('assignmentsContainer');
    if (!container) return;

    if (assignments.length === 0) {
        container.innerHTML = '<p style="text-align: center; font-size: 1.8rem; color: #888; padding: 4rem;">Belum ada assignment tersedia.</p>';
        return;
    }

    let html = '';
    assignments.forEach(assignment => {
        const submission = mySubmissions.find(s => s.assignment_id === assignment.id);
        const hasSubmitted = !!submission;
        const isGraded = submission && submission.score !== null;

        html += `
            <div class="assignment-card">
                <div class="assignment-header">
                    <div>
                        <h3>${assignment.title}</h3>
                        <p class="assignment-meta">
                            <span><i class="bx bx-book"></i> ${assignment.module_name}</span>
                            <span><i class="bx bx-calendar"></i> Due: ${formatDate(assignment.due_date)}</span>
                        </p>
                    </div>
                    <div class="assignment-status">
                        ${hasSubmitted ? `
                            ${isGraded ? `
                                <span class="badge badge-success">
                                    <i class="bx bx-check-circle"></i> Graded: ${submission.score}
                                </span>
                            ` : `
                                <span class="badge badge-warning">
                                    <i class="bx bx-time"></i> Pending Review
                                </span>
                            `}
                        ` : `
                            <span class="badge badge-danger">
                                <i class="bx bx-x-circle"></i> Not Submitted
                            </span>
                        `}
                    </div>
                </div>

                <div class="assignment-description">
                    ${assignment.description || 'No description available'}
                </div>

                ${hasSubmitted ? `
                    <div class="submission-info">
                        <h4><i class="bx bx-file"></i> Your Submission</h4>
                        <p><strong>File:</strong> ${submission.file_name}</p>
                        <p><strong>Submitted:</strong> ${formatDate(submission.submitted_at)}</p>
                        ${submission.score !== null ? `
                            <p><strong>Score:</strong> ${submission.score}/100</p>
                            ${submission.feedback ? `<p><strong>Feedback:</strong> ${submission.feedback}</p>` : ''}
                        ` : ''}
                    </div>
                ` : ''}

                <div class="assignment-actions">
                    ${!hasSubmitted ? `
                        <button class="btn btn-primary" onclick="openSubmitModal(${assignment.id}, '${assignment.title}')">
                            <i class="bx bx-upload"></i> Submit Assignment
                        </button>
                    ` : `
                        ${!isGraded ? `
                            <button class="btn btn-secondary" onclick="openResubmitModal(${submission.id}, '${assignment.title}')">
                                <i class="bx bx-redo"></i> Resubmit
                            </button>
                        ` : ''}
                        <button class="btn btn-outline" onclick="downloadSubmission(${submission.id})">
                            <i class="bx bx-download"></i> Download
                        </button>
                    `}
                    <button class="btn btn-outline" onclick="viewAssignmentDetail(${assignment.id})">
                        <i class="bx bx-info-circle"></i> View Details
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Open submit modal
function openSubmitModal(assignmentId, assignmentTitle) {
    selectedAssignment = assignmentId;

    document.getElementById('modalTitle').textContent = `Submit: ${assignmentTitle}`;
    document.getElementById('submitForm').reset();
    document.getElementById('submitModal').style.display = 'flex';
}

// Open resubmit modal
function openResubmitModal(submissionId, assignmentTitle) {
    selectedAssignment = submissionId; // Store submission ID for resubmit

    document.getElementById('modalTitle').textContent = `Resubmit: ${assignmentTitle}`;
    document.getElementById('submitForm').reset();
    document.getElementById('submitModal').style.display = 'flex';
    document.getElementById('submitModal').setAttribute('data-resubmit', 'true');
}

// Close modal
function closeSubmitModal() {
    document.getElementById('submitModal').style.display = 'none';
    document.getElementById('submitForm').reset();
    document.getElementById('submitModal').removeAttribute('data-resubmit');
    selectedAssignment = null;
}

// Handle form submit
document.getElementById('submitForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fileInput = document.getElementById('assignmentFile');
    const notes = document.getElementById('submissionNotes').value.trim();
    const isResubmit = document.getElementById('submitModal').getAttribute('data-resubmit') === 'true';

    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select a file to upload!');
        return;
    }

    const file = fileInput.files[0];

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB!');
        return;
    }

    // Validate file type
    const allowedTypes = ['pdf', 'doc', 'docx', 'zip', 'js', 'html', 'css', 'txt'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(extension)) {
        alert('Invalid file type! Allowed: ' + allowedTypes.join(', '));
        return;
    }

    try {
        showLoading(true);

        // Create FormData
        const formData = new FormData();
        if (isResubmit) {
            formData.append('file', file);
            if (notes) formData.append('notes', notes);

            // Resubmit
            const response = await apiService.resubmitAssignment(selectedAssignment, formData);

            if (response.success) {
                alert('Assignment resubmitted successfully!');
                closeSubmitModal();
                await loadData();
                renderAssignments();
            } else {
                alert('Failed to resubmit: ' + (response.message || 'Unknown error'));
            }
        } else {
            formData.append('assignment_id', selectedAssignment);
            formData.append('file', file);
            if (notes) formData.append('notes', notes);

            // Submit new
            const response = await apiService.submitAssignment(formData);

            if (response.success) {
                alert('Assignment submitted successfully!');
                closeSubmitModal();
                await loadData();
                renderAssignments();
            } else {
                alert('Failed to submit: ' + (response.message || 'Unknown error'));
            }
        }

        showLoading(false);
    } catch (error) {
        console.error('Submit error:', error);
        alert('Error submitting assignment: ' + error.message);
        showLoading(false);
    }
});

// Download submission
async function downloadSubmission(submissionId) {
    try {
        window.open(`${apiService.baseURL}/submissions/${submissionId}/download`, '_blank');
    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download submission');
    }
}

// View assignment detail
function viewAssignmentDetail(assignmentId) {
    // For now, just show alert. Can be enhanced to show full detail modal
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
        alert(`Assignment: ${assignment.title}\n\nDescription: ${assignment.description}\n\nDue Date: ${formatDate(assignment.due_date)}`);
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
    document.addEventListener('DOMContentLoaded', initAssignment);
} else {
    initAssignment();
}
