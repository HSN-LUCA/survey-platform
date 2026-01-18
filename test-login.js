// Simple test script to verify login works
const http = require('http');

const data = JSON.stringify({
  email: 'admin@example.com',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', responseData);
    
    if (res.statusCode === 200) {
      console.log('\n✅ Login successful!');
      const response = JSON.parse(responseData);
      console.log('Token:', response.token.substring(0, 20) + '...');
      console.log('Admin:', response.admin);
    } else {
      console.log('\n❌ Login failed');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
