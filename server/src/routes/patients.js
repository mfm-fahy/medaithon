const express = require('express');
const { Patient } = require('../models/Patient');
const { Doctor } = require('../models/Doctor');
const { Vitals } = require('../models/Vitals');
const { Prescription } = require('../models/Prescription');
const { LabTest } = require('../models/LabTest');
const { Injection } = require('../models/Injection');
const { Visit } = require('../models/Visit');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const wsManager = require('../services/websocket');

const router = express.Router();

// ============================================
// SPECIFIC ROUTES (must come before generic :id routes)
// ============================================

// Debug: Get all patients (for testing)
router.get('/debug/all', async (req, res) => {
  try {
    const patients = await Patient.find({}).select('patientId userId');
    console.log('🔵 All patients in database:', patients);
    res.json({ patients });
  } catch (error) {
    console.error('❌ Error fetching all patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error });
  }
});

// Get patients assigned to a specific doctor
router.get('/doctor/:doctorId', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req, res) => {
  try {
    console.log('🔵 Fetching patients for doctor:', req.params.doctorId);

    const patients = await Patient.find({
      'assignedDoctor.doctorId': req.params.doctorId,
      inQueue: true,
    })
      .populate('userId', 'username email name')
      .sort({ queuePosition: 1 });

    console.log('📝 Patients found:', patients.length);
    res.json({ patients });
  } catch (error) {
    console.error('❌ Error fetching patients for doctor:', error);
    res.status(500).json({ message: 'Error fetching patients', error });
  }
});

