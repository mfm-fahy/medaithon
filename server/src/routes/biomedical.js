const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Equipment = require('../models/Equipment');
const WasteRecord = require('../models/WasteRecord');
const CollectionTask = require('../models/CollectionTask');
const DispatchSchedule = require('../models/DispatchSchedule');
const QRCode = require('qrcode');
const biomedicalWS = require('../services/biomedicalWebSocket');

// ==================== EQUIPMENT ROUTES ====================

// Get all equipment
router.get('/equipment', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  MongoDB not connected, returning mock data');
      // Return mock data when DB is not connected
      const mockEquipment = [
        {
          _id: 'mock1',
          equipmentId: 'EQ-001',
          name: 'Ventilator',
          model: 'Model V-100',
          serialNumber: 'SN-12345',
          department: 'ICU',
          status: 'Active',
          nextServiceDue: '2025-12-01',
          lastServiceDate: '2025-06-01'
        },
        {
          _id: 'mock2',
          equipmentId: 'EQ-002',
          name: 'ECG Machine',
          model: 'Model ECG-200',
          serialNumber: 'SN-67890',
          department: 'Cardiology',
          status: 'Due Soon',
          nextServiceDue: '2025-11-15',
          lastServiceDate: '2025-05-15'
        }
      ];
      return res.json(mockEquipment);
    }

    const equipment = await Equipment.find();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get equipment by ID
router.get('/equipment/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new equipment
router.post('/equipment', async (req, res) => {
  try {
    const { name, model, serialNumber, department, purchaseDate, nextServiceDue, criticalityLevel } = req.body;

    const equipmentId = `EQ-${Date.now()}`;
    const qrCodeData = await QRCode.toDataURL(equipmentId);

    const equipment = new Equipment({
      equipmentId,
      name,
      model,
      serialNumber,
      department,
      purchaseDate,
      nextServiceDue,
      criticalityLevel,
      qrCode: qrCodeData,
    });

    await equipment.save();

    // Broadcast real-time update
    biomedicalWS.broadcastEquipmentUpdate(equipment, 'added');

    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update equipment
router.put('/equipment/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Broadcast real-time update
    biomedicalWS.broadcastEquipmentUpdate(equipment, 'updated');

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log maintenance
router.post('/equipment/:id/maintenance', async (req, res) => {
  try {
    const { type, technician, notes, serviceReport } = req.body;
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    equipment.maintenanceHistory.push({
      date: new Date(),
      type,
      technician,
      notes,
      serviceReport,
    });

    equipment.lastServiceDate = new Date();
    equipment.status = 'Active';

    await equipment.save();

    // Broadcast real-time update
    biomedicalWS.broadcastEquipmentUpdate(equipment, 'maintenance-logged');

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get equipment dashboard stats
router.get('/equipment/dashboard/stats', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  MongoDB not connected, returning mock stats');
      // Return mock stats when DB is not connected
      return res.json({
        total: 2,
        active: 1,
        dueSoon: 1,
        overdue: 0,
        activePercentage: '50.00',
      });
    }

    const total = await Equipment.countDocuments();
    const active = await Equipment.countDocuments({ status: 'Active' });
    const dueSoon = await Equipment.countDocuments({ status: 'Due Soon' });
    const overdue = await Equipment.countDocuments({ status: 'Overdue' });

    res.json({
      total,
      active,
      dueSoon,
      overdue,
      activePercentage: ((active / total) * 100).toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== WASTE MANAGEMENT ROUTES ====================

// Get all waste records
router.get('/waste', async (req, res) => {
  try {
    const waste = await WasteRecord.find().sort({ date: -1 });
    res.json(waste);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create waste record
router.post('/waste', async (req, res) => {
  try {
    const { items, department } = req.body;

    const wasteId = `WS-${Date.now()}`;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    const waste = new WasteRecord({
      wasteId,
      items,
      totalQuantity,
      department,
    });

    await waste.save();

    // Broadcast real-time update
    biomedicalWS.broadcastWasteUpdate(waste, 'added');

    res.status(201).json(waste);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get waste dashboard stats
router.get('/waste/dashboard/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayWaste = await WasteRecord.find({ date: { $gte: today } });
    
    const breakdown = {
      yellow: 0,
      red: 0,
      blue: 0,
      white: 0,
    };
    
    todayWaste.forEach((record) => {
      record.items.forEach((item) => {
        const color = item.colorCode.toLowerCase();
        breakdown[color] += item.quantity;
      });
    });
    
    res.json({
      totalRecords: todayWaste.length,
      totalQuantity: todayWaste.reduce((sum, r) => sum + r.totalQuantity, 0),
      breakdown,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COLLECTION TASK ROUTES ====================

// Get all collection tasks
router.get('/collection-tasks', async (req, res) => {
  try {
    const tasks = await CollectionTask.find().sort({ date: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create collection task
router.post('/collection-tasks', async (req, res) => {
  try {
    const { date, timeSlot, assignedStaff, location } = req.body;

    const taskId = `CT-${Date.now()}`;

    const task = new CollectionTask({
      taskId,
      date,
      timeSlot,
      assignedStaff,
      location,
    });

    await task.save();

    // Broadcast real-time update
    biomedicalWS.broadcastCollectionTaskUpdate(task, 'added');

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update collection task status
router.put('/collection-tasks/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;

    const task = await CollectionTask.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
        completedAt: status === 'Completed' ? new Date() : null,
      },
      { new: true }
    );

    // Broadcast real-time update
    biomedicalWS.broadcastCollectionTaskUpdate(task, status.toLowerCase().replace(' ', '-'));

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's collection tasks
router.get('/collection-tasks/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasks = await CollectionTask.find({
      date: { $gte: today, $lt: tomorrow },
    });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DISPATCH SCHEDULE ROUTES ====================

// Get all dispatch schedules
router.get('/dispatch', async (req, res) => {
  try {
    const schedules = await DispatchSchedule.find().sort({ dispatchDate: -1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create dispatch schedule
router.post('/dispatch', async (req, res) => {
  try {
    const { weekStartDate, weekEndDate, dispatchDate, processingPlant, plantLocation } = req.body;

    const dispatchId = `DS-${Date.now()}`;

    const schedule = new DispatchSchedule({
      dispatchId,
      weekStartDate,
      weekEndDate,
      dispatchDate,
      processingPlant,
      plantLocation,
    });

    await schedule.save();

    // Broadcast real-time update
    biomedicalWS.broadcastDispatchUpdate(schedule, 'added');

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update dispatch status
router.put('/dispatch/:id', async (req, res) => {
  try {
    const { status, dispatchedBy, notes } = req.body;

    const schedule = await DispatchSchedule.findByIdAndUpdate(
      req.params.id,
      {
        status,
        dispatchedBy,
        dispatchedAt: status === 'In Transit' ? new Date() : null,
        notes,
      },
      { new: true }
    );

    // Broadcast real-time update
    biomedicalWS.broadcastDispatchUpdate(schedule, status.toLowerCase().replace(' ', '-'));

    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

