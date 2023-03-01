const express = require("express");
const {
    createAppointment,
    getAppointment,
    updateAppointmentStatus,
    markPaid
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getAppointment).post(protect, createAppointment).put(protect, updateAppointmentStatus);
router.put("/pay", protect, markPaid)

module.exports = router;