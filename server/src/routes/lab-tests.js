const express = require('express');
const { LabTest } = require('../models/LabTest');
const { Patient } = require('../models/Patient');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const wsManager = require('../services/websocket');

const router = express.Router();

// Get all lab tests
router.get('/', authMiddleware, roleMiddleware(['admin', 'doctor', 'labTechnician']), async (req, res) => {
  try {
    const labTests = await LabTest.find()
      .populate('patientId', 'userId')
      .populate('labTechnicianId', 'userId');
    res.json(labTests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab tests', error });
  }
});

// Create lab test
router.post('/', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req, res) => {
  try {
    const { patientId, testName, sampleType, estimatedTime } = req.body;

    const labTest = new LabTest({
      patientId,
      testName,
      sampleType,
      estimatedTime,
      status: 'pending',
    });

    await labTest.save();
    res.status(201).json({ message: 'Lab test created successfully', labTest });
  } catch (error) {
    res.status(500).json({ message: 'Error creating lab test', error });
  }
});

// Get lab test by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.id)
      .populate('patientId', 'userId')
      .populate('labTechnicianId', 'userId');
    if (!labTest) {
      res.status(404).json({ message: 'Lab test not found' });
      return;
    }
    res.json(labTest);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab test', error });
  }
});

// Update lab test
router.put('/:id', authMiddleware, roleMiddleware(['labTechnician', 'admin']), async (req, res) => {
  try {
    console.log('🔵 Updating lab test:', req.params.id);
    console.log('📝 Update data:', req.body);

    const labTest = await LabTest.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('patientId', 'patientId userId');

    if (!labTest) {
      console.log('❌ Lab test not found');
      res.status(404).json({ message: 'Lab test not found' });
      return;
    }

    console.log('✅ Lab test updated:', labTest._id);

    // If test is completed, send notifications to doctor and patient
    if (labTest.status === 'completed') {
      console.log('📢 Sending notifications for completed test');

      // Get patient info
      const patient = await Patient.findById(labTest.patientId).populate('userId', 'name email');

      if (patient) {
        // Prepare notification data
        const testResultNotification = {
          type: 'lab-test-result',
          testId: labTest._id,
          testName: labTest.testName,
          status: labTest.status,
          result: labTest.result,
          resultDate: labTest.resultDate,
          uploadedFile: labTest.uploadedFile ? {
            name: labTest.uploadedFile.name,
            type: labTest.uploadedFile.type,
            size: labTest.uploadedFile.size,
            uploadedAt: labTest.uploadedFile.uploadedAt,
          } : null,
          patientId: patient.patientId,
          patientName: patient.userId?.name,
          timestamp: new Date(),
        };

        // Send to patient via WebSocket
        console.log('📤 Sending to patient:', patient.patientId);
        wsManager.sendNavigationUpdate(patient.patientId, testResultNotification);

        // Send to doctor if assigned
        if (labTest.doctorId) {
          console.log('📤 Sending to doctor:', labTest.doctorId);
          wsManager.broadcastToDoctorQueue(labTest.doctorId, testResultNotification);
        }
      }
    }

    res.json({ message: 'Lab test updated successfully', labTest });
  } catch (error) {
    console.error('❌ Error updating lab test:', error);
    res.status(500).json({ message: 'Error updating lab test', error });
  }
});

module.exports = router;

