const express = require('express');
const { Injection } = require('../models/Injection');
const { Patient } = require('../models/Patient');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all injections
router.get('/', authMiddleware, roleMiddleware(['admin', 'doctor', 'nurse']), async (req, res) => {
  try {
    const injections = await Injection.find()
      .populate('patientId', 'userId patientId')
      .populate('doctorId', 'userId');
    res.json(injections);
  } catch (error) {
    console.error('❌ Error fetching injections:', error);
    res.status(500).json({ message: 'Error fetching injections', error });
  }
});

// Get injections for a specific patient
router.get('/patient/:patientId', authMiddleware, async (req, res) => {
  try {
    const injections = await Injection.find({ patientId: req.params.patientId })
      .populate('patientId', 'userId patientId')
      .populate('doctorId', 'userId')
      .sort({ createdAt: -1 });
    res.json(injections);
  } catch (error) {
    console.error('❌ Error fetching patient injections:', error);
    res.status(500).json({ message: 'Error fetching patient injections', error });
  }
});

// Get injection by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const injection = await Injection.findById(req.params.id)
      .populate('patientId', 'userId patientId')
      .populate('doctorId', 'userId');
    if (!injection) {
      res.status(404).json({ message: 'Injection not found' });
      return;
    }
    res.json(injection);
  } catch (error) {
    console.error('❌ Error fetching injection:', error);
    res.status(500).json({ message: 'Error fetching injection', error });
  }
});

// Create injection
router.post('/', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req, res) => {
  try {
    const { patientId, doctorId, injectionName, injectionType, dose, frequency, duration, route, notes } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !injectionName || !injectionType || !dose || !frequency) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const injection = new Injection({
      patientId,
      doctorId,
      injectionName,
      injectionType,
      dose,
      frequency,
      duration,
      route,
      notes,
      status: 'pending',
    });

    await injection.save();
    console.log('💉 Injection created:', injectionName);
    res.status(201).json({ message: 'Injection created successfully', injection });
  } catch (error) {
    console.error('❌ Error creating injection:', error);
    res.status(500).json({ message: 'Error creating injection', error });
  }
});

// Update injection status (for nurse to mark as done)
router.put('/:id/status', authMiddleware, roleMiddleware(['nurse', 'admin']), async (req, res) => {
  try {
    const { status, notes } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const injection = await Injection.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes: notes || injection?.notes,
        updatedAt: new Date(),
      },
      { new: true }
    )
      .populate('patientId', 'userId patientId')
      .populate('doctorId', 'userId');

    if (!injection) {
      res.status(404).json({ message: 'Injection not found' });
      return;
    }

    console.log(`✅ Injection status updated to ${status}:`, injection.injectionName);
    res.json({ message: 'Injection status updated successfully', injection });
  } catch (error) {
    console.error('❌ Error updating injection status:', error);
    res.status(500).json({ message: 'Error updating injection status', error });
  }
});

// Update injection (full update)
router.put('/:id', authMiddleware, roleMiddleware(['doctor', 'nurse', 'admin']), async (req, res) => {
  try {
    const injection = await Injection.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('patientId', 'userId patientId')
      .populate('doctorId', 'userId');

    if (!injection) {
      res.status(404).json({ message: 'Injection not found' });
      return;
    }

    console.log('✅ Injection updated:', injection.injectionName);
    res.json({ message: 'Injection updated successfully', injection });
  } catch (error) {
    console.error('❌ Error updating injection:', error);
    res.status(500).json({ message: 'Error updating injection', error });
  }
});

// Delete injection
router.delete('/:id', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req, res) => {
  try {
    const injection = await Injection.findByIdAndDelete(req.params.id);
    if (!injection) {
      res.status(404).json({ message: 'Injection not found' });
      return;
    }

    console.log('🗑️  Injection deleted:', injection.injectionName);
    res.json({ message: 'Injection deleted successfully', injection });
  } catch (error) {
    console.error('❌ Error deleting injection:', error);
    res.status(500).json({ message: 'Error deleting injection', error });
  }
});

module.exports = router;

