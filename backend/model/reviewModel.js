const mongoose = require("mongoose");

const reviewModel = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    overallRating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    usefullness: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    worthiness: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    flexibility: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    note: {
        type: String
    }

}, { 
    timestamps: true 
});

module.exports = mongoose.model('Review', reviewModel)