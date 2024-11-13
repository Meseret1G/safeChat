const fs = require('fs');
const path = require('path');
const verifyCsrfToken = require('../utils/verifyCsrfToken');

const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const chatDir = path.join(__dirname, '../uploads/chat');

if (!fs.existsSync(chatDir)) fs.mkdirSync(chatDir);

exports.uploadFile = async (req, res) => {
    const { data, mimeType, csrfToken } = req.body;

    if (!allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({ message: 'Invalid file type' });
    }

    const isValid = verifyCsrfToken(csrfToken, req);
    if (!isValid) return res.status(403).json({ message: 'Invalid CSRF token' });

    const fileName = `upload_${Date.now()}.data`;
    const filePath = path.join(chatDir, fileName);

    try {
        fs.writeFileSync(filePath, data, { encoding: 'base64' });
        res.status(200).json({ message: 'File uploaded successfully', filePath });
    } catch (error) {
        console.error("File saving error:", error);
        res.status(500).json({ message: 'File could not be saved' });
    }
};