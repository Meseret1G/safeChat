const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const chatModel = mongoose.Schema({
    chatName: { type: String, required: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
});

chatModel.pre('save', async function (next) {
    if (this.isModified('chatName') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.chatName = await bcrypt.hash(this.chatName, salt);
    }
    next();
});

chatModel.methods.compareChatName = async function (plainChatName) {
    return await bcrypt.compare(plainChatName, this.chatName);
};

const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;