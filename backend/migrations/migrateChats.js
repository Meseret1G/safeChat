const mongoose = require('mongoose');
const Chat = require('./models/chatModel'); 
const bcrypt = require('bcryptjs');

const migrateChats = async () => {
    await mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true });

    const chats = await Chat.find({});
    for (const chat of chats) {
        const salt = await bcrypt.genSalt(10);
        const hashedChatName = await bcrypt.hash(chat.chatName, salt);
        chat.chatName = hashedChatName;
        await chat.save();
    }

    console.log('Migration complete!');
    mongoose.disconnect();
};

migrateChats().catch(console.error);