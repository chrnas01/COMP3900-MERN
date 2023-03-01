const asyncHandler = require('express-async-handler')

const Course = require('../model/courseModel')

// @desc    Get courses according to the prefix entered
// @route   GET courses/:prefix?
// @access  Public
const getCoursebyPrefix = asyncHandler(async (req, res) => {
    const prefix = req.params.prefix

    let filterBy = {}
    if (prefix) filterBy = {code: new RegExp(`^${prefix}`, 'i')}
    
    const courses = await Course.find(filterBy).exec()
    res.status(200).json(courses)
})

const getCoursebyId = asyncHandler(async (req, res) => {
    const id = req.params.id

    try {
        const course = await Course.findById(id)
        res.status(200).json(course)
    }
    catch (err) {
        res.status(400)
        throw new Error(err)
    }
})

module.exports = {
    getCoursebyPrefix,
    getCoursebyId
}