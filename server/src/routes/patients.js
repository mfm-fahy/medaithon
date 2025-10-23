const express = require('express');
const { Patient } = require('../models/Patient');
const { Vitals } = require('../models/Vitals');
const { Prescription } = require('../models/Prescription');
const { LabTest } = require('../models/LabTest');
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
    const { doctorCategory, roomNumber, floor, department } = req.body;
    const patientId = req.params.patientId;

    console.log('🔵 Updating patient navigation:', {
      patientId,
      doctorCategory,
      roomNumber,
      floor,
      department,
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

    await patient.save();
    console.log('✅ Patient navigation updated successfully');

    // Send real-time WebSocket update to patient
    console.log('🔌 Sending WebSocket update to patient:', patientId);
    wsManager.sendNavigationUpdate(patientId, patient.hospitalNavigation);
    wsManager.storeNavigationUpdate(patientId, patient.hospitalNavigation);

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
router.get('/', authMiddleware, roleMiddleware(['admin', 'doctor', 'nurse']), async (req, res) => {
  try {
    const patients = await Patient.find().populate('userId', 'username email name');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error });
  }
});

// Get patient by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'username email name');
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }
    res.json(patient);
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
    } = req.body;

    console.log('🔵 Saving patient record for:', patientId);

    // Find patient by patientId (not MongoDB _id)
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      console.log('❌ Patient not found');
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

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

    // Handle injection details
    if (needsInjection) {
      patient.injectionDetails = {
        required: true,
        details: injectionDetails,
        roomNumber: generateRandomRoom(),
        floor: 'Ground Floor',
        status: 'pending',
        updatedAt: new Date(),
      };
    }

    // Handle lab test details
    if (needsLabTest) {
      patient.labTestDetails = {
        required: true,
        details: labTestDetails,
        roomNumber: generateRandomRoom(),
        floor: 'Ground Floor',
        status: 'pending',
        updatedAt: new Date(),
      };
    }

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
      wsManager.broadcastToPatient(patient.patientId, navigationUpdate);
    }

    res.json({
      message: 'Patient record saved successfully',
      patient,
    });
  } catch (error) {
    console.error('❌ Error saving patient record:', error);
    res.status(500).json({ message: 'Error saving patient record', error });
  }
});

module.exports = router;

