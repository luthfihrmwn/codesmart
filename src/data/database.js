// Mock Database for CodeSmart
// In production, this should be replaced with actual backend API calls

// ==================== INTEGRATION WITH LEARNING MATERIALS ====================
// Full learning materials are stored in /src/data/learning-materials.js
// To get material content for display in LMS:
//   const content = LearningMaterials.getContent(classId);
//   document.getElementById('material-content').innerHTML = content;
//
// The learning-materials.js contains comprehensive content for all 15 classes:
//   - Fundamental JavaScript (Class 1-5)
//   - Intermediate JavaScript (Class 6-10)
//   - Advance JavaScript (Class 11-15)
// ==============================================================================

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
                    content: 'Use LearningMaterials.getContent(1) to get full content',
                    order: 1
                },
                {
                    id: 2,
                    moduleId: 1,
                    title: 'Variabel dan Tipe Data',
                    description: 'Belajar tentang variabel, tipe data, dan cara penggunaannya',
                    content: 'Use LearningMaterials.getContent(2) to get full content',
                    order: 2
                },
                {
                    id: 3,
                    moduleId: 1,
                    title: 'Operator dan Ekspresi',
                    description: 'Memahami berbagai operator dalam JavaScript',
                    content: 'Use LearningMaterials.getContent(3) to get full content',
                    order: 3
                },
                {
                    id: 4,
                    moduleId: 1,
                    title: 'Kontrol Alur Program',
                    description: 'Belajar if-else, switch, dan struktur kontrol lainnya',
                    content: 'Use LearningMaterials.getContent(4) to get full content',
                    order: 4
                },
                {
                    id: 5,
                    moduleId: 1,
                    title: 'Fungsi Dasar',
                    description: 'Memahami cara membuat dan menggunakan fungsi',
                    content: 'Use LearningMaterials.getContent(5) to get full content',
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
                    content: 'Use LearningMaterials.getContent(6) to get full content',
                    order: 1
                },
                {
                    id: 7,
                    moduleId: 2,
                    title: 'DOM Manipulation',
                    description: 'Belajar memanipulasi Document Object Model',
                    content: 'Use LearningMaterials.getContent(7) to get full content',
                    order: 2
                },
                {
                    id: 8,
                    moduleId: 2,
                    title: 'Event Handling',
                    description: 'Menangani berbagai event dalam JavaScript',
                    content: 'Use LearningMaterials.getContent(8) to get full content',
                    order: 3
                },
                {
                    id: 9,
                    moduleId: 2,
                    title: 'Asynchronous JavaScript',
                    description: 'Memahami callback, promises, dan async/await',
                    content: 'Use LearningMaterials.getContent(9) to get full content',
                    order: 4
                },
                {
                    id: 10,
                    moduleId: 2,
                    title: 'API dan Fetch',
                    description: 'Belajar mengambil data dari API eksternal',
                    content: 'Use LearningMaterials.getContent(10) to get full content',
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
                    content: 'Use LearningMaterials.getContent(11) to get full content',
                    order: 1
                },
                {
                    id: 12,
                    moduleId: 3,
                    title: 'Design Patterns',
                    description: 'Pola desain dalam pemrograman JavaScript',
                    content: 'Use LearningMaterials.getContent(12) to get full content',
                    order: 2
                },
                {
                    id: 13,
                    moduleId: 3,
                    title: 'Module Systems',
                    description: 'Import/Export dan sistem modular JavaScript',
                    content: 'Use LearningMaterials.getContent(13) to get full content',
                    order: 3
                },
                {
                    id: 14,
                    moduleId: 3,
                    title: 'Performance Optimization',
                    description: 'Teknik optimisasi performa aplikasi JavaScript',
                    content: 'Use LearningMaterials.getContent(14) to get full content',
                    order: 4
                },
                {
                    id: 15,
                    moduleId: 3,
                    title: 'Testing dan Debugging',
                    description: 'Unit testing dan debugging aplikasi JavaScript',
                    content: 'Use LearningMaterials.getContent(15) to get full content',
                    order: 5
                }
            ]
        }
    ],

    // Assignments (Tugas) - per class
    assignments: [
        // ========== FUNDAMENTAL JAVASCRIPT (Class 1-5) ==========

        // Class 1: Pengenalan JavaScript
        {
            id: 1,
            classId: 1,
            moduleId: 1,
            title: 'Membuat Hello World & Console Log',
            description: `Buat program JavaScript sederhana untuk menampilkan pesan di console.

**Instruksi:**
1. Buat file HTML dengan nama "hello-world.html"
2. Tambahkan script JavaScript yang menampilkan:
   - Pesan "Hello, World!"
   - Nama Anda
   - Tanggal hari ini
3. Gunakan console.log() untuk semua output
4. Buka file di browser dan screenshot hasil console
5. Upload file HTML dan screenshot

**Contoh Output:**
Hello, World!
Nama: John Doe
Tanggal: 2 November 2025`,
            requirements: [
                'File HTML dengan struktur lengkap (<!DOCTYPE>, <html>, <head>, <body>)',
                'Script JavaScript di dalam tag <script>',
                'Menggunakan console.log() minimal 3 kali',
                'Screenshot hasil console yang menampilkan semua output',
                'Kode terorganisir dan diberi komentar'
            ],
            dueDate: '2025-12-15',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Functionality': 40,
                'Code Quality': 30,
                'Documentation': 20,
                'Best Practices': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 2,
            classId: 1,
            moduleId: 1,
            title: 'Dokumentasi Tools JavaScript',
            description: `Buat dokumentasi singkat tentang tools yang digunakan dalam JavaScript development.

**Instruksi:**
1. Buat dokumen (PDF/Word/HTML) yang menjelaskan:
   - Browser Developer Tools (Console, Elements, Network)
   - Text Editor/IDE yang Anda gunakan
   - Node.js (opsional)
2. Sertakan screenshot untuk setiap tool
3. Jelaskan fungsi masing-masing tool
4. Berikan contoh penggunaan sederhana

**Minimal 3 halaman, maksimal 5 halaman.**`,
            requirements: [
                'Dokumentasi minimal 3 halaman dengan format rapi',
                'Screenshot untuk setiap tool yang dijelaskan',
                'Penjelasan fungsi yang jelas dan mudah dipahami',
                'Contoh penggunaan untuk minimal 2 tools',
                'Daftar pustaka/referensi jika menggunakan sumber external'
            ],
            dueDate: '2025-12-15',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Completeness': 40,
                'Clarity': 30,
                'Visual Documentation': 20,
                'Presentation': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 2: Variabel dan Tipe Data
        {
            id: 3,
            classId: 2,
            moduleId: 1,
            title: 'Deklarasi Variabel dengan var, let, const',
            description: `Praktikkan penggunaan var, let, dan const dalam berbagai skenario.

**Instruksi:**
1. Buat file JavaScript "variabel.js"
2. Buat contoh penggunaan:
   - var (3 contoh)
   - let (3 contoh)
   - const (3 contoh)
3. Demonstrasikan perbedaan scope (global, function, block)
4. Tunjukkan error saat mencoba reassign const
5. Tambahkan komentar menjelaskan setiap contoh

**Output harus ditampilkan dengan console.log()**`,
            requirements: [
                'File JavaScript dengan minimal 9 contoh variabel',
                'Demonstrasi perbedaan var, let, dan const',
                'Contoh scope yang berbeda (minimal 3 jenis)',
                'Error handling untuk const reassignment',
                'Komentar yang jelas untuk setiap bagian kode'
            ],
            dueDate: '2025-12-18',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Functionality': 40,
                'Understanding of Scope': 30,
                'Code Quality': 20,
                'Documentation': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 4,
            classId: 2,
            moduleId: 1,
            title: 'Konversi Tipe Data',
            description: `Buat program yang mendemonstrasikan berbagai cara konversi tipe data.

**Instruksi:**
1. Buat file "konversi.html" dengan script JavaScript
2. Implementasikan konversi:
   - String ke Number (3 cara berbeda)
   - Number ke String (2 cara)
   - Boolean conversion (3 contoh)
   - Implicit vs Explicit conversion
3. Tampilkan hasil dengan console.log()
4. Tambahkan tabel perbandingan di HTML

**Sertakan penjelasan untuk setiap metode konversi.**`,
            requirements: [
                'File HTML dengan script JavaScript embedded',
                'Minimal 8 contoh konversi tipe data',
                'Demonstrasi implicit dan explicit conversion',
                'Tabel perbandingan metode konversi di HTML',
                'Penjelasan untuk setiap metode yang digunakan'
            ],
            dueDate: '2025-12-18',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Completeness': 35,
                'Accuracy': 35,
                'Presentation': 20,
                'Documentation': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 3: Operator dan Ekspresi
        {
            id: 5,
            classId: 3,
            moduleId: 1,
            title: 'Kalkulator Sederhana',
            description: `Buat kalkulator sederhana dengan operasi matematika dasar.

**Instruksi:**
1. Buat file "kalkulator.html"
2. Implementasikan operasi:
   - Penjumlahan
   - Pengurangan
   - Perkalian
   - Pembagian
   - Modulus
3. Gunakan prompt() untuk input dari user
4. Tampilkan hasil dengan alert() dan console.log()
5. Tambahkan validasi input (harus angka)

**Bonus: Tambahkan operasi pangkat dan akar kuadrat.**`,
            requirements: [
                'Interface HTML dengan minimal 5 operasi matematika',
                'Input validation untuk memastikan angka valid',
                'Output ditampilkan dengan alert() dan console',
                'Error handling untuk pembagian dengan 0',
                'Kode yang clean dan terstruktur'
            ],
            dueDate: '2025-12-20',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Functionality': 40,
                'Input Validation': 25,
                'Error Handling': 20,
                'Code Quality': 15
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 6,
            classId: 3,
            moduleId: 1,
            title: 'Operator Logika dan Perbandingan',
            description: `Buat program yang mendemonstrasikan penggunaan operator logika dan perbandingan.

**Instruksi:**
1. Buat file "operator-logika.js"
2. Implementasikan contoh:
   - Operator perbandingan (==, ===, !=, !==, <, >, <=, >=)
   - Operator logika (&&, ||, !)
   - Short-circuit evaluation
   - Truthy dan Falsy values
3. Buat minimal 10 contoh praktis
4. Tampilkan hasil dengan console.table()

**Sertakan penjelasan untuk setiap contoh.**`,
            requirements: [
                'Minimal 10 contoh operator yang berbeda',
                'Demonstrasi short-circuit evaluation',
                'Penjelasan truthy dan falsy values',
                'Menggunakan console.table() untuk menampilkan hasil',
                'Komentar yang jelas untuk setiap operator'
            ],
            dueDate: '2025-12-20',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Completeness': 40,
                'Understanding': 30,
                'Presentation': 20,
                'Documentation': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 4: Kontrol Alur Program
        {
            id: 7,
            classId: 4,
            moduleId: 1,
            title: 'Program FizzBuzz',
            description: `Implementasikan classic FizzBuzz problem dengan variasi.

**Instruksi:**
1. Buat file "fizzbuzz.html"
2. Implementasikan FizzBuzz untuk angka 1-100:
   - Print "Fizz" jika angka habis dibagi 3
   - Print "Buzz" jika angka habis dibagi 5
   - Print "FizzBuzz" jika habis dibagi 3 dan 5
   - Print angka jika tidak memenuhi kondisi di atas
3. Tampilkan hasil di HTML dengan styling
4. Tambahkan input untuk custom range

**Bonus: Tambahkan animasi atau warna berbeda untuk setiap kondisi.**`,
            requirements: [
                'Implementasi FizzBuzz yang benar untuk 1-100',
                'Output ditampilkan di HTML dengan styling',
                'Input untuk custom range (start dan end)',
                'Logika yang efisien dan mudah dibaca',
                'Minimal ada styling CSS untuk visual yang menarik'
            ],
            dueDate: '2025-12-22',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Correctness': 40,
                'Code Logic': 30,
                'User Interface': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 8,
            classId: 4,
            moduleId: 1,
            title: 'Validasi Form dengan If-Else',
            description: `Buat form registrasi dengan validasi lengkap menggunakan if-else.

**Instruksi:**
1. Buat file "form-validation.html"
2. Buat form dengan field:
   - Username (minimal 5 karakter)
   - Email (format valid)
   - Password (minimal 8 karakter, harus ada angka)
   - Confirm Password (harus sama dengan password)
   - Age (minimal 17 tahun)
3. Validasi setiap field dengan if-else
4. Tampilkan error message spesifik untuk setiap error
5. Jika valid, tampilkan success message

**Gunakan CSS untuk styling error dan success states.**`,
            requirements: [
                'Form HTML dengan minimal 5 field input',
                'Validasi lengkap untuk setiap field',
                'Error messages yang spesifik dan jelas',
                'Success message jika semua validasi lolos',
                'Styling CSS untuk error dan success states'
            ],
            dueDate: '2025-12-22',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Validation Logic': 40,
                'User Experience': 25,
                'Error Handling': 20,
                'Code Quality': 15
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 5: Fungsi Dasar
        {
            id: 9,
            classId: 5,
            moduleId: 1,
            title: 'Fungsi Matematika (Faktorial, Fibonacci)',
            description: `Implementasikan fungsi matematika klasik.

**Instruksi:**
1. Buat file "math-functions.html"
2. Implementasikan fungsi:
   - Faktorial (iterative dan recursive)
   - Fibonacci (iterative dan recursive)
   - isPrime (cek bilangan prima)
   - sumArray (jumlahkan semua element array)
3. Buat UI untuk test setiap fungsi
4. Tampilkan hasil dan execution time

**Bonus: Bandingkan performa iterative vs recursive.**`,
            requirements: [
                'Minimal 4 fungsi matematika yang bekerja dengan benar',
                'Implementasi iterative dan recursive untuk faktorial dan fibonacci',
                'UI untuk testing setiap fungsi',
                'Display hasil dan execution time',
                'Kode yang clean dengan proper naming'
            ],
            dueDate: '2025-12-25',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Correctness': 40,
                'Algorithm Efficiency': 30,
                'User Interface': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 10,
            classId: 5,
            moduleId: 1,
            title: 'Arrow Function dan Callback',
            description: `Demonstrasikan penggunaan arrow function dan callback.

**Instruksi:**
1. Buat file "arrow-callback.js"
2. Buat contoh arrow function:
   - Dengan 0, 1, dan multiple parameters
   - Dengan dan tanpa return statement
   - Sebagai callback function
3. Implementasikan custom array methods menggunakan callback:
   - customMap
   - customFilter
   - customForEach
4. Bandingkan dengan built-in array methods

**Sertakan penjelasan perbedaan arrow function dengan function biasa.**`,
            requirements: [
                'Minimal 5 contoh arrow function yang berbeda',
                'Implementasi 3 custom array methods dengan callback',
                'Perbandingan dengan built-in methods',
                'Penjelasan perbedaan arrow function vs regular function',
                'Test cases untuk setiap custom method'
            ],
            dueDate: '2025-12-25',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Implementation': 40,
                'Understanding': 30,
                'Testing': 20,
                'Documentation': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // ========== INTERMEDIATE JAVASCRIPT (Class 6-10) ==========

        // Class 6: Array dan Object
        {
            id: 11,
            classId: 6,
            moduleId: 2,
            title: 'Manipulasi Array dengan Map, Filter, Reduce',
            description: `Praktikkan penggunaan array methods modern.

**Instruksi:**
1. Buat file "array-methods.html"
2. Buat array data products dengan minimal 10 items (id, name, price, category)
3. Implementasikan:
   - Map: Tambahkan discount 10% ke semua harga
   - Filter: Tampilkan produk dengan harga > 100000
   - Reduce: Hitung total harga semua produk
   - Chaining methods: Filter products by category, map to get names
4. Tampilkan hasil di HTML dengan tabel
5. Tambahkan search dan filter UI

**Sertakan minimal 5 operasi berbeda.**`,
            requirements: [
                'Array data dengan minimal 10 products',
                'Implementasi map, filter, dan reduce',
                'Method chaining minimal 1 contoh',
                'UI dengan tabel dan filter functionality',
                'Minimal 5 operasi array yang berbeda'
            ],
            dueDate: '2025-12-28',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Functionality': 40,
                'Code Logic': 25,
                'User Interface': 20,
                'Code Quality': 15
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 12,
            classId: 6,
            moduleId: 2,
            title: 'CRUD Object dan Destructuring',
            description: `Buat aplikasi manajemen data sederhana dengan CRUD operations.

**Instruksi:**
1. Buat file "crud-object.html"
2. Implementasikan CRUD untuk data mahasiswa:
   - Create: Tambah mahasiswa baru
   - Read: Tampilkan semua mahasiswa
   - Update: Edit data mahasiswa
   - Delete: Hapus mahasiswa
3. Gunakan object destructuring saat menampilkan data
4. Gunakan spread operator untuk update data
5. Tampilkan dalam tabel dengan action buttons

**Bonus: Tambahkan localStorage untuk persist data.**`,
            requirements: [
                'CRUD operations yang lengkap (Create, Read, Update, Delete)',
                'Penggunaan object destructuring minimal 3 kali',
                'Penggunaan spread operator untuk update',
                'UI dengan tabel dan action buttons',
                'Data validation untuk setiap operation'
            ],
            dueDate: '2025-12-28',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'CRUD Functionality': 45,
                'Use of ES6 Features': 25,
                'User Interface': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 7: DOM Manipulation
        {
            id: 13,
            classId: 7,
            moduleId: 2,
            title: 'Todo List dengan DOM',
            description: `Buat aplikasi Todo List lengkap dengan DOM manipulation.

**Instruksi:**
1. Buat file "todo-list.html"
2. Fitur yang harus ada:
   - Tambah todo baru
   - Mark todo as complete (dengan strikethrough)
   - Edit todo
   - Delete todo
   - Filter: All, Active, Completed
   - Counter untuk active todos
3. Gunakan DOM methods (createElement, appendChild, etc)
4. Styling dengan CSS yang menarik

**Bonus: Tambahkan due date dan priority untuk setiap todo.**`,
            requirements: [
                'Semua fitur CRUD untuk todos',
                'Filter functionality (All, Active, Completed)',
                'Counter untuk active todos',
                'DOM manipulation tanpa innerHTML untuk create elements',
                'Styling CSS yang clean dan modern'
            ],
            dueDate: '2026-01-02',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Functionality': 40,
                'DOM Manipulation': 30,
                'User Interface': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 14,
            classId: 7,
            moduleId: 2,
            title: 'Form Validation Real-time',
            description: `Buat form dengan real-time validation menggunakan DOM events.

**Instruksi:**
1. Buat file "realtime-validation.html"
2. Buat form registrasi dengan field:
   - Full Name
   - Email
   - Phone Number
   - Password
   - Confirm Password
3. Implementasikan real-time validation:
   - Validasi saat user mengetik (input event)
   - Visual indicator (icon/color) untuk valid/invalid
   - Error message muncul di bawah field
4. Disable submit button jika ada field yang invalid

**Gunakan classList, setAttribute, dan textContent untuk manipulation.**`,
            requirements: [
                'Real-time validation untuk semua fields',
                'Visual feedback yang jelas (color, icon)',
                'Error messages yang descriptive',
                'Submit button state management',
                'Clean DOM manipulation code'
            ],
            dueDate: '2026-01-02',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Validation Logic': 40,
                'Real-time Feedback': 25,
                'User Experience': 20,
                'Code Quality': 15
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 8: Event Handling
        {
            id: 15,
            classId: 8,
            moduleId: 2,
            title: 'Event Delegation',
            description: `Demonstrasikan penggunaan event delegation dalam aplikasi praktis.

**Instruksi:**
1. Buat file "event-delegation.html"
2. Buat aplikasi dengan dynamic list of items
3. Implementasikan:
   - Add new item button
   - Delete button untuk setiap item (dengan event delegation)
   - Edit button (inline editing)
   - Like/Unlike button
4. Semua event harus menggunakan delegation pattern
5. Log setiap action ke console

**Jelaskan mengapa event delegation lebih efisien.**`,
            requirements: [
                'Dynamic list dengan add/remove items',
                'Event delegation untuk semua child element interactions',
                'Minimal 3 jenis action (delete, edit, like)',
                'Console logging untuk setiap event',
                'Penjelasan tentang keuntungan event delegation'
            ],
            dueDate: '2026-01-05',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Event Delegation Implementation': 45,
                'Functionality': 25,
                'Understanding': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 16,
            classId: 8,
            moduleId: 2,
            title: 'Image Gallery dengan Modal',
            description: `Buat image gallery dengan lightbox/modal viewer.

**Instruksi:**
1. Buat file "image-gallery.html"
2. Buat grid gallery dengan minimal 9 gambar
3. Implementasikan modal viewer yang muncul saat image diklik
4. Fitur modal:
   - Show selected image dalam ukuran besar
   - Previous/Next navigation
   - Close button (dan ESC key)
   - Click outside modal to close
5. Tambahkan smooth transitions

**Bonus: Tambahkan zoom in/out functionality.**`,
            requirements: [
                'Grid gallery dengan minimal 9 images',
                'Modal viewer yang functional',
                'Navigation (previous, next)',
                'Multiple ways to close modal (button, ESC, outside click)',
                'Smooth transitions dan animations'
            ],
            dueDate: '2026-01-05',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Functionality': 40,
                'Event Handling': 30,
                'User Experience': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 9: Asynchronous JavaScript
        {
            id: 17,
            classId: 9,
            moduleId: 2,
            title: 'Promise Chain',
            description: `Praktikkan penggunaan Promise chaining untuk operasi sequential.

**Instruksi:**
1. Buat file "promise-chain.html"
2. Simulasikan proses order yang sequential:
   - checkStock() - cek ketersediaan barang (delay 1s)
   - processPayment() - proses pembayaran (delay 2s)
   - shipOrder() - kirim pesanan (delay 1.5s)
   - sendNotification() - kirim notifikasi (delay 0.5s)
3. Gunakan Promise chaining (.then)
4. Tampilkan progress di UI untuk setiap step
5. Handle error dengan .catch

**Tampilkan loading indicator untuk setiap step.**`,
            requirements: [
                'Minimal 4 Promise functions yang chained',
                'Progress indicator di UI untuk setiap step',
                'Proper error handling dengan .catch',
                'Loading states dan success/error messages',
                'Kode yang clean dan well-structured'
            ],
            dueDate: '2026-01-08',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Promise Implementation': 40,
                'Error Handling': 25,
                'User Interface': 20,
                'Code Quality': 15
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 18,
            classId: 9,
            moduleId: 2,
            title: 'Async/Await untuk API',
            description: `Refactor Promise chain menjadi async/await syntax.

**Instruksi:**
1. Buat file "async-await.html"
2. Ambil assignment sebelumnya (Promise Chain) dan refactor ke async/await
3. Tambahkan try-catch untuk error handling
4. Buat juga contoh:
   - Multiple parallel requests dengan Promise.all
   - Error handling yang comprehensive
   - Loading states
5. Bandingkan readability Promise vs async/await

**Jelaskan kapan menggunakan Promise.all vs sequential await.**`,
            requirements: [
                'Refactor lengkap dari Promise chain ke async/await',
                'Try-catch error handling',
                'Contoh Promise.all untuk parallel requests',
                'Perbandingan Promise vs async/await',
                'Penjelasan use cases untuk Promise.all'
            ],
            dueDate: '2026-01-08',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Async/Await Implementation': 40,
                'Error Handling': 25,
                'Understanding': 20,
                'Code Quality': 15
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 10: API dan Fetch
        {
            id: 19,
            classId: 10,
            moduleId: 2,
            title: 'Fetch API - CRUD Operations',
            description: `Buat aplikasi yang melakukan CRUD operations menggunakan public API.

**Instruksi:**
1. Buat file "fetch-crud.html"
2. Gunakan JSONPlaceholder API (https://jsonplaceholder.typicode.com/)
3. Implementasikan:
   - GET: Tampilkan list posts
   - POST: Tambah post baru
   - PUT: Update post
   - DELETE: Hapus post
4. Tampilkan loading state untuk setiap request
5. Handle errors (network error, 404, etc)

**Bonus: Tambahkan filter dan search functionality.**`,
            requirements: [
                'Implementasi semua HTTP methods (GET, POST, PUT, DELETE)',
                'Proper fetch syntax dengan async/await',
                'Loading indicators untuk setiap request',
                'Comprehensive error handling',
                'Clean UI untuk display dan interact dengan data'
            ],
            dueDate: '2026-01-10',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'CRUD Implementation': 40,
                'Error Handling': 25,
                'User Interface': 20,
                'Code Quality': 15
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 20,
            classId: 10,
            moduleId: 2,
            title: 'Weather App dengan Public API',
            description: `Buat weather app menggunakan OpenWeatherMap API atau API serupa.

**Instruksi:**
1. Buat file "weather-app.html"
2. Fitur yang harus ada:
   - Search city by name
   - Display current weather
   - Display 5-day forecast
   - Show weather icon
   - Display temperature, humidity, wind speed
3. Gunakan async/await untuk fetch data
4. Handle API errors dan invalid city names
5. Styling yang menarik dengan responsive design

**API: OpenWeatherMap (gratis) atau WeatherAPI.com**`,
            requirements: [
                'Integration dengan real weather API',
                'Search functionality untuk city',
                'Display current weather dan forecast',
                'Error handling untuk invalid inputs',
                'Responsive design dengan styling menarik'
            ],
            dueDate: '2026-01-10',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'API Integration': 40,
                'Functionality': 25,
                'User Interface': 20,
                'Code Quality': 15
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // ========== ADVANCE JAVASCRIPT (Class 11-15) ==========

        // Class 11: ES6+ Features
        {
            id: 21,
            classId: 11,
            moduleId: 3,
            title: 'Refactor ke ES6+ Syntax',
            description: `Refactor old JavaScript code menjadi modern ES6+ syntax.

**Instruksi:**
1. Buat file "es6-refactor.html"
2. Saya akan berikan sample legacy code (ES5)
3. Refactor menggunakan ES6+ features:
   - let/const instead of var
   - Arrow functions
   - Template literals
   - Destructuring
   - Spread/Rest operators
   - Default parameters
4. Buat comparison side-by-side (before/after)
5. Jelaskan improvement untuk setiap refactor

**Legacy code akan diberikan dalam assignment file.**`,
            requirements: [
                'Refactor lengkap dari ES5 ke ES6+',
                'Minimal menggunakan 6 ES6+ features berbeda',
                'Side-by-side comparison',
                'Penjelasan untuk setiap improvement',
                'Code yang lebih clean dan readable'
            ],
            dueDate: '2026-01-12',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Refactoring Quality': 40,
                'ES6+ Features Usage': 30,
                'Understanding': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 22,
            classId: 11,
            moduleId: 3,
            title: 'Class-based Component',
            description: `Buat reusable component menggunakan ES6 Classes.

**Instruksi:**
1. Buat file "class-component.html"
2. Buat minimal 3 class components:
   - Modal component (show, hide, setContent)
   - Notification component (success, error, warning)
   - Accordion component (expand, collapse)
3. Gunakan inheritance jika memungkinkan
4. Tambahkan private fields (#privateField)
5. Buat demo page yang menggunakan semua components

**Bonus: Tambahkan static methods.**`,
            requirements: [
                'Minimal 3 class components yang functional',
                'Proper use of constructor, methods, dan properties',
                'Contoh inheritance minimal 1 kali',
                'Demo page yang menunjukkan semua components',
                'Clean OOP principles'
            ],
            dueDate: '2026-01-12',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'OOP Implementation': 40,
                'Component Functionality': 30,
                'Code Organization': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 12: Design Patterns
        {
            id: 23,
            classId: 12,
            moduleId: 3,
            title: 'Implement Observer Pattern',
            description: `Implementasikan Observer Pattern untuk event system.

**Instruksi:**
1. Buat file "observer-pattern.html"
2. Buat Observer Pattern untuk notification system:
   - Subject class (Observable)
   - Observer class
   - Methods: subscribe, unsubscribe, notify
3. Buat demo dengan minimal 3 observers
4. Implementasikan practical use case (e.g., stock price updates)
5. Jelaskan kegunaan pattern ini

**Contoh: Multiple UI components subscribe ke data changes.**`,
            requirements: [
                'Complete Observer Pattern implementation',
                'Subject dan Observer classes yang proper',
                'Subscribe/unsubscribe functionality',
                'Practical use case demo dengan 3+ observers',
                'Dokumentasi tentang kegunaan pattern'
            ],
            dueDate: '2026-01-15',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Pattern Implementation': 45,
                'Functionality': 25,
                'Understanding': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 24,
            classId: 12,
            moduleId: 3,
            title: 'Module Pattern untuk Calculator',
            description: `Buat calculator menggunakan Module Pattern dan Revealing Module Pattern.

**Instruksi:**
1. Buat file "module-pattern.html"
2. Implementasikan calculator dengan Module Pattern:
   - Private variables dan functions
   - Public API methods
   - Encapsulation yang proper
3. Buat 2 versi:
   - Module Pattern (IIFE)
   - Revealing Module Pattern
4. Bandingkan kedua approaches
5. Buat UI untuk test calculator

**Jelaskan keuntungan encapsulation.**`,
            requirements: [
                'Module Pattern implementation yang benar',
                'Revealing Module Pattern sebagai alternatif',
                'Private dan public members yang jelas',
                'Perbandingan kedua patterns',
                'Functional calculator UI'
            ],
            dueDate: '2026-01-15',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Pattern Implementation': 40,
                'Encapsulation': 30,
                'Understanding': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 13: Module Systems
        {
            id: 25,
            classId: 13,
            moduleId: 3,
            title: 'Modular Application',
            description: `Buat aplikasi modular dengan multiple JavaScript modules.

**Instruksi:**
1. Buat project folder dengan struktur:
   - index.html
   - modules/
     - auth.js (authentication)
     - api.js (API calls)
     - ui.js (UI helpers)
     - utils.js (utility functions)
   - app.js (main application)
2. Gunakan ES6 modules (import/export)
3. Buat simple app (e.g., task manager) yang menggunakan semua modules
4. Demonstrasikan named exports dan default exports

**Bonus: Setup dengan bundler (Vite/Parcel) optional.**`,
            requirements: [
                'Modular structure dengan minimal 4 modules',
                'Proper import/export syntax',
                'Clear separation of concerns',
                'Working application yang integrate semua modules',
                'README dengan penjelasan struktur'
            ],
            dueDate: '2026-01-18',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Module Organization': 40,
                'Import/Export Usage': 30,
                'Application Functionality': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 26,
            classId: 13,
            moduleId: 3,
            title: 'Import/Export System',
            description: `Demonstrasikan berbagai cara import/export dalam ES6 modules.

**Instruksi:**
1. Buat file "module-demo.html" dan berbagai module files
2. Demonstrasikan:
   - Named exports (multiple exports dari 1 file)
   - Default exports
   - Mixed (named + default)
   - Import all as namespace
   - Dynamic imports dengan import()
3. Buat cheat sheet/documentation
4. Implementasikan lazy loading dengan dynamic import

**Jelaskan use cases untuk setiap jenis import/export.**`,
            requirements: [
                'Contoh untuk semua jenis export (named, default, mixed)',
                'Contoh untuk semua cara import',
                'Dynamic import implementation',
                'Documentation/cheat sheet yang jelas',
                'Practical use cases untuk setiap jenis'
            ],
            dueDate: '2026-01-18',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Completeness': 40,
                'Dynamic Imports': 25,
                'Documentation': 20,
                'Code Quality': 15
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 14: Performance Optimization
        {
            id: 27,
            classId: 14,
            moduleId: 3,
            title: 'Debounce & Throttle',
            description: `Implementasikan debounce dan throttle untuk optimize event handlers.

**Instruksi:**
1. Buat file "debounce-throttle.html"
2. Implementasikan debounce function dari scratch
3. Implementasikan throttle function dari scratch
4. Buat demo untuk kedua techniques:
   - Debounce: Search input (wait until user stops typing)
   - Throttle: Scroll event (limit execution rate)
5. Tampilkan execution count untuk compare
6. Jelaskan perbedaan dan use cases

**Bonus: Tambahkan visual indicator untuk setiap execution.**`,
            requirements: [
                'Custom debounce dan throttle functions',
                'Demo yang menunjukkan perbedaan dengan dan tanpa optimization',
                'Execution counter untuk visualisasi',
                'Penjelasan perbedaan dan use cases',
                'Working examples yang practical'
            ],
            dueDate: '2026-01-20',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Implementation': 40,
                'Demonstration': 25,
                'Understanding': 20,
                'Code Quality': 15
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 28,
            classId: 14,
            moduleId: 3,
            title: 'Lazy Loading Images',
            description: `Implementasikan lazy loading untuk images menggunakan Intersection Observer.

**Instruksi:**
1. Buat file "lazy-loading.html"
2. Buat page dengan minimal 20 images
3. Implementasikan lazy loading:
   - Gunakan Intersection Observer API
   - Load image hanya saat masuk viewport
   - Show placeholder/skeleton saat loading
   - Smooth fade-in animation saat loaded
4. Tampilkan loading count dan performance metrics

**Bonus: Implementasikan progressive image loading (blur-up effect).**`,
            requirements: [
                'Intersection Observer implementation',
                'Minimal 20 images dengan lazy loading',
                'Placeholder/skeleton loading state',
                'Smooth loading animations',
                'Performance metrics display'
            ],
            dueDate: '2026-01-20',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Lazy Loading Implementation': 40,
                'User Experience': 25,
                'Performance': 20,
                'Code Quality': 15
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },

        // Class 15: Testing dan Debugging
        {
            id: 29,
            classId: 15,
            moduleId: 3,
            title: 'Unit Testing Functions',
            description: `Buat unit tests untuk utility functions.

**Instruksi:**
1. Buat file "unit-testing.html"
2. Buat minimal 5 utility functions (e.g., validateEmail, formatCurrency, etc)
3. Buat simple testing framework sendiri atau gunakan assertions
4. Write tests untuk setiap function:
   - Happy path (valid inputs)
   - Edge cases
   - Error cases
5. Tampilkan test results dengan pass/fail indicators

**Bonus: Calculate code coverage percentage.**`,
            requirements: [
                'Minimal 5 utility functions dengan implementations',
                'Minimal 3 test cases per function (15 total)',
                'Testing framework atau assertion functions',
                'Visual test results (pass/fail dengan styling)',
                'Coverage untuk happy path dan edge cases'
            ],
            dueDate: '2026-01-22',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Test Coverage': 40,
                'Test Quality': 30,
                'Test Results Display': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        },
        {
            id: 30,
            classId: 15,
            moduleId: 3,
            title: 'Debugging Practice',
            description: `Fix bugs dalam provided code dan dokumentasikan debugging process.

**Instruksi:**
1. Download buggy code yang disediakan
2. Identifikasi minimal 10 bugs (syntax, logic, runtime)
3. Fix semua bugs
4. Dokumentasikan:
   - Bug description
   - How you found it (debugging technique)
   - The fix
5. Buat before/after comparison
6. Tambahkan error handling dan input validation

**Buggy code akan disediakan dalam assignment resources.**`,
            requirements: [
                'Identifikasi dan fix minimal 10 bugs',
                'Dokumentasi lengkap untuk setiap bug',
                'Before/after code comparison',
                'Penjelasan debugging techniques yang digunakan',
                'Additional error handling dan validation'
            ],
            dueDate: '2026-01-22',
            maxScore: 100,
            fileRequired: true,
            rubric: {
                'Bug Identification': 35,
                'Bug Fixes': 35,
                'Documentation': 20,
                'Code Quality': 10
            },
            createdBy: 2,
            createdAt: '2025-11-01'
        }
    ],

    // Submissions (Pengumpulan Tugas)
    submissions: [
        // User 3 (John Doe) submissions - Fundamental Module
        {
            id: 1,
            assignmentId: 1, // Hello World & Console Log
            userId: 3,
            fileName: 'hello-world-john.html',
            fileData: null,
            submittedAt: '2025-11-10',
            score: 85,
            feedback: 'Bagus! Output sudah benar. Namun bisa ditambahkan lebih banyak komentar untuk menjelaskan setiap baris kode.',
            gradedBy: 2,
            gradedAt: '2025-11-11'
        },
        {
            id: 2,
            assignmentId: 2, // Dokumentasi Tools
            userId: 3,
            fileName: 'dokumentasi-tools-john.pdf',
            fileData: null,
            submittedAt: '2025-11-12',
            score: 90,
            feedback: 'Dokumentasi sangat lengkap dengan screenshot yang jelas. Penjelasan tools sudah detail.',
            gradedBy: 2,
            gradedAt: '2025-11-13'
        },
        {
            id: 3,
            assignmentId: 3, // Deklarasi Variabel
            userId: 3,
            fileName: 'variabel-john.js',
            fileData: null,
            submittedAt: '2025-11-19',
            score: 88,
            feedback: 'Demonstrasi scope sudah baik. Perlu tambahan contoh untuk block scope dengan let.',
            gradedBy: 2,
            gradedAt: '2025-11-20'
        },
        {
            id: 4,
            assignmentId: 5, // Kalkulator Sederhana
            userId: 3,
            fileName: 'kalkulator-john.html',
            fileData: null,
            submittedAt: '2025-11-21',
            score: 80,
            feedback: 'Fungsi kalkulator berjalan dengan baik. Error handling untuk division by zero sudah ada, tapi input validation masih kurang robust.',
            gradedBy: 2,
            gradedAt: '2025-11-22'
        },
        {
            id: 5,
            assignmentId: 7, // FizzBuzz
            userId: 3,
            fileName: 'fizzbuzz-john.html',
            fileData: null,
            submittedAt: '2025-11-23',
            score: null, // Belum dinilai
            feedback: null,
            gradedBy: null,
            gradedAt: null
        },

        // User 4 (Jane Smith) submissions - Intermediate Module
        {
            id: 6,
            assignmentId: 11, // Array Methods
            userId: 4,
            fileName: 'array-methods-jane.html',
            fileData: null,
            submittedAt: '2025-11-14',
            score: 95,
            feedback: 'Excellent! Implementasi map, filter, reduce sangat baik. Method chaining juga sudah tepat.',
            gradedBy: 2,
            gradedAt: '2025-11-15'
        },
        {
            id: 7,
            assignmentId: 12, // CRUD Object
            userId: 4,
            fileName: 'crud-object-jane.html',
            fileData: null,
            submittedAt: '2025-11-16',
            score: 92,
            feedback: 'CRUD operations lengkap dan functional. Penggunaan destructuring dan spread operator sudah tepat. UI bisa lebih dipoles.',
            gradedBy: 2,
            gradedAt: '2025-11-17'
        },
        {
            id: 8,
            assignmentId: 13, // Todo List
            userId: 4,
            fileName: 'todo-list-jane.html',
            fileData: null,
            submittedAt: '2025-11-18',
            score: 90,
            feedback: 'Todo list berfungsi dengan baik. Filter dan counter sudah implementasi. DOM manipulation tanpa innerHTML - good job!',
            gradedBy: 2,
            gradedAt: '2025-11-19'
        },
        {
            id: 9,
            assignmentId: 15, // Event Delegation
            userId: 4,
            fileName: 'event-delegation-jane.html',
            fileData: null,
            submittedAt: '2025-11-20',
            score: null, // Belum dinilai
            feedback: null,
            gradedBy: null,
            gradedAt: null
        },
        {
            id: 10,
            assignmentId: 17, // Promise Chain
            userId: 4,
            fileName: 'promise-chain-jane.html',
            fileData: null,
            submittedAt: '2025-11-21',
            score: null, // Belum dinilai
            feedback: null,
            gradedBy: null,
            gradedAt: null
        },

        // Additional submissions for grading queue
        {
            id: 11,
            assignmentId: 1, // Hello World (Different user would need user 5+, using 3 for now)
            userId: 3,
            fileName: 'hello-world-john-revised.html',
            fileData: null,
            submittedAt: '2025-11-24',
            score: null,
            feedback: null,
            gradedBy: null,
            gradedAt: null
        },
        {
            id: 12,
            assignmentId: 6, // Operator Logika
            userId: 3,
            fileName: 'operator-logika-john.js',
            fileData: null,
            submittedAt: '2025-11-24',
            score: null,
            feedback: null,
            gradedBy: null,
            gradedAt: null
        },
        {
            id: 13,
            assignmentId: 14, // Form Validation Real-time
            userId: 4,
            fileName: 'realtime-validation-jane.html',
            fileData: null,
            submittedAt: '2025-11-22',
            score: null,
            feedback: null,
            gradedBy: null,
            gradedAt: null
        },
        {
            id: 14,
            assignmentId: 19, // Fetch CRUD
            userId: 4,
            fileName: 'fetch-crud-jane.html',
            fileData: null,
            submittedAt: '2025-11-23',
            score: null,
            feedback: null,
            gradedBy: null,
            gradedAt: null
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
            .filter(u => u.role === 'student' && u.promotionRequests && u.promotionRequests.length > 0)
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
            .filter(u => u.role === 'student' && enrolledUserIds.includes(u.id))
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
            .filter(u => u.role === 'student' && enrolledUserIds.includes(u.id))
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
