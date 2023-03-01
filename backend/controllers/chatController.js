const asyncHandler = require("express-async-handler");

const Chat = require("../model/chatModel");
const User = require("../model/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        res.status(400)
        throw new Error ("UserId param not sent with request");
    }

    const chat = await Chat.find({
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
    .populate("users", "name email pic tutor")
    .populate("latestMessage");

    await User.populate(chat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (chat.length !== 0) {
        res.status(200).json("Chat with these two users already exists!")
        return
    }

    try {
        const newChat = await Chat.create({
            users: [req.user._id, userId],
        });

        await newChat.populate("users", "name pic email")
        res.status(200).json(newChat);
    } 
    catch(err) {
      res.status(400);
      throw new Error(err);
    }

});

//@description     Fetch all chats for a user
//@route           GET /chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
    try {
        const allChats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "name email pic tutor")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })

        await User.populate(allChats, {
            path: "latestMessage.sender",
            select: "name email pic",
        })
        
        res.status(200).json(allChats);
    } 
    catch (err) {
        res.status(400);
        throw new Error(err);
    }
});

module.exports = {
  accessChat,
  fetchChats,
};