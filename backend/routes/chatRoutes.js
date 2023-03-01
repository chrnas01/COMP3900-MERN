const express = require("express");
const {
  accessChat,
  fetchChats
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, fetchChats);
router.route("/").post(protect, accessChat);

module.exports = router;