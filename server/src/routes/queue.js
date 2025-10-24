const express = require('express');
const router = express.Router();
const { Patient } = require('../models/Patient');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Remove patient from queue
router.delete('/remove/:patientId', authMiddleware, roleMiddleware(['pharmacist', 'admin']), async (req, res) => {
  try {
    const { patientId } = req.params;

    console.log('🗑️ Removing patient from queue:', patientId);

    // Find patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Remove from queue
    patient.queuePosition = null;
    patient.queueStatus = 'completed';
    await patient.save();

    console.log('✅ Patient removed from queue:', patientId);
    res.json({
      success: true,
      message: 'Patient removed from queue',
      patient,
    });
  } catch (error) {
    console.error('❌ Error removing patient from queue:', error);
    res.status(500).json({
      error: 'Failed to remove patient from queue',
      details: error.message,
    });
  }
});

// Get queue (all patients in queue)
router.get('/', authMiddleware, roleMiddleware(['pharmacist', 'admin']), async (req, res) => {
  try {
    console.log('📋 Fetching queue');

    const patients = await Patient.find({ queueStatus: 'active' })
      .populate('userId', 'name email')
      .sort({ queuePosition: 1 });

    console.log('✅ Queue fetched:', patients.length, 'patients');
    res.json({
      success: true,
      patients,
      count: patients.length,
    });
  } catch (error) {
    console.error('❌ Error fetching queue:', error);
    res.status(500).json({
      error: 'Failed to fetch queue',
      details: error.message,
    });
  }
});

module.exports = router;

