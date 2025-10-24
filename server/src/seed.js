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
      // General Medicine Doctors
      {
        username: 'dr_general_1',
        email: 'dr.general1@example.com',
        password: 'password123',
        name: 'Dr. Rajesh Kumar',
        role: 'doctor',
        specialization: 'General Medicine',
      },
      {
        username: 'dr_general_2',
        email: 'dr.general2@example.com',
        password: 'password123',
        name: 'Dr. Priya Sharma',
        role: 'doctor',
        specialization: 'General Medicine',
      },
      // Cardiology Doctors
      {
        username: 'dr_cardio_1',
        email: 'dr.cardio1@example.com',
        password: 'password123',
        name: 'Dr. Amit Patel',
        role: 'doctor',
        specialization: 'Cardiology',
      },
      {
        username: 'dr_cardio_2',
        email: 'dr.cardio2@example.com',
        password: 'password123',
        name: 'Dr. Neha Gupta',
        role: 'doctor',
        specialization: 'Cardiology',
      },
      // Orthopedics Doctors
      {
        username: 'dr_ortho_1',
        email: 'dr.ortho1@example.com',
        password: 'password123',
        name: 'Dr. Vikram Singh',
        role: 'doctor',
        specialization: 'Orthopedics',
      },
      {
        username: 'dr_ortho_2',
        email: 'dr.ortho2@example.com',
        password: 'password123',
        name: 'Dr. Anjali Verma',
        role: 'doctor',
        specialization: 'Orthopedics',
      },
      // Pediatrics Doctors
      {
        username: 'dr_pedia_1',
        email: 'dr.pedia1@example.com',
        password: 'password123',
        name: 'Dr. Suresh Nair',
        role: 'doctor',
        specialization: 'Pediatrics',
      },
      {
        username: 'dr_pedia_2',
        email: 'dr.pedia2@example.com',
        password: 'password123',
        name: 'Dr. Meera Iyer',
        role: 'doctor',
        specialization: 'Pediatrics',
      },
      // Neurology Doctors
      {
        username: 'dr_neuro_1',
        email: 'dr.neuro1@example.com',
        password: 'password123',
        name: 'Dr. Arjun Desai',
        role: 'doctor',
        specialization: 'Neurology',
      },
      {
        username: 'dr_neuro_2',
        email: 'dr.neuro2@example.com',
        password: 'password123',
        name: 'Dr. Divya Reddy',
        role: 'doctor',
        specialization: 'Neurology',
      },
      // General Surgery Doctors
      {
        username: 'dr_surgery_1',
        email: 'dr.surgery1@example.com',
        password: 'password123',
        name: 'Dr. Rohan Malhotra',
        role: 'doctor',
        specialization: 'General Surgery',
      },
      {
        username: 'dr_surgery_2',
        email: 'dr.surgery2@example.com',
        password: 'password123',
        name: 'Dr. Kavya Menon',
        role: 'doctor',
        specialization: 'General Surgery',
      },
      // Radiology Doctors
      {
        username: 'dr_radio_1',
        email: 'dr.radio1@example.com',
        password: 'password123',
        name: 'Dr. Sanjay Bhat',
        role: 'doctor',
        specialization: 'Radiology',
      },
      {
        username: 'dr_radio_2',
        email: 'dr.radio2@example.com',
        password: 'password123',
        name: 'Dr. Pooja Saxena',
        role: 'doctor',
        specialization: 'Radiology',
      },
      // Emergency Doctors
      {
        username: 'dr_emergency_1',
        email: 'dr.emergency1@example.com',
        password: 'password123',
        name: 'Dr. Nikhil Joshi',
        role: 'doctor',
        specialization: 'Emergency',
      },
      {
        username: 'dr_emergency_2',
        email: 'dr.emergency2@example.com',
        password: 'password123',
        name: 'Dr. Riya Chopra',
        role: 'doctor',
        specialization: 'Emergency',
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
        const licenseNumber = `DOC${Date.now().toString().slice(-6)}`;
        await Doctor.create({
          userId: user._id,
          designation: 'Senior Doctor',
          specialization: userData.specialization || 'General Medicine',
          licenseNumber: licenseNumber,
          department: userData.specialization || 'General Medicine',
          yearsOfExperience: 10,
        });
        console.log(`   └─ Created doctor record (${userData.specialization || 'General Medicine'})`);
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
    console.log('\n👤 PATIENT:');
    console.log('   patient_john / password123');
    console.log('\n👨‍⚕️  DOCTORS (By Specialization):');
    console.log('   General Medicine:');
    console.log('      dr_general_1 / password123 (Dr. Rajesh Kumar)');
    console.log('      dr_general_2 / password123 (Dr. Priya Sharma)');
    console.log('   Cardiology:');
    console.log('      dr_cardio_1 / password123 (Dr. Amit Patel)');
    console.log('      dr_cardio_2 / password123 (Dr. Neha Gupta)');
    console.log('   Orthopedics:');
    console.log('      dr_ortho_1 / password123 (Dr. Vikram Singh)');
    console.log('      dr_ortho_2 / password123 (Dr. Anjali Verma)');
    console.log('   Pediatrics:');
    console.log('      dr_pedia_1 / password123 (Dr. Suresh Nair)');
    console.log('      dr_pedia_2 / password123 (Dr. Meera Iyer)');
    console.log('   Neurology:');
    console.log('      dr_neuro_1 / password123 (Dr. Arjun Desai)');
    console.log('      dr_neuro_2 / password123 (Dr. Divya Reddy)');
    console.log('   General Surgery:');
    console.log('      dr_surgery_1 / password123 (Dr. Rohan Malhotra)');
    console.log('      dr_surgery_2 / password123 (Dr. Kavya Menon)');
    console.log('   Radiology:');
    console.log('      dr_radio_1 / password123 (Dr. Sanjay Bhat)');
    console.log('      dr_radio_2 / password123 (Dr. Pooja Saxena)');
    console.log('   Emergency:');
    console.log('      dr_emergency_1 / password123 (Dr. Nikhil Joshi)');
    console.log('      dr_emergency_2 / password123 (Dr. Riya Chopra)');
    console.log('\n👩‍⚕️  NURSE:');
    console.log('   nurse_alice / password123');
    console.log('\n💊 PHARMACIST:');
    console.log('   pharmacist_mike / password123');
    console.log('\n🧪 LAB TECHNICIAN:');
    console.log('   lab_tech_sarah / password123');
    console.log('\n🔐 ADMIN:');
    console.log('   admin / admin123');

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

