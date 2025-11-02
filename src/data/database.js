// Mock Database for CodeSmart
// In production, this should be replaced with actual backend API calls

const Database = {
    users: [
        {
            id: 1,
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            name: 'Administrator',
            email: 'admin@codesmart.com',
            phone: '',
            photoUrl: '',
            pretestScore: null,
            recommendedModule: null,
            pretestCompleted: false,
            securityQuestion: 'Apa nama hewan peliharaan pertama Anda?',
            securityAnswer: 'rex',
            approved: true, // Admin is auto-approved
            approvedBy: null,
            approvedAt: null
        },
        {
            id: 2,
            username: 'assessor',
            password: 'assessor123',
            role: 'assessor',
            name: 'Assessor User',
            email: 'assessor@codesmart.com',
            phone: '',
            photoUrl: '',
            pretestScore: null,
            recommendedModule: null,
            pretestCompleted: false,
            securityQuestion: 'Apa kota kelahiran Anda?',
            securityAnswer: 'jakarta',
            assignedModules: [1, 2, 3], // Module IDs assessor is responsible for
            assignedClasses: [], // Class IDs assessor manages
            approved: true, // Assessor is auto-approved
            approvedBy: null,
            approvedAt: null
        },
        {
            id: 3,
            username: 'user1',
            password: 'user123',
            role: 'user',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '',
            photoUrl: '',
            pretestScore: null,
            recommendedModule: null,
            pretestCompleted: false,
            securityQuestion: 'Apa makanan favorit Anda?',
            securityAnswer: 'pizza',
            currentModule: null, // Current module user is enrolled in
            unlockedModules: [], // Modules user can access ['fundamental', 'intermediate', 'advance']
            promotionRequests: [], // Array of {moduleId, status: 'pending'|'approved'|'rejected', requestedAt, reviewedBy, reviewedAt}
            approved: true, // Existing users are approved
            approvedBy: 1, // Approved by admin
            approvedAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 4,
            username: 'user2',
            password: 'user123',
            role: 'user',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '',
            photoUrl: '',
            pretestScore: 55,
            recommendedModule: 'intermediate',
            pretestCompleted: true,
            securityQuestion: 'Apa nama sekolah dasar Anda?',
            securityAnswer: 'sdn 1',
            currentModule: 'intermediate',
            unlockedModules: ['fundamental', 'intermediate'],
            promotionRequests: [],
            approved: true, // Existing users are approved
            approvedBy: 1, // Approved by admin
            approvedAt: '2024-01-01T00:00:00.000Z'
        }
    ],

    modules: [
        {
            id: 1,
            name: 'Fundamental JavaScript',
            level: 'fundamental',
            description: 'Pelajari konsep dasar dan cara kerja JavaScript dalam pengembangan web dengan materi yang mudah dipahami.',
            minScore: 0,
            maxScore: 45,
            classes: [
                {
                    id: 1,
                    moduleId: 1,
                    title: 'Pengenalan JavaScript',
                    description: 'Memahami apa itu JavaScript dan perannya dalam web development',
                    content: 'Materi tentang pengenalan JavaScript...',
                    order: 1
                },
                {
                    id: 2,
                    moduleId: 1,
                    title: 'Variabel dan Tipe Data',
                    description: 'Belajar tentang variabel, tipe data, dan cara penggunaannya',
                    content: 'Materi tentang variabel dan tipe data...',
                    order: 2
                },
                {
                    id: 3,
                    moduleId: 1,
                    title: 'Operator dan Ekspresi',
                    description: 'Memahami berbagai operator dalam JavaScript',
                    content: 'Materi tentang operator...',
                    order: 3
                },
                {
                    id: 4,
                    moduleId: 1,
                    title: 'Kontrol Alur Program',
                    description: 'Belajar if-else, switch, dan struktur kontrol lainnya',
                    content: 'Materi tentang kontrol alur...',
                    order: 4
                },
                {
                    id: 5,
                    moduleId: 1,
                    title: 'Fungsi Dasar',
                    description: 'Memahami cara membuat dan menggunakan fungsi',
                    content: 'Materi tentang fungsi dasar...',
                    order: 5
                }
            ]
        },
        {
            id: 2,
            name: 'Intermediate JavaScript',
            level: 'intermediate',
            description: 'Dalami konsep lanjutan dan teknik pemrograman yang lebih kompleks untuk meningkatkan keterampilan coding.',
            minScore: 46,
            maxScore: 65,
            classes: [
                {
                    id: 6,
                    moduleId: 2,
                    title: 'Array dan Object',
                    description: 'Manipulasi array dan object dalam JavaScript',
                    content: 'Materi tentang array dan object...',
                    order: 1
                },
                {
                    id: 7,
                    moduleId: 2,
                    title: 'DOM Manipulation',
                    description: 'Belajar memanipulasi Document Object Model',
                    content: 'Materi tentang DOM...',
                    order: 2
                },
                {
                    id: 8,
                    moduleId: 2,
                    title: 'Event Handling',
                    description: 'Menangani berbagai event dalam JavaScript',
                    content: 'Materi tentang event handling...',
                    order: 3
                },
                {
                    id: 9,
                    moduleId: 2,
                    title: 'Asynchronous JavaScript',
                    description: 'Memahami callback, promises, dan async/await',
                    content: 'Materi tentang async programming...',
                    order: 4
                },
                {
                    id: 10,
                    moduleId: 2,
                    title: 'API dan Fetch',
                    description: 'Belajar mengambil data dari API eksternal',
                    content: 'Materi tentang API dan fetch...',
                    order: 5
                }
            ]
        },
        {
            id: 3,
            name: 'Advance JavaScript',
            level: 'advance',
            description: 'Kuasai teknologi dan metode pengembangan modern untuk membangun aplikasi web yang lebih efisien.',
            minScore: 66,
            maxScore: 100,
            classes: [
                {
                    id: 11,
                    moduleId: 3,
                    title: 'ES6+ Features',
                    description: 'Fitur-fitur modern JavaScript ES6 dan seterusnya',
                    content: 'Materi tentang ES6+...',
                    order: 1
                },
                {
                    id: 12,
                    moduleId: 3,
                    title: 'Design Patterns',
                    description: 'Pola desain dalam pemrograman JavaScript',
                    content: 'Materi tentang design patterns...',
                    order: 2
                },
                {
                    id: 13,
                    moduleId: 3,
                    title: 'Module Systems',
                    description: 'Import/Export dan sistem modular JavaScript',
                    content: 'Materi tentang module systems...',
                    order: 3
                },
                {
                    id: 14,
                    moduleId: 3,
                    title: 'Performance Optimization',
                    description: 'Teknik optimisasi performa aplikasi JavaScript',
                    content: 'Materi tentang optimisasi...',
                    order: 4
                },
                {
                    id: 15,
                    moduleId: 3,
                    title: 'Testing dan Debugging',
                    description: 'Unit testing dan debugging aplikasi JavaScript',
                    content: 'Materi tentang testing...',
                    order: 5
                }
            ]
        }
    ],

    // Assignments (Tugas) - per class
    assignments: [
        {
            id: 1,
            classId: 1,
            title: 'Latihan Variabel JavaScript',
            description: 'Buat 5 contoh variabel dengan tipe data berbeda',
            dueDate: '2025-12-01',
            maxScore: 100,
            fileRequired: true,
            createdBy: 2, // assessor id
            createdAt: '2025-11-01'
        },
        {
            id: 2,
            classId: 2,
            title: 'Tugas Tipe Data',
            description: 'Jelaskan perbedaan tipe data primitif dan object',
            dueDate: '2025-12-05',
            maxScore: 100,
            fileRequired: true,
            createdBy: 2,
            createdAt: '2025-11-01'
        }
    ],

    // Submissions (Pengumpulan Tugas)
    submissions: [
        {
            id: 1,
            assignmentId: 1,
            userId: 3,
            fileName: 'tugas-variabel-john.pdf',
            fileData: null, // Will store base64 or file reference
            submittedAt: '2025-11-25',
            score: 85,
            feedback: 'Bagus! Tapi perlu lebih detail di bagian object',
            gradedBy: 2,
            gradedAt: '2025-11-26'
        },
        {
            id: 2,
            assignmentId: 1,
            userId: 4,
            fileName: 'tugas-variabel-jane.docx',
            fileData: null,
            submittedAt: '2025-11-24',
            score: 95,
            feedback: 'Excellent work!',
            gradedBy: 2,
            gradedAt: '2025-11-25'
        }
    ],

    // Enrollments (Pendaftaran kelas)
    enrollments: [
        {
            id: 1,
            userId: 3,
            moduleId: 1,
            enrolledAt: '2025-11-01',
            completedClasses: [1, 2], // class ids yang sudah selesai
            progress: 40 // percentage
        },
        {
            id: 2,
            userId: 4,
            moduleId: 2,
            enrolledAt: '2025-11-01',
            completedClasses: [6, 7, 8],
            progress: 60
        }
    ],

    pretestQuestions: [
        {
            id: 1,
            question: 'Apa output dari console.log(typeof null)?',
            options: ['null', 'object', 'undefined', 'number'],
            correctAnswer: 1,
            difficulty: 'easy'
        },
        {
            id: 2,
            question: 'Manakah cara yang benar untuk mendeklarasikan variabel di JavaScript?',
            options: ['var name = "John";', 'variable name = "John";', 'v name = "John";', 'dim name = "John";'],
            correctAnswer: 0,
            difficulty: 'easy'
        },
        {
            id: 3,
            question: 'Apa yang dimaksud dengan DOM?',
            options: ['Data Object Model', 'Document Object Model', 'Display Object Management', 'Digital Optical Media'],
            correctAnswer: 1,
            difficulty: 'medium'
        },
        {
            id: 4,
            question: 'Apa perbedaan antara == dan === di JavaScript?',
            options: ['Tidak ada perbedaan', '== membandingkan nilai, === membandingkan nilai dan tipe', '=== hanya untuk angka', '== lebih cepat dari ==='],
            correctAnswer: 1,
            difficulty: 'medium'
        },
        {
            id: 5,
            question: 'Apa output dari: [1, 2, 3].map(x => x * 2)?',
            options: ['[1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', 'Error'],
            correctAnswer: 1,
            difficulty: 'medium'
        },
        {
            id: 6,
            question: 'Apa itu closure dalam JavaScript?',
            options: ['Fungsi yang menutup browser', 'Fungsi yang dapat mengakses variabel dari scope luarnya', 'Cara menutup aplikasi', 'Method untuk menutup file'],
            correctAnswer: 1,
            difficulty: 'hard'
        },
        {
            id: 7,
            question: 'Apa yang dilakukan Promise.all()?',
            options: ['Menjalankan satu promise', 'Menunggu semua promise selesai', 'Membatalkan semua promise', 'Membuat promise baru'],
            correctAnswer: 1,
            difficulty: 'hard'
        },
        {
            id: 8,
            question: 'Apa output dari: console.log(0.1 + 0.2 === 0.3)?',
            options: ['true', 'false', 'undefined', 'Error'],
            correctAnswer: 1,
            difficulty: 'hard'
        },
        {
            id: 9,
            question: 'Apa kegunaan async/await?',
            options: ['Membuat kode sinkron', 'Menangani operasi asynchronous dengan sintaks yang lebih bersih', 'Mempercepat eksekusi kode', 'Menghentikan eksekusi'],
            correctAnswer: 1,
            difficulty: 'hard'
        },
        {
            id: 10,
            question: 'Apa itu event bubbling?',
            options: ['Event yang menghilang', 'Event yang menyebar dari child ke parent element', 'Event yang error', 'Event yang cepat'],
            correctAnswer: 1,
            difficulty: 'hard'
        }
    ],

    // Helper functions
    findUserByUsername(username) {
        return this.users.find(user => user.username === username);
    },

    findUserById(id) {
        return this.users.find(user => user.id === id);
    },

    authenticateUser(username, password) {
        const user = this.findUserByUsername(username);
        if (user && user.password === password) {
            return { ...user, password: undefined }; // Don't return password
        }
        return null;
    },

    updateUser(userId, updates) {
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updates };
            return this.users[index];
        }
        return null;
    },

    addUser(userData) {
        const newUser = {
            id: this.users.length + 1,
            ...userData,
            phone: userData.phone || '',
            photoUrl: userData.photoUrl || '',
            pretestScore: null,
            recommendedModule: null,
            pretestCompleted: false,
            approved: userData.role === 'admin' || userData.role === 'assessor' ? true : false, // Only users need approval
            approvedBy: null,
            approvedAt: null
        };
        this.users.push(newUser);
        return newUser;
    },

    deleteUser(userId) {
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    },

    getModuleByLevel(level) {
        return this.modules.find(module => module.level === level);
    },

    getClassesByModuleId(moduleId) {
        const module = this.modules.find(m => m.id === moduleId);
        return module ? module.classes : [];
    },

    updateClass(classId, updates) {
        for (let module of this.modules) {
            const classIndex = module.classes.findIndex(c => c.id === classId);
            if (classIndex !== -1) {
                module.classes[classIndex] = { ...module.classes[classIndex], ...updates };
                return module.classes[classIndex];
            }
        }
        return null;
    },

    addClass(moduleId, classData) {
        const module = this.modules.find(m => m.id === moduleId);
        if (module) {
            const newClass = {
                id: Date.now(),
                moduleId: moduleId,
                ...classData
            };
            module.classes.push(newClass);
            return newClass;
        }
        return null;
    },

    deleteClass(classId) {
        for (let module of this.modules) {
            const classIndex = module.classes.findIndex(c => c.id === classId);
            if (classIndex !== -1) {
                module.classes.splice(classIndex, 1);
                return true;
            }
        }
        return false;
    },

    // LMS Helper Functions

    // Assignments
    getAssignmentsByClassId(classId) {
        return this.assignments.filter(a => a.classId === classId);
    },

    addAssignment(assignmentData) {
        const newAssignment = {
            id: this.assignments.length + 1,
            createdAt: new Date().toISOString().split('T')[0],
            ...assignmentData
        };
        this.assignments.push(newAssignment);
        return newAssignment;
    },

    updateAssignment(assignmentId, updates) {
        const index = this.assignments.findIndex(a => a.id === assignmentId);
        if (index !== -1) {
            this.assignments[index] = { ...this.assignments[index], ...updates };
            return this.assignments[index];
        }
        return null;
    },

    deleteAssignment(assignmentId) {
        const index = this.assignments.findIndex(a => a.id === assignmentId);
        if (index !== -1) {
            this.assignments.splice(index, 1);
            // Also delete related submissions
            this.submissions = this.submissions.filter(s => s.assignmentId !== assignmentId);
            return true;
        }
        return false;
    },

    // Submissions
    getSubmissionsByAssignmentId(assignmentId) {
        return this.submissions.filter(s => s.assignmentId === assignmentId);
    },

    getSubmissionsByUserId(userId) {
        return this.submissions.filter(s => s.userId === userId);
    },

    getUserSubmission(assignmentId, userId) {
        return this.submissions.find(s => s.assignmentId === assignmentId && s.userId === userId);
    },

    submitAssignment(submissionData) {
        // Check if already submitted
        const existing = this.getUserSubmission(submissionData.assignmentId, submissionData.userId);
        if (existing) {
            // Update existing submission
            const index = this.submissions.findIndex(s => s.id === existing.id);
            this.submissions[index] = {
                ...existing,
                ...submissionData,
                submittedAt: new Date().toISOString().split('T')[0]
            };
            return this.submissions[index];
        } else {
            // Create new submission
            const newSubmission = {
                id: this.submissions.length + 1,
                submittedAt: new Date().toISOString().split('T')[0],
                score: null,
                feedback: null,
                gradedBy: null,
                gradedAt: null,
                ...submissionData
            };
            this.submissions.push(newSubmission);
            return newSubmission;
        }
    },

    gradeSubmission(submissionId, score, feedback, gradedBy) {
        const index = this.submissions.findIndex(s => s.id === submissionId);
        if (index !== -1) {
            this.submissions[index] = {
                ...this.submissions[index],
                score,
                feedback,
                gradedBy,
                gradedAt: new Date().toISOString().split('T')[0]
            };
            return this.submissions[index];
        }
        return null;
    },

    // Enrollments
    getEnrollmentByUserId(userId, moduleId) {
        return this.enrollments.find(e => e.userId === userId && e.moduleId === moduleId);
    },

    enrollUser(userId, moduleId) {
        const existing = this.getEnrollmentByUserId(userId, moduleId);
        if (existing) return existing;

        const newEnrollment = {
            id: this.enrollments.length + 1,
            userId,
            moduleId,
            enrolledAt: new Date().toISOString().split('T')[0],
            completedClasses: [],
            progress: 0
        };
        this.enrollments.push(newEnrollment);
        return newEnrollment;
    },

    markClassComplete(userId, moduleId, classId) {
        const enrollment = this.getEnrollmentByUserId(userId, moduleId);
        if (enrollment && !enrollment.completedClasses.includes(classId)) {
            enrollment.completedClasses.push(classId);
            // Update progress
            const module = this.modules.find(m => m.id === moduleId);
            if (module) {
                enrollment.progress = Math.round((enrollment.completedClasses.length / module.classes.length) * 100);
            }
            return enrollment;
        }
        return null;
    },

    // Get classmates (users in same module)
    getClassmates(userId, moduleId) {
        const user = this.findUserById(userId);
        if (!user) return [];

        return this.enrollments
            .filter(e => e.moduleId === moduleId && e.userId !== userId)
            .map(e => {
                const classmate = this.findUserById(e.userId);
                return {
                    id: classmate.id,
                    name: classmate.name,
                    email: classmate.email,
                    progress: e.progress,
                    enrolledAt: e.enrolledAt
                };
            });
    },

    // Get user progress summary
    getUserProgress(userId) {
        const enrollments = this.enrollments.filter(e => e.userId === userId);
        return enrollments.map(e => {
            const module = this.modules.find(m => m.id === e.moduleId);
            return {
                moduleId: e.moduleId,
                moduleName: module ? module.name : 'Unknown',
                progress: e.progress,
                completedClasses: e.completedClasses.length,
                totalClasses: module ? module.classes.length : 0
            };
        });
    },

    // ==================== PROMOTION SYSTEM ====================

    // Request module promotion
    requestPromotion(userId, moduleId) {
        const user = this.findUserById(userId);
        if (!user) return null;

        // Check if already has pending request for this module
        const existingRequest = user.promotionRequests?.find(
            r => r.moduleId === moduleId && r.status === 'pending'
        );
        if (existingRequest) return null;

        const request = {
            id: (user.promotionRequests?.length || 0) + 1,
            moduleId,
            status: 'pending',
            requestedAt: new Date().toISOString(),
            reviewedBy: null,
            reviewedAt: null
        };

        if (!user.promotionRequests) user.promotionRequests = [];
        user.promotionRequests.push(request);
        return request;
    },

    // Get all pending promotion requests (for assessor)
    getPendingPromotions(assessorId) {
        const assessor = this.findUserById(assessorId);
        if (!assessor || assessor.role !== 'assessor') return [];

        const assignedModules = assessor.assignedModules || [1, 2, 3];

        return this.users
            .filter(u => u.role === 'user' && u.promotionRequests && u.promotionRequests.length > 0)
            .flatMap(user =>
                user.promotionRequests
                    .filter(req => req.status === 'pending' && assignedModules.includes(req.moduleId))
                    .map(req => ({
                        ...req,
                        userId: user.id,
                        userName: user.name,
                        userEmail: user.email,
                        currentModule: user.currentModule,
                        pretestScore: user.pretestScore
                    }))
            );
    },

    // Approve/Reject promotion request
    reviewPromotion(userId, requestId, status, reviewerId) {
        const user = this.findUserById(userId);
        if (!user || !user.promotionRequests) return null;

        const request = user.promotionRequests.find(r => r.id === requestId);
        if (!request) return null;

        request.status = status;
        request.reviewedBy = reviewerId;
        request.reviewedAt = new Date().toISOString();

        // If approved, unlock the module
        if (status === 'approved') {
            const moduleLevel = this.modules.find(m => m.id === request.moduleId)?.level;
            if (moduleLevel && !user.unlockedModules.includes(moduleLevel)) {
                user.unlockedModules.push(moduleLevel);
                user.currentModule = moduleLevel;
            }
        }

        return request;
    },

    // ==================== CLASS MANAGEMENT ====================

    // Get students in a specific class
    getStudentsByClass(classId) {
        // Find which module this class belongs to
        let moduleId = null;
        for (let module of this.modules) {
            if (module.classes.some(c => c.id === classId)) {
                moduleId = module.id;
                break;
            }
        }

        if (!moduleId) return [];

        // Get all users enrolled in this module
        const enrolledUserIds = this.enrollments
            .filter(e => e.moduleId === moduleId)
            .map(e => e.userId);

        return this.users
            .filter(u => u.role === 'user' && enrolledUserIds.includes(u.id))
            .map(user => {
                const enrollment = this.enrollments.find(e => e.userId === user.id && e.moduleId === moduleId);
                const submissions = this.submissions.filter(s => s.userId === user.id);
                const classAssignments = this.assignments.filter(a => a.classId === classId);

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    progress: enrollment?.progress || 0,
                    completedClasses: enrollment?.completedClasses || [],
                    totalAssignments: classAssignments.length,
                    submittedAssignments: submissions.filter(s =>
                        classAssignments.some(a => a.id === s.assignmentId)
                    ).length,
                    avgScore: this.calculateAvgScore(user.id, classId)
                };
            });
    },

    // Get students by module
    getStudentsByModule(moduleId) {
        const enrolledUserIds = this.enrollments
            .filter(e => e.moduleId === moduleId)
            .map(e => e.userId);

        return this.users
            .filter(u => u.role === 'user' && enrolledUserIds.includes(u.id))
            .map(user => {
                const enrollment = this.enrollments.find(e => e.userId === user.id && e.moduleId === moduleId);
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    progress: enrollment?.progress || 0,
                    completedClasses: enrollment?.completedClasses || [],
                    enrolledAt: enrollment?.enrolledAt
                };
            });
    },

    // Calculate average score for user in specific class
    calculateAvgScore(userId, classId) {
        const classAssignments = this.assignments.filter(a => a.classId === classId);
        const userSubmissions = this.submissions.filter(s =>
            s.userId === userId &&
            classAssignments.some(a => a.id === s.assignmentId) &&
            s.score !== null
        );

        if (userSubmissions.length === 0) return 0;

        const total = userSubmissions.reduce((sum, s) => sum + s.score, 0);
        return Math.round(total / userSubmissions.length);
    },

    // Get learning report for a student
    getLearningReport(userId) {
        const user = this.findUserById(userId);
        if (!user) return null;

        const enrollments = this.enrollments.filter(e => e.userId === userId);
        const submissions = this.submissions.filter(s => s.userId === userId);

        const moduleReports = enrollments.map(enrollment => {
            const module = this.modules.find(m => m.id === enrollment.moduleId);
            const moduleAssignments = this.assignments.filter(a =>
                module.classes.some(c => c.id === a.classId)
            );
            const moduleSubmissions = submissions.filter(s =>
                moduleAssignments.some(a => a.id === s.assignmentId)
            );

            const gradedSubmissions = moduleSubmissions.filter(s => s.score !== null);
            const avgScore = gradedSubmissions.length > 0
                ? Math.round(gradedSubmissions.reduce((sum, s) => sum + s.score, 0) / gradedSubmissions.length)
                : 0;

            return {
                moduleId: module.id,
                moduleName: module.name,
                progress: enrollment.progress,
                completedClasses: enrollment.completedClasses.length,
                totalClasses: module.classes.length,
                totalAssignments: moduleAssignments.length,
                submittedAssignments: moduleSubmissions.length,
                gradedAssignments: gradedSubmissions.length,
                avgScore,
                enrolledAt: enrollment.enrolledAt
            };
        });

        return {
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            pretestScore: user.pretestScore,
            recommendedModule: user.recommendedModule,
            currentModule: user.currentModule,
            unlockedModules: user.unlockedModules,
            modules: moduleReports,
            generatedAt: new Date().toISOString()
        };
    },

    // Assign assessor to modules/classes
    assignAssessorToModule(assessorId, moduleId) {
        const assessor = this.findUserById(assessorId);
        if (!assessor || assessor.role !== 'assessor') return false;

        if (!assessor.assignedModules) assessor.assignedModules = [];
        if (!assessor.assignedModules.includes(moduleId)) {
            assessor.assignedModules.push(moduleId);
        }
        return true;
    },

    assignAssessorToClass(assessorId, classId) {
        const assessor = this.findUserById(assessorId);
        if (!assessor || assessor.role !== 'assessor') return false;

        if (!assessor.assignedClasses) assessor.assignedClasses = [];
        if (!assessor.assignedClasses.includes(classId)) {
            assessor.assignedClasses.push(classId);
        }
        return true;
    },

    // User Approval System
    getPendingUsers() {
        return this.users.filter(user => !user.approved && user.role !== 'admin');
    },

    approveUser(userId, adminId) {
        const user = this.findUserById(userId);
        if (!user) return { success: false, message: 'User tidak ditemukan' };

        if (user.approved) {
            return { success: false, message: 'User sudah disetujui' };
        }

        user.approved = true;
        user.approvedBy = adminId;
        user.approvedAt = new Date().toISOString();

        return { success: true, message: 'User berhasil disetujui' };
    },

    rejectUser(userId, adminId) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return { success: false, message: 'User tidak ditemukan' };
        }

        const user = this.users[userIndex];
        if (user.approved) {
            return { success: false, message: 'User sudah disetujui, tidak dapat ditolak' };
        }

        // Remove user from database (rejection = deletion)
        this.users.splice(userIndex, 1);

        return { success: true, message: 'Pendaftaran user ditolak dan dihapus' };
    }
};

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('codesmart_users', JSON.stringify(Database.users));
    localStorage.setItem('codesmart_modules', JSON.stringify(Database.modules));
    localStorage.setItem('codesmart_assignments', JSON.stringify(Database.assignments));
    localStorage.setItem('codesmart_submissions', JSON.stringify(Database.submissions));
    localStorage.setItem('codesmart_enrollments', JSON.stringify(Database.enrollments));
}

// Load from localStorage
function loadFromLocalStorage() {
    const savedUsers = localStorage.getItem('codesmart_users');
    const savedModules = localStorage.getItem('codesmart_modules');
    const savedAssignments = localStorage.getItem('codesmart_assignments');
    const savedSubmissions = localStorage.getItem('codesmart_submissions');
    const savedEnrollments = localStorage.getItem('codesmart_enrollments');

    if (savedUsers) {
        Database.users = JSON.parse(savedUsers);
    }
    if (savedModules) {
        Database.modules = JSON.parse(savedModules);
    }
    if (savedAssignments) {
        Database.assignments = JSON.parse(savedAssignments);
    }
    if (savedSubmissions) {
        Database.submissions = JSON.parse(savedSubmissions);
    }
    if (savedEnrollments) {
        Database.enrollments = JSON.parse(savedEnrollments);
    }
}

// Initialize
loadFromLocalStorage();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Database;
}
