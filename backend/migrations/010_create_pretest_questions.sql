-- Migration: Create Pretest Questions Table
-- Date: 2025-12-10
-- Description: Create table for pretest questions with 30 questions representing each module

-- Create pretest_questions table
CREATE TABLE IF NOT EXISTS pretest_questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    module_category VARCHAR(50) NOT NULL CHECK (module_category IN ('fundamental', 'intermediate', 'advance')),
    difficulty_level VARCHAR(20) DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    points INTEGER DEFAULT 1,
    explanation TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_pretest_questions_category ON pretest_questions(module_category);
CREATE INDEX idx_pretest_questions_active ON pretest_questions(is_active);

-- Insert 30 pretest questions (10 fundamental, 10 intermediate, 10 advance)

-- FUNDAMENTAL QUESTIONS (10 questions)
INSERT INTO pretest_questions (question_text, option_a, option_b, option_c, option_d, correct_answer, module_category, difficulty_level, points, explanation) VALUES
('Apa yang dimaksud dengan variabel dalam JavaScript?', 'Sebuah fungsi untuk menyimpan data', 'Wadah untuk menyimpan nilai data', 'Sebuah loop untuk perulangan', 'Sebuah kondisi logika', 'B', 'fundamental', 'easy', 1, 'Variabel adalah wadah atau container yang digunakan untuk menyimpan nilai data yang dapat berubah-ubah.'),

('Manakah yang merupakan tipe data primitif dalam JavaScript?', 'Array', 'Object', 'String', 'Function', 'C', 'fundamental', 'easy', 1, 'String adalah salah satu tipe data primitif dalam JavaScript, selain Number, Boolean, Null, Undefined, dan Symbol.'),

('Bagaimana cara mendeklarasikan variabel dengan let di JavaScript?', 'var x = 10;', 'let x = 10;', 'const x = 10;', 'int x = 10;', 'B', 'fundamental', 'easy', 1, 'let digunakan untuk mendeklarasikan variabel yang nilainya dapat diubah dan memiliki block scope.'),

('Apa output dari: console.log(typeof 42)?', 'string', 'number', 'integer', 'float', 'B', 'fundamental', 'easy', 1, 'typeof 42 akan mengembalikan "number" karena 42 adalah tipe data number.'),

('Operator mana yang digunakan untuk penugasan nilai dalam JavaScript?', '+', '==', '=', '===', 'C', 'fundamental', 'easy', 1, 'Operator = digunakan untuk assignment (penugasan nilai), sedangkan == dan === untuk perbandingan.'),

('Bagaimana cara menulis komentar satu baris di JavaScript?', '/* komentar */', '// komentar', '<!-- komentar -->', '# komentar', 'B', 'fundamental', 'easy', 1, '// digunakan untuk komentar satu baris di JavaScript.'),

('Manakah pernyataan yang benar tentang const?', 'Nilainya dapat diubah', 'Nilainya tidak dapat diubah setelah dideklarasikan', 'Sama dengan var', 'Hanya untuk angka', 'B', 'fundamental', 'easy', 1, 'const digunakan untuk mendeklarasikan konstanta yang nilainya tidak dapat diubah setelah inisialisasi.'),

('Apa fungsi dari console.log()?', 'Membuat variabel baru', 'Menampilkan output ke console', 'Membuat fungsi baru', 'Menghapus data', 'B', 'fundamental', 'easy', 1, 'console.log() digunakan untuk menampilkan output/pesan ke console browser untuk debugging.'),

('Bagaimana cara membuat array kosong di JavaScript?', 'var arr = {};', 'var arr = [];', 'var arr = ();', 'var arr = <>;', 'B', 'fundamental', 'easy', 1, 'Array kosong dibuat menggunakan tanda kurung siku [] atau new Array().'),

('Operator mana yang digunakan untuk membandingkan nilai DAN tipe data?', '==', '=', '===', '!=', 'C', 'fundamental', 'easy', 1, '=== adalah strict equality operator yang membandingkan nilai dan tipe data.'),

-- INTERMEDIATE QUESTIONS (10 questions)
('Apa yang dimaksud dengan closure dalam JavaScript?', 'Sebuah loop', 'Fungsi yang memiliki akses ke variabel di scope luar', 'Sebuah object', 'Sebuah array', 'B', 'intermediate', 'medium', 1, 'Closure adalah fungsi yang memiliki akses ke variabel di scope luar (outer scope) meskipun fungsi luar sudah selesai dieksekusi.'),

('Apa perbedaan antara let dan var?', 'Tidak ada perbedaan', 'let memiliki block scope, var memiliki function scope', 'var lebih cepat', 'let hanya untuk angka', 'B', 'intermediate', 'medium', 1, 'let memiliki block scope (terbatas pada blok kode {}), sedangkan var memiliki function scope.'),

('Apa itu callback function?', 'Fungsi yang memanggil dirinya sendiri', 'Fungsi yang dikirim sebagai argumen ke fungsi lain', 'Fungsi untuk membuat array', 'Fungsi untuk loop', 'B', 'intermediate', 'medium', 1, 'Callback function adalah fungsi yang dikirim sebagai argumen ke fungsi lain dan akan dipanggil/dieksekusi nanti.'),

('Bagaimana cara mengakses elemen array dengan index 0?', 'arr.first()', 'arr(0)', 'arr[0]', 'arr{0}', 'C', 'intermediate', 'medium', 1, 'Elemen array diakses menggunakan tanda kurung siku dengan index, dimulai dari 0.'),

