const asyncHandler = require("express-async-handler");

const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");
const User = require("../model/userModel");

//@description     Get all Messages
//@route           GET /message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat", "latestMessage")
            .sort({createdAt: -1})
    
        res.status(200).json(messages);
    } 
    catch (err) {
        res.status(400);
        throw new Error(err);
    }
});

//@description     Create New Message
//@route           POST /message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        res.status(400);
        throw new Error("Invalid data passed into request");
    }

    try {
        const newMessage = await Message.create({
            sender: req.user._id,
            content: content,
            chat: chatId,
        })

        const message = await Message.findById(newMessage._id)
            .populate("sender", "name pic")
            .populate("chat")
        
        await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.status(200).json(message);
    } 
    catch (err) {
        res.status(400);
        throw new Error(err);
    }
});

module.exports = { allMessages, sendMessage };