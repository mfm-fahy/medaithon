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
          console.log('Token:', response.token);
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

// Now test the doctor assignment endpoint
async function testDoctorAssignment(token) {
  return new Promise((resolve, reject) => {
    const patientId = 'P1761233880345'; // Use a valid patient ID
    
    const assignData = JSON.stringify({
      doctorCategory: 'Cardiology',
      roomNumber: 'C205',
      floor: '1st Floor',
      department: 'Cardiology'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/patients/navigation/${patientId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': assignData.length
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
    req.write(assignData);
    req.end();
  });
}

// Run the test
async function runTest() {
  try {
    console.log('🔵 Getting authentication token...');
    const token = await getToken();
    
    console.log('\n🔵 Testing doctor assignment endpoint...');
    const result = await testDoctorAssignment(token);
    
    console.log('\n✅ Test completed successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTest();

