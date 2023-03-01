const express = require('express')
const router = express.Router()
const {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    getTutor,
    getRecommendedTutors
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.route('/').get(protect, getUser).put(protect, updateUser).delete(protect, deleteUser)
router.get('/tutor/:id?', getTutor)
router.get('/recommend', getRecommendedTutors)

module.exports = router