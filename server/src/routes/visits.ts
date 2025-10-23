import express, { Response } from 'express';
import { Visit } from '../models/Visit';
import { Patient } from '../models/Patient';
import { AuthRequest, authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all visits (admin, doctor)
router.get('/', authMiddleware, roleMiddleware(['admin', 'doctor']), async (req: AuthRequest, res: Response): Promise<void> => {
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
router.get('/patient/:patientId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const visits = await Visit.find({ patientId: req.params.patientId })
      .populate('assignedDoctorId', 'userId');
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient visits', error });
  }
});

// Create a new visit (patient)
router.post('/', authMiddleware, roleMiddleware(['patient']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { visitType, symptoms, description } = req.body;

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

    const visit = new Visit({
      patientId: patient._id,
      visitType,
      symptoms,
      description,
      status: 'pending',
    });

    await visit.save();
    res.status(201).json({ message: 'Visit created successfully', visit });
  } catch (error) {
    res.status(500).json({ message: 'Error creating visit', error });
  }
});

// Get visit by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
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
router.put('/:id', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
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
router.put('/:id/cancel', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
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

export default router;