// Get patient by QR code (Patient ID)
router.get('/qr/:patientId', authMiddleware, roleMiddleware(['doctor', 'nurse', 'lab-technician', 'admin']), async (req, res) => {
  try {
    console.log('🔵 Fetching patient by QR code:', req.params.patientId);

    const patient = await Patient.findOne({ patientId: req.params.patientId }).populate('userId', 'username email name');

    console.log('📝 Patient found:', patient ? 'YES' : 'NO');
    if (patient) {
      console.log('   - Patient ID:', patient.patientId);
      console.log('   - User ID:', patient.userId ? patient.userId._id : 'NULL');
      console.log('   - User Name:', patient.userId ? patient.userId.name : 'NULL');
    }

    if (!patient) {
      console.log('❌ Patient not found');
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    // Get patient's vitals, prescriptions, and lab tests
    const vitals = await Vitals.find({ patientId: patient._id }).sort({ createdAt: -1 }).limit(5);
    const prescriptions = await Prescription.find({ patientId: patient._id }).sort({ createdAt: -1 }).limit(5);
    const labTests = await LabTest.find({ patientId: patient._id }).sort({ createdAt: -1 }).limit(5);

    console.log('✅ Patient data retrieved successfully');
    res.json({
      patient,
      vitals,
      prescriptions,
      labTests,
    });
  } catch (error) {
    console.error('❌ Error fetching patient by QR code:', error);
    res.status(500).json({ message: 'Error fetching patient by QR code', error });
  }
});

// Update patient by QR code (for doctors, nurses, lab technicians)
router.put('/qr/:patientId', authMiddleware, roleMiddleware(['doctor', 'nurse', 'lab-technician', 'admin']), async (req, res) => {
  try {
    const { medicalHistory, allergies, notes } = req.body;
    const userRole = req.userRole;

    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    // Update based on role
    if (userRole === 'doctor' || userRole === 'admin') {
      if (medicalHistory) patient.medicalHistory = medicalHistory;
      if (allergies) patient.allergies = allergies;
    }

    if (userRole === 'nurse' || userRole === 'admin') {
      if (medicalHistory) patient.medicalHistory = medicalHistory;
    }

    if (userRole === 'lab-technician' || userRole === 'admin') {
      // Lab technicians can add notes to medical history
      if (notes) {
        patient.medicalHistory = (patient.medicalHistory || '') + '\n[Lab Notes] ' + notes;
      }
    }

    await patient.save();
    res.json({ message: 'Patient updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error });
  }
});

// Update patient navigation with doctor category and room (nurse only)
router.put('/navigation/:patientId', authMiddleware, roleMiddleware(['nurse', 'admin']), async (req, res) => {
  try {
    const { doctorCategory, roomNumber, floor, department, doctorId, doctorName } = req.body;
    const patientId = req.params.patientId;

    console.log('🔵 Updating patient navigation:', {
      patientId,
      doctorCategory,
      roomNumber,
      floor,
      department,
      doctorId,
      doctorName,
    });

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      console.log('❌ Patient not found');
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    // Update hospital navigation
    patient.hospitalNavigation = {
      roomNumber: roomNumber || 'TBD',
      floor: floor || 'Ground Floor',
      department: department || doctorCategory || 'General',
      directions: `Please proceed to ${department || doctorCategory || 'General'} department, Room ${roomNumber || 'TBD'}`,
      estimatedWaitTime: 15,
      status: 'scheduled',
      lastUpdated: new Date(),
    };

    // Assign doctor and add to queue
    if (doctorId) {
      patient.assignedDoctor = {
        doctorId: doctorId,
        doctorName: doctorName || 'Doctor',
        specialization: doctorCategory || department,
        roomNumber: roomNumber,
        floor: floor,
        assignedAt: new Date(),
      };
      patient.inQueue = true;
      patient.queuePosition = 1; // Will be updated when other patients are added
      console.log('👨‍⚕️  Doctor assigned:', doctorName, 'Specialization:', doctorCategory);
    }

    await patient.save();
    console.log('✅ Patient navigation updated successfully');

    // Send real-time WebSocket update to patient
    console.log('🔌 Sending WebSocket update to patient:', patientId);
    wsManager.sendNavigationUpdate(patientId, patient.hospitalNavigation);
    wsManager.storeNavigationUpdate(patientId, patient.hospitalNavigation);

    // Broadcast to doctor's dashboard if doctor is assigned
    if (doctorId) {
      console.log('🔌 Broadcasting to doctor dashboard:', doctorId);
      wsManager.broadcastToDoctorQueue(doctorId, {
        type: 'patient-added-to-queue',
        patient: {
          _id: patient._id,
          patientId: patient.patientId,
          name: patient.userId?.name,
          age: patient.age,
          sex: patient.sex,
          queuePosition: patient.queuePosition,
        },
      });
    }

    res.json({
      message: 'Patient navigation updated successfully',
      patient,
      hospitalNavigation: patient.hospitalNavigation,
    });
  } catch (error) {
    console.error('❌ Error updating patient navigation:', error);
    res.status(500).json({ message: 'Error updating patient navigation', error });
  }
});

// ============================================
// GENERIC ROUTES (must come after specific routes)
// ============================================

// Get all patients
router.get('/', authMiddleware, roleMiddleware(['admin', 'doctor', 'nurse', 'pharmacist']), async (req, res) => {
  try {
    const patients = await Patient.find().populate('userId', 'username email name');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error });
  }
});

// Get patient by ID with all related data (prescriptions, lab tests, injections, visits)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'username email name');
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    // Get related data
    const prescriptions = await Prescription.find({ patientId: req.params.id }).sort({ createdAt: -1 });
    const labTests = await LabTest.find({ patientId: req.params.id }).sort({ createdAt: -1 });
    const injections = await Injection.find({ patientId: req.params.id }).sort({ createdAt: -1 });
    const visits = await Visit.find({ patientId: req.params.id }).sort({ createdAt: -1 });
    const vitals = await Vitals.find({ patientId: req.params.id }).sort({ createdAt: -1 });

    res.json({
      patient,
      prescriptions,
      labTests,
      injections,
      visits,
      vitals,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error });
  }
});

// Update patient
router.put('/:id', authMiddleware, roleMiddleware(['patient', 'admin']), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }
    res.json({ message: 'Patient updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error });
  }
});