('Apa fungsi dari method map() pada array?', 'Menghapus elemen', 'Membuat array baru dengan hasil transformasi setiap elemen', 'Mengurutkan array', 'Menggabungkan array', 'B', 'intermediate', 'medium', 1, 'map() membuat array baru dengan hasil dari pemanggilan fungsi untuk setiap elemen array.'),

('Apa yang dimaksud dengan arrow function?', 'Fungsi dengan sintaks yang lebih pendek', 'Fungsi untuk membuat panah', 'Fungsi untuk loop', 'Fungsi untuk array', 'A', 'intermediate', 'medium', 1, 'Arrow function (=>) adalah sintaks yang lebih pendek untuk menulis fungsi dan memiliki perilaku this yang berbeda.'),

('Bagaimana cara menambahkan elemen di akhir array?', 'array.add()', 'array.push()', 'array.append()', 'array.insert()', 'B', 'intermediate', 'medium', 1, 'push() digunakan untuk menambahkan satu atau lebih elemen di akhir array.'),

('Apa itu template literal di JavaScript?', 'Cara menulis string dengan backtick (`)', 'Sebuah fungsi', 'Sebuah loop', 'Sebuah object', 'A', 'intermediate', 'medium', 1, 'Template literal menggunakan backtick (`) dan memungkinkan string interpolation dengan ${}.'),

('Apa fungsi dari method filter() pada array?', 'Mengurutkan array', 'Membuat array baru dengan elemen yang memenuhi kondisi', 'Menghapus semua elemen', 'Menggabungkan array', 'B', 'intermediate', 'medium', 1, 'filter() membuat array baru berisi elemen yang lolos test/kondisi yang diberikan.'),

('Bagaimana cara mengubah string menjadi huruf besar semua?', 'str.uppercase()', 'str.toUpper()', 'str.toUpperCase()', 'str.upper()', 'C', 'intermediate', 'medium', 1, 'toUpperCase() adalah method untuk mengubah semua karakter string menjadi huruf besar.'),

-- ADVANCE QUESTIONS (10 questions)
('Apa yang dimaksud dengan Promise dalam JavaScript?', 'Sebuah loop', 'Object yang merepresentasikan hasil dari operasi asynchronous', 'Sebuah fungsi', 'Sebuah variabel', 'B', 'advance', 'hard', 1, 'Promise adalah object yang merepresentasikan keberhasilan atau kegagalan dari operasi asynchronous.'),

('Apa perbedaan antara async/await dan Promise?', 'Tidak ada perbedaan', 'async/await adalah syntactic sugar untuk Promise', 'async/await lebih lambat', 'Promise sudah tidak digunakan', 'B', 'advance', 'hard', 1, 'async/await adalah cara menulis asynchronous code yang lebih mudah dibaca, yang merupakan syntactic sugar di atas Promise.'),

('Apa itu event loop dalam JavaScript?', 'Loop for biasa', 'Mekanisme yang menangani eksekusi code asynchronous', 'Sebuah array', 'Sebuah fungsi', 'B', 'advance', 'hard', 1, 'Event loop adalah mekanisme yang menangani eksekusi code, event, dan callback dalam JavaScript runtime.'),

('Apa fungsi dari method reduce() pada array?', 'Mengurangi ukuran array', 'Mengeksekusi fungsi reducer pada setiap elemen untuk menghasilkan nilai tunggal', 'Menghapus elemen duplikat', 'Memfilter array', 'B', 'advance', 'hard', 1, 'reduce() mengeksekusi reducer function pada setiap elemen array dan menghasilkan satu nilai output.'),

('Apa yang dimaksud dengan destructuring dalam JavaScript?', 'Menghancurkan object', 'Cara mengekstrak nilai dari array atau object ke variabel terpisah', 'Menghapus variabel', 'Membuat array baru', 'B', 'advance', 'hard', 1, 'Destructuring adalah sintaks untuk mengekstrak nilai dari array atau properties dari object ke variabel terpisah.'),

('Apa itu spread operator (...) dalam JavaScript?', 'Operator matematika', 'Operator untuk menyebar elemen array atau object', 'Operator perbandingan', 'Operator logika', 'B', 'advance', 'hard', 1, 'Spread operator (...) digunakan untuk menyebar/expand elemen dari array atau object.'),

('Bagaimana cara membuat class di JavaScript (ES6)?', 'function Class(){}', 'class MyClass {}', 'var class = {}', 'new Class()', 'B', 'advance', 'hard', 1, 'ES6 memperkenalkan sintaks class dengan keyword "class" untuk membuat class.'),

('Apa yang dimaksud dengan hoisting?', 'Mengangkat variabel', 'Mekanisme JavaScript memindahkan deklarasi ke atas scope', 'Menghapus variabel', 'Membuat variabel baru', 'B', 'advance', 'hard', 1, 'Hoisting adalah mekanisme JavaScript yang memindahkan deklarasi variabel dan fungsi ke atas scope sebelum eksekusi code.'),

('Apa fungsi dari fetch() API?', 'Mengambil data dari server', 'Menghapus data', 'Membuat variabel', 'Membuat loop', 'A', 'advance', 'hard', 1, 'fetch() adalah API modern untuk melakukan HTTP request dan mengembalikan Promise.'),

('Apa yang dimaksud dengan higher-order function?', 'Fungsi yang selalu return true', 'Fungsi yang menerima fungsi sebagai argument atau return fungsi', 'Fungsi yang lebih cepat', 'Fungsi untuk matematika', 'B', 'advance', 'hard', 1, 'Higher-order function adalah fungsi yang menerima fungsi lain sebagai argument atau mengembalikan fungsi.');

-- Log the migration
DO $$
BEGIN
    RAISE NOTICE 'Migration 010: Created pretest_questions table with 30 questions';
END $$;
