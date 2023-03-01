const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    users: {
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }],
        validate: [(val) => val.length == 2, 'Only two users per chat.']
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Chat', chatSchema)