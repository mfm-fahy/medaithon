import express, { Response } from 'express';
import { LabTest } from '../models/LabTest';
import { AuthRequest, authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all lab tests
router.get('/', authMiddleware, roleMiddleware(['admin', 'doctor', 'labTechnician']), async (req: AuthRequest, res: Response): Promise<void> => {
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
router.post('/', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
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
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
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
router.put('/:id', authMiddleware, roleMiddleware(['labTechnician', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const labTest = await LabTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!labTest) {
      res.status(404).json({ message: 'Lab test not found' });
      return;
    }
    res.json({ message: 'Lab test updated successfully', labTest });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lab test', error });
  }
});

export default router;

