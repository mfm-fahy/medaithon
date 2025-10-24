const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { Patient } = require('../models/Patient');
const { Doctor } = require('../models/Doctor');
const { Nurse } = require('../models/Nurse');
const { Pharmacist } = require('../models/Pharmacist');
const { LabTechnician } = require('../models/LabTechnician');
const { Admin } = require('../models/Admin');
const { generateQRCodeData } = require('../services/hospitalNavigation');

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    console.log('🔵 Backend: Signup request received');
    const { username, email, password, name, role, ...roleSpecificData } = req.body;
    console.log('📝 Backend: Signup data:', { username, email, name, role });

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log('❌ Backend: User already exists');
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create user
    console.log('👤 Backend: Creating user...');
    const user = new User({ username, email, password, name, role });
    await user.save();
    console.log('✅ Backend: User created:', user._id);

    // Create role-specific document
    let patientId;
    let qrCode;
    switch (role) {
      case 'patient':
        patientId = `P${Date.now()}`;
        qrCode = generateQRCodeData(patientId, user.name);
        console.log('🏥 Backend: Creating patient document...');
        await Patient.create({
          userId: user._id,
          patientId,
          qrCode,
          ...roleSpecificData,
        });
        console.log('✅ Backend: Patient created:', patientId);
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
    console.log('🔐 Backend: Generating JWT token...');
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
      { expiresIn: '7d' }
    );

    const responseUser = { id: user._id, username: user.username, email: user.email, role: user.role, name: user.name };
    if (patientId) {
      responseUser.patientId = patientId;
      responseUser.qrCode = qrCode;
    }

    console.log('📤 Backend: Sending response...');
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: responseUser,
    });
    console.log('✅ Backend: Response sent successfully');
  } catch (error) {
    console.error('❌ Backend: Signup error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Sign In (using /signin endpoint)
router.post('/signin', async (req, res) => {
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

    const responseUser = { id: user._id, username: user.username, email: user.email, role: user.role, name: user.name };

    // If patient, fetch and include patientId and QR code
    if (user.role === 'patient') {
      const patient = await Patient.findOne({ userId: user._id });
      if (patient) {
        responseUser.patientId = patient.patientId;
        responseUser.qrCode = patient.qrCode;
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
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('🔵 Login request received');
    console.log('📝 Username:', username);

    const user = await User.findOne({ username });
    console.log('🔍 User found:', user ? 'YES' : 'NO');
    if (!user) {
      console.log('❌ User not found in database');
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    console.log('🔐 Comparing passwords...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('✅ Password valid:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('❌ Password is invalid');
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    console.log('🔐 Generating JWT token...');
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
      { expiresIn: '7d' }
    );

    const responseUser = { id: user._id, username: user.username, email: user.email, role: user.role, name: user.name };

    // If patient, fetch and include patientId and QR code
    if (user.role === 'patient') {
      const patient = await Patient.findOne({ userId: user._id });
      if (patient) {
        responseUser.patientId = patient.patientId;
        responseUser.qrCode = patient.qrCode;
      }
    }

    // If doctor, fetch and include doctor's _id and specialization
    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: user._id });
      if (doctor) {
        responseUser._id = doctor._id; // Use doctor's MongoDB _id
        responseUser.specialization = doctor.specialization;
        console.log('👨‍⚕️  Doctor found:', doctor._id, 'Specialization:', doctor.specialization);
      }
    }

    console.log('✅ Login successful for user:', username, 'Role:', user.role);
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

module.exports = router;

