import express from "express";
import Booking from "../models/Booking.js";
import { requireSignIn, isAdmin } from "../middlewares/Auth.js";

const router = express.Router();

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
router.post("/", async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['roomId', 'firstname', 'lastname', 'email', 'phone', 'checkInDate', 'checkOutDate', 'guests'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    const booking = new Booking(req.body);
    await booking.save();
    
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error.errors || error,
    });
  }
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
router.get("/", requireSignIn, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
router.put("/:id", requireSignIn, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error.errors || error,
    });
  }
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
router.delete("/:id", requireSignIn, isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;