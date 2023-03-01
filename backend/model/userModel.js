const mongoose = require('mongoose')
const defaultImg = require('../resources/defaultImg')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Enter a valid email address."]
    },
    password: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        default: defaultImg
    },
    tutor: {
        type: Boolean,
        default: false,
        immutable: true
    },
    description: {
        type: String,
    },
    delivery: {
        type: String,
        enum: ['face-to-face', 'online', 'both'],
        required: [function() {return this.tutor}, `Required if user is tutor`],
    },
    postcode: {
        type: Number,
        required: [function() {return this.tutor}, `Required if user is tutor`],
        min: 2000,
        max: 3000,
    },
    hourlyRate: {
        type: Number,
        min: 0
    },
    teaching: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        }],
        validate:[function(teaching) {
            if (this.tutor) {return teaching.length >= 1}
            else {return true}
        }, 
        'Must specify at least one subject']
    },
    rating: {
        averageOverall: {
            type: Number,
            min: 0,
            max: 5,
            default: 0

        },
        totalRatings: {
            type: Number,
            min: 0,
            default: 0
        }
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)