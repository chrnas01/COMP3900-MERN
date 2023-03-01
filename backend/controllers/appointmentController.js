const asyncHandler = require('express-async-handler')

const Appointment = require('../model/appointmentModel')
const Course = require('../model/courseModel')
const User = require('../model/userModel')

// @desc    Register new user
// @route   POST /appointment
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
    const { tutor, student, price, duration, delivery, date, subject } = req.body
    
    if (!tutor && !student) {
        res.status(400)
        throw new Error("Please specify the other user in the appointment")
    }
    
    // Check if student or tutor is creating appointment
    const tutorId = req.user.tutor ? req.user._id : tutor;
    const studentId = req.user.tutor ? student : req.user._id

    // Check there is exactly one tutor and one student 
    try {
        const tut = await User.findById(tutorId).select("tutor")
        const stu = await User.findById(studentId).select("tutor")

        // Validate tutor and student
        if (!(tut.tutor && !stu.tutor)) {
            throw "Appointments must have ONE valid tutor and ONE valid student"
    }
    }
    catch (err) {
        res.status(400)
        throw new Error(err)
    }

    try {
        if (!price || !duration || !delivery || !date || !subject ) {
            throw "Please provide a valid price, duration, delivery, date and subject"
        }
        const [value, currency] = price.split(" ", 2)
        const [year, month, day, hour=0, minute=0] = date.split(",", 5)
        
        const appointment = await Appointment.create({
            sender: req.user._id === tutorId ? 'tutor' : 'student',
            tutor: tutorId,
            student: studentId,
            price: {
                value: value, 
                currency: currency,
            },
            duration: duration,
            delivery: delivery,
            date: new Date(year, month-1, day, hour, minute),
            subject: await Course.findOne({code: subject}).select("_id")
        })

        res.status(200).json(appointment)
    }
    catch (err) {
        res.status(400)
        throw new Error(err)
    }
})

// @desc    Get appointment information
// @route   GET appointment
// @access  Private
const getAppointment = asyncHandler(async (req, res) => {
    const userId = req.user._id
    try {
        const userAppointments = await Appointment.find({$or: [{tutor: userId}, {student: userId}]})
            .populate("student tutor", "name email tutor")
            .populate("subject")
        
        // Automatically update from pending to completed
        userAppointments.forEach(async (apt) => {
            const aptTime = apt.date.getTime()
            const aptCompletionTime = new Date(aptTime + apt.duration * 60 * 1000)
            const currentTime = new Date()

            // If the appointment is approved and has finished mark complete
            if (apt.status === "approved" && currentTime >= aptCompletionTime) {
                apt.status = "completed"
                await apt.save({ validateBeforeSave: false })
            }
            // If the appointment is pending and has not been actioned before
            // the appointment time mark declined
            else if (apt.status === "pending" && currentTime >= aptCompletionTime) {
                apt.status = "declined"
                await apt.save({ validateBeforeSave: false })
            }
        })

        res.status(200).json(userAppointments)
    }
    catch (err) {
        res.status(400)
        throw new Error(err)
    }
})

// @desc    Update appointment status from pending to approved or declined
// @route   PUT appointment
// @access  Private
const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { appointmentId, newStatus } = req.body

    if (!appointmentId || !newStatus) {
        res.status(400)
        throw new Error ("Please provide appointmentId and newStatus")
    }

    // Cannot be updated to pending since that is the appointments initial state.
    if (!['approved', 'declined'].includes(newStatus)) {
        res.status(400)
        throw new Error("newStatus can only be 'approved', 'declined' or 'completed'")
    }

    try {
        const appointment = await Appointment.findById(appointmentId)
        
        if (!appointment) {
            throw 'Appointment does not exist'
        }
        
        const caller = (req.user._id).toString()
        const tutor = appointment.tutor._id.toString()
        const student = appointment.student._id.toString()
        if (caller !== tutor && caller !== student) {
            throw "You do not belong to this appointment."
        }

        // Can only be updated as follows:
        // pending -> approved
        // pending -> declined
        if (appointment.status !== "pending"){
            throw 'Appointment status can only be uploaded from pending state.'
        }

        appointment.status = newStatus
        await appointment.save({ validateBeforeSave: false })

        res.status(200).json(appointment)
    }
    catch (err) {
        res.status(400)
        throw new Error(err)
    }
})

// @desc    Tutor can mark the appointment paid
// @route   PUT appointment/pay
// @access  Private
const markPaid = asyncHandler( async (req, res) => {
    const { appointmentId } = req.body

    if (!appointmentId) throw new Error("Please supply appointmentId")

    try {
        const appointment = await Appointment.findById(appointmentId)
        
        if (!appointment) {
            throw "No appointment found"
        }
        if (!req.user._id.equals(appointment.tutor)) {
            throw "Only the tutor for the specified appointmentId has authorization to mark payments complete."
        }
        if (appointment.price.status === "paid") {
            throw "Appointment has already been marked as paid."
        }

        appointment.price.status = "paid"
        appointment.save({ validateBeforeSave: false })
        res.status(200).json(appointment)
    }
    catch (err) {
        res.status(400)
        throw new Error(err)
    }
})

module.exports = {
    createAppointment,
    getAppointment,
    updateAppointmentStatus,
    markPaid
}