const express = require('express');
const { Prescription } = require('../models/Prescription');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all prescriptions
router.get('/', authMiddleware, roleMiddleware(['admin', 'doctor', 'pharmacist']), async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patientId', 'userId')
      .populate('doctorId', 'userId');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error });
  }
});

// Get prescription by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId', 'userId')
      .populate('doctorId', 'userId');
    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescription', error });
  }
});

// Update prescription
router.put('/:id', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }
    res.json({ message: 'Prescription updated successfully', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Error updating prescription', error });
  }
});

// Delete prescription
router.delete('/:id', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }
    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting prescription', error });
  }
});

module.exports = router;

