// Learning Materials Content for CodeSmart LMS
// Comprehensive course materials for all JavaScript modules

const LearningMaterials = {
    // FUNDAMENTAL JAVASCRIPT MATERIALS
    fundamental: {
        class1: {
            id: 1,
            title: 'Pengenalan JavaScript',
            content: `
                <h2>Apa itu JavaScript?</h2>
                <p>JavaScript adalah bahasa pemrograman tingkat tinggi yang dinamis dan berjalan di browser web. JavaScript memungkinkan kita membuat halaman web yang interaktif dan responsif.</p>

                <h3>Sejarah JavaScript</h3>
                <p>JavaScript diciptakan oleh Brendan Eich pada tahun 1995 di Netscape Communications. Awalnya dinamakan LiveScript, kemudian diubah menjadi JavaScript untuk memanfaatkan popularitas Java.</p>

                <h3>Peran JavaScript dalam Web Development</h3>
                <ul>
                    <li><strong>Client-Side Programming:</strong> Berjalan di browser pengguna</li>
                    <li><strong>Interaktivitas:</strong> Membuat elemen yang dapat berinteraksi dengan user</li>
                    <li><strong>Dynamic Content:</strong> Mengubah konten tanpa reload halaman</li>
                    <li><strong>Form Validation:</strong> Validasi input sebelum dikirim ke server</li>
                </ul>

                <h3>Contoh Kode Pertama</h3>
                <pre><code>// Hello World di JavaScript
console.log("Hello, World!");

// Menampilkan alert di browser
alert("Selamat datang di JavaScript!");

// Mengubah isi elemen HTML
document.getElementById("demo").innerHTML = "Hello JavaScript!";</code></pre>

                <h3>JavaScript vs Bahasa Lain</h3>
                <table border="1">
                    <tr>
                        <th>Aspek</th>
                        <th>JavaScript</th>
                        <th>Java</th>
                        <th>Python</th>
                    </tr>
                    <tr>
                        <td>Tipe</td>
                        <td>Dinamis</td>
                        <td>Statis</td>
                        <td>Dinamis</td>
                    </tr>
                    <tr>
                        <td>Platform</td>
                        <td>Browser & Node.js</td>
                        <td>JVM</td>
                        <td>Interpreter</td>
                    </tr>
                    <tr>
                        <td>Syntax</td>
                        <td>C-like</td>
                        <td>C-like</td>
                        <td>Indentation</td>
                    </tr>
                </table>

                <h3>Tools yang Dibutuhkan</h3>
                <ol>
                    <li><strong>Browser</strong> (Chrome, Firefox, Safari)</li>
                    <li><strong>Text Editor</strong> (VS Code, Sublime Text)</li>
                    <li><strong>Console Browser</strong> (DevTools - F12)</li>
                </ol>

                <h3>Latihan</h3>
                <p>1. Buka browser dan tekan F12 untuk membuka Console</p>
                <p>2. Ketik: <code>console.log("Saya belajar JavaScript")</code></p>
                <p>3. Tekan Enter dan lihat hasilnya!</p>
            `
        },

        class2: {
            id: 2,
            title: 'Variabel dan Tipe Data',
            content: `
                <h2>Variabel di JavaScript</h2>
                <p>Variabel adalah wadah untuk menyimpan nilai data. Di JavaScript, ada 3 cara mendeklarasikan variabel:</p>

                <h3>1. var (Cara Lama)</h3>
                <pre><code>var nama = "John";
var umur = 25;
var isStudent = true;</code></pre>

                <h3>2. let (ES6+)</h3>
                <pre><code>let kota = "Jakarta";
let populasi = 10000000;
// Nilai bisa diubah
kota = "Bandung";</code></pre>

                <h3>3. const (ES6+ - Constant)</h3>
                <pre><code>const PI = 3.14159;
const NAMA_APLIKASI = "CodeSmart";
// Nilai TIDAK bisa diubah
// PI = 3.14; // ERROR!</code></pre>

                <h3>Aturan Penamaan Variabel</h3>
                <ul>
                    <li>Harus dimulai dengan huruf, underscore (_), atau dollar sign ($)</li>
                    <li>Tidak boleh menggunakan keyword JavaScript (let, if, function, dll)</li>
                    <li>Case sensitive (nama ≠ Nama ≠ NAMA)</li>
                    <li>Gunakan camelCase untuk multi-word: namaLengkap, jumlahSiswa</li>
                </ul>

                <h3>Tipe Data Primitif</h3>

                <h4>1. String (Teks)</h4>
                <pre><code>let nama = "John Doe";
let alamat = 'Jl. Merdeka No. 10';
let pesan = \`Hello, \${nama}!\`; // Template literal</code></pre>

                <h4>2. Number (Angka)</h4>
                <pre><code>let umur = 25;
let tinggi = 175.5;
let suhu = -10;
let infinity = Infinity;</code></pre>

                <h4>3. Boolean (True/False)</h4>
                <pre><code>let isActive = true;
let isPremium = false;
let isLoggedIn = true;</code></pre>

                <h4>4. Undefined</h4>
                <pre><code>let x; // undefined
let y = undefined;</code></pre>

                <h4>5. Null</h4>
                <pre><code>let data = null; // Intentionally empty</code></pre>

                <h4>6. Symbol (ES6+)</h4>
                <pre><code>let sym1 = Symbol("id");
let sym2 = Symbol("id");
// sym1 !== sym2 (always unique)</code></pre>

                <h3>Tipe Data Non-Primitif</h3>

                <h4>1. Object</h4>
                <pre><code>let person = {
    nama: "John",
    umur: 25,
    kota: "Jakarta"
};</code></pre>

                <h4>2. Array</h4>
                <pre><code>let buah = ["Apel", "Jeruk", "Mangga"];
let angka = [1, 2, 3, 4, 5];</code></pre>

                <h4>3. Function</h4>
                <pre><code>function sapa(nama) {
    return "Hello, " + nama;
}</code></pre>

                <h3>Typeof Operator</h3>
                <pre><code>console.log(typeof "Hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object" (quirk!)
console.log(typeof {});          // "object"
console.log(typeof []);          // "object"
console.log(typeof function(){}); // "function"</code></pre>

                <h3>Konversi Tipe Data</h3>

                <h4>String ke Number</h4>
                <pre><code>let str = "123";
let num = Number(str);     // 123
let num2 = parseInt(str);  // 123
let num3 = parseFloat("3.14"); // 3.14</code></pre>

                <h4>Number ke String</h4>
                <pre><code>let num = 123;
let str = String(num);     // "123"
let str2 = num.toString(); // "123"</code></pre>

                <h4>Boolean Conversion</h4>
                <pre><code>Boolean(1);        // true
Boolean(0);        // false
Boolean("");       // false
Boolean("hello");  // true
Boolean(null);     // false
Boolean(undefined); // false</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Buat variabel untuk nama, umur, dan email Anda</li>
                    <li>Buat array berisi 5 hobi favorit Anda</li>
                    <li>Buat object untuk data profil lengkap Anda</li>
                    <li>Coba konversi string "100" menjadi number dan tambahkan 50</li>
                </ol>
            `
        },

        class3: {
            id: 3,
            title: 'Operator dan Ekspresi',
            content: `
                <h2>Operator di JavaScript</h2>
                <p>Operator adalah simbol yang digunakan untuk melakukan operasi pada nilai dan variabel.</p>

                <h3>1. Operator Aritmatika</h3>
                <pre><code>let a = 10;
let b = 3;

console.log(a + b);  // 13 (Penjumlahan)
console.log(a - b);  // 7  (Pengurangan)
console.log(a * b);  // 30 (Perkalian)
console.log(a / b);  // 3.333... (Pembagian)
console.log(a % b);  // 1  (Modulus/Sisa bagi)
console.log(a ** b); // 1000 (Pangkat - ES7)</code></pre>

                <h3>2. Operator Penugasan</h3>
                <pre><code>let x = 10;

x += 5;  // x = x + 5  → 15
x -= 3;  // x = x - 3  → 12
x *= 2;  // x = x * 2  → 24
x /= 4;  // x = x / 4  → 6
x %= 5;  // x = x % 5  → 1
x **= 2; // x = x ** 2 → 1</code></pre>

                <h3>3. Operator Perbandingan</h3>
                <pre><code>let a = 5;
let b = "5";

console.log(a == b);   // true (nilai sama, tipe diabaikan)
console.log(a === b);  // false (nilai dan tipe harus sama)
console.log(a != b);   // false
console.log(a !== b);  // true
console.log(a > 3);    // true
console.log(a < 10);   // true
console.log(a >= 5);   // true
console.log(a <= 4);   // false</code></pre>

                <h3>4. Operator Logika</h3>
                <pre><code>let x = true;
let y = false;

// AND (&&) - Semua harus true
console.log(x && y);  // false

// OR (||) - Salah satu true
console.log(x || y);  // true

// NOT (!) - Membalik nilai
console.log(!x);      // false
console.log(!y);      // true</code></pre>

                <h4>Short-Circuit Evaluation</h4>
                <pre><code>// AND: berhenti di false pertama
false && console.log("Tidak dieksekusi");

// OR: berhenti di true pertama
true || console.log("Tidak dieksekusi");

// Default value dengan OR
let username = userInput || "Guest";

// Nullish coalescing (ES2020)
let count = 0;
let result = count ?? 10;  // 0 (hanya null/undefined yang di-override)</code></pre>

                <h3>5. Operator Increment & Decrement</h3>
                <pre><code>let a = 5;

// Post-increment (a++): gunakan dulu, tambah kemudian
let b = a++;  // b = 5, a = 6

// Pre-increment (++a): tambah dulu, gunakan kemudian
let c = ++a;  // c = 7, a = 7

// Sama untuk decrement
let d = a--;  // d = 7, a = 6
let e = --a;  // e = 5, a = 5</code></pre>

                <h3>6. Operator Ternary</h3>
                <pre><code>// Syntax: kondisi ? nilaiJikaTrue : nilaiJikaFalse

let umur = 18;
let status = umur >= 17 ? "Dewasa" : "Anak-anak";

let nilai = 85;
let grade = nilai >= 90 ? "A" :
            nilai >= 80 ? "B" :
            nilai >= 70 ? "C" : "D";</code></pre>

                <h3>7. Operator String</h3>
                <pre><code>// Concatenation
let nama = "John";
let salam = "Hello, " + nama + "!";

// Template Literal (ES6+)
let pesan = \`Hello, \${nama}! Umur: \${25}\`;

// Multiline
let alamat = \`
    Jl. Merdeka No. 10
    Jakarta Pusat
    Indonesia
\`;</code></pre>

                <h3>8. Operator typeof</h3>
                <pre><code>console.log(typeof 42);           // "number"
console.log(typeof "hello");      // "string"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object" (bug JavaScript!)
console.log(typeof {});           // "object"
console.log(typeof []);           // "object"
console.log(typeof function(){}); // "function"</code></pre>

                <h3>Operator Precedence (Prioritas)</h3>
                <pre><code>let hasil = 2 + 3 * 4;        // 14 (perkalian duluan)
let hasil2 = (2 + 3) * 4;     // 20 (kurung duluan)

// Urutan prioritas (tinggi ke rendah):
// 1. () - Kurung
// 2. **, *, /, % - Aritmatika
// 3. +, - - Penjumlahan/Pengurangan
// 4. <, <=, >, >= - Perbandingan
// 5. ==, ===, !=, !== - Equality
// 6. && - AND
// 7. || - OR
// 8. ? : - Ternary
// 9. = - Assignment</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Hitung luas lingkaran dengan jari-jari 7 (π = 3.14)</li>
                    <li>Buat program untuk cek apakah bilangan genap atau ganjil</li>
                    <li>Buat kalkulator sederhana dengan semua operator dasar</li>
                    <li>Buat validasi login: username "admin" DAN password "12345"</li>
                </ol>
            `
        },

        class4: {
            id: 4,
            title: 'Kontrol Alur Program',
            content: `
                <h2>Struktur Kontrol di JavaScript</h2>
                <p>Struktur kontrol mengatur alur eksekusi program berdasarkan kondisi tertentu.</p>

                <h3>1. If Statement</h3>
                <pre><code>let umur = 18;

if (umur >= 17) {
    console.log("Anda sudah dewasa");
}

// Dengan else
if (umur >= 17) {
    console.log("Dewasa");
} else {
    console.log("Anak-anak");
}

// Dengan else if
if (umur < 13) {
    console.log("Anak-anak");
} else if (umur < 18) {
    console.log("Remaja");
} else {
    console.log("Dewasa");
}</code></pre>

                <h3>2. Switch Statement</h3>
                <pre><code>let hari = "Senin";

switch (hari) {
    case "Senin":
        console.log("Mulai kerja");
        break;
    case "Jumat":
        console.log("Hampir weekend");
        break;
    case "Sabtu":
    case "Minggu":
        console.log("Weekend!");
        break;
    default:
        console.log("Hari biasa");
}

// Tanpa break - fall through
let nilai = 'B';
switch (nilai) {
    case 'A':
    case 'B':
        console.log("Bagus!");
        break;
    case 'C':
        console.log("Cukup");
        break;
    default:
        console.log("Perlu belajar lebih giat");
}</code></pre>

                <h3>3. For Loop</h3>
                <pre><code>// Basic for loop
for (let i = 0; i < 5; i++) {
    console.log("Iterasi ke-" + i);
}

// Loop array
let buah = ["Apel", "Jeruk", "Mangga"];
for (let i = 0; i < buah.length; i++) {
    console.log(buah[i]);
}

// Nested loop
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        console.log(\`\${i} x \${j} = \${i * j}\`);
    }
}</code></pre>

                <h3>4. While Loop</h3>
                <pre><code>let i = 0;
while (i < 5) {
    console.log("Count: " + i);
    i++;
}

// Infinite loop (hati-hati!)
// while (true) {
//     console.log("Forever...");
// }</code></pre>

                <h3>5. Do-While Loop</h3>
                <pre><code>let i = 0;
do {
    console.log("Count: " + i);
    i++;
} while (i < 5);

// Perbedaan: do-while minimal eksekusi 1 kali
let x = 10;
do {
    console.log("Dieksekusi meski x >= 10");
} while (x < 10);</code></pre>

                <h3>6. For...of Loop (ES6+)</h3>
                <pre><code>// Untuk iterasi nilai array
let angka = [1, 2, 3, 4, 5];
for (let num of angka) {
    console.log(num);
}

// Untuk string
let nama = "CodeSmart";
for (let char of nama) {
    console.log(char);
}</code></pre>

                <h3>7. For...in Loop</h3>
                <pre><code>// Untuk iterasi property object
let person = {
    nama: "John",
    umur: 25,
    kota: "Jakarta"
};

for (let key in person) {
    console.log(\`\${key}: \${person[key]}\`);
}

// Juga bisa untuk array (tapi tidak disarankan)
let arr = ["a", "b", "c"];
for (let index in arr) {
    console.log(index); // 0, 1, 2
}</code></pre>

                <h3>8. Break dan Continue</h3>
                <pre><code>// Break: keluar dari loop
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        break; // Stop di 5
    }
    console.log(i);
}

// Continue: skip iterasi saat ini
for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
        continue; // Skip bilangan genap
    }
    console.log(i); // Hanya bilangan ganjil
}

// Label untuk nested loop
outerLoop: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
            break outerLoop; // Keluar dari outer loop
        }
        console.log(\`\${i},\${j}\`);
    }
}</code></pre>

                <h3>9. Try-Catch (Error Handling)</h3>
                <pre><code>try {
    // Kode yang mungkin error
    let x = undefinedVariable;
} catch (error) {
    console.log("Terjadi error: " + error.message);
} finally {
    console.log("Selalu dieksekusi");
}

// Throw custom error
function validateAge(age) {
    if (age < 0) {
        throw new Error("Umur tidak boleh negatif!");
    }
    return age;
}

try {
    validateAge(-5);
} catch (e) {
    console.log(e.message);
}</code></pre>

                <h3>Pattern Umum</h3>

                <h4>1. FizzBuzz</h4>
                <pre><code>for (let i = 1; i <= 15; i++) {
    if (i % 15 === 0) {
        console.log("FizzBuzz");
    } else if (i % 3 === 0) {
        console.log("Fizz");
    } else if (i % 5 === 0) {
        console.log("Buzz");
    } else {
        console.log(i);
    }
}</code></pre>

                <h4>2. Validasi Input</h4>
                <pre><code>function validateEmail(email) {
    if (!email) {
        return "Email tidak boleh kosong";
    }
    if (!email.includes("@")) {
        return "Email harus mengandung @";
    }
    return "Valid";
}</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Buat program untuk print angka 1-100</li>
                    <li>Buat program untuk cari bilangan prima 1-50</li>
                    <li>Buat program untuk reverse string</li>
                    <li>Buat program untuk hitung faktorial</li>
                    <li>Buat program FizzBuzz untuk 1-100</li>
                </ol>
            `
        },

        class5: {
            id: 5,
            title: 'Fungsi Dasar',
            content: `
                <h2>Fungsi di JavaScript</h2>
                <p>Fungsi adalah blok kode yang dapat digunakan kembali untuk melakukan tugas tertentu.</p>

                <h3>1. Deklarasi Fungsi</h3>
                <pre><code>// Function Declaration
function sapa() {
    console.log("Hello!");
}

// Memanggil fungsi
sapa(); // Output: Hello!

// Dengan parameter
function sapaOrang(nama) {
    console.log("Hello, " + nama + "!");
}

sapaOrang("John"); // Hello, John!</code></pre>

                <h3>2. Function Expression</h3>
                <pre><code>// Anonymous function
const sapa = function() {
    console.log("Hello!");
};

// Dengan nama (jarang digunakan)
const sapa2 = function namaFungsi() {
    console.log("Hello!");
};</code></pre>

                <h3>3. Arrow Function (ES6+)</h3>
                <pre><code>// Basic arrow function
const sapa = () => {
    console.log("Hello!");
};

// Dengan 1 parameter (tanpa kurung)
const kuadrat = x => x * x;

// Dengan multiple parameter
const tambah = (a, b) => a + b;

// Dengan body
const hitung = (a, b) => {
    let hasil = a + b;
    return hasil * 2;
};</code></pre>

                <h3>4. Parameter dan Argument</h3>
                <pre><code>// Multiple parameters
function buatProfile(nama, umur, kota) {
    return \`\${nama}, \${umur} tahun, dari \${kota}\`;
}

console.log(buatProfile("John", 25, "Jakarta"));

// Default parameters (ES6+)
function sapa(nama = "Guest") {
    return "Hello, " + nama;
}

console.log(sapa());        // Hello, Guest
console.log(sapa("John"));  // Hello, John

// Rest parameters (ES6+)
function jumlahkan(...angka) {
    let total = 0;
    for (let num of angka) {
        total += num;
    }
    return total;
}

console.log(jumlahkan(1, 2, 3, 4, 5)); // 15</code></pre>

                <h3>5. Return Value</h3>
                <pre><code>function tambah(a, b) {
    return a + b;
}

let hasil = tambah(5, 3); // 8

// Return object
function buatUser(nama, umur) {
    return {
        nama: nama,
        umur: umur,
        aktif: true
    };
}

// Return multiple values (array)
function hitung(a, b) {
    return [a + b, a - b, a * b, a / b];
}

let [tambah, kurang, kali, bagi] = hitung(10, 2);</code></pre>

                <h3>6. Scope</h3>
                <pre><code>// Global scope
let globalVar = "Global";

function test() {
    // Function scope
    let localVar = "Local";
    console.log(globalVar); // OK
    console.log(localVar);  // OK
}

test();
console.log(globalVar); // OK
// console.log(localVar); // ERROR!

// Block scope (let, const)
{
    let blockVar = "Block";
    const CONST_VAR = "Constant";
}
// console.log(blockVar); // ERROR!</code></pre>

                <h3>7. Closure</h3>
                <pre><code>function counter() {
    let count = 0;

    return function() {
        count++;
        return count;
    };
}

const myCounter = counter();
console.log(myCounter()); // 1
console.log(myCounter()); // 2
console.log(myCounter()); // 3

// Practical example: Private variables
function createBankAccount(initialBalance) {
    let balance = initialBalance;

    return {
        deposit: function(amount) {
            balance += amount;
            return balance;
        },
        withdraw: function(amount) {
            if (amount <= balance) {
                balance -= amount;
                return balance;
            }
            return "Insufficient funds";
        },
        getBalance: function() {
            return balance;
        }
    };
}

const account = createBankAccount(1000);
console.log(account.deposit(500));    // 1500
console.log(account.withdraw(200));   // 1300
console.log(account.getBalance());    // 1300</code></pre>

                <h3>8. Callback Function</h3>
                <pre><code>// Callback sebagai parameter
function prosesData(data, callback) {
    console.log("Processing: " + data);
    callback(data);
}

function tampilkan(data) {
    console.log("Result: " + data);
}

prosesData("Hello", tampilkan);

// Anonymous callback
prosesData("World", function(data) {
    console.log("Done: " + data);
});</code></pre>

                <h3>9. Higher-Order Function</h3>
                <pre><code>// Function yang return function
function createMultiplier(multiplier) {
    return function(x) {
        return x * multiplier;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Function sebagai parameter
function operasi(a, b, fungsi) {
    return fungsi(a, b);
}

const tambah = (x, y) => x + y;
const kali = (x, y) => x * y;

console.log(operasi(5, 3, tambah)); // 8
console.log(operasi(5, 3, kali));   // 15</code></pre>

                <h3>10. Immediately Invoked Function Expression (IIFE)</h3>
                <pre><code>// IIFE - Langsung dieksekusi
(function() {
    console.log("IIFE executed!");
})();

// Dengan parameter
(function(name) {
    console.log("Hello, " + name);
})("John");

// Arrow IIFE
(() => {
    console.log("Arrow IIFE");
})();</code></pre>

                <h3>Rekursif</h3>
                <pre><code>// Faktorial
function faktorial(n) {
    if (n <= 1) return 1;
    return n * faktorial(n - 1);
}

console.log(faktorial(5)); // 120

// Fibonacci
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(7)); // 13</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Buat fungsi untuk cek bilangan prima</li>
                    <li>Buat fungsi kalkulator dengan 4 operasi dasar</li>
                    <li>Buat fungsi untuk reverse string</li>
                    <li>Buat fungsi untuk cek palindrome</li>
                    <li>Buat fungsi counter dengan closure</li>
                </ol>
            `
        }
    },

    // INTERMEDIATE JAVASCRIPT MATERIALS
    intermediate: {
        class6: {
            id: 6,
            title: 'Array dan Object',
            content: `
                <h2>Array di JavaScript</h2>
                <p>Array adalah struktur data yang menyimpan koleksi elemen dengan indeks numerik.</p>

                <h3>Membuat Array</h3>
                <pre><code>// Array literal
let buah = ["Apel", "Jeruk", "Mangga"];
let angka = [1, 2, 3, 4, 5];
let mixed = [1, "text", true, null, {nama: "John"}];

// Array constructor
let arr = new Array(5); // Array dengan 5 slot kosong
let arr2 = new Array(1, 2, 3);</code></pre>

                <h3>Method Array Penting</h3>
                <pre><code>let arr = [1, 2, 3, 4, 5];

// Push & Pop
arr.push(6);        // [1,2,3,4,5,6]
arr.pop();          // [1,2,3,4,5]

// Shift & Unshift
arr.unshift(0);     // [0,1,2,3,4,5]
arr.shift();        // [1,2,3,4,5]

// Splice
arr.splice(2, 1);   // Remove 1 element at index 2
arr.splice(2, 0, 3); // Insert 3 at index 2

// Slice
let sub = arr.slice(1, 3); // [2,3]

// Concat
let arr2 = [6, 7];
let combined = arr.concat(arr2);

// Join
let str = arr.join("-"); // "1-2-3-4-5"</code></pre>

                <h3>Array Iteration</h3>
                <pre><code>let numbers = [1, 2, 3, 4, 5];

// forEach
numbers.forEach(num => console.log(num));

// map
let doubled = numbers.map(num => num * 2);

// filter
let even = numbers.filter(num => num % 2 === 0);

// reduce
let sum = numbers.reduce((total, num) => total + num, 0);

// find
let found = numbers.find(num => num > 3);

// some & every
let hasEven = numbers.some(num => num % 2 === 0);
let allPositive = numbers.every(num => num > 0);</code></pre>

                <h3>Object di JavaScript</h3>
                <pre><code>// Object literal
let person = {
    nama: "John",
    umur: 25,
    kota: "Jakarta",
    hobi: ["coding", "reading"],
    sapa: function() {
        return "Hello, " + this.nama;
    }
};

// Akses property
console.log(person.nama);
console.log(person["umur"]);

// Menambah property
person.email = "john@example.com";

// Menghapus property
delete person.kota;

// Method shorthand (ES6+)
let obj = {
    nama: "John",
    sapa() {
        return "Hello!";
    }
};</code></pre>

                <h3>Object Methods</h3>
                <pre><code>let person = {nama: "John", umur: 25};

// Keys, Values, Entries
Object.keys(person);    // ["nama", "umur"]
Object.values(person);  // ["John", 25]
Object.entries(person); // [["nama","John"], ["umur",25]]

// Assign
let defaults = {theme: "dark", lang: "id"};
let settings = Object.assign({}, defaults, {lang: "en"});

// Freeze & Seal
Object.freeze(person);  // Tidak bisa diubah
Object.seal(person);    // Bisa diubah nilai, tidak bisa tambah/hapus</code></pre>

                <h3>Destructuring</h3>
                <pre><code>// Array destructuring
let [a, b, c] = [1, 2, 3];
let [first, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring
let {nama, umur} = person;
let {nama: name, umur: age} = person; // Rename

// Default values
let {kota = "Unknown"} = person;</code></pre>

                <h3>Spread Operator</h3>
                <pre><code>// Array spread
let arr1 = [1, 2, 3];
let arr2 = [...arr1, 4, 5]; // [1,2,3,4,5]

// Object spread
let obj1 = {a: 1, b: 2};
let obj2 = {...obj1, c: 3}; // {a:1, b:2, c:3}</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Buat array siswa dan filter yang nilainya >= 75</li>
                    <li>Buat object product dengan method diskon</li>
                    <li>Gunakan reduce untuk hitung total harga</li>
                </ol>
            `
        },
        // ... Tambahkan class 7-10 intermediate materials di sini
    },

    // ADVANCE JAVASCRIPT MATERIALS
    advance: {
        class11: {
            id: 11,
            title: 'ES6+ Features',
            content: `
                <h2>Modern JavaScript Features</h2>
                <p>Fitur-fitur ES6 dan beyond yang membuat JavaScript lebih powerful.</p>

                <h3>Let & Const</h3>
                <pre><code>// Block scope
{
    let x = 10;
    const Y = 20;
}
// x dan Y tidak accessible di luar block

// Const tidak bisa reassign
const PI = 3.14;
// PI = 3.14159; // ERROR

// Tapi object/array bisa dimutasi
const arr = [1, 2, 3];
arr.push(4); // OK
// arr = []; // ERROR</code></pre>

                <h3>Template Literals</h3>
                <pre><code>let nama = "John";
let umur = 25;

// String interpolation
let pesan = \`Hello, \${nama}! Umur: \${umur}\`;

// Multiline
let html = \`
    <div>
        <h1>\${nama}</h1>
        <p>Age: \${umur}</p>
    </div>
\`;

// Tagged templates
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] ? \`<mark>\${values[i]}</mark>\` : '');
    }, '');
}</code></pre>

                <h3>Arrow Functions</h3>
                <pre><code>// Concise syntax
const tambah = (a, b) => a + b;

// Implicit return
const kuadrat = x => x * x;

// Lexical this
const person = {
    nama: "John",
    sapa: function() {
        setTimeout(() => {
            console.log(this.nama); // 'this' refers to person
        }, 1000);
    }
};</code></pre>

                <h3>Destructuring Assignment</h3>
                <pre><code>// Array destructuring
const [a, b, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring
const {nama, umur, kota = "Unknown"} = user;

// Nested destructuring
const {
    address: {city, country}
} = user;

// Function parameters
function greet({nama, umur}) {
    return \`Hello \${nama}, age \${umur}\`;
}</code></pre>

                <h3>Spread & Rest Operators</h3>
                <pre><code>// Spread in arrays
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
const combined = [...arr1, ...arr2];

// Spread in objects
const obj1 = {a: 1, b: 2};
const obj2 = {...obj1, c: 3};

// Rest in parameters
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}</code></pre>

                <h3>Classes</h3>
                <pre><code>class Person {
    constructor(nama, umur) {
        this.nama = nama;
        this.umur = umur;
    }

    sapa() {
        return \`Hello, \${this.nama}\`;
    }

    static create(nama, umur) {
        return new Person(nama, umur);
    }
}

// Inheritance
class Student extends Person {
    constructor(nama, umur, kelas) {
        super(nama, umur);
        this.kelas = kelas;
    }

    belajar() {
        return \`\${this.nama} is studying\`;
    }
}</code></pre>

                <h3>Modules (Import/Export)</h3>
                <pre><code>// math.js
export const PI = 3.14159;
export function add(a, b) {
    return a + b;
}
export default class Calculator {}

// main.js
import Calculator, {PI, add} from './math.js';
import * as Math from './math.js';</code></pre>

                <h3>Promises</h3>
                <pre><code>// Creating a promise
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Success!");
    }, 1000);
});

// Using promises
promise
    .then(result => console.log(result))
    .catch(error => console.error(error))
    .finally(() => console.log("Done"));

// Promise.all
Promise.all([promise1, promise2, promise3])
    .then(results => console.log(results));</code></pre>

                <h3>Async/Await</h3>
                <pre><code>async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// Using async function
fetchData().then(data => console.log(data));</code></pre>

                <h3>Optional Chaining (?.)  </h3>
                <pre><code>// Without optional chaining
const city = user && user.address && user.address.city;

// With optional chaining
const city = user?.address?.city;

// With methods
const result = obj.method?.();

// With arrays
const item = arr?.[0];</code></pre>

                <h3>Nullish Coalescing (??)</h3>
                <pre><code>// OR operator problem
const count = 0;
const value = count || 10; // 10 (wrong!)

// Nullish coalescing
const value = count ?? 10; // 0 (correct!)

// Only null/undefined are nullish
null ?? 'default';      // 'default'
undefined ?? 'default'; // 'default'
0 ?? 'default';         // 0
'' ?? 'default';        // ''</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Buat class Vehicle dengan inheritance</li>
                    <li>Implementasi Promise untuk simulate API call</li>
                    <li>Refactor old code dengan ES6+ features</li>
                </ol>
            `
        },
        // ... Tambahkan class 12-15 advance materials di sini
    }
};

