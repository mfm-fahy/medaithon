import express, { Response } from 'express';
import { Doctor } from '../models/Doctor';
import { Prescription } from '../models/Prescription';
import { AuthRequest, authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all doctors
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctors = await Doctor.find().populate('userId', 'username email name');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
});

// Get doctor by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'username email name');
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error });
  }
});

// Update doctor
router.put('/:id', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }
    res.json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor', error });
  }
});

// Create prescription
router.post('/:id/prescriptions', authMiddleware, roleMiddleware(['doctor']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId, medicine, route, dose, frequency, duration, advice } = req.body;

    const prescription = new Prescription({
      patientId,
      doctorId: req.params.id,
      medicine,
      route,
      dose,
      frequency,
      duration,
      advice,
    });

    await prescription.save();
    res.status(201).json({ message: 'Prescription created successfully', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Error creating prescription', error });
  }
});

// Get doctor prescriptions
router.get('/:id/prescriptions', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.params.id })
      .populate('patientId', 'userId')
      .populate('doctorId', 'userId');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error });
  }
});

export default router;

