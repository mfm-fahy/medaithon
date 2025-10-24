const mongoose = require('mongoose');
const Equipment = require('./src/models/Equipment');
require('dotenv').config();

const sampleEquipment = [
  {
    equipmentId: 'EQ-001',
    name: 'Ventilator',
    model: 'Siemens SERVO-i',
    serialNumber: 'SN-VEN-001',
    department: 'ICU',
    purchaseDate: new Date('2022-01-15'),
    lastServiceDate: new Date('2024-09-01'),
    nextServiceDue: new Date('2024-12-01'),
    status: 'Active',
    usageHours: 2450,
    criticalityLevel: 'Critical'
  },
  {
    equipmentId: 'EQ-002',
    name: 'ECG Machine',
    model: 'Philips PageWriter',
    serialNumber: 'SN-ECG-002',
    department: 'Cardiology',
    purchaseDate: new Date('2021-06-20'),
    lastServiceDate: new Date('2024-08-15'),
    nextServiceDue: new Date('2024-11-15'),
    status: 'Active',
    usageHours: 3200,
    criticalityLevel: 'High'
  },
  {
    equipmentId: 'EQ-003',
    name: 'Infusion Pump',
    model: 'Baxter Colleague',
    serialNumber: 'SN-INF-003',
    department: 'General Ward',
    purchaseDate: new Date('2023-03-10'),
    lastServiceDate: new Date('2024-07-20'),
    nextServiceDue: new Date('2024-10-20'),
    status: 'Active',
    usageHours: 1800,
    criticalityLevel: 'High'
  },
  {
    equipmentId: 'EQ-004',
    name: 'Defibrillator',
    model: 'Philips HeartStart',
    serialNumber: 'SN-DEF-004',
    department: 'Emergency',
    purchaseDate: new Date('2022-11-05'),
    lastServiceDate: new Date('2024-06-10'),
    nextServiceDue: new Date('2024-12-10'),
    status: 'Due Soon',
    usageHours: 450,
    criticalityLevel: 'Critical'
  },
  {
    equipmentId: 'EQ-005',
    name: 'Patient Monitor',
    model: 'GE Carescape',
    serialNumber: 'SN-MON-005',
    department: 'ICU',
    purchaseDate: new Date('2023-05-12'),
    lastServiceDate: new Date('2024-05-15'),
    nextServiceDue: new Date('2024-11-15'),
    status: 'Active',
    usageHours: 2100,
    criticalityLevel: 'Critical'
  },
  {
    equipmentId: 'EQ-006',
    name: 'Suction Apparatus',
    model: 'Medela Pump',
    serialNumber: 'SN-SUC-006',
    department: 'Surgery',
    purchaseDate: new Date('2022-08-22'),
    lastServiceDate: new Date('2024-04-10'),
    nextServiceDue: new Date('2024-10-10'),
    status: 'Overdue',
    usageHours: 1600,
    criticalityLevel: 'High'
  },
  {
    equipmentId: 'EQ-007',
    name: 'X-Ray Machine',
    model: 'Siemens AXIOM',
    serialNumber: 'SN-XRY-007',
    department: 'Radiology',
    purchaseDate: new Date('2020-12-01'),
    lastServiceDate: new Date('2024-03-20'),
    nextServiceDue: new Date('2024-09-20'),
    status: 'Overdue',
    usageHours: 5200,
    criticalityLevel: 'High'
  }
];

async function addSampleEquipment() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_management');
    console.log('✅ Connected to MongoDB');

    // Clear existing equipment
    await Equipment.deleteMany({});
    console.log('🗑️  Cleared existing equipment');

    // Add sample equipment
    const result = await Equipment.insertMany(sampleEquipment);
    console.log(`✅ Added ${result.length} sample equipment items`);

    // Display added equipment
    console.log('\n📋 Sample Equipment Added:');
    result.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.equipmentId}) - ${item.department}`);
    });

    console.log('\n✅ Sample equipment added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample equipment:', error);
    process.exit(1);
  }
}

addSampleEquipment();

