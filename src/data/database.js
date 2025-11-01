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
            pretestScore: null,
            recommendedModule: null,
            pretestCompleted: false
        },
        {
            id: 2,
            username: 'assessor',
            password: 'assessor123',
            role: 'assessor',
            name: 'Assessor User',
            email: 'assessor@codesmart.com',
            pretestScore: null,
            recommendedModule: null,
            pretestCompleted: false
        },
        {
            id: 3,
            username: 'user1',
            password: 'user123',
            role: 'user',
            name: 'John Doe',
            email: 'john@example.com',
            pretestScore: null,
            recommendedModule: null,
            pretestCompleted: false
        },
        {
            id: 4,
            username: 'user2',
            password: 'user123',
            role: 'user',
            name: 'Jane Smith',
            email: 'jane@example.com',
            pretestScore: 55,
            recommendedModule: 'intermediate',
            pretestCompleted: true
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
            pretestScore: null,
            recommendedModule: null,
            pretestCompleted: false
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
    }
};

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('codesmart_users', JSON.stringify(Database.users));
    localStorage.setItem('codesmart_modules', JSON.stringify(Database.modules));
}

// Load from localStorage
function loadFromLocalStorage() {
    const savedUsers = localStorage.getItem('codesmart_users');
    const savedModules = localStorage.getItem('codesmart_modules');

    if (savedUsers) {
        Database.users = JSON.parse(savedUsers);
    }
    if (savedModules) {
        Database.modules = JSON.parse(savedModules);
    }
}

// Initialize
loadFromLocalStorage();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Database;
}
