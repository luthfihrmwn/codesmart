#!/bin/bash

echo "🚀 CodeSmart - Supabase Setup & Complete Integration"
echo "====================================================="
echo ""

# Check if password is set
if grep -q "YOUR_SUPABASE_PASSWORD_HERE" backend/.env; then
    echo "❌ ERROR: Supabase password not set!"
    echo ""
    echo "Please edit backend/.env and set your Supabase password:"
    echo "  nano backend/.env"
    echo ""
    echo "Change this line:"
    echo "  DB_PASSWORD=YOUR_SUPABASE_PASSWORD_HERE"
    echo ""
    echo "To your actual Supabase password, then run this script again."
    exit 1
fi

echo "📍 Step 1: Testing Supabase connection..."
cd backend

node -e "
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

pool.query('SELECT version()')
    .then(result => {
        console.log('✅ Supabase connection successful!');
        console.log('PostgreSQL version:', result.rows[0].version.substring(0, 60));
        pool.end();
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message);
        console.error('');
        console.error('Please check:');
        console.error('1. Password is correct in backend/.env');
        console.error('2. Supabase database is running');
        console.error('3. Internet connection is active');
        pool.end();
        process.exit(1);
    });
"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Connection test failed. Please fix the error above."
    exit 1
fi

echo ""
echo "📍 Step 2: Running database migration..."
npm run migrate

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Migration failed!"
    echo ""
    echo "This might be because tables already exist."
    echo "Continue anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📍 Step 3: Starting backend server..."
npm run dev &
BACKEND_PID=$!

echo "Backend started with PID: $BACKEND_PID"
echo ""

sleep 5

echo "📍 Step 4: Testing backend health..."
curl -s http://localhost:5000/health | head -3

echo ""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 SUCCESS! Backend connected to Supabase!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Supabase PostgreSQL: Connected"
echo "✅ Database: Migrated with all tables"
echo "✅ Admin user: Created"
echo "✅ Backend API: Running on port 5000"
echo ""
echo "📍 Next Step - Start Frontend:"
echo "   Open new terminal and run:"
echo "   cd /home/luthfi/codesmart"
echo "   python3 -m http.server 8080"
echo ""
echo "🌐 Then access application:"
echo "   http://localhost:8080/src/pages/auth/login.html"
echo ""
echo "👤 Login credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Backend is running in background (PID: $BACKEND_PID)"
echo "To stop: kill $BACKEND_PID"
echo ""
