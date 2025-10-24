const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

db.once('open', async () => {
  console.log('✅ Connected to MongoDB');

  try {
    // Import models
    const { Patient } = require('./src/models/Patient');
    const { User } = require('./src/models/User');

    // Fetch all patients
    const patients = await Patient.find().populate('userId', 'name email');

    console.log('\n📋 ========================================');
    console.log('   PATIENT LIST');
    console.log('========================================\n');

    if (patients.length === 0) {
      console.log('❌ No patients found in database');
    } else {
      console.log(`✅ Found ${patients.length} patients:\n`);

      patients.forEach((patient, index) => {
        console.log(`${index + 1}. Patient ID: ${patient.patientId}`);
        console.log(`   Name: ${patient.userId?.name || 'N/A'}`);
        console.log(`   Email: ${patient.userId?.email || 'N/A'}`);
        console.log(`   Age: ${patient.age || 'N/A'}`);
        console.log(`   Sex: ${patient.sex || 'N/A'}`);
        console.log(`   Phone: ${patient.phone || 'N/A'}`);
        console.log(`   MongoDB ID: ${patient._id}`);
        console.log('');
      });

      console.log('========================================\n');
      console.log('💡 Use any of the Patient IDs above to scan in the Lab Technician app\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fetching patients:', error);
    process.exit(1);
  }
});

