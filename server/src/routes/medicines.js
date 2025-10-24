const express = require('express');
const { Medicine } = require('../models/Medicine');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const wsManager = require('../services/websocket');

const router = express.Router();

// Get all medicines (with expiry status)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const medicines = await Medicine.find();

    // Add expiry status to each medicine
    const medicinesWithStatus = medicines.map(med => {
      const isExpired = new Date() > new Date(med.expiryDate);
      return {
        ...med.toObject(),
        isExpired,
        expiryStatus: isExpired ? 'expired' : 'active',
      };
    });

    res.json(medicinesWithStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines', error });
  }
});

// Create medicine
router.post('/', authMiddleware, roleMiddleware(['pharmacist', 'admin']), async (req, res) => {
  try {
    const { chemicalName, brandName, quantity, price, expiryDate, manufacturer, batchNumber } = req.body;

    // Validate expiry date
    if (!expiryDate) {
      return res.status(400).json({ message: 'Expiry date is required' });
    }

    const medicine = new Medicine({
      chemicalName,
      brandName,
      quantity,
      price,
      expiryDate: new Date(expiryDate),
      manufacturer,
      batchNumber,
    });

    await medicine.save();

    // Broadcast medicine update via WebSocket
    wsManager.broadcastMedicineUpdate({
      type: 'medicine-added',
      medicine: {
        ...medicine.toObject(),
        isExpired: new Date() > new Date(medicine.expiryDate),
      },
      timestamp: new Date(),
    });

    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Error adding medicine', error });
  }
});

// Get medicine by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicine', error });
  }
});

// Update medicine
router.put('/:id', authMiddleware, roleMiddleware(['pharmacist', 'admin']), async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicine) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }

    // Broadcast medicine update via WebSocket
    wsManager.broadcastMedicineUpdate({
      type: 'medicine-updated',
      medicine: {
        ...medicine.toObject(),
        isExpired: new Date() > new Date(medicine.expiryDate),
      },
      timestamp: new Date(),
    });

    res.json({ message: 'Medicine updated successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Error updating medicine', error });
  }
});

// Reduce medicine quantity (purchase/dispense)
router.post('/:id/reduce-quantity', authMiddleware, roleMiddleware(['pharmacist', 'admin']), async (req, res) => {
  try {
    const { quantity } = req.body;
    const medicineId = req.params.id;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Check if medicine is expired
    const isExpired = new Date() > new Date(medicine.expiryDate);
    if (isExpired) {
      return res.status(400).json({
        message: 'Cannot dispense expired medicine',
        isExpired: true,
        expiryDate: medicine.expiryDate,
      });
    }

    // Check if sufficient quantity available
    if (medicine.quantity < quantity) {
      return res.status(400).json({
        message: 'Insufficient quantity available',
        available: medicine.quantity,
        requested: quantity,
      });
    }

    // Reduce quantity
    medicine.quantity -= quantity;
    await medicine.save();

    // Broadcast medicine update via WebSocket
    wsManager.broadcastMedicineUpdate({
      type: 'medicine-dispensed',
      medicine: {
        ...medicine.toObject(),
        isExpired: false,
      },
      quantityDispensed: quantity,
      timestamp: new Date(),
    });

    res.json({
      message: 'Medicine dispensed successfully',
      medicine,
      quantityDispensed: quantity,
      remainingQuantity: medicine.quantity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error dispensing medicine', error });
  }
});

// Delete medicine
router.delete('/:id', authMiddleware, roleMiddleware(['pharmacist', 'admin']), async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medicine', error });
  }
});

module.exports = router;

