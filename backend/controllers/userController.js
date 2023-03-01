const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../model/userModel')
const Appointment = require('../model/appointmentModel')
const Chat = require('../model/chatModel')
const Course = require('../model/courseModel')
const Message = require('../model/messageModel')
const Review = require('../model/reviewModel')

// @desc    Register new user
// @route   POST /auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, tutor, description, delivery, postcode, hourlyRate, teaching} = req.body

    // Common to both student and tutor
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Name, email and password is required for both account types')
    }

    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Password validation 
    // Must be greater than 7 characters long
    const passwordRegex =  /^[a-zA-Z0-9!@#$%^&*]{7,}$/
    if (!password.match(passwordRegex)) {
        res.status(400)
        throw new Error('Password must be at least 7 characters long and must not include illegal characters')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    let tutorFields = {}
    if (tutor) {
        tutorFields = {
            tutor: tutor,
            description: description,
            delivery: delivery,
            postcode: postcode, 
            hourlyRate: hourlyRate,
            teaching: tutor ? await Course.find({code: teaching}) : undefined, 
        }
    }
    
    // Create User
    const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        ...tutorFields
    })

    if (user) {
        res.status(201).json({
            token: generateToken(user.id)
        })
    }
    else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate a user
// @route   POST auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error ("Email and password must be supplied to login")
    }

    // Check if user exists and entered password matches stored password
    const user = await User.findOne({email})
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            token: generateToken(user.id)
        })
    } 
    else {
        res.status(400)
        throw new Error ('Invalid credentials')
    }
})

// @desc    Get user information
// @route   GET auth/user
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate("teaching")
        
        res.status(200).json(user)
    }
    catch {
        res.status(400)
        throw new Error("Something went wrong")
        
    }
})

// @desc    Update user information
// @route   PUT auth/
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { name, email, password, pic, description, delivery, postcode, hourlyRate, teaching } = req.body
    
    try {
        const updatedUser = await User.findById(_id)
        if (name) updatedUser.name = name
        if (email) updatedUser.email = email
        if (password && password.match(/^[a-zA-Z0-9!@#$%^&*]{7,}$/)) {
            // Hash password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            updatedUser.password = hashedPassword
        }
        if (pic) updatedUser.pic = pic
        if (description) updatedUser.description = description
        if (delivery) updatedUser.delivery = delivery
        if (postcode) updatedUser.postcode = postcode
        if (hourlyRate) updatedUser.hourlyRate = hourlyRate
        if (teaching) updatedUser.teaching = await Course.find({code: teaching})
        await updatedUser.save()

        const formatUser = await User.findById(_id)
            .select("-password")
            .populate("teaching")
        
        res.status(200).json(formatUser)
    }
    catch (err) {
        res.status(400)
        throw new Error(err)
    }

})

// @desc    Delete user information
// @route   DELETE auth/
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    try {
        if (!req.user) throw "User has been deleted"

        // Delete Reviews
        await Review.deleteMany({author: req.user._id})

        // Delete Appointments
        await Appointment.deleteMany({
            $or: [
                { student: req.user._id },
                { tutor: req.user._id }
            ]
        })

        // Delete Messages
        await Message.deleteMany({sender: req.user._id})

        // Delete Chats
        await Chat.deleteMany({user: req.user._id})

        // Delete User
        const deletedUser = await User.findByIdAndRemove(req.user._id)

        res.status(200).json(deletedUser)
    }
    catch (err) {
        res.status(400)
        throw new Error(err)
    }
})

// @desc    Get a specifed tutors details or all tutors details if no tutor id is specified.
// @route   GET auth/tutor/:id?
// @access  Public
const getTutor = asyncHandler(async (req, res) => {
    const { id }= req.params

    if (id) {
        try {
            const tutor = await User.findById({_id: id})
                .select("-password")
                .populate("teaching")
            
            // If user is not a tutor
            if (!tutor.tutor) throw "User matching this id is not a tutor"
            
            res.status(200).json(tutor)
        }
        catch (err) {
            res.status(400)
            throw new Error (err)
        }
    }
    else {
        /* 
        Sort:
         - bestReviewed
         - mostReviewed
         - newest
         - oldest
         - price: high-low
         - price: low-high

        Filter: 
         - name
         - delivery
         - postcode
         - teaching
         - minRating
         - minPrice
         - maxPrice
        */

        const { sort, name, delivery, postcode, subject, minRating, minPrice, maxPrice } = req.query
        const subjectList = subject.split(",")
        
        // Sort alphabetically by default
        let sortBy = {name: 1}
        if (sort === "bestReviewed") sortBy = {"rating.averageOverall": -1}
        else if (sort === 'mostReviewed') sortBy = {"rating.totalRatings": -1}
        else if (sort === "newest") sortBy = {createdAt: -1}
        else if (sort === "oldest") sortBy = {createdAt: 1}
        else if (sort === "high-low") sortBy = {hourlyRate: -1}
        else if (sort === "low-high") sortBy = {hourlyRate: 1}
        
        // Filter tutors by default
        let filterBy = {
            tutor: true,
        }
        // Add min rating
        if (name) filterBy.name = new RegExp(`^.*${name}.*$`, 'i');
        if (delivery) filterBy.delivery = delivery;
        if (postcode) filterBy.postcode = postcode
        if (subject) {
            const courses = await Course.find({code: subjectList})
            const courseId = courses.map((course) => course._id) 
            if (courseId.length !== 0) filterBy.teaching = {$in: courseId}
        }
        if (parseInt(minRating)) filterBy["rating.averageOverall"] = {$gte: minRating}
        if (parseInt(minPrice)) filterBy.hourlyRate = {$gte: minPrice}
        if (parseInt(maxPrice)) filterBy.hourlyRate = {$lte: maxPrice}
        
        const tutors = await User.find(filterBy)
            .select("-password")
            .populate("teaching")
            .sort(sortBy)

        res.status(200).json(tutors) 
    }
})

// @desc    Recommend a tutor
// @route   GET auth/recommend/
// @access  Private
const getRecommendedTutors = asyncHandler(async (req, res) => {
    const { delivery, courses } = req.query

    try {
        if (!delivery || !courses) throw 'delivery and course specification required.'
        if (!['face-to-face', 'online', 'both'].includes(delivery)) throw 'delivery type invald.'
        
        let filterBy = {delivery: delivery}
        if (delivery === 'both') {
            filterBy = {$or: [{delivery: 'face-to-face'}, {delivery: 'online'}]}
        }

        const courseList = courses.split(",")
        const courseDB = await Course.find({code: courseList})
        const courseById = courseDB.map((course) => course._id) 
        filterBy.teaching = {$in: courseById}
        
        const recommendedTutors = await User.find(filterBy)
            .select("-password")
            .populate("teaching")

        res.status(200).json(recommendedTutors)
    }
    catch (err) {
        res.status(400)
        throw new Error(err)
    }
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = { 
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    getTutor,
    getRecommendedTutors,
}