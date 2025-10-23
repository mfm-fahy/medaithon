import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Patient } from '../models/Patient';
import { Doctor } from '../models/Doctor';
import { Nurse } from '../models/Nurse';
import { Pharmacist } from '../models/Pharmacist';
import { LabTechnician } from '../models/LabTechnician';
import { Admin } from '../models/Admin';

const router = express.Router();

// Sign Up
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, name, role, ...roleSpecificData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create user
    const user = new User({ username, email, password, name, role });
    await user.save();

    // Create role-specific document
    let patientId: string | undefined;
    switch (role) {
      case 'patient':
        patientId = `P${Date.now()}`;
        await Patient.create({
          userId: user._id,
          patientId,
          ...roleSpecificData,
        });
        break;
      case 'doctor':
        await Doctor.create({ userId: user._id, ...roleSpecificData });
        break;
      case 'nurse':
        await Nurse.create({ userId: user._id, ...roleSpecificData });
        break;
      case 'pharmacist':
        await Pharmacist.create({ userId: user._id, ...roleSpecificData });
        break;
      case 'labTechnician':
        await LabTechnician.create({ userId: user._id, ...roleSpecificData });
        break;
      case 'admin':
        await Admin.create({ userId: user._id, ...roleSpecificData });
        break;
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
      { expiresIn: '7d' }
    );

    const responseUser: any = { id: user._id, username: user.username, email: user.email, role: user.role, name: user.name };
    if (patientId) {
      responseUser.patientId = patientId;
    }

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Sign In (using /signin endpoint)
router.post('/signin', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
      { expiresIn: '7d' }
    );

    const responseUser: any = { id: user._id, username: user.username, email: user.email, role: user.role, name: user.name };

    // If patient, fetch and include patientId
    if (user.role === 'patient') {
      const patient = await Patient.findOne({ userId: user._id });
      if (patient) {
        responseUser.patientId = patient.patientId;
      }
    }

    res.json({
      message: 'Signed in successfully',
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Error signing in', error });
  }
});

// Login endpoint (alias for signin - for compatibility)
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
      { expiresIn: '7d' }
    );

    const responseUser: any = { id: user._id, username: user.username, email: user.email, role: user.role, name: user.name };

    // If patient, fetch and include patientId
    if (user.role === 'patient') {
      const patient = await Patient.findOne({ userId: user._id });
      if (patient) {
        responseUser.patientId = patient.patientId;
      }
    }

    res.json({
      message: 'Logged in successfully',
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
});

export default router;

