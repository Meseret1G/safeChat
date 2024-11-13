import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from "@mui/material";
import { io } from "socket.io-client"; // Import the Socket.IO client
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';

const socket = io('http://localhost:5000'); // Replace with your server URL

function ChatArea({ name, timeStamp }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // State to hold messages

    const displayName = name || "Unknown";
    const displayInitial = displayName[0] || "?";

    useEffect(() => {
        // Listen for incoming messages from the server
        socket.on('message received', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Cleanup on unmount
        return () => {
            socket.off('message received');
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                text: message,
                sender: 'self', // You can modify this based on actual user data
                timeStamp: new Date().toLocaleTimeString(), // Add timestamp for the message
            };

            // Emit the new message to the server
            socket.emit('new message', newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]); // Update local state
            setMessage(''); // Clear the input field
        }
    };

    return (
        <div className='chatarea-container'>
            <div className='chatarea-header'> 
                <p className='con-icon'>{displayInitial}</p>
                <div className='header-text'>
                    <p className='con-title'>{displayName}</p>
                    <p className='con-timeStamp'>{timeStamp}</p>
                </div>
                <IconButton>
                    <DeleteIcon />
                </IconButton>
            </div>
            <div className='message-container'>
                <div>
                    {messages.map((msg, index) => 
                        msg.sender === 'self' ? (
                            <MessageSelf key={index} text={msg.text} />
                        ) : (
                            <MessageOthers key={index} text={msg.text} />
                        )
                    )}
                </div>
            </div>
            <div className='inputarea'>
                <input 
                    placeholder='Message..' 
                    className='search-box'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <IconButton onClick={handleSendMessage}>
                    <SendIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default ChatArea;