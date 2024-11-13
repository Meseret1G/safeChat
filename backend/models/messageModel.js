const mongoose = require("mongoose");
const crypto = require("crypto");

const algorithm = 'aes-256-cbc'; // Encryption algorithm
const key = crypto.randomBytes(32); // Key for encryption (store this securely)
const iv = crypto.randomBytes(16); // Initialization vector (should be stored with the message)

const messageModel = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    content: {
        type: String,
        required: true
    },
    iv: { 
        type: Buffer,
        required: true
    }
}, {
    timestamps: true,
});

messageModel.pre('save', function(next) {
    if (this.isModified('content')) {
        this.iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), this.iv);
        let encrypted = cipher.update(this.content, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        this.content = encrypted; 
    }
    next();
});

messageModel.methods.decryptContent = function() {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), this.iv);
    let decrypted = decipher.update(this.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const Message = mongoose.model("Message", messageModel);
module.exports = Message;