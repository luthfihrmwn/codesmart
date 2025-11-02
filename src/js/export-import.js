// Export and Import Utilities for CodeSmart

class ExportImport {

    // ==================== EXPORT FUNCTIONS ====================

    /**
     * Export data to JSON file
     * @param {Object} data - Data to export
     * @param {string} filename - Filename without extension
     */
    static exportToJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Export data to CSV file
     * @param {Array} data - Array of objects to export
     * @param {string} filename - Filename without extension
     */
    static exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            alert('No data to export!');
            return;
        }

        // Get headers from first object
        const headers = Object.keys(data[0]);

        // Create CSV content
        let csv = headers.join(',') + '\n';

        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                // Handle values with commas or quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return '"' + value.replace(/"/g, '""') + '"';
                }
                return value !== null && value !== undefined ? value : '';
            });
            csv += values.join(',') + '\n';
        });

        // Create and download file
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // ==================== IMPORT FUNCTIONS ====================

    /**
     * Import JSON file
     * @param {Function} callback - Callback function with imported data
     */
    static importFromJSON(callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    callback(data, null);
                } catch (error) {
                    callback(null, 'Invalid JSON file: ' + error.message);
                }
            };
            reader.onerror = () => {
                callback(null, 'Error reading file');
            };
            reader.readAsText(file);
        };

        input.click();
    }

    /**
     * Import CSV file
     * @param {Function} callback - Callback function with imported data
     */
    static importFromCSV(callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const csv = event.target.result;
                    const lines = csv.split('\n').filter(line => line.trim());

                    if (lines.length === 0) {
                        callback(null, 'Empty CSV file');
                        return;
                    }

                    // Parse headers
                    const headers = lines[0].split(',').map(h => h.trim());

                    // Parse data
                    const data = [];
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(v => v.trim());
                        const obj = {};
                        headers.forEach((header, index) => {
                            obj[header] = values[index] || '';
                        });
                        data.push(obj);
                    }

                    callback(data, null);
                } catch (error) {
                    callback(null, 'Error parsing CSV: ' + error.message);
                }
            };
            reader.onerror = () => {
                callback(null, 'Error reading file');
            };
            reader.readAsText(file);
        };

        input.click();
    }

    // ==================== SPECIFIC EXPORT FUNCTIONS ====================

    /**
     * Export all users
     */
    static exportUsers() {
        const users = Database.users.map(user => ({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            pretestCompleted: user.pretestCompleted,
            pretestScore: user.pretestScore,
            recommendedModule: user.recommendedModule
        }));

        this.exportToJSON({ users, exportDate: new Date().toISOString() }, 'codesmart-users');
    }

    /**
     * Export all users as CSV
     */
    static exportUsersCSV() {
        const users = Database.users.map(user => ({
            ID: user.id,
            Name: user.name,
            Username: user.username,
            Email: user.email,
            Role: user.role,
            'Pretest Completed': user.pretestCompleted ? 'Yes' : 'No',
            'Pretest Score': user.pretestScore || 0,
            'Recommended Module': user.recommendedModule || 'N/A'
        }));

        this.exportToCSV(users, 'codesmart-users');
    }

    /**
     * Export LMS data (assignments, submissions, enrollments)
     */
    static exportLMSData() {
        const data = {
            assignments: Database.assignments,
            submissions: Database.submissions,
            enrollments: Database.enrollments,
            exportDate: new Date().toISOString()
        };

        this.exportToJSON(data, 'codesmart-lms-data');
    }

    /**
     * Export pretest results
     */
    static exportPretestResults() {
        const results = Database.users
            .filter(u => u.pretestCompleted)
            .map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                score: user.pretestScore,
                recommendedModule: user.recommendedModule,
                completedDate: user.pretestCompletedDate || 'N/A'
            }));

        this.exportToJSON({ results, exportDate: new Date().toISOString() }, 'codesmart-pretest-results');
    }

    /**
     * Export pretest results as CSV
     */
    static exportPretestResultsCSV() {
        const results = Database.users
            .filter(u => u.pretestCompleted)
            .map(user => ({
                ID: user.id,
                Name: user.name,
                Email: user.email,
                Score: user.pretestScore,
                'Recommended Module': user.recommendedModule,
                'Completed Date': user.pretestCompletedDate || 'N/A'
            }));

        this.exportToCSV(results, 'codesmart-pretest-results');
    }

    /**
     * Export modules and classes
     */
    static exportModulesClasses() {
        const data = {
            modules: Database.modules.map(m => ({
                ...m,
                classCount: m.classes.length
            })),
            exportDate: new Date().toISOString()
        };

        this.exportToJSON(data, 'codesmart-modules-classes');
    }

    /**
     * Export complete database backup
     */
    static exportCompleteBackup() {
        const backup = {
            users: Database.users,
            modules: Database.modules,
            assignments: Database.assignments,
            submissions: Database.submissions,
            enrollments: Database.enrollments,
            pretestQuestions: Database.pretestQuestions,
            exportDate: new Date().toISOString(),
            version: '2.2.0'
        };

        this.exportToJSON(backup, 'codesmart-complete-backup');
    }

    /**
     * Export assignments with details
     */
    static exportAssignments() {
        const assignments = Database.assignments.map(assignment => {
            const submissions = Database.getSubmissionsByAssignmentId(assignment.id);
            let className = 'Unknown';
            let moduleName = 'Unknown';

            Database.modules.forEach(module => {
                const foundClass = module.classes.find(c => c.id === assignment.classId);
                if (foundClass) {
                    className = foundClass.title;
                    moduleName = module.name;
                }
            });

            return {
                id: assignment.id,
                module: moduleName,
                class: className,
                title: assignment.title,
                description: assignment.description,
                dueDate: assignment.dueDate,
                maxScore: assignment.maxScore,
                totalSubmissions: submissions.length,
                gradedCount: submissions.filter(s => s.score !== null).length,
                createdAt: assignment.createdAt
            };
        });

        this.exportToJSON({ assignments, exportDate: new Date().toISOString() }, 'codesmart-assignments');
    }

    /**
     * Export submissions with details
     */
    static exportSubmissions() {
        const submissions = Database.submissions.map(submission => {
            const user = Database.findUserById(submission.userId);
            const assignment = Database.assignments.find(a => a.id === submission.assignmentId);
            const grader = submission.gradedBy ? Database.findUserById(submission.gradedBy) : null;

            return {
                id: submission.id,
                studentName: user ? user.name : 'Unknown',
                studentEmail: user ? user.email : 'Unknown',
                assignmentTitle: assignment ? assignment.title : 'Unknown',
                fileName: submission.fileName,
                submittedAt: submission.submittedAt,
                score: submission.score,
                feedback: submission.feedback,
                gradedBy: grader ? grader.name : null,
                gradedAt: submission.gradedAt
            };
        });

        this.exportToJSON({ submissions, exportDate: new Date().toISOString() }, 'codesmart-submissions');
    }

    /**
     * Export submissions as CSV
     */
    static exportSubmissionsCSV() {
        const submissions = Database.submissions.map(submission => {
            const user = Database.findUserById(submission.userId);
            const assignment = Database.assignments.find(a => a.id === submission.assignmentId);
            const grader = submission.gradedBy ? Database.findUserById(submission.gradedBy) : null;

            return {
                ID: submission.id,
                'Student Name': user ? user.name : 'Unknown',
                'Student Email': user ? user.email : 'Unknown',
                'Assignment': assignment ? assignment.title : 'Unknown',
                'File Name': submission.fileName,
                'Submitted At': submission.submittedAt,
                Score: submission.score || 'Not graded',
                'Graded By': grader ? grader.name : 'Not graded',
                'Graded At': submission.gradedAt || 'Not graded'
            };
        });

        this.exportToCSV(submissions, 'codesmart-submissions');
    }

    // ==================== IMPORT FUNCTIONS ====================

    /**
     * Import users (merge with existing)
     */
    static importUsers(mergeMode = true) {
        this.importFromJSON((data, error) => {
            if (error) {
                alert('Import failed: ' + error);
                return;
            }

            if (!data.users || !Array.isArray(data.users)) {
                alert('Invalid user data format');
                return;
            }

            if (!confirm(`Import ${data.users.length} users? ${mergeMode ? '(Will merge with existing)' : '(Will replace existing)'}`)) {
                return;
            }

            if (mergeMode) {
                // Merge: Add new users, skip existing usernames
                let added = 0;
                data.users.forEach(importedUser => {
                    const exists = Database.users.find(u => u.username === importedUser.username);
                    if (!exists) {
                        Database.users.push(importedUser);
                        added++;
                    }
                });
                alert(`Import complete! ${added} new users added, ${data.users.length - added} skipped (already exist)`);
            } else {
                // Replace mode
                Database.users = data.users;
                alert(`Import complete! ${data.users.length} users imported`);
            }

            saveToLocalStorage();
            location.reload();
        });
    }

    /**
     * Import LMS data
     */
    static importLMSData(mergeMode = true) {
        this.importFromJSON((data, error) => {
            if (error) {
                alert('Import failed: ' + error);
                return;
            }

            if (!confirm('Import LMS data? This will affect assignments, submissions, and enrollments.')) {
                return;
            }

            if (data.assignments) Database.assignments = data.assignments;
            if (data.submissions) Database.submissions = data.submissions;
            if (data.enrollments) Database.enrollments = data.enrollments;

            saveToLocalStorage();
            alert('LMS data imported successfully!');
            location.reload();
        });
    }

    /**
     * Import complete backup
     */
    static importCompleteBackup() {
        if (!confirm('⚠️ WARNING: This will REPLACE ALL existing data! Are you sure?')) {
            return;
        }

        this.importFromJSON((data, error) => {
            if (error) {
                alert('Import failed: ' + error);
                return;
            }

            // Verify it's a complete backup
            if (!data.users || !data.modules) {
                alert('Invalid backup file: missing required data');
                return;
            }

            if (!confirm('FINAL WARNING: All current data will be lost. Continue?')) {
                return;
            }

            // Restore everything
            Database.users = data.users;
            Database.modules = data.modules;
            Database.assignments = data.assignments || [];
            Database.submissions = data.submissions || [];
            Database.enrollments = data.enrollments || [];
            if (data.pretestQuestions) Database.pretestQuestions = data.pretestQuestions;

            saveToLocalStorage();
            alert('Complete backup restored successfully!');
            location.reload();
        });
    }
}

// Make available globally
window.ExportImport = ExportImport;
