const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("User ID not sent with request");
        return res.sendStatus(400);
    }

    try {
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
        .populate("users", "-password")
        .populate("latestMessage");

        if (isChat.length > 0) {
            return res.json(isChat[0]);
        } else {
            const chatData = {
                chatName: "Private Chat", 
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password");

            return res.status(200).json(fullChat);
        }
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password") 
            .populate("groupAdmin", "-password")
            .populate("latestMessage") 
            .sort({ updatedAt: -1 }); 
        return res.status(200).json({ success: true, chats });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

const fetchGroups = asyncHandler(async (req, res) => {
    try {
        const allGroups = await Chat.find({ isGroupChat: true });
        return res.status(200).json(allGroups);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.chatName) {
        return res.status(400).json({ success: false, message: "Please add a name and users to create a group" });
    }

    const users = req.body.users; 
    users.push(req.user._id); 

    try {
        const newGroup = new Chat({
            chatName: req.body.chatName, 
            isGroupChat: true,
            users: users,
            groupAdmin: req.user._id,
        });

        const fullGroupChat = await newGroup.save()
            .then(async (chat) => {
                return Chat.findOne({ _id: chat._id })
                    .populate("users", "-password")
                    .populate("groupAdmin", "-password");
            });

        return res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});
const joinGroupChat = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return res.status(400).json({ success: false, message: "Chat ID and User ID are required." });
    }

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $addToSet: { users: userId } 
        },
        {
            new: true,
            runValidators: true 
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!added) {
        return res.status(404).json({ success: false, message: "Chat not found." });
    }

    return res.status(200).json({ success: true, chat: added });
});

const groupExit = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return res.status(400).json({ success: false, message: "Chat ID and User ID are required." });
    }

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } }, 
            { new: true, runValidators: true } 
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        if (!updatedChat) {
            return res.status(404).json({ success: false, message: "Chat not found." });
        }
        
        return res.status(200).json({ success: true, chat: updatedChat });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = {
    accessChat,
    fetchChats,
    fetchGroups,
    createGroupChat,
    groupExit,
    joinGroupChat
};