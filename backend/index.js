const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require('./config/db'); 
const csrfProtection = require('./middleware/csrfProtection'); 
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const fileRoute = require('./routes/fileRoute');
const chatSocket = require('./socket/chatSocket');
const fileSocket = require('./socket/fileSocket');
const videoSocket = require('./socket/videoSocket');

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(csrfProtection);  

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);
app.use("/file", fileRoute);

app.get("/", (req, res) => {
    res.send("API is running..");
});

app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
    },
    pingTimeout: 6000,
});

io.on("connection", (socket) => {
    chatSocket(socket, io);            
    fileSocket(socket);        
    videoSocket(socket);           
});

// const express = require('express');
// const dotenv = require("dotenv");
// const mongoose = require('mongoose');
// const path = require('path');
// const fs = require('fs');
// const http = require('http');
// const cors = require("cors");
// const cookieParser = require('cookie-parser');
// const csrf = require('csurf');
// const userRoutes = require("./routes/userRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const messageRoutes = require('./routes/messageRoutes');


// dotenv.config();
// const app = express();

// app.use(cors({
//     origin: "*", 
//     credentials: true,
// }));
// app.use(cookieParser());
// app.use(express.json({ limit: '1mb' })); 

// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

// const connectDb = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB connected');
//     } catch (error) {
//         console.error("MongoDB is not connected:", error.message);
//         setTimeout(connectDb, 5000);
//     }
// };

// connectDb();

// app.get("/", (req, res) => {
//     res.send("API is running..");
// });

// app.get('/csrf-token', (req, res) => {
//     res.json({ csrfToken: req.csrfToken() });
// });

// app.use("/user", userRoutes);
// app.use("/chat", chatRoutes);
// app.use("/message", messageRoutes);

// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// const io = require('socket.io')(server, {
//     cors: {
//         origin: process.env.CLIENT_URL || "*",
//     },
//     pingTimeout: 6000,
// });

// const chatDir = path.join(__dirname, 'chat');
// if (!fs.existsSync(chatDir)) {
//     fs.mkdirSync(chatDir);
// }

// const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

// const verifyCsrfToken = async (token, socket) => {
//     if (!token) {
//         console.error("CSRF token missing from payload");
//         return false;
//     }

//     // Retrieve the CSRF token from cookies using `cookie-parser`
//     const csrfCookieToken = socket.handshake.headers.cookie
//         ?.split('; ')
//         .find(cookie => cookie.startsWith('_csrf='))
//         ?.split('=')[1];

//     if (!csrfCookieToken) {
//         console.error("CSRF token missing from cookies");
//         return false;
//     }

//     const isValid = token === csrfCookieToken;

//     if (!isValid) {
//         console.error("CSRF token mismatch");
//     }

//     return isValid;
// };
// let peers = {};
// io.on("connection", (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on("setup", (user) => {
//         socket.join(user.data._id);
//         socket.emit('connected');
//     });

//     socket.on("join chat", (room) => {
//         socket.join(room);
//         console.log("User joined room:", room);
//     });

//     socket.on("new message", (newMessageStatus) => {
//         console.log("New message:", newMessageStatus);
//         const chat = newMessageStatus.chat;

//         if (!chat.users) {
//             return console.error("Chat users not found");
//         }

//         chat.users.forEach((user) => {
//             if (user._id === newMessageStatus.sender._id) return;
//             socket.to(user._id).emit('message received', newMessageStatus);
//         });
//     });

//     socket.on("upload", async ({ data, mimeType, csrfToken }) => {
//         if (!allowedMimeTypes.includes(mimeType)) {
//             return socket.emit('uploadError', { message: 'Invalid file type' });
//         }

//         const isValid = await verifyCsrfToken(csrfToken, socket);

//         if (!isValid) {
//             return socket.emit('uploadError', { message: 'Invalid CSRF token' });
//         }

//         const fileName = `upload_${Date.now()}.data`;
//         const filePath = path.join(chatDir, fileName);

//         try {
//             fs.writeFileSync(filePath, data, { encoding: 'base64' });
//             socket.emit('uploaded', { buffer: data.toString("base64") });
//         } catch (error) {
//             console.error("File saving error:", error);
//             socket.emit('uploadError', { message: 'File could not be saved' });
//         }
//     });
    
//     const peer = new RTCPeerConnection();
//      peers[socket.id] = peer;

//      peer.onicecandidate = event => {
//        if (event.candidate) {
//          socket.emit('candidate', socket.id, event.candidate);
//        }
//      };
     
//     socket.on('offer', async (id, description) => {
//         await peer.setRemoteDescription(new RTCSessionDescription(description));
//         const answer = await peer.createAnswer();
//         await peer.setLocalDescription(answer);
//         socket.emit('answer', id, peer.localDescription);
//       });
    
//       socket.on('answer', async (id, description) => {
//         await peer.setRemoteDescription(new RTCSessionDescription(description));
//       });
 
//       socket.on('candidate', async (id, candidate) => {
//         await peer.addIceCandidate(new RTCIceCandidate(candidate));
//       });
    
//     socket.on("disconnect", () => {
//         delete peers[socket.id];
//         console.log('User disconnected:', socket.id);
//     });
// });
