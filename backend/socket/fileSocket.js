const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const verifyCsrfToken = require('../utils/verifyCsrfToken');
const fileType = require('file-type');
const { exec } = require('child_process');

const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const maxFileSize = 5 * 1024 * 1024; 
const chatDir = path.join(__dirname, '../uploads/chat');
if (!fs.existsSync(chatDir)) fs.mkdirSync(chatDir);

const sanitizeFileName = (fileName) => {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '_'); 
};

const generateRandomFileName = () => {
    return crypto.randomBytes(16).toString('hex'); 
};

const scanFileForMalware = (filePath) => {
    return new Promise((resolve, reject) => {
        exec(`clamscan ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error scanning file: ${stderr}`);
                return reject(stderr);
            }
            if (stdout.includes('OK')) {
                resolve(true);
            } else {
                resolve(false); 
            }
        });
    });
};

module.exports = (socket) => {
    socket.on("upload", async ({ data, mimeType, csrfToken }) => {
        if (!allowedMimeTypes.includes(mimeType)) {
            return socket.emit('uploadError', { message: 'Invalid file type' });
        }

        const isValid = verifyCsrfToken(csrfToken, socket);
        if (!isValid) return socket.emit('uploadError', { message: 'Invalid CSRF token' });

        if (Buffer.byteLength(data, 'base64') > maxFileSize) {
            return socket.emit('uploadError', { message: 'File size exceeds the limit' });
        }

        const bufferData = Buffer.from(data, 'base64');

        const detectedType = await fileType.fromBuffer(bufferData);
        if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
            return socket.emit('uploadError', { message: 'File type mismatch or unsupported file' });
        }

        const fileName = `${generateRandomFileName()}_${sanitizeFileName(detectedType.ext)}.data`;
        const filePath = path.join(chatDir, fileName);

        try {
            
            fs.writeFileSync(filePath, bufferData);

            const isSafe = await scanFileForMalware(filePath);
            if (!isSafe) {
                fs.unlinkSync(filePath); 
                return socket.emit('uploadError', { message: 'Malware detected in file' });
            }

            socket.emit('uploaded', { buffer: data, fileName });
        } catch (error) {
            console.error("File saving error:", error);
            socket.emit('uploadError', { message: 'File could not be saved' });
        }
    });
};