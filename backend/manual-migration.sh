#!/bin/bash

echo "🚀 CodeSmart Manual Migration"
echo "=============================="
echo ""

# Run schema
echo "📖 Running schema.sql..."
sudo -u postgres psql -d codesmart -f /home/luthfi/codesmart/backend/migrations/schema.sql

if [ $? -ne 0 ]; then
    echo "❌ Schema migration failed!"
    exit 1
fi

echo "✅ Schema created successfully!"
echo ""

# Create admin user
echo "👤 Creating admin user..."
sudo -u postgres psql -d codesmart <<EOF
DO \$\$
DECLARE
    hashed_password TEXT;
BEGIN
    -- Hash password using pgcrypto
    SELECT crypt('admin123', gen_salt('bf', 10)) INTO hashed_password;

    -- Insert admin user
    INSERT INTO users (username, email, password, name, role, status)
    VALUES ('admin', 'admin@codesmart.com', hashed_password, 'Administrator', 'admin', 'active')
    ON CONFLICT (email) DO NOTHING;
END \$\$;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Admin user created!"
    echo ""
    echo "🎉 Migration completed successfully!"
    echo ""
    echo "📝 Default Admin Credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "🌐 Test login at: http://localhost:8080/src/pages/auth/login.html"
else
    echo "❌ Failed to create admin user!"
    exit 1
fi
