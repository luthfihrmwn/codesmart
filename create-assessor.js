const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/v1';

async function createAssessor() {
    try {
        const userData = {
            name: 'guru',
            email: 'guru@app.com',
            password: 'guru123',
            role: 'assessor'
        };

        console.log('Creating assessor account...');
        console.log('Username:', userData.name);
        console.log('Email:', userData.email);
        console.log('Role:', userData.role);
        console.log('');

        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);

        if (response.data.success) {
            console.log('✅ Assessor account created successfully!');
            console.log('');
            console.log('Account Details:');
            console.log('- Name:', userData.name);
            console.log('- Email:', userData.email);
            console.log('- Password:', userData.password);
            console.log('- Role:', userData.role);
            console.log('');
            console.log('You can now login with these credentials.');
        } else {
            console.log('❌ Failed to create assessor:', response.data.message);
        }
    } catch (error) {
        if (error.response) {
            console.log('❌ Error creating assessor:', error.response.data.message || error.message);
        } else {
            console.log('❌ Error:', error.message);
        }
    }
}

createAssessor();
