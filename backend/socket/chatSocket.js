const { verifyToken } = require('../middleware/authMiddleware'); 

module.exports = (socket, io) => {
    console.log('User connected:', socket.id);

    socket.on("setup", async (token) => {
        try {
            const user = await verifyToken(token);
            socket.join(user.data._id);
            socket.emit('connected', { userId: user.data._id });
        } catch (error) {
            console.error('Authentication error:', error);
            socket.emit('error', { message: 'Authentication failed' });
            socket.disconnect();
        }
    });

    socket.on("join chat", (room) => {
        if (!room || typeof room !== 'string') {
            return socket.emit('error', { message: 'Invalid room' });
        }
        socket.join(room);
        console.log("User joined room:", room);
    });

    socket.on("new message", (newMessageStatus) => {
        if (!newMessageStatus || !newMessageStatus.chat || !newMessageStatus.chat.users) {
            return console.error("Invalid message format");
        }

        const chat = newMessageStatus.chat;

        console.log("New message:", newMessageStatus);
        
        if (!newMessageStatus.sender || !newMessageStatus.sender._id) {
            return console.error("Sender information is missing");
        }

        chat.users.forEach((user) => {
            if (user._id === newMessageStatus.sender._id) return;
            socket.to(user._id).emit('message received', newMessageStatus);
        });
    });

    socket.on("disconnect", () => {
        console.log('User disconnected:', socket.id);
    });
};