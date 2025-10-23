const express = require('express');
const { Visit } = require('../models/Visit');
const { Patient } = require('../models/Patient');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { generateHospitalNavigation, getRealtimeNavigationUpdate } = require('../services/hospitalNavigation');

const router = express.Router();

// Get all visits (admin, doctor)
router.get('/', authMiddleware, roleMiddleware(['admin', 'doctor']), async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate('patientId', 'userId patientId')
      .populate('assignedDoctorId', 'userId');
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visits', error });
  }
});

// Get patient's visits
router.get('/patient/:patientId', authMiddleware, async (req, res) => {
  try {
    const visits = await Visit.find({ patientId: req.params.patientId })
      .populate('assignedDoctorId', 'userId');
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient visits', error });
  }
});

// Create a new visit (patient)
router.post('/', authMiddleware, roleMiddleware(['patient']), async (req, res) => {
  try {
    const { visitType, symptoms, description, department = 'OP Nurse' } = req.body;

    // Get patient ID from user
    const patient = await Patient.findOne({ userId: req.userId });
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    // Validate required fields
    if (!visitType || !symptoms) {
      res.status(400).json({ message: 'Visit type and symptoms are required' });
      return;
    }

    // Validate visit type
    if (!['new', 'follow-up'].includes(visitType)) {
      res.status(400).json({ message: 'Invalid visit type. Must be "new" or "follow-up"' });
      return;
    }

    // Generate hospital navigation
    const hospitalNavigation = generateHospitalNavigation(department);

    const visit = new Visit({
      patientId: patient._id,
      visitType,
      symptoms,
      description,
      status: 'pending',
    });

    await visit.save();

    // Update patient with hospital navigation and current visit
    patient.currentVisit = visit._id;
    patient.hospitalNavigation = hospitalNavigation;
    await patient.save();

    res.status(201).json({
      message: 'Visit created successfully',
      visit,
      hospitalNavigation,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating visit', error });
  }
});

// Get visit by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id)
      .populate('patientId', 'userId patientId')
      .populate('assignedDoctorId', 'userId');
    
    if (!visit) {
      res.status(404).json({ message: 'Visit not found' });
      return;
    }

    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visit', error });
  }
});

// Update visit (doctor, admin)
router.put('/:id', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req, res) => {
  try {
    const { status, assignedDoctorId, notes } = req.body;

    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      { status, assignedDoctorId, notes },
      { new: true }
    ).populate('patientId', 'userId patientId')
     .populate('assignedDoctorId', 'userId');

    if (!visit) {
      res.status(404).json({ message: 'Visit not found' });
      return;
    }

    res.json({ message: 'Visit updated successfully', visit });
  } catch (error) {
    res.status(500).json({ message: 'Error updating visit', error });
  }
});

// Cancel visit (patient, doctor, admin)
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('patientId', 'userId patientId')
     .populate('assignedDoctorId', 'userId');

    if (!visit) {
      res.status(404).json({ message: 'Visit not found' });
      return;
    }

    res.json({ message: 'Visit cancelled successfully', visit });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling visit', error });
  }
});

// Get real-time navigation updates for patient's current visit
router.get('/navigation/realtime/:patientId', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    if (!patient.hospitalNavigation) {
      res.status(404).json({ message: 'No active navigation' });
      return;
    }

    // Get real-time update
    const realtimeUpdate = getRealtimeNavigationUpdate(req.params.patientId);
    const updatedWaitTime = Math.max(
      0,
      patient.hospitalNavigation.estimatedWaitTime + realtimeUpdate.variation
    );

    res.json({
      hospitalNavigation: {
        ...patient.hospitalNavigation,
        estimatedWaitTime: updatedWaitTime,
      },
      realtimeUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching navigation', error });
  }
});

// Get patient's current navigation
router.get('/navigation/:patientId', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    if (!patient.hospitalNavigation) {
      res.status(404).json({ message: 'No active navigation' });
      return;
    }

    res.json({
      hospitalNavigation: patient.hospitalNavigation,
      currentVisit: patient.currentVisit,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching navigation', error });
  }
});

module.exports = router;

