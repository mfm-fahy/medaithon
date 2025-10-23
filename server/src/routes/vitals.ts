import express, { Response } from 'express';
import { Vitals } from '../models/Vitals';
import { AuthRequest, authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all vitals
router.get('/', authMiddleware, roleMiddleware(['admin', 'doctor', 'nurse']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vitals = await Vitals.find()
      .populate('patientId', 'userId')
      .populate('nurseId', 'userId');
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vitals', error });
  }
});

// Create vitals record
router.post('/', authMiddleware, roleMiddleware(['nurse']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId, height, weight, temperature, bloodPressure, heartRate, respiratoryRate, pulse } = req.body;

    const vitals = new Vitals({
      patientId,
      nurseId: req.userId,
      height,
      weight,
      temperature,
      bloodPressure,
      heartRate,
      respiratoryRate,
      pulse,
    });

    await vitals.save();
    res.status(201).json({ message: 'Vitals recorded successfully', vitals });
  } catch (error) {
    res.status(500).json({ message: 'Error recording vitals', error });
  }
});

// Get vitals by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vitals = await Vitals.findById(req.params.id)
      .populate('patientId', 'userId')
      .populate('nurseId', 'userId');
    if (!vitals) {
      res.status(404).json({ message: 'Vitals not found' });
      return;
    }
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vitals', error });
  }
});

// Update vitals
router.put('/:id', authMiddleware, roleMiddleware(['nurse', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vitals = await Vitals.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vitals) {
      res.status(404).json({ message: 'Vitals not found' });
      return;
    }
    res.json({ message: 'Vitals updated successfully', vitals });
  } catch (error) {
    res.status(500).json({ message: 'Error updating vitals', error });
  }
});

export default router;

