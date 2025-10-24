const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const WasteRecord = require('./src/models/WasteRecord');
const CollectionTask = require('./src/models/CollectionTask');
const DispatchSchedule = require('./src/models/DispatchSchedule');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  addSampleWasteData();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

async function addSampleWasteData() {
  try {
    // Clear existing data
    await WasteRecord.deleteMany({});
    await CollectionTask.deleteMany({});
    await DispatchSchedule.deleteMany({});
    console.log('🗑️  Cleared existing waste data');

    // ==================== WASTE RECORDS ====================
    const wasteRecords = [
      {
        wasteId: 'WR-001',
        date: new Date('2025-10-24'),
        items: [
          { itemName: 'Contaminated Syringes', quantity: 15, unit: 'pieces', colorCode: 'Yellow' },
          { itemName: 'Infected Dressings', quantity: 8, unit: 'kg', colorCode: 'Yellow' },
        ],
        totalQuantity: 23,
        department: 'ICU',
        collectedBy: 'Nurse Sharma',
        status: 'Collected',
      },
      {
        wasteId: 'WR-002',
        date: new Date('2025-10-24'),
        items: [
          { itemName: 'Sharps (Needles)', quantity: 25, unit: 'pieces', colorCode: 'Red' },
          { itemName: 'Scalpels', quantity: 5, unit: 'pieces', colorCode: 'Red' },
        ],
        totalQuantity: 30,
        department: 'Surgery',
        collectedBy: 'Nurse Patel',
        status: 'Collected',
      },
      {
        wasteId: 'WR-003',
        date: new Date('2025-10-24'),
        items: [
          { itemName: 'Chemical Waste', quantity: 12, unit: 'liters', colorCode: 'Blue' },
          { itemName: 'Expired Medicines', quantity: 5, unit: 'kg', colorCode: 'Blue' },
        ],
        totalQuantity: 17,
        department: 'Pharmacy',
        collectedBy: 'Pharmacist Kumar',
        status: 'Pending',
      },
      {
        wasteId: 'WR-004',
        date: new Date('2025-10-24'),
        items: [
          { itemName: 'Paper Waste', quantity: 20, unit: 'kg', colorCode: 'White' },
          { itemName: 'Plastic Waste', quantity: 10, unit: 'kg', colorCode: 'White' },
        ],
        totalQuantity: 30,
        department: 'General Ward',
        collectedBy: 'Cleaner Singh',
        status: 'Collected',
      },
      {
        wasteId: 'WR-005',
        date: new Date('2025-10-23'),
        items: [
          { itemName: 'Contaminated Gloves', quantity: 12, unit: 'kg', colorCode: 'Yellow' },
          { itemName: 'Pathological Waste', quantity: 8, unit: 'kg', colorCode: 'Yellow' },
        ],
        totalQuantity: 20,
        department: 'Pathology Lab',
        collectedBy: 'Lab Tech Verma',
        status: 'Dispatched',
      },
    ];

    await WasteRecord.insertMany(wasteRecords);
    console.log('✅ Added 5 waste records');

    // ==================== COLLECTION TASKS ====================
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const collectionTasks = [
      {
        taskId: 'CT-001',
        date: today,
        timeSlot: 'Morning',
        assignedStaff: 'Nurse Sharma',
        location: 'ICU Ward',
        status: 'Completed',
        completedAt: new Date(),
        notes: 'All waste collected successfully',
      },
      {
        taskId: 'CT-002',
        date: today,
        timeSlot: 'Morning',
        assignedStaff: 'Nurse Patel',
        location: 'Surgery Block',
        status: 'In Progress',
        notes: 'Collection in progress',
      },
      {
        taskId: 'CT-003',
        date: today,
        timeSlot: 'Evening',
        assignedStaff: 'Pharmacist Kumar',
        location: 'Pharmacy',
        status: 'Pending',
        notes: null,
      },
      {
        taskId: 'CT-004',
        date: today,
        timeSlot: 'Evening',
        assignedStaff: 'Cleaner Singh',
        location: 'General Ward',
        status: 'Pending',
        notes: null,
      },
      {
        taskId: 'CT-005',
        date: tomorrow,
        timeSlot: 'Morning',
        assignedStaff: 'Lab Tech Verma',
        location: 'Pathology Lab',
        status: 'Pending',
        notes: null,
      },
    ];

    await CollectionTask.insertMany(collectionTasks);
    console.log('✅ Added 5 collection tasks');

    // ==================== DISPATCH SCHEDULES ====================
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const dispatchDate = new Date(today);
    dispatchDate.setDate(dispatchDate.getDate() + 3);

    const dispatchSchedules = [
      {
        dispatchId: 'DS-001',
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        dispatchDate: dispatchDate,
        processingPlant: 'Green Earth Biomedical Waste Management',
        plantLocation: 'Industrial Area, Mumbai',
        totalWasteQuantity: 120,
        wasteBreakdown: {
          yellow: 45,
          red: 35,
          blue: 25,
          white: 15,
        },
        status: 'Scheduled',
        dispatchedBy: null,
        dispatchedAt: null,
        notes: 'Weekly dispatch scheduled',
      },
      {
        dispatchId: 'DS-002',
        weekStartDate: new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000),
        weekEndDate: new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000),
        dispatchDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        processingPlant: 'EcoWaste Solutions',
        plantLocation: 'Pune Industrial Zone',
        totalWasteQuantity: 110,
        wasteBreakdown: {
          yellow: 40,
          red: 32,
          blue: 22,
          white: 16,
        },
        status: 'Delivered',
        dispatchedBy: 'Manager Desai',
        dispatchedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        notes: 'Successfully delivered',
      },
    ];

    await DispatchSchedule.insertMany(dispatchSchedules);
    console.log('✅ Added 2 dispatch schedules');

    // ==================== SUMMARY ====================
    console.log('\n📋 Sample Waste Management Data Added:\n');
    console.log('🟡 Yellow Waste (Infectious):');
    console.log('   - Contaminated Syringes: 15 pieces');
    console.log('   - Infected Dressings: 8 kg');
    console.log('   - Contaminated Gloves: 12 kg');
    console.log('   Total: 45 kg\n');

    console.log('🔴 Red Waste (Hazardous):');
    console.log('   - Sharps (Needles): 25 pieces');
    console.log('   - Scalpels: 5 pieces');
    console.log('   Total: 35 kg\n');

    console.log('🔵 Blue Waste (Chemical):');
    console.log('   - Chemical Waste: 12 liters');
    console.log('   - Expired Medicines: 5 kg');
    console.log('   Total: 25 kg\n');

    console.log('⚪ White Waste (Non-hazardous):');
    console.log('   - Paper Waste: 20 kg');
    console.log('   - Plastic Waste: 10 kg');
    console.log('   Total: 15 kg\n');

    console.log('📊 Collection Tasks:');
    console.log('   - Morning: 2 tasks');
    console.log('   - Evening: 2 tasks');
    console.log('   - Tomorrow: 1 task\n');

    console.log('🚚 Dispatch Schedules:');
    console.log('   - Scheduled: 1 dispatch');
    console.log('   - Delivered: 1 dispatch\n');

    console.log('✅ Sample waste management data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
}