// Get patient vitals
router.get('/:id/vitals', authMiddleware, async (req, res) => {
  try {
    const vitals = await Vitals.find({ patientId: req.params.id }).populate('nurseId', 'userId');
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vitals', error });
  }
});

// Get patient prescriptions
router.get('/:id/prescriptions', authMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.id })
      .populate('doctorId', 'userId')
      .populate('patientId', 'userId');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error });
  }
});

// Get patient lab tests
router.get('/:id/lab-tests', authMiddleware, async (req, res) => {
  try {
    const labTests = await LabTest.find({ patientId: req.params.id }).populate('labTechnicianId', 'userId');
    res.json(labTests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab tests', error });
  }
});

// Save patient record with diagnosis, medicines, injection, and lab test details
router.post('/:patientId/save-record', authMiddleware, roleMiddleware(['doctor']), async (req, res) => {
  try {
    const { patientId } = req.params;
    const {
      diagnosis,
      remarks,
      advice,
      medicines,
      needsInjection,
      injectionDetails,
      needsLabTest,
      labTestDetails,
      vitals,
    } = req.body;

    console.log('🔵 Saving patient record for:', patientId);

    // Find patient by patientId (not MongoDB _id)
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      console.log('❌ Patient not found');
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    // Get doctor ID from auth
    const doctorId = req.userId;

    // Get doctor details
    const doctor = await Doctor.findOne({ userId: doctorId }).populate('userId', 'name');
    const doctorName = doctor?.userId?.name || 'Doctor';

    // Helper function to generate random room number
    const generateRandomRoom = () => {
      const floors = ['Ground', '1st', '2nd', '3rd'];
      const floor = floors[Math.floor(Math.random() * floors.length)];
      const roomNum = Math.floor(Math.random() * 100) + 1;
      return `${floor[0]}${roomNum}`;
    };

    // Update patient record
    patient.diagnosis = diagnosis;
    patient.remarks = remarks;
    patient.advice = advice;
    patient.prescribedMedicines = medicines.filter((m) => m.medicine && m.medicine.trim());

    // Add remarks to history if remarks exist
    if (remarks && remarks.trim()) {
      if (!patient.remarksHistory) {
        patient.remarksHistory = [];
      }
      patient.remarksHistory.push({
        text: remarks,
        doctorId: doctorId,
        doctorName: doctorName,
        createdAt: new Date(),
      });
    }

    // Save prescriptions to Prescription collection
    const validMedicines = medicines.filter((m) => m.medicine && m.medicine.trim());
    for (const medicine of validMedicines) {
      const prescription = new Prescription({
        patientId: patient._id,
        doctorId: doctorId,
        medicine: medicine.medicine,
        route: medicine.route || 'Oral',
        dose: medicine.dose,
        frequency: medicine.frequency,
        duration: medicine.duration || '7 days',
        advice: advice,
        status: 'active',
      });
      await prescription.save();
      console.log('💊 Prescription saved:', medicine.medicine);
    }

    // Handle injection details
    if (needsInjection && injectionDetails) {
      patient.injectionDetails = {
        required: true,
        details: injectionDetails,
        roomNumber: generateRandomRoom(),
        floor: 'Ground Floor',
        status: 'pending',
        updatedAt: new Date(),
      };

      // Save injection to Injection collection
      const injection = new Injection({
        patientId: patient._id,
        doctorId: doctorId,
        injectionName: injectionDetails,
        injectionType: 'IV',
        dose: 'As per doctor prescription',
        frequency: 'As per doctor prescription',
        status: 'pending',
        notes: injectionDetails,
      });
      await injection.save();
      console.log('💉 Injection saved:', injectionDetails);
    }

    // Handle lab test details
    if (needsLabTest && labTestDetails) {
      patient.labTestDetails = {
        required: true,
        details: labTestDetails,
        roomNumber: generateRandomRoom(),
        floor: 'Ground Floor',
        status: 'pending',
        updatedAt: new Date(),
      };

      // Save lab test to LabTest collection
      const labTest = new LabTest({
        patientId: patient._id,
        doctorId: doctorId,
        testName: labTestDetails,
        sampleType: 'Blood',
        status: 'pending',
        notes: labTestDetails,
      });
      await labTest.save();
      console.log('🧪 Lab test saved:', labTestDetails);
    }

    // Create or update visit record
    const visit = new Visit({
      patientId: patient._id,
      visitType: 'follow-up',
      symptoms: 'Consultation',
      description: diagnosis,
      status: 'completed',
      assignedDoctorId: doctorId,
      diagnosis: diagnosis,
      advice: advice,
      remarks: remarks,
      vitals: vitals || {},
    });
    await visit.save();
    console.log('📋 Visit record saved');

    // Remove from queue
    patient.inQueue = false;
    patient.queuePosition = null;

    await patient.save();
    console.log('✅ Patient record saved successfully');

    // Send WebSocket update to patient with new navigation
    if (needsInjection || needsLabTest) {
      const navigationUpdate = {
        type: 'navigation-update',
        data: {
          patientId: patient.patientId,
          injection: needsInjection ? patient.injectionDetails : null,
          labTest: needsLabTest ? patient.labTestDetails : null,
          prescribedMedicines: patient.prescribedMedicines,
          lastUpdated: new Date(),
        },
      };

      console.log('🔌 Sending WebSocket update to patient:', patient.patientId);
      wsManager.sendNavigationUpdate(patient.patientId, navigationUpdate.data);
    }

    res.json({
      message: 'Patient record saved successfully',
      patient,
      prescriptions: validMedicines.length,
      injections: needsInjection ? 1 : 0,
      labTests: needsLabTest ? 1 : 0,
    });
  } catch (error) {
    console.error('❌ Error saving patient record:', error);
    res.status(500).json({ message: 'Error saving patient record', error });
  }
});

// Get remarks history for a patient
router.get('/:patientId/remarks-history', authMiddleware, roleMiddleware(['doctor', 'nurse', 'admin']), async (req, res) => {
  try {
    const { patientId } = req.params;

    console.log('📝 Fetching remarks history for patient:', patientId);

    // Find patient by patientId
    const patient = await Patient.findOne({ patientId }).populate('userId', 'name email');
    if (!patient) {
      console.log('❌ Patient not found');
      return res.status(404).json({ error: 'Patient not found' });
    }

    const remarksHistory = patient.remarksHistory || [];
    console.log('✅ Remarks history fetched:', remarksHistory.length, 'remarks');

    res.json({
      success: true,
      patientId: patient.patientId,
      patientName: patient.userId?.name,
      remarksHistory: remarksHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      count: remarksHistory.length,
    });
  } catch (error) {
    console.error('❌ Error fetching remarks history:', error);
    res.status(500).json({ error: 'Failed to fetch remarks history', details: error.message });
  }
});

// Delete a specific remark from history
router.delete('/:patientId/remarks/:remarkId', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req, res) => {
  try {
    const { patientId, remarkId } = req.params;

    console.log('🗑️ Deleting remark:', remarkId, 'for patient:', patientId);

    // Find patient by patientId
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      console.log('❌ Patient not found');
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Remove remark from history
    if (!patient.remarksHistory) {
      return res.status(404).json({ error: 'No remarks history found' });
    }

    const initialLength = patient.remarksHistory.length;
    patient.remarksHistory = patient.remarksHistory.filter((r) => r._id.toString() !== remarkId);

    if (patient.remarksHistory.length === initialLength) {
      console.log('❌ Remark not found');
      return res.status(404).json({ error: 'Remark not found' });
    }

    await patient.save();
    console.log('✅ Remark deleted successfully');

    res.json({
      success: true,
      message: 'Remark deleted successfully',
      remarksHistory: patient.remarksHistory,
    });
  } catch (error) {
    console.error('❌ Error deleting remark:', error);
    res.status(500).json({ error: 'Failed to delete remark', details: error.message });
  }
});

module.exports = router;

