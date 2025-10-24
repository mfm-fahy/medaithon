const express = require('express');
const router = express.Router();
const { Billing } = require('../models/Billing');
const { Patient } = require('../models/Patient');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Generate unique bill number
const generateBillNumber = async () => {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const count = await Billing.countDocuments({
      createdAt: {
        $gte: new Date(year, date.getMonth(), date.getDate()),
        $lt: new Date(year, date.getMonth(), date.getDate() + 1),
      },
    });

    return `BILL-${year}${month}${day}-${String(count + 1).padStart(4, '0')}`;
  } catch (err) {
    console.error('Error generating bill number:', err);
    throw err;
  }
};

// Create a new bill
router.post('/create', authMiddleware, roleMiddleware(['pharmacist']), async (req, res) => {
  try {
    const { patientId, patientName, patientPhone, items, discountPercentage = 0, taxPercentage = 0, paymentMethod = 'cash', notes } = req.body;

    console.log('📝 Creating bill with data:', { patientId, patientName, patientPhone, itemsCount: items?.length });

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ Invalid items:', items);
      return res.status(400).json({ error: 'Items are required and must be an array' });
    }

    // Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.medicineName) {
        return res.status(400).json({ error: `Item ${i + 1}: Medicine name is required` });
      }
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: `Item ${i + 1}: Quantity must be greater than 0` });
      }
      if (item.unitPrice === undefined || item.unitPrice < 0) {
        return res.status(400).json({ error: `Item ${i + 1}: Unit price is required` });
      }
      if (!item.totalPrice && item.totalPrice !== 0) {
        item.totalPrice = item.quantity * item.unitPrice;
      }
    }

    // Validate patient name
    if (!patientName || patientName.trim() === '') {
      return res.status(400).json({ error: 'Patient name is required' });
    }

    // If patientId is provided and valid, fetch patient details
    let finalPatientName = patientName;
    let finalPatientPhone = patientPhone || 'N/A';
    let finalPatientId = patientId;

    if (patientId && patientId !== 'mock-patient-id') {
      try {
        const patient = await Patient.findById(patientId).populate('userId');
        if (patient) {
          finalPatientName = patient.userId?.name || patientName;
          finalPatientPhone = patient.phone || patientPhone || 'N/A';
          console.log('✅ Patient found:', finalPatientName);
        } else {
          console.log('⚠️ Patient not found, using provided data');
        }
      } catch (err) {
        console.log('⚠️ Error fetching patient, using provided data:', err.message);
      }
    } else {
      console.log('ℹ️ Using provided patient data (no patient ID lookup)');
    }

    // Generate bill number
    const billNumber = await generateBillNumber();

    // Create bill object
    const billData = {
      billNumber,
      patientId: finalPatientId || null,
      patientName: finalPatientName,
      patientPhone: finalPatientPhone,
      pharmacistId: req.userId,
      pharmacistName: req.userName || 'Pharmacist',
      items: items.map(item => ({
        medicineName: item.medicineName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice || (item.quantity * item.unitPrice),
        prescriptionId: item.prescriptionId || null,
        route: item.route || null,
        dose: item.dose || null,
        frequency: item.frequency || null,
      })),
      discountPercentage: Math.max(0, Math.min(100, discountPercentage || 0)),
      taxPercentage: Math.max(0, Math.min(100, taxPercentage || 0)),
      paymentMethod: paymentMethod || 'cash',
      notes: notes || '',
      status: 'completed',
      paymentStatus: 'pending',
    };

    console.log('💾 Creating bill object:', billNumber);
    const bill = new Billing(billData);

    console.log('💾 Saving bill:', billNumber);
    await bill.save();

    console.log('✅ Bill created successfully:', billNumber);
    return res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      bill: bill,
    });
  } catch (error) {
    console.error('❌ Error creating bill:', error);
    return res.status(500).json({
      error: 'Failed to create bill',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get bills for a patient
router.get('/patient/:patientId', authMiddleware, async (req, res) => {
  try {
    const { patientId } = req.params;

    const bills = await Billing.find({ patientId })
      .sort({ createdAt: -1 })
      .populate('patientId')
      .populate('pharmacistId', 'name email');

    res.json({
      success: true,
      bills,
    });
  } catch (error) {
    console.error('Error fetching patient bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Get all bills (for pharmacist and admin)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, status, paymentStatus } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    // If pharmacist, only show their bills
    if (req.userRole === 'pharmacist') {
      query.pharmacistId = req.userId;
    }

    const bills = await Billing.find(query)
      .sort({ createdAt: -1 })
      .populate('patientId', 'patientId')
      .populate('pharmacistId', 'name email');

    res.json({
      success: true,
      bills,
    });
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Get bill by ID
router.get('/:billId', authMiddleware, async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.billId)
      .populate('patientId')
      .populate('pharmacistId', 'name email');

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({
      success: true,
      bill,
    });
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
});

// Update bill payment status
router.put('/:billId/payment', authMiddleware, roleMiddleware(['pharmacist', 'admin']), async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!['pending', 'completed', 'failed'].includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const bill = await Billing.findByIdAndUpdate(
      req.params.billId,
      { paymentStatus, updatedAt: new Date() },
      { new: true }
    );

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({
      success: true,
      message: 'Payment status updated',
      bill,
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Get sales report
router.get('/report/sales', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'daily' } = req.query;
    let query = { status: 'completed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // If pharmacist, only show their sales
    if (req.userRole === 'pharmacist') {
      query.pharmacistId = req.userId;
    }

    const bills = await Billing.find(query).sort({ createdAt: -1 });

    // Calculate totals
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const totalBills = bills.length;
    const totalItems = bills.reduce((sum, bill) => sum + bill.items.length, 0);
    const averageBillValue = totalBills > 0 ? totalRevenue / totalBills : 0;

    // Group by date if requested
    let groupedData = {};
    if (groupBy === 'daily') {
      bills.forEach((bill) => {
        const date = bill.createdAt.toISOString().split('T')[0];
        if (!groupedData[date]) {
          groupedData[date] = { revenue: 0, bills: 0, items: 0 };
        }
        groupedData[date].revenue += bill.totalAmount;
        groupedData[date].bills += 1;
        groupedData[date].items += bill.items.length;
      });
    }

    res.json({
      success: true,
      summary: {
        totalRevenue,
        totalBills,
        totalItems,
        averageBillValue,
      },
      groupedData: Object.keys(groupedData).length > 0 ? groupedData : null,
      bills,
    });
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Get medicine sales report
router.get('/report/medicines', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { status: 'completed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // If pharmacist, only show their sales
    if (req.userRole === 'pharmacist') {
      query.pharmacistId = req.userId;
    }

    const bills = await Billing.find(query);

    // Aggregate medicine sales
    const medicineStats = {};
    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        if (!medicineStats[item.medicineName]) {
          medicineStats[item.medicineName] = {
            name: item.medicineName,
            totalQuantity: 0,
            totalRevenue: 0,
            totalSales: 0,
          };
        }
        medicineStats[item.medicineName].totalQuantity += item.quantity;
        medicineStats[item.medicineName].totalRevenue += item.totalPrice;
        medicineStats[item.medicineName].totalSales += 1;
      });
    });

    const medicineReport = Object.values(medicineStats).sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    );

    res.json({
      success: true,
      medicineReport,
    });
  } catch (error) {
    console.error('Error generating medicine report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

module.exports = router;

