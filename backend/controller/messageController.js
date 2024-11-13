const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const allMessages = expressAsyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name email") 
            .populate("receiver", "name email") 
            .populate("chat"); 

        const decryptedMessages = messages.map(message => {
            return {
                ...message.toObject(),
                content: message.decryptContent() 
            };
        });

        res.status(200).json({ success: true, messages: decryptedMessages }); 
    } catch (error) {
        console.error("Error fetching messages:", error.message); 
        res.status(400).json({ success: false, message: error.message }); 
    }
});

const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json({ success: false, message: "Content and chatId are required." }); 
    }

    const newMessage = {
        content, 
        sender: req.user._id,
        chat: chatId
    };

    try {
        let message = await Message.create(newMessage); 
        message = await message.populate("sender", "name email"); 
        message = await message.populate("chat");
        message = await message.populate("receiver", "name email");

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.status(201).json({ success: true, message });
    } catch (error) {
        console.error("Error sending message:", error.message); 
        res.status(400).json({ success: false, message: error.message }); 
    }
});

module.exports = { allMessages, sendMessage };