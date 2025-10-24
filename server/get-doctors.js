const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const { User } = require('./src/models/User');
const { Doctor } = require('./src/models/Doctor');

const getDoctors = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-management';
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Get all doctors with their user information
    const doctors = await Doctor.find().populate('userId');
    
    if (doctors.length === 0) {
      console.log('❌ No doctors found in the database');
      await mongoose.disconnect();
      return;
    }

    console.log('📋 DOCTORS CREDENTIALS');
    console.log('='.repeat(80));
    console.log(`Total Doctors: ${doctors.length}\n`);

    doctors.forEach((doctor, index) => {
      const user = doctor.userId;
      console.log(`${index + 1}. Doctor: ${user.name}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Specialization: ${doctor.specialization || 'N/A'}`);
      console.log(`   Department: ${doctor.department || 'N/A'}`);
      console.log(`   Designation: ${doctor.designation || 'N/A'}`);
      console.log(`   License Number: ${doctor.licenseNumber || 'N/A'}`);
      console.log(`   Years of Experience: ${doctor.yearsOfExperience || 'N/A'}`);
      console.log('-'.repeat(80));
    });

    console.log('\n✅ Doctors credentials retrieved successfully');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

getDoctors();

