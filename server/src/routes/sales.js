const express = require('express');
const router = express.Router();
const { Sales } = require('../models/Sales');
const { Billing } = require('../models/Billing');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Create sales record from bill
router.post('/create-from-bill/:billId', authMiddleware, roleMiddleware(['pharmacist', 'admin']), async (req, res) => {
  try {
    const { billId } = req.params;

    console.log('📊 Creating sales record from bill:', billId);

    // Find the bill
    const bill = await Billing.findById(billId);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Check if sales record already exists
    const existingSales = await Sales.findOne({ billId });
    if (existingSales) {
      return res.status(400).json({ error: 'Sales record already exists for this bill' });
    }

    // Create sales record
    const salesData = {
      billId: bill._id,
      billNumber: bill.billNumber,
      patientId: bill.patientId || null,
      patientName: bill.patientName,
      patientPhone: bill.patientPhone,
      pharmacistId: bill.pharmacistId,
      pharmacistName: bill.pharmacistName,
      items: bill.items,
      subtotal: bill.subtotal,
      discount: bill.discount,
      discountPercentage: bill.discountPercentage,
      tax: bill.tax,
      taxPercentage: bill.taxPercentage,
      totalAmount: bill.totalAmount,
      paymentMethod: bill.paymentMethod,
      paymentStatus: bill.paymentStatus,
      notes: bill.notes,
      status: 'completed',
      saleDate: new Date(),
    };

    const sales = new Sales(salesData);
    await sales.save();

    console.log('✅ Sales record created:', sales._id);
    res.status(201).json({
      success: true,
      message: 'Sales record created successfully',
      sales,
    });
  } catch (error) {
    console.error('❌ Error creating sales record:', error);
    res.status(500).json({
      error: 'Failed to create sales record',
      details: error.message,
    });
  }
});

// Get all sales (for admin)
router.get('/all', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { startDate, endDate, paymentStatus, pharmacistId } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate);
      if (endDate) query.saleDate.$lte = new Date(endDate);
    }

    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (pharmacistId) query.pharmacistId = pharmacistId;

    const sales = await Sales.find(query)
      .sort({ saleDate: -1 })
      .populate('patientId')
      .populate('pharmacistId', 'name email');

    // Calculate totals
    const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalDiscount = sales.reduce((sum, s) => sum + s.discount, 0);
    const totalTax = sales.reduce((sum, s) => sum + s.tax, 0);

    res.json({
      success: true,
      sales,
      summary: {
        totalSales,
        totalDiscount,
        totalTax,
        totalRecords: sales.length,
      },
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Get sales by date range (for admin dashboard)
router.get('/report/daily', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};
    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate);
      if (endDate) query.saleDate.$lte = new Date(endDate);
    }

    const sales = await Sales.find(query).sort({ saleDate: -1 });

    // Group by date
    const dailyReport = {};
    sales.forEach((sale) => {
      const date = new Date(sale.saleDate).toISOString().split('T')[0];
      if (!dailyReport[date]) {
        dailyReport[date] = {
          date,
          totalSales: 0,
          totalDiscount: 0,
          totalTax: 0,
          count: 0,
        };
      }
      dailyReport[date].totalSales += sale.totalAmount;
      dailyReport[date].totalDiscount += sale.discount;
      dailyReport[date].totalTax += sale.tax;
      dailyReport[date].count += 1;
    });

    res.json({
      success: true,
      report: Object.values(dailyReport),
    });
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Get sales by pharmacist (for admin dashboard)
router.get('/report/pharmacist', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};
    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate);
      if (endDate) query.saleDate.$lte = new Date(endDate);
    }

    const sales = await Sales.find(query)
      .populate('pharmacistId', 'name email')
      .sort({ saleDate: -1 });

    // Group by pharmacist
    const pharmacistReport = {};
    sales.forEach((sale) => {
      const pharmacistId = sale.pharmacistId?._id || 'unknown';
      const pharmacistName = sale.pharmacistName || 'Unknown';
      if (!pharmacistReport[pharmacistId]) {
        pharmacistReport[pharmacistId] = {
          pharmacistId,
          pharmacistName,
          totalSales: 0,
          totalDiscount: 0,
          totalTax: 0,
          count: 0,
        };
      }
      pharmacistReport[pharmacistId].totalSales += sale.totalAmount;
      pharmacistReport[pharmacistId].totalDiscount += sale.discount;
      pharmacistReport[pharmacistId].totalTax += sale.tax;
      pharmacistReport[pharmacistId].count += 1;
    });

    res.json({
      success: true,
      report: Object.values(pharmacistReport),
    });
  } catch (error) {
    console.error('Error generating pharmacist report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Get single sales record
router.get('/:salesId', authMiddleware, async (req, res) => {
  try {
    const sales = await Sales.findById(req.params.salesId)
      .populate('patientId')
      .populate('pharmacistId', 'name email');

    if (!sales) {
      return res.status(404).json({ error: 'Sales record not found' });
    }

    res.json({
      success: true,
      sales,
    });
  } catch (error) {
    console.error('Error fetching sales record:', error);
    res.status(500).json({ error: 'Failed to fetch sales record' });
  }
});

module.exports = router;

