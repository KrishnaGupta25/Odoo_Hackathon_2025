const axios = require('axios');

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    const response = await axios.post('http://localhost:5000/api/admin/create');
    console.log('Admin user created successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@rewear.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

createAdmin(); 