// Script to add azzahra (assessor) replies to all discussions
const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD || ''),
  ssl: { rejectUnauthorized: false }
};

const pool = new Pool(poolConfig);

async function addAzzahraReplies() {
  try {
    console.log('🔄 Adding azzahra (assessor) replies to discussions...\n');

    // Get all discussions
    const discussions = await pool.query(
      'SELECT id, title, user_id FROM discussions ORDER BY id'
    );

    console.log(`Found ${discussions.rows.length} discussions\n`);

    let totalAdded = 0;

    // Azzahra's replies for each discussion
    const azzahraReplies = [
      // Discussion 1: API Authentication
      {
        discussion_id: 1,
        replies: [
          'Untuk menggunakan API Authentication, Anda perlu login terlebih dahulu menggunakan endpoint /api/v1/auth/login dengan username dan password. Setelah itu, Anda akan mendapatkan JWT token yang harus disertakan di header Authorization.',
          'Contoh penggunaan token: Authorization: Bearer <your_token>. Token ini berlaku selama 7 hari sebelum expired.'
        ]
      },
      // Discussion 2: Error submit assignment
      {
        discussion_id: 2,
        replies: [
          'Error saat submit assignment biasanya disebabkan oleh: 1) Token expired, 2) Format file tidak sesuai, atau 3) Ukuran file terlalu besar. Bisa coba cek console browser untuk melihat error message yang lebih detail.',
          'Pastikan juga koneksi internet stabil dan file yang diupload tidak melebihi 10MB.'
        ]
      },
      // Discussion 3: Optimasi database
      {
        discussion_id: 3,
        replies: [
          'Tips utama untuk optimasi database query: 1) Gunakan index pada kolom yang sering di-query, 2) Hindari SELECT *, gunakan kolom spesifik, 3) Gunakan JOIN dengan bijak, 4) Implementasi pagination untuk data besar.',
          'Untuk aplikasi kita, saya sudah menambahkan index pada kolom user_id, module_id, dan created_at di tabel discussions dan assignments.'
        ]
      },
      // Discussion 4: Perbedaan role
      {
        discussion_id: 4,
        replies: [
          'Perbedaan utama: User/Student dapat mengikuti kelas, submit assignment, dan ikut diskusi. Assessor dapat melihat semua student, menilai assignment, manage materi, dan moderasi diskusi. Admin memiliki akses penuh ke semua fitur termasuk user management.',
          'Setiap role memiliki dashboard dan menu yang disesuaikan dengan kebutuhannya.'
        ]
      },
      // Discussion 5: Panduan sistem
      {
        discussion_id: 5,
        replies: [
          'Selamat datang di CodeSmart! Sistem ini dirancang untuk pembelajaran JavaScript secara bertahap. Mulai dari Fundamental, Intermediate, hingga Advance. Setiap level memiliki materi, assignment, dan quiz.',
          'Anda bisa mulai dengan mengikuti pretest untuk menentukan level awal, kemudian ikuti materi secara berurutan. Jangan ragu untuk bertanya di forum diskusi jika ada yang kurang jelas!'
        ]
      },
      // Discussion 6: JavaScript closures
      {
        discussion_id: 6,
        replies: [
          'Closure adalah function yang memiliki akses ke scope dari outer function setelah outer function tersebut selesai dieksekusi. Ini adalah salah satu konsep penting di JavaScript.',
          'Contoh sederhana:\n```javascript\nfunction outer() {\n  let count = 0;\n  return function inner() {\n    count++;\n    return count;\n  }\n}\n\nconst counter = outer();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n```\nFunction inner() masih bisa mengakses variable count dari outer() meski outer() sudah selesai.',
          'Closure sangat berguna untuk: 1) Data privacy/encapsulation, 2) Function factory, 3) Callbacks dan event handlers. Praktikkan dengan membuat beberapa contoh sendiri!'
        ]
      },
      // Discussion 7: let, const, var
      {
        discussion_id: 7,
        replies: [
          'Perbedaan utama:\n\n**var**: Function-scoped, dapat di-redeclare, hoisting dengan undefined\n**let**: Block-scoped, tidak dapat di-redeclare, hoisting tanpa inisialisasi (TDZ)\n**const**: Block-scoped, tidak dapat di-redeclare, tidak dapat di-reassign, harus diinisialisasi',
          'Best practice modern JavaScript:\n- Gunakan **const** sebagai default untuk semua variable\n- Gunakan **let** hanya jika value akan berubah\n- Hindari **var** karena function-scoped bisa menyebabkan bug',
          'Contoh:\n```javascript\nconst API_URL = "http://localhost:5000"; // Tidak akan berubah\nlet counter = 0; // Akan berubah\ncounter++; // OK\n\nAPI_URL = "http://other.com"; // ERROR!\n```',
          'Untuk object dan array dengan const, isi masih bisa diubah:\n```javascript\nconst user = {name: "hasan"};\nuser.name = "azzahra"; // OK\nuser = {}; // ERROR!\n```'
        ]
      },
      // Discussion 8: Arrow functions
      {
        discussion_id: 8,
        replies: [
          'Arrow functions memiliki beberapa perbedaan penting dengan regular functions:\n\n1. **Syntax lebih singkat**\n2. **Tidak memiliki `this` binding sendiri** - menggunakan lexical this\n3. **Tidak bisa digunakan sebagai constructor**\n4. **Tidak memiliki `arguments` object**',
          'Contoh perbedaan `this`:\n```javascript\nconst obj = {\n  name: "CodeSmart",\n  regular: function() {\n    console.log(this.name); // "CodeSmart"\n  },\n  arrow: () => {\n    console.log(this.name); // undefined atau global\n  }\n};\n```',
          'Kapan menggunakan arrow functions?\n- ✅ Callbacks dan array methods (map, filter, reduce)\n- ✅ Promise chains dan async operations\n- ✅ Fungsi yang tidak perlu `this` context\n\nKapan menggunakan regular functions?\n- ✅ Methods dalam object\n- ✅ Constructor functions\n- ✅ Event handlers yang perlu `this`',
          'Contoh praktis dengan array methods:\n```javascript\nconst numbers = [1, 2, 3, 4, 5];\n\n// Arrow function - clean!\nconst doubled = numbers.map(n => n * 2);\nconst evens = numbers.filter(n => n % 2 === 0);\nconst sum = numbers.reduce((acc, n) => acc + n, 0);\n```'
        ]
      },
      // Discussion 9: Promises dan async/await
      {
        discussion_id: 9,
        replies: [
          'Promises dan async/await adalah cara modern untuk handle asynchronous operations di JavaScript. Promise adalah object yang merepresentasikan eventual completion atau failure dari async operation.',
          'Promise memiliki 3 state:\n1. **Pending**: Initial state\n2. **Fulfilled**: Operation berhasil\n3. **Rejected**: Operation gagal\n\nContoh:\n```javascript\nconst fetchUser = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve({id: 1, name: "hasan"});\n  }, 1000);\n});\n\nfetchUser.then(user => console.log(user));\n```',
          'async/await adalah syntactic sugar untuk Promises yang membuat kode lebih mudah dibaca:\n\n```javascript\n// Dengan Promise chains\nfetchUser()\n  .then(user => fetchPosts(user.id))\n  .then(posts => console.log(posts))\n  .catch(err => console.error(err));\n\n// Dengan async/await\nasync function getUserPosts() {\n  try {\n    const user = await fetchUser();\n    const posts = await fetchPosts(user.id);\n    console.log(posts);\n  } catch(err) {\n    console.error(err);\n  }\n}\n```',
          'Best practices:\n1. Selalu gunakan try-catch dengan async/await\n2. Gunakan Promise.all() untuk multiple async operations yang independent\n3. Hindari mixing .then() dan async/await\n4. Handle error dengan baik',
          'Contoh Promise.all():\n```javascript\nasync function loadData() {\n  try {\n    const [users, posts, comments] = await Promise.all([\n      fetchUsers(),\n      fetchPosts(),\n      fetchComments()\n    ]);\n    // Semua berjalan parallel!\n  } catch(err) {\n    console.error(err);\n  }\n}\n```',
          'Real-world example dari aplikasi kita:\n```javascript\nasync loadDiscussions() {\n  try {\n    this.isLoading = true;\n    const response = await API_SERVICE.getDiscussions();\n    this.discussions = response.data;\n  } catch(error) {\n    console.error("Failed to load discussions:", error);\n    this.discussions = mockDiscussions; // Fallback\n  } finally {\n    this.isLoading = false;\n  }\n}\n```'
        ]
      },
      // Discussion 10: Array methods
      {
        discussion_id: 10,
        replies: [
          'Array methods map, filter, dan reduce adalah functional programming tools yang powerful! Mari saya jelaskan satu per satu dengan contoh praktis.',
          '**map()** - Transform setiap element\n```javascript\nconst students = [{name: "hasan", score: 80}, {name: "luthfi", score: 75}];\n\n// Ambil nama saja\nconst names = students.map(s => s.name);\n// ["hasan", "luthfi"]\n\n// Tambah 5 poin ke semua score\nconst boosted = students.map(s => ({\n  ...s,\n  score: s.score + 5\n}));\n```',
          '**filter()** - Select elements yang memenuhi kondisi\n```javascript\nconst numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n// Ambil genap saja\nconst evens = numbers.filter(n => n % 2 === 0);\n// [2, 4, 6, 8, 10]\n\n// Student dengan score >= 80\nconst topStudents = students.filter(s => s.score >= 80);\n```',
          '**reduce()** - Reduce array ke single value\n```javascript\nconst numbers = [1, 2, 3, 4, 5];\n\n// Sum\nconst sum = numbers.reduce((acc, n) => acc + n, 0);\n// 15\n\n// Average score\nconst avgScore = students.reduce((sum, s) => sum + s.score, 0) / students.length;\n\n// Group by level\nconst byLevel = students.reduce((groups, s) => {\n  groups[s.level] = groups[s.level] || [];\n  groups[s.level].push(s);\n  return groups;\n}, {});\n```',
          'Chain multiple methods untuk operasi complex:\n```javascript\nconst students = [\n  {name: "hasan", score: 80, active: true},\n  {name: "luthfi", score: 75, active: true},\n  {name: "ahmad", score: 90, active: false}\n];\n\n// Ambil active students, boost score +5, hitung rata-rata\nconst activeAverage = students\n  .filter(s => s.active)\n  .map(s => s.score + 5)\n  .reduce((sum, score) => sum + score, 0) / \n  students.filter(s => s.active).length;\n```',
          'Tips performance:\n- Gunakan for loop jika perlu break/continue\n- Avoid chaining terlalu banyak (maksimal 3-4)\n- Untuk array besar (>10000), consider optimization\n- map/filter/reduce create new array, tidak modify original'
        ]
      }
    ];

    // Insert replies
    for (const disc of azzahraReplies) {
      console.log(`\n📝 Discussion #${disc.discussion_id}:`);

      for (let i = 0; i < disc.replies.length; i++) {
        const reply = disc.replies[i];
        const timestamp = new Date(Date.now() + (i * 3600000)); // 1 hour apart

        await pool.query(
          `INSERT INTO discussion_replies (discussion_id, user_id, content, created_at)
           VALUES ($1, $2, $3, $4)`,
          [disc.discussion_id, 6, reply, timestamp] // user_id 6 = azzahra
        );

        console.log(`   ✅ Added reply ${i + 1}: ${reply.substring(0, 60)}...`);
        totalAdded++;
      }
    }

    console.log(`\n✅ Successfully added ${totalAdded} replies from azzahra (assessor)!\n`);

    // Show statistics
    const stats = await pool.query(`
      SELECT
        d.id,
        d.title,
        COUNT(dr.id) as total_replies,
        COUNT(CASE WHEN dr.user_id = 6 THEN 1 END) as azzahra_replies
      FROM discussions d
      LEFT JOIN discussion_replies dr ON d.id = dr.discussion_id
      GROUP BY d.id, d.title
      ORDER BY d.id
    `);

    console.log('📊 Discussion Statistics:\n');
    stats.rows.forEach(row => {
      console.log(`Discussion #${row.id}: ${row.title}`);
      console.log(`   Total replies: ${row.total_replies} | From azzahra: ${row.azzahra_replies}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

addAzzahraReplies();
