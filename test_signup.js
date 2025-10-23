const http = require('http');

const data = JSON.stringify({
  username: 'testuser' + Date.now(),
  email: 'test' + Date.now() + '@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'patient',
  age: 30,
  sex: 'male',
  phone: '1234567890',
  occupation: 'Engineer',
  address: '123 Main St'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS:`, res.headers);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('\nRESPONSE BODY:');
    try {
      const parsed = JSON.parse(responseData);
      console.log(JSON.stringify(parsed, null, 2));
      
      if (parsed.user && parsed.user.patientId) {
        console.log('\n✅ SUCCESS! Patient ID:', parsed.user.patientId);
        console.log('✅ QR Code:', parsed.user.qrCode ? 'Present' : 'Missing');
        console.log('✅ Token:', parsed.token ? 'Present' : 'Missing');
      } else {
        console.log('\n❌ FAILED! Missing patientId or qrCode');
      }
    } catch (e) {
      console.log(responseData);
    }
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

console.log('Sending signup request...');
console.log('Data:', JSON.parse(data));
console.log('');

req.write(data);
req.end();

