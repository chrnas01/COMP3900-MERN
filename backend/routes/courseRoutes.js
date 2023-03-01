const express = require('express')
const router = express.Router()
const { 
    getCoursebyPrefix,
    getCoursebyId
} = require('../controllers/courseController')

router.get('/:prefix?', getCoursebyPrefix)
router.get('/id/:id', getCoursebyId)

module.exports = router