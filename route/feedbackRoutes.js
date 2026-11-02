const express = require("express");
const mongoose = require("mongoose");
const Feedback = require("../models/feedbackSchema.js");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { studentName, courseName, message, rating } = req.body;
    if (!studentName || !courseName || !message || rating === undefined) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    if (!Number.isFinite(Number(rating)) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }
    const feedback = await Feedback.create({
      studentName,
      courseName,
      message,
      rating,
    });
    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        message: "Invalid page or limit",
      });
    }
    const skip = (page - 1) * limit;
    const feedback = await Feedback.find().skip(skip).limit(limit);
    const totalRecords = await Feedback.countDocuments();
    res.status(200).json({
      currentPage: page,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid feedback ID",
      });
    }

    if (!["Pending", "Reviewed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Pending or Reviewed",
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      message: "Feedback status updated successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
