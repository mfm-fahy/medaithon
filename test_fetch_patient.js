const http = require('http');

// First, let's get a valid token by logging in
async function getToken() {
  return new Promise((resolve, reject) => {
    const loginData = JSON.stringify({
      username: 'nurse_alice',
      password: 'password123'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Login successful');
          resolve(response.token);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(loginData);
    req.end();
  });
}

// Test fetching patient by QR code
async function testFetchPatient(token, patientId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/patients/qr/${patientId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('Response Status:', res.statusCode);
        console.log('Response Headers:', res.headers);
        console.log('Response Body:', data);
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Run the test
async function runTest() {
  try {
    console.log('🔵 Getting authentication token...');
    const token = await getToken();
    
    console.log('\n🔵 Testing fetch patient endpoint...');
    const patientId = 'P1761233880345';
    console.log('Patient ID:', patientId);
    
    const result = await testFetchPatient(token, patientId);
    
    console.log('\n✅ Test completed successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTest();