// Export untuk digunakan di database.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearningMaterials;
}

        class7: {
            id: 7,
            title: 'DOM Manipulation',
            content: `
                <h2>Document Object Model (DOM)</h2>
                <p>DOM adalah representasi struktur HTML sebagai tree of objects yang dapat dimanipulasi dengan JavaScript.</p>

                <h3>Selecting Elements</h3>
                <pre><code>// getElementById
const header = document.getElementById('header');

// getElementsByClassName
const buttons = document.getElementsByClassName('btn');

// getElementsByTagName
const paragraphs = document.getElementsByTagName('p');

// querySelector (first match)
const firstBtn = document.querySelector('.btn');
const input = document.querySelector('input[type="text"]');

// querySelectorAll (all matches)
const allBtns = document.querySelectorAll('.btn');
const items = document.querySelectorAll('li');</code></pre>

                <h3>Manipulating Content</h3>
                <pre><code>// innerHTML - HTML content
element.innerHTML = '<strong>Bold text</strong>';

// textContent - Text only
element.textContent = 'Plain text';

// innerText - Visible text
element.innerText = 'Visible text';

// value (for inputs)
const input = document.querySelector('input');
input.value = 'New value';</code></pre>

                <h3>Manipulating Attributes</h3>
                <pre><code>// getAttribute & setAttribute
const link = document.querySelector('a');
const href = link.getAttribute('href');
link.setAttribute('href', 'https://example.com');

// Direct property access
link.href = 'https://example.com';
link.target = '_blank';

// classList
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('highlight');
element.classList.contains('active'); // true/false

// style
element.style.color = 'red';
element.style.backgroundColor = 'yellow';
element.style.fontSize = '20px';</code></pre>

                <h3>Creating & Removing Elements</h3>
                <pre><code>// Create element
const div = document.createElement('div');
div.className = 'box';
div.textContent = 'New box';

// Append to parent
document.body.appendChild(div);

// Insert before
const parent = document.getElementById('parent');
const referenceNode = document.getElementById('reference');
parent.insertBefore(div, referenceNode);

// Remove element
div.remove(); // Modern
parent.removeChild(div); // Old way

// Replace element
parent.replaceChild(newElement, oldElement);</code></pre>

                <h3>Traversing DOM</h3>
                <pre><code>// Parent
element.parentElement;
element.parentNode;

// Children
element.children; // HTMLCollection
element.firstElementChild;
element.lastElementChild;
element.childNodes; // NodeList (includes text nodes)

// Siblings
element.nextElementSibling;
element.previousElementSibling;

// Closest (up the tree)
element.closest('.container');</code></pre>

                <h3>Practical Example: Todo List</h3>
                <pre><code>const todoList = document.getElementById('todoList');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');

function addTodo() {
    const todoText = todoInput.value.trim();
    if (!todoText) return;

    const li = document.createElement('li');
    li.innerHTML = \`
        <span>\${todoText}</span>
        <button onclick="removeTodo(this)">Delete</button>
    \`;

    todoList.appendChild(li);
    todoInput.value = '';
}

function removeTodo(btn) {
    btn.parentElement.remove();
}

addBtn.addEventListener('click', addTodo);</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Buat form dengan validation real-time</li>
                    <li>Buat image gallery dengan modal</li>
                    <li>Buat accordion menu</li>
                </ol>
            `
        },

        class8: {
            id: 8,
            title: 'Event Handling',
            content: `
                <h2>JavaScript Events</h2>
                <p>Events adalah aksi yang terjadi di halaman web (click, hover, submit, dll).</p>

                <h3>Adding Event Listeners</h3>
                <pre><code>// addEventListener (recommended)
const btn = document.getElementById('myBtn');

btn.addEventListener('click', function() {
    alert('Button clicked!');
});

// Arrow function
btn.addEventListener('click', () => {
    console.log('Clicked!');
});

// Named function
function handleClick() {
    console.log('Clicked!');
}
btn.addEventListener('click', handleClick);

// Remove listener
btn.removeEventListener('click', handleClick);</code></pre>

                <h3>Common Events</h3>
                <pre><code>// Mouse events
element.addEventListener('click', handler);
element.addEventListener('dblclick', handler);
element.addEventListener('mouseenter', handler);
element.addEventListener('mouseleave', handler);
element.addEventListener('mouseover', handler);
element.addEventListener('mouseout', handler);
element.addEventListener('mousemove', handler);

// Keyboard events
element.addEventListener('keydown', handler);
element.addEventListener('keyup', handler);
element.addEventListener('keypress', handler);

// Form events
form.addEventListener('submit', handler);
input.addEventListener('focus', handler);
input.addEventListener('blur', handler);
input.addEventListener('change', handler);
input.addEventListener('input', handler);

// Window events
window.addEventListener('load', handler);
window.addEventListener('resize', handler);
window.addEventListener('scroll', handler);
window.addEventListener('DOMContentLoaded', handler);</code></pre>

                <h3>Event Object</h3>
                <pre><code>button.addEventListener('click', function(event) {
    // Event properties
    console.log(event.type);        // 'click'
    console.log(event.target);      // Element that triggered
    console.log(event.currentTarget); // Element with listener
    console.log(event.clientX);     // Mouse X position
    console.log(event.clientY);     // Mouse Y position

    // Event methods
    event.preventDefault();  // Prevent default action
    event.stopPropagation(); // Stop bubbling
});

// Keyboard event
input.addEventListener('keydown', function(e) {
    console.log(e.key);      // Key pressed
    console.log(e.code);     // Physical key
    console.log(e.keyCode);  // Numeric code (deprecated)
    console.log(e.ctrlKey);  // Ctrl pressed?
    console.log(e.shiftKey); // Shift pressed?
    console.log(e.altKey);   // Alt pressed?
});</code></pre>

                <h3>Event Delegation</h3>
                <pre><code>// Instead of adding listener to each item
document.getElementById('parent').addEventListener('click', function(e) {
    if (e.target.matches('.item')) {
        console.log('Item clicked:', e.target.textContent);
    }

    if (e.target.matches('.delete-btn')) {
        e.target.closest('.item').remove();
    }
});</code></pre>

                <h3>Event Bubbling & Capturing</h3>
                <pre><code>// Bubbling (default): inner → outer
parent.addEventListener('click', handler);

// Capturing: outer → inner
parent.addEventListener('click', handler, true);

// Stop propagation
element.addEventListener('click', function(e) {
    e.stopPropagation(); // Stop bubbling
});</code></pre>

                <h3>Custom Events</h3>
                <pre><code>// Create custom event
const myEvent = new CustomEvent('userLogin', {
    detail: {
        username: 'john',
        time: new Date()
    }
});

// Listen for custom event
document.addEventListener('userLogin', function(e) {
    console.log('User logged in:', e.detail.username);
});

// Dispatch event
document.dispatchEvent(myEvent);</code></pre>

                <h3>Practical Example: Form Validation</h3>
                <pre><code>const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate email
    if (!email.value.includes('@')) {
        showError(email, 'Invalid email');
        return;
    }

    // Validate password
    if (password.value.length < 8) {
        showError(password, 'Password min 8 characters');
        return;
    }

    // Submit form
    console.log('Form valid!');
    form.submit();
});

function showError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);

    setTimeout(() => errorDiv.remove(), 3000);
}</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Buat dropdown menu dengan hover</li>
                    <li>Buat image carousel dengan keyboard navigation</li>
                    <li>Buat form dengan real-time validation</li>
                </ol>
            `
        },

        class9: {
            id: 9,
            title: 'Asynchronous JavaScript',
            content: `
                <h2>Asynchronous Programming</h2>
                <p>JavaScript adalah single-threaded, tapi bisa handle operasi async dengan event loop.</p>

                <h3>Callbacks</h3>
                <pre><code>// Synchronous
function greet(name) {
    return 'Hello ' + name;
}

// Asynchronous with callback
function greetAsync(name, callback) {
    setTimeout(() => {
        callback('Hello ' + name);
    }, 1000);
}

greetAsync('John', function(message) {
    console.log(message); // After 1 second
});

// Callback hell
getData(function(a) {
    getMoreData(a, function(b) {
        getMoreData(b, function(c) {
            getMoreData(c, function(d) {
                console.log(d); // Hard to read!
            });
        });
    });
});</code></pre>

                <h3>Promises</h3>
                <pre><code>// Creating a Promise
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const success = true;
        if (success) {
            resolve('Operation successful!');
        } else {
            reject('Operation failed!');
        }
    }, 1000);
});

// Using Promise
promise
    .then(result => {
        console.log(result);
        return 'Next step';
    })
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error(error);
    })
    .finally(() => {
        console.log('Always executed');
    });</code></pre>

                <h3>Promise Methods</h3>
                <pre><code>// Promise.all - Wait for all
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
    .then(results => console.log(results)); // [1, 2, 3]

// Promise.race - First to resolve
Promise.race([p1, p2, p3])
    .then(result => console.log(result)); // 1

// Promise.allSettled - All complete (ES2020)
Promise.allSettled([p1, p2, p3])
    .then(results => console.log(results));

// Promise.any - First successful (ES2021)
Promise.any([p1, p2, p3])
    .then(result => console.log(result));</code></pre>

                <h3>Async/Await</h3>
                <pre><code>// Async function always returns a Promise
async function fetchUser() {
    return {name: 'John', age: 25};
}

// Await pauses execution until Promise resolves
async function getUser() {
    try {
        const user = await fetchUser();
        console.log(user);
        return user;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Multiple awaits
async function getData() {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    return {user, posts, comments};
}

// Parallel execution
async function getDataParallel() {
    const [user, posts] = await Promise.all([
        fetchUser(),
        fetchPosts()
    ]);
    return {user, posts};
}</code></pre>

                <h3>Error Handling</h3>
                <pre><code>// Try-catch with async/await
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw if needed
    } finally {
        console.log('Cleanup');
    }
}

// Catch at call site
fetchData()
    .then(data => console.log(data))
    .catch(error => console.error('Handled:', error));</code></pre>

                <h3>setTimeout & setInterval</h3>
                <pre><code>// setTimeout - Execute once after delay
const timeoutId = setTimeout(() => {
    console.log('After 2 seconds');
}, 2000);

// Clear timeout
clearTimeout(timeoutId);

// setInterval - Execute repeatedly
const intervalId = setInterval(() => {
    console.log('Every 1 second');
}, 1000);

// Clear interval
clearInterval(intervalId);

// Countdown example
let count = 10;
const countdown = setInterval(() => {
    console.log(count);
    count--;
    if (count === 0) {
        clearInterval(countdown);
        console.log('Done!');
    }
}, 1000);</code></pre>

                <h3>Event Loop</h3>
                <pre><code>console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2
// Microtasks (Promises) run before macrotasks (setTimeout)</code></pre>

                <h3>Practical Example: API Call</h3>
                <pre><code>async function loginUser(username, password) {
    try {
        // Show loading
        showLoading(true);

        // Simulate API call
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();

        // Save token
        localStorage.setItem('token', data.token);

        // Redirect
        window.location.href = '/dashboard';

    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Buat Promise chain untuk sequential API calls</li>
                    <li>Refactor callback hell ke async/await</li>
                    <li>Buat loading indicator untuk async operations</li>
                </ol>
            `
        },

        class10: {
            id: 10,
            title: 'API dan Fetch',
            content: `
                <h2>Fetch API</h2>
                <p>Fetch adalah modern way untuk melakukan HTTP requests di JavaScript.</p>

                <h3>Basic Fetch</h3>
                <pre><code>// GET request
fetch('https://api.example.com/users')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

// With async/await
async function getUsers() {
    try {
        const response = await fetch('https://api.example.com/users');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}</code></pre>

                <h3>HTTP Methods</h3>
                <pre><code>// POST request
async function createUser(userData) {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    return await response.json();
}

// PUT request
async function updateUser(id, userData) {
    const response = await fetch(\`/api/users/\${id}\`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    return await response.json();
}

// DELETE request
async function deleteUser(id) {
    const response = await fetch(\`/api/users/\${id}\`, {
        method: 'DELETE'
    });
    return response.ok;
}

// PATCH request (partial update)
async function patchUser(id, updates) {
    const response = await fetch(\`/api/users/\${id}\`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    });
    return await response.json();
}</code></pre>

                <h3>Headers & Authentication</h3>
                <pre><code>// Custom headers
fetch('/api/data', {
    headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'X-Custom-Header': 'value'
    }
});

// Headers object
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Authorization', 'Bearer token');

fetch('/api/data', {headers});</code></pre>

                <h3>Response Handling</h3>
                <pre><code>async function fetchData() {
    const response = await fetch('/api/data');

    // Check status
    if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    // Response properties
    console.log(response.status);      // 200
    console.log(response.statusText);  // "OK"
    console.log(response.headers);     // Headers object
    console.log(response.url);         // Request URL

    // Parse response
    const json = await response.json();      // JSON
    const text = await response.text();      // Text
    const blob = await response.blob();      // Binary
    const formData = await response.formData(); // Form data

    return json;
}</code></pre>

                <h3>Error Handling</h3>
                <pre><code>async function fetchWithErrorHandling(url) {
    try {
        const response = await fetch(url);

        // Network error
        if (!response.ok) {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }

        const data = await response.json();

        // Business logic error
        if (data.error) {
            throw new Error(data.error);
        }

        return data;

    } catch (error) {
        if (error instanceof TypeError) {
            console.error('Network error:', error);
        } else {
            console.error('Error:', error.message);
        }
        throw error;
    }
}</code></pre>

                <h3>AbortController</h3>
                <pre><code>// Cancel fetch request
const controller = new AbortController();
const signal = controller.signal;

fetch('/api/data', {signal})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
        }
    });

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

// Cancel on button click
cancelBtn.addEventListener('click', () => controller.abort());</code></pre>

                <h3>Fetch with Timeout</h3>
                <pre><code>async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal
        });
        clearTimeout(id);
        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}</code></pre>

                <h3>Practical Example: CRUD App</h3>
                <pre><code>class UserAPI {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('token');
    }

    async request(endpoint, options = {}) {
        const url = \`\${this.baseURL}\${endpoint}\`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${this.token}\`,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) throw new Error(response.statusText);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    getUsers() {
        return this.request('/users');
    }

    getUser(id) {
        return this.request(\`/users/\${id}\`);
    }

    createUser(userData) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    updateUser(id, userData) {
        return this.request(\`/users/\${id}\`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    deleteUser(id) {
        return this.request(\`/users/\${id}\`, {
            method: 'DELETE'
        });
    }
}

// Usage
const api = new UserAPI('https://api.example.com');

async function loadUsers() {
    try {
        const users = await api.getUsers();
        displayUsers(users);
    } catch (error) {
        showError(error.message);
    }
}</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Buat aplikasi weather dengan public API</li>
                    <li>Buat CRUD application dengan REST API</li>
                    <li>Implement pagination dan search</li>
                </ol>
            `
        }
    },

    // ADVANCE MATERIALS COMPLETION
    advance: {
        // class11 already defined above

        class12: {
            id: 12,
            title: 'Design Patterns',
            content: `
                <h2>JavaScript Design Patterns</h2>
                <p>Design patterns adalah solusi umum untuk masalah yang sering muncul dalam software design.</p>

                <h3>1. Module Pattern</h3>
                <pre><code>// Encapsulation dengan closure
const Calculator = (function() {
    // Private variables
    let result = 0;

    // Private function
    function log(operation, value) {
        console.log(\`\${operation}: \${value}\`);
    }

    // Public API
    return {
        add(num) {
            result += num;
            log('Add', num);
            return this;
        },
        subtract(num) {
            result -= num;
            log('Subtract', num);
            return this;
        },
        getResult() {
            return result;
        },
        reset() {
            result = 0;
            return this;
        }
    };
})();

// Usage
Calculator.add(5).add(3).subtract(2);
console.log(Calculator.getResult()); // 6</code></pre>

                <h3>2. Singleton Pattern</h3>
                <pre><code>// Only one instance
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        this.connection = null;
        Database.instance = this;
    }

    connect() {
        if (!this.connection) {
            this.connection = 'Connected to DB';
        }
        return this.connection;
    }
}

const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2); // true</code></pre>

                <h3>3. Factory Pattern</h3>
                <pre><code>// Object creation logic
class UserFactory {
    createUser(type, name) {
        switch(type) {
            case 'admin':
                return new Admin(name);
            case 'editor':
                return new Editor(name);
            default:
                return new Viewer(name);
        }
    }
}

class Admin {
    constructor(name) {
        this.name = name;
        this.permissions = ['read', 'write', 'delete'];
    }
}

class Editor {
    constructor(name) {
        this.name = name;
        this.permissions = ['read', 'write'];
    }
}

// Usage
const factory = new UserFactory();
const admin = factory.createUser('admin', 'John');</code></pre>

                <h3>4. Observer Pattern (Pub/Sub)</h3>
                <pre><code>class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }

    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
}

// Usage
const emitter = new EventEmitter();

emitter.on('login', (user) => {
    console.log(\`User \${user} logged in\`);
});

emitter.emit('login', 'John');</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Implement State pattern untuk UI components</li>
                    <li>Create decorator pattern untuk logging</li>
                </ol>
            `
        },

        class13: {
            id: 13,
            title: 'Module Systems',
            content: `
                <h2>JavaScript Modules</h2>
                <p>Modules membantu organize code menjadi reusable pieces.</p>

                <h3>ES6 Modules</h3>
                <pre><code>// math.js - Named exports
export const PI = 3.14159;
export function add(a, b) {
    return a + b;
}

// Default export
export default class Calculator {
    multiply(a, b) {
        return a * b;
    }
}

// main.js - Import
import Calculator, {PI, add} from './math.js';
import * as Math from './math.js';

const calc = new Calculator();
console.log(calc.multiply(5, 3));</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Refactor aplikasi menjadi modules</li>
                    <li>Create utility modules</li>
                </ol>
            `
        },

        class14: {
            id: 14,
            title: 'Performance Optimization',
            content: `
                <h2>JavaScript Performance</h2>
                <p>Teknik untuk membuat aplikasi JavaScript lebih cepat.</p>

                <h3>1. Debounce & Throttle</h3>
                <pre><code>// Debounce - Execute after delay
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Usage: Search input
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce(function(e) {
    search(e.target.value);
}, 500));

// Throttle - Execute at most once per interval
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage: Scroll event
window.addEventListener('scroll', throttle(function() {
    console.log('Scrolling...');
}, 1000));</code></pre>

                <h3>2. Lazy Loading</h3>
                <pre><code>// Lazy load images
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));</code></pre>

                <h3>3. Memoization</h3>
                <pre><code>// Cache expensive calculations
function memoize(fn) {
    const cache = {};
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache[key]) {
            return cache[key];
        }
        const result = fn.apply(this, args);
        cache[key] = result;
        return result;
    };
}

// Usage
const fibonacci = memoize(function(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Optimize rendering dengan virtual scrolling</li>
                    <li>Implement code splitting</li>
                </ol>
            `
        },

        class15: {
            id: 15,
            title: 'Testing dan Debugging',
            content: `
                <h2>Testing JavaScript</h2>
                <p>Testing memastikan code bekerja dengan benar.</p>

                <h3>Console Methods</h3>
                <pre><code>// Basic logging
console.log('Hello');
console.error('Error!');
console.warn('Warning!');
console.info('Info');

// Table
console.table([{name: 'John', age: 25}, {name: 'Jane', age: 30}]);

// Group
console.group('User Details');
console.log('Name: John');
console.log('Age: 25');
console.groupEnd();

// Time
console.time('operation');
// ... code ...
console.timeEnd('operation');

// Assert
console.assert(1 === 2, 'This will fail!');</code></pre>

                <h3>Debugging</h3>
                <pre><code>// Breakpoints
debugger; // Pause execution

// Try-catch
try {
    riskyCode();
} catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
} finally {
    cleanup();
}</code></pre>

                <h3>Unit Testing Example</h3>
                <pre><code>// Simple test function
function assert(condition, message) {
    if (!condition) {
        throw new Error('Test failed: ' + message);
    }
    console.log('✓ Test passed: ' + message);
}

// Test add function
function add(a, b) {
    return a + b;
}

// Tests
assert(add(2, 3) === 5, 'adds 2 + 3 = 5');
assert(add(-1, 1) === 0, 'adds -1 + 1 = 0');
assert(add(0, 0) === 0, 'adds 0 + 0 = 0');</code></pre>

                <h3>Latihan</h3>
                <ol>
                    <li>Write unit tests untuk utility functions</li>
                    <li>Debug complex async code</li>
                    <li>Profile performance dengan DevTools</li>
                </ol>
            `
        }
    }
};

// Getter function untuk ambil content berdasarkan class ID
LearningMaterials.getContent = function(classId) {
    // Search in fundamental
    for (let key in this.fundamental) {
        if (this.fundamental[key].id === classId) {
            return this.fundamental[key].content;
        }
    }
    // Search in intermediate
    for (let key in this.intermediate) {
        if (this.intermediate[key].id === classId) {
            return this.intermediate[key].content;
        }
    }
    // Search in advance
    for (let key in this.advance) {
        if (this.advance[key].id === classId) {
            return this.advance[key].content;
        }
    }
    return 'Materi belum tersedia.';
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearningMaterials;
}
