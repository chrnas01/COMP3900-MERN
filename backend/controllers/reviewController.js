const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

const Appointment = require('../model/appointmentModel')
const Review = require('../model/reviewModel')
const User = require('../model/userModel')

// @desc    Create new review
// @route   POST /review
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    const { tutorId, overallRating, usefullness, worthiness, flexibility, note } = req.body

    try {
        if (req.user.tutor) {
            throw 'Tutors cannot leave reviews'
        }
        
        if (!tutorId || !overallRating || !usefullness || !worthiness || !flexibility) {
            throw 'Please specify tutorId, overallRating, usefullness, worthiness and flexibility'
        }

        // Students can only leave a review if they've had an appointment
        const appointment = await Appointment.find({
            student: req.user._id, 
            tutor: tutorId, 
            status: "completed"
        })

        if (appointment.length < 1) {
            throw 'Students can only leave a review if they have had at least one appointment'
        }

        // Check if the user has already left a review for this tutor
        const previousReviews = await Review.find({
            author: req.user._id,
            tutor: tutorId
        })

        if (previousReviews.length >= 1) {
            throw 'You have already left a review for this tutor.'
        }

        // Verify tutorId
        const tutor = await User.findById(tutorId)
        if (!tutor) {
            throw 'tutorId is invalid '
        }
        
        const review = await Review.create({
            author: req.user._id,
            tutor: tutorId,
            overallRating: overallRating,
            usefullness: usefullness,
            worthiness: worthiness, 
            flexibility: flexibility,
            note: note
        })

        // Calculate the average and total reviews and update user profile accordingly
        const averageOverall = await Review.aggregate([
            { $match: {tutor: mongoose.Types.ObjectId(tutorId)} },
            { $group: { _id: "$tutor", averageOverall: { $avg: "$overallRating" } } }
        ])
        const totalRatings = await Review.find({tutor: tutorId}).count()
        
        tutor.rating.averageOverall = averageOverall[0].averageOverall
        tutor.rating.totalRatings = totalRatings
        tutor.save()

        res.status(200).json(review)
    }
    catch (err) {
        res.status(400)
        throw new Error(err)
    }
})

// @desc    Get reviews for a tutor
// @route   GET /review
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
    const { tutorId } = req.params

    try {
        if (!tutorId) {
            throw 'tutorId param not sent with request'
        }

        const reviews = await Review.find({tutor: tutorId})
        res.status(200).json(reviews)
    } 
    catch (err) {
        res.status(400)
        throw new Error(err)
    }
})

// @desc    Update a review
// @route   PUT /review
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
    res.status(200).json("Hi")

})

// @desc    Delete a review
// @route   DELETE /review
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
})

module.exports = {
    createReview,
    getReviews,
    updateReview,
    deleteReview
}