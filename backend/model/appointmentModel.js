const mongoose = require("mongoose");

const appointmentModel = mongoose.Schema({
    sender: {
        type: String,
        enum: ['tutor', 'student'],
        required: true,
    },
    tutor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
        immutable: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
        immutable: true,
    },
    price: {
        value: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"]
        },
        currency: {
            type: String,
            required: true,
            validate: [(currency) => currency.length === 3, "Enter valid currency"]
        },
        status: {
            type: String,
            enum: ['unpaid', 'paid'],
            default: 'unpaid'
        }
    },
    duration: {
        type: Number,
        min: [1, "1 hour minimum session length"],
        required: true,
    },
    delivery: { 
        type: String, 
        enum: ['face-to-face', 'online'],
        required: true,
        immutable: true
    },
    date: {
        type: Date,
        required: true,
        validate: [(date) => date > new Date(), "Date cannot be in the past"]
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, "Please enter a valid course code"]
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined', 'completed'],
        default: 'pending'
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Appointment', appointmentModel)