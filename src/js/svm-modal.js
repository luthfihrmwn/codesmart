/**
 * SVM Prediction Detail Modal
 * Shows detailed information about SVM predictions in a modal pop-up
 */

class SVMModal {
    constructor() {
        this.modal = null;
        this.currentPrediction = null;
        this.init();
    }

    init() {
        // Create modal HTML if it doesn't exist
        if (!document.getElementById('svmDetailModal')) {
            this.createModal();
        }
        this.modal = document.getElementById('svmDetailModal');
        this.attachEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div id="svmDetailModal" class="svm-detail-modal">
                <div class="svm-modal-container">
                    <div class="svm-modal-header">
                        <h2 class="svm-modal-title">
                            <i class='bx bx-brain'></i>
                            SVM Prediction Details
                        </h2>
                        <button class="svm-modal-close" onclick="svmModal.close()">
                            <i class='bx bx-x'></i>
                        </button>
                    </div>
                    <div class="svm-modal-body" id="svmModalBody">
                        <!-- Content will be dynamically inserted -->
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    attachEventListeners() {
        // Close on overlay click
        const modal = document.getElementById('svmDetailModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close();
                }
            });
        }

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    show(prediction) {
        this.currentPrediction = prediction;
        this.renderContent(prediction);

        // Show modal with animation
        setTimeout(() => {
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';

        // Clear content after animation
        setTimeout(() => {
            document.getElementById('svmModalBody').innerHTML = '';
            this.currentPrediction = null;
        }, 300);
    }

    renderContent(pred) {
        const isMatch = pred.current_level === pred.svm_predicted_level;
        const matchClass = isMatch ? 'match' : 'different';
        const matchText = isMatch ? 'Prediction Matches' : 'Prediction Different';
        const matchIcon = isMatch ? 'bx-check-circle' : 'bx-x-circle';

        // Parse probabilities
        const probabilities = pred.svm_probabilities || {};
        const probFundamental = (probabilities.fundamental || 0) * 100;
        const probIntermediate = (probabilities.intermediate || 0) * 100;
        const probAdvance = (probabilities.advance || 0) * 100;

        // Get initials for avatar
        const initials = (pred.name || 'U').substring(0, 2).toUpperCase();

        // Format date
        const predictionDate = pred.prediction_date
            ? new Date(pred.prediction_date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'N/A';

        const content = `
            <!-- Student Info -->
            <div class="svm-student-info">
                <div class="svm-student-avatar">${initials}</div>
                <div class="svm-student-details">
                    <h3 class="svm-student-name">${pred.name || 'Unknown Student'}</h3>
                    <div class="svm-student-meta">
                        <div class="svm-meta-item">
                            <i class='bx bx-envelope'></i>
                            <span class="svm-meta-value">${pred.email || 'N/A'}</span>
                        </div>
                        <div class="svm-meta-item">
                            <i class='bx bx-calendar'></i>
                            <span class="svm-meta-value">${predictionDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="svm-stats-grid">
                <div class="svm-stat-card">
                    <div class="svm-stat-value" style="color: #667eea;">${pred.pretest_score || 0}</div>
                    <div class="svm-stat-label">Pretest Score</div>
                </div>
                <div class="svm-stat-card">
                    <div class="svm-stat-value" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${(pred.svm_confidence || 0).toFixed(1)}%</div>
                    <div class="svm-stat-label">Confidence</div>
                </div>
            </div>

            <!-- Level Comparison -->
            <div class="svm-comparison">
                <h3 class="svm-section-title">
                    <i class='bx bx-git-compare'></i>
                    Level Comparison
                </h3>
                <div class="svm-comparison-grid">
                    <div class="svm-comparison-card">
                        <div class="svm-comparison-label">Rule-Based Level</div>
                        <div class="svm-comparison-value">
                            <span class="svm-level-badge ${pred.current_level || 'fundamental'}">
                                <i class='bx bx-trophy'></i>
                                ${(pred.current_level || 'N/A').toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div class="svm-comparison-card">
                        <div class="svm-comparison-label">SVM Predicted Level</div>
                        <div class="svm-comparison-value">
                            <span class="svm-level-badge ${pred.svm_predicted_level || 'fundamental'}">
                                <i class='bx bx-brain'></i>
                                ${(pred.svm_predicted_level || 'N/A').toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="svm-match-status ${matchClass}">
                    <i class='bx ${matchIcon}'></i>
                    ${matchText}
                </div>
            </div>

            <!-- Confidence Score -->
            <div class="svm-confidence-section">
                <h3 class="svm-section-title">
                    <i class='bx bx-bar-chart-alt-2'></i>
                    Confidence Score
                </h3>
                <div class="svm-confidence-bar-container">
                    <div class="svm-confidence-bar" style="width: ${pred.svm_confidence || 0}%">
                        <span class="svm-confidence-text">${(pred.svm_confidence || 0).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="svm-confidence-label">
                    ${this.getConfidenceLabel(pred.svm_confidence || 0)}
                </div>
            </div>

            <!-- Probabilities -->
            <div class="svm-probabilities">
                <h3 class="svm-section-title">
                    <i class='bx bx-pie-chart-alt-2'></i>
                    Level Probabilities
                </h3>

                <div class="svm-prob-item">
                    <div class="svm-prob-label">
                        <span class="svm-level-badge fundamental" style="padding: 4px 12px; font-size: 12px;">Fundamental</span>
                    </div>
                    <div class="svm-prob-bar-wrapper">
                        <div class="svm-prob-bar-bg">
                            <div class="svm-prob-bar-fill" style="width: ${probFundamental}%; background: linear-gradient(90deg, #fa709a 0%, #fee140 100%);">
                                <span class="svm-prob-percentage">${probFundamental.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="svm-prob-item">
                    <div class="svm-prob-label">
                        <span class="svm-level-badge intermediate" style="padding: 4px 12px; font-size: 12px;">Intermediate</span>
                    </div>
                    <div class="svm-prob-bar-wrapper">
                        <div class="svm-prob-bar-bg">
                            <div class="svm-prob-bar-fill" style="width: ${probIntermediate}%; background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);">
                                <span class="svm-prob-percentage">${probIntermediate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="svm-prob-item">
                    <div class="svm-prob-label">
                        <span class="svm-level-badge advance" style="padding: 4px 12px; font-size: 12px;">Advance</span>
                    </div>
                    <div class="svm-prob-bar-wrapper">
                        <div class="svm-prob-bar-bg">
                            <div class="svm-prob-bar-fill" style="width: ${probAdvance}%; background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);">
                                <span class="svm-prob-percentage">${probAdvance.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional Information -->
            <div class="svm-additional-info">
                <h3 class="svm-section-title">
                    <i class='bx bx-info-circle'></i>
                    Additional Information
                </h3>
                <div class="svm-info-row">
                    <div class="svm-info-label">
                        <i class='bx bx-user'></i>
                        Student ID
                    </div>
                    <div class="svm-info-value">${pred.id || 'N/A'}</div>
                </div>
                <div class="svm-info-row">
                    <div class="svm-info-label">
                        <i class='bx bx-clipboard'></i>
                        Pretest Score
                    </div>
                    <div class="svm-info-value">${pred.pretest_score || 0} / 100</div>
                </div>
                <div class="svm-info-row">
                    <div class="svm-info-label">
                        <i class='bx bx-calendar-check'></i>
                        Prediction Date
                    </div>
                    <div class="svm-info-value">${predictionDate}</div>
                </div>
                <div class="svm-info-row">
                    <div class="svm-info-label">
                        <i class='bx bx-check-double'></i>
                        Status
                    </div>
                    <div class="svm-info-value">${isMatch ? '✅ Match' : '❌ Different'}</div>
                </div>
            </div>
        `;

        document.getElementById('svmModalBody').innerHTML = content;
    }

    getConfidenceLabel(confidence) {
        if (confidence >= 90) return '🎯 Very High Confidence - Excellent prediction reliability';
        if (confidence >= 80) return '✅ High Confidence - Strong prediction reliability';
        if (confidence >= 70) return '👍 Good Confidence - Reliable prediction';
        if (confidence >= 60) return '⚠️ Moderate Confidence - Acceptable prediction';
        return '⚠️ Low Confidence - Prediction may need review';
    }
}

// Initialize global instance
const svmModal = new SVMModal();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVMModal;
}
