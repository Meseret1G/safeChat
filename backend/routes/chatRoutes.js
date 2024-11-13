const express = require("express");
const router = express.Router();
const { 
    accessChat,
    fetchChats,
    fetchGroups,
    createGroupChat,
    groupExit,
    joinGroupChat,
} = require("../controller/chatController");

const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats); 
router.route("/fetchGroup").get(protect, fetchGroups);
router.route("/createGroup").post(protect, createGroupChat); 
router.route("/groupExit").delete(protect, groupExit); 
router.route("/joinGroupChat").post(protect, joinGroupChat); 
module.exports = router;