import * as crypto from 'crypto';

// Define encryption and decryption functions
const algorithm = 'aes-256-ctr';  // Encryption algorithm
const secretKey = 'sujan';  // Secret key
const iv = crypto.randomBytes(16);  // Initialization vector

// Encrypt function
// Encrypt function
// function encrypt(text: string): string {
//     console.log('Text to encrypt:', text);  // Log input text
    
//     const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
//     console.log('Cipher object:', cipher);  // This will not show useful info but can confirm it's created
    
//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     console.log('Encrypted (partial):', encrypted);  // Log the partial encrypted result
    
//     encrypted += cipher.final('hex');
//     console.log('Encrypted (final):', encrypted);  // Log the final encrypted result
    
//     return `${iv.toString('hex')}:${encrypted}`;  // Return the IV and encrypted text
//   }
function encrypt(text:string) {
    return Buffer.from(text).toString('base64');
  }

// Decrypt function
// function decrypt(text: string): string {
//   const [ivHex, encryptedText] = text.split(':');
//   const ivBuffer = Buffer.from(ivHex, 'hex');
//   const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), ivBuffer);
//   let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }
// Base64 decoding function
function decrypt(encodedText:string) {
    return Buffer.from(encodedText, 'base64').toString('utf-8');
  }
export default {encrypt, decrypt};
