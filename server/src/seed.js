const mongoose = require('mongoose');
require('dotenv').config();
const { User } = require('./models/User');
const { Patient } = require('./models/Patient');
const { Doctor } = require('./models/Doctor');
const { Nurse } = require('./models/Nurse');
const { Pharmacist } = require('./models/Pharmacist');
const { LabTechnician } = require('./models/LabTechnician');
const { Admin } = require('./models/Admin');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-management';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Nurse.deleteMany({});
    await Pharmacist.deleteMany({});
    await LabTechnician.deleteMany({});
    await Admin.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create test users
    const testUsers = [
      {
        username: 'patient_john',
        email: 'patient.john@example.com',
        password: 'password123',
        name: 'John Patient',
        role: 'patient',
      },
      {
        username: 'dr_smith',
        email: 'dr.smith@example.com',
        password: 'password123',
        name: 'Dr. Smith',
        role: 'doctor',
      },
      {
        username: 'nurse_alice',
        email: 'nurse.alice@example.com',
        password: 'password123',
        name: 'Alice Nurse',
        role: 'nurse',
      },
      {
        username: 'pharmacist_mike',
        email: 'pharmacist.mike@example.com',
        password: 'password123',
        name: 'Mike Pharmacist',
        role: 'pharmacist',
      },
      {
        username: 'lab_tech_sarah',
        email: 'lab.tech.sarah@example.com',
        password: 'password123',
        name: 'Sarah Lab Technician',
        role: 'labTechnician',
      },
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
      },
    ];

    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.username} (${userData.role})`);

      // Create role-specific documents
      if (userData.role === 'patient') {
        const patientId = `P${Date.now()}`;
        await Patient.create({
          userId: user._id,
          patientId,
          age: 30,
          sex: 'male',
          phone: '1234567890',
          occupation: 'Engineer',
          address: '123 Main St',
        });
        console.log(`   └─ Created patient record: ${patientId}`);
      } else if (userData.role === 'doctor') {
        await Doctor.create({
          userId: user._id,
          designation: 'Senior Doctor',
          specialization: 'General Medicine',
          licenseNumber: 'DOC123456',
          department: 'General Medicine',
          yearsOfExperience: 10,
        });
        console.log(`   └─ Created doctor record`);
      } else if (userData.role === 'nurse') {
        await Nurse.create({
          userId: user._id,
          licenseNumber: 'NURSE123456',
          department: 'General Ward',
        });
        console.log(`   └─ Created nurse record`);
      } else if (userData.role === 'pharmacist') {
        await Pharmacist.create({
          userId: user._id,
          licenseNumber: 'PHARM123456',
        });
        console.log(`   └─ Created pharmacist record`);
      } else if (userData.role === 'labTechnician') {
        await LabTechnician.create({
          userId: user._id,
          licenseNumber: 'LAB123456',
          department: 'Laboratory',
        });
        console.log(`   └─ Created lab technician record`);
      } else if (userData.role === 'admin') {
        await Admin.create({
          userId: user._id,
          department: 'Administration',
        });
        console.log(`   └─ Created admin record`);
      }
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Patient: patient_john / password123');
    console.log('   Doctor: dr_smith / password123');
    console.log('   Nurse: nurse_alice / password123');
    console.log('   Pharmacist: pharmacist_mike / password123');
    console.log('   Lab Technician: lab_tech_sarah / password123');
    console.log('   Admin: admin / admin123');

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

