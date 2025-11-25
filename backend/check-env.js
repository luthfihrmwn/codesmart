require('dotenv').config();
console.log('=== Environment Variables ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD type:', typeof process.env.DB_PASSWORD);
console.log('DB_PASSWORD value:', process.env.DB_PASSWORD);
console.log('DB_PASSWORD as String:', String(process.env.DB_PASSWORD));
console.log('Is string?:', typeof String(process.env.DB_PASSWORD) === 'string');
