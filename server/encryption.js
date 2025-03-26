require('dotenv').config();
const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32-byte key
const IV_LENGTH = 16; // AES block size (128 bits)

const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

const decrypt = (text) => {
    try {
        const [iv, encryptedText] = text.split(':');
        
        if (!iv || !encryptedText) {
            console.error("Invalid encrypted data format:", text);
            return null;
        }

        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            ENCRYPTION_KEY,
            Buffer.from(iv, 'hex')
        );

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error("Decryption failed for text:", text, "Error:", error.message);
        return null;
    }
};

module.exports = { encrypt, decrypt };

