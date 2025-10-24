const express = require('express');
const { Staff } = require('../models/Staff');
const { User } = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all staff members
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const staff = await Staff.find()
      .populate('userId', 'name username email role')
      .sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
});

// Get staff by role
router.get('/role/:role', auth, adminOnly, async (req, res) => {
  try {
    const { role } = req.params;
    const staff = await Staff.find({ role })
      .populate('userId', 'name username email role')
      .sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff by role', error: error.message });
  }
});

// Get staff by ID
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate('userId', 'name username email role');
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
});

// Create staff member (called from auth signup)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      userId,
      role,
      designation,
      specialization,
      department,
      licenseNumber,
      yearsOfExperience,
    } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: 'userId and role are required' });
    }

    const staff = new Staff({
      userId,
      role,
      designation,
      specialization,
      department,
      licenseNumber,
      yearsOfExperience,
      status: 'active',
    });

    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error creating staff', error: error.message });
  }
});

// Update staff member
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const {
      designation,
      specialization,
      department,
      licenseNumber,
      yearsOfExperience,
      status,
    } = req.body;

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        designation,
        specialization,
        department,
        licenseNumber,
        yearsOfExperience,
        status,
      },
      { new: true }
    ).populate('userId', 'name username email role');

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error updating staff', error: error.message });
  }
});

// Delete staff member
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff', error: error.message });
  }
});

// Get staff statistics
router.get('/stats/summary', auth, adminOnly, async (req, res) => {
  try {
    const stats = await Staff.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalStaff = await Staff.countDocuments();
    const activeStaff = await Staff.countDocuments({ status: 'active' });

    res.json({
      totalStaff,
      activeStaff,
      byRole: stats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router;

