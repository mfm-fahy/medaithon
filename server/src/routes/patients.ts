import express, { Response } from 'express';
import { Patient } from '../models/Patient';
import { Vitals } from '../models/Vitals';
import { Prescription } from '../models/Prescription';
import { LabTest } from '../models/LabTest';
import { AuthRequest, authMiddleware, roleMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all patients
router.get('/', authMiddleware, roleMiddleware(['admin', 'doctor', 'nurse']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patients = await Patient.find().populate('userId', 'username email name');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error });
  }
});

// Get patient by QR code (Patient ID) - Must come before /:id route
router.get('/qr/:patientId', authMiddleware, roleMiddleware(['doctor', 'nurse', 'lab-technician', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId }).populate('userId', 'username email name');
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    // Get patient's vitals, prescriptions, and lab tests
    const vitals = await Vitals.find({ patientId: patient._id }).sort({ createdAt: -1 }).limit(5);
    const prescriptions = await Prescription.find({ patientId: patient._id }).sort({ createdAt: -1 }).limit(5);
    const labTests = await LabTest.find({ patientId: patient._id }).sort({ createdAt: -1 }).limit(5);

    res.json({
      patient,
      vitals,
      prescriptions,
      labTests,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient by QR code', error });
  }
});

// Get patient by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id).populate('userId', 'username email name');
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error });
  }
});

// Update patient
router.put('/:id', authMiddleware, roleMiddleware(['patient', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }
    res.json({ message: 'Patient updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error });
  }
});

// Update patient by QR code (for doctors, nurses, lab technicians)
router.put('/qr/:patientId', authMiddleware, roleMiddleware(['doctor', 'nurse', 'lab-technician', 'admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { medicalHistory, allergies, notes } = req.body;
    const userRole = (req as any).userRole;

    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    // Update based on role
    if (userRole === 'doctor' || userRole === 'admin') {
      if (medicalHistory) patient.medicalHistory = medicalHistory;
      if (allergies) patient.allergies = allergies;
    }

    if (userRole === 'nurse' || userRole === 'admin') {
      if (medicalHistory) patient.medicalHistory = medicalHistory;
    }

    if (userRole === 'lab-technician' || userRole === 'admin') {
      // Lab technicians can add notes to medical history
      if (notes) {
        patient.medicalHistory = (patient.medicalHistory || '') + '\n[Lab Notes] ' + notes;
      }
    }

    await patient.save();
    res.json({ message: 'Patient updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error });
  }
});

// Get patient vitals
router.get('/:id/vitals', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vitals = await Vitals.find({ patientId: req.params.id }).populate('nurseId', 'userId');
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vitals', error });
  }
});

// Get patient prescriptions
router.get('/:id/prescriptions', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.id })
      .populate('doctorId', 'userId')
      .populate('patientId', 'userId');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error });
  }
});

// Get patient lab tests
router.get('/:id/lab-tests', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const labTests = await LabTest.find({ patientId: req.params.id }).populate('labTechnicianId', 'userId');
    res.json(labTests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab tests', error });
  }
});

export default router;

