const express = require("express");
const {
    createReview,
    getReviews,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createReview).put(protect, updateReview).delete(protect,deleteReview)
router.get("/:tutorId", getReviews)

module.exports = router;