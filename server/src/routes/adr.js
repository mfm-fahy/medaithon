const express = require("express")
const router = express.Router()
const ADR = require("../models/ADR")
const authMiddleware = require("../middleware/auth")

// Submit ADR Form
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const {
      patientName,
      patientAge,
      patientGender,
      medicineNames,
      adverseReaction,
      severity,
      dateOfOnset,
      actionTaken,
      outcome,
      reporterName,
      reporterPhone,
      reporterEmail,
      additionalNotes,
      submittedBy,
      submittedByName,
    } = req.body

    // Validate required fields
    if (!patientName || !medicineNames || !adverseReaction) {
      return res.status(400).json({
        success: false,
        message: "Patient name, medicine names, and adverse reaction are required",
      })
    }

    // Create new ADR record
    const adrRecord = new ADR({
      patientName,
      patientAge,
      patientGender,
      medicineNames,
      adverseReaction,
      severity,
      dateOfOnset: dateOfOnset ? new Date(dateOfOnset) : null,
      actionTaken,
      outcome,
      reporterName,
      reporterPhone,
      reporterEmail,
      additionalNotes,
      submittedBy,
      submittedByName,
      status: "submitted",
    })

    await adrRecord.save()

    console.log("✅ ADR form submitted:", adrRecord._id)

    res.status(201).json({
      success: true,
      message: "ADR form submitted successfully",
      adr: adrRecord,
    })
  } catch (err) {
    console.error("Error submitting ADR form:", err)
    res.status(500).json({
      success: false,
      message: "Failed to submit ADR form",
      error: err.message,
    })
  }
})

// Get all ADR records (Admin/Pharmacist)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status, patientName, page = 1, limit = 10 } = req.query

    const filter = {}
    if (status) filter.status = status
    if (patientName) filter.patientName = { $regex: patientName, $options: "i" }

    const skip = (page - 1) * limit

    const adrs = await ADR.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("submittedBy", "name email")
      .populate("reviewedBy", "name email")

    const total = await ADR.countDocuments(filter)

    res.json({
      success: true,
      adrs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error("Error fetching ADR records:", err)
    res.status(500).json({
      success: false,
      message: "Failed to fetch ADR records",
      error: err.message,
    })
  }
})

// Get single ADR record
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const adr = await ADR.findById(req.params.id)
      .populate("submittedBy", "name email")
      .populate("reviewedBy", "name email")

    if (!adr) {
      return res.status(404).json({
        success: false,
        message: "ADR record not found",
      })
    }

    res.json({
      success: true,
      adr,
    })
  } catch (err) {
    console.error("Error fetching ADR record:", err)
    res.status(500).json({
      success: false,
      message: "Failed to fetch ADR record",
      error: err.message,
    })
  }
})

// Update ADR status (Admin only)
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status, reviewNotes } = req.body

    if (!["submitted", "under-review", "acknowledged", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      })
    }

    const adr = await ADR.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes,
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
      { new: true }
    )

    if (!adr) {
      return res.status(404).json({
        success: false,
        message: "ADR record not found",
      })
    }

    console.log("✅ ADR status updated:", adr._id, "Status:", status)

    res.json({
      success: true,
      message: "ADR status updated successfully",
      adr,
    })
  } catch (err) {
    console.error("Error updating ADR status:", err)
    res.status(500).json({
      success: false,
      message: "Failed to update ADR status",
      error: err.message,
    })
  }
})

// Get ADR statistics
router.get("/stats/summary", authMiddleware, async (req, res) => {
  try {
    const total = await ADR.countDocuments()
    const submitted = await ADR.countDocuments({ status: "submitted" })
    const underReview = await ADR.countDocuments({ status: "under-review" })
    const acknowledged = await ADR.countDocuments({ status: "acknowledged" })
    const closed = await ADR.countDocuments({ status: "closed" })

    const severityStats = await ADR.aggregate([
      {
        $group: {
          _id: "$severity",
          count: { $sum: 1 },
        },
      },
    ])

    const outcomeStats = await ADR.aggregate([
      {
        $group: {
          _id: "$outcome",
          count: { $sum: 1 },
        },
      },
    ])

    res.json({
      success: true,
      stats: {
        total,
        byStatus: {
          submitted,
          underReview,
          acknowledged,
          closed,
        },
        bySeverity: severityStats,
        byOutcome: outcomeStats,
      },
    })
  } catch (err) {
    console.error("Error fetching ADR statistics:", err)
    res.status(500).json({
      success: false,
      message: "Failed to fetch ADR statistics",
      error: err.message,
    })
  }
})

module.exports = router

