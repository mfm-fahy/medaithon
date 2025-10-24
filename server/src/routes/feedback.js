const express = require("express")
const Feedback = require("../models/Feedback")
const { authMiddleware, roleMiddleware } = require("../middleware/auth")

const router = express.Router()

// Submit feedback
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { patientId, rating, category, message, timestamp } = req.body

    // Validation
    if (!patientId || !rating || !category || !message) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    if (message.length < 10 || message.length > 500) {
      return res.status(400).json({ message: "Message must be between 10 and 500 characters" })
    }

    const validCategories = ["general", "staff", "facilities", "treatment", "cleanliness", "wait_time"]
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" })
    }

    // Create feedback
    const feedback = new Feedback({
      patientId,
      rating,
      category,
      message,
      timestamp: timestamp || new Date(),
      status: "new",
    })

    await feedback.save()

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    res.status(500).json({ message: "Error submitting feedback" })
  }
})

// Get all feedback (admin only)
router.get("/", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { status, category, patientId } = req.query

    const filter = {}
    if (status) filter.status = status
    if (category) filter.category = category
    if (patientId) filter.patientId = patientId

    const feedback = await Feedback.find(filter).sort({ createdAt: -1 })

    res.json({
      total: feedback.length,
      feedback,
    })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    res.status(500).json({ message: "Error fetching feedback" })
  }
})

// Get feedback by patient ID
router.get("/patient/:patientId", authMiddleware, async (req, res) => {
  try {
    const { patientId } = req.params

    const feedback = await Feedback.find({ patientId }).sort({ createdAt: -1 })

    res.json({
      total: feedback.length,
      feedback,
    })
  } catch (error) {
    console.error("Error fetching patient feedback:", error)
    res.status(500).json({ message: "Error fetching feedback" })
  }
})

// Get feedback statistics (admin only)
router.get("/stats/summary", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments()
    const averageRating = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ])

    const feedbackByCategory = await Feedback.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ])

    const feedbackByStatus = await Feedback.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    res.json({
      totalFeedback,
      averageRating: averageRating[0]?.avgRating || 0,
      byCategory: feedbackByCategory,
      byStatus: feedbackByStatus,
    })
  } catch (error) {
    console.error("Error fetching feedback stats:", error)
    res.status(500).json({ message: "Error fetching statistics" })
  }
})

// Update feedback status (admin only)
router.patch("/:feedbackId", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { feedbackId } = req.params
    const { status, adminNotes } = req.body

    const validStatuses = ["new", "reviewed", "resolved"]
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      {
        status: status || undefined,
        adminNotes: adminNotes || undefined,
      },
      { new: true }
    )

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" })
    }

    res.json({
      message: "Feedback updated successfully",
      feedback,
    })
  } catch (error) {
    console.error("Error updating feedback:", error)
    res.status(500).json({ message: "Error updating feedback" })
  }
})

// Delete feedback (admin only)
router.delete("/:feedbackId", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const { feedbackId } = req.params

    const feedback = await Feedback.findByIdAndDelete(feedbackId)

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" })
    }

    res.json({ message: "Feedback deleted successfully" })
  } catch (error) {
    console.error("Error deleting feedback:", error)
    res.status(500).json({ message: "Error deleting feedback" })
  }
})

module.exports = router

