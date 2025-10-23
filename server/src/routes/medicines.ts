import express, { Response } from 'express';
import { Medicine } from '../models/Medicine';
import { AuthRequest, authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all medicines
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines', error });
  }
});

// Create medicine
router.post('/', authMiddleware, roleMiddleware(['pharmacist', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chemicalName, brandName, quantity, price, expiryDate, manufacturer, batchNumber } = req.body;

    const medicine = new Medicine({
      chemicalName,
      brandName,
      quantity,
      price,
      expiryDate,
      manufacturer,
      batchNumber,
    });

    await medicine.save();
    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Error adding medicine', error });
  }
});

// Get medicine by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
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
router.put('/:id', authMiddleware, roleMiddleware(['pharmacist', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicine) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }
    res.json({ message: 'Medicine updated successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Error updating medicine', error });
  }
});

// Delete medicine
router.delete('/:id', authMiddleware, roleMiddleware(['pharmacist', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
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

export default router;

