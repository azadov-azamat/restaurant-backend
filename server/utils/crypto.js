const crypto = require('crypto');
const Promise = require('bluebird');
const pbkdf2Async = Promise.promisify(crypto.pbkdf2);
const randomBytes = Promise.promisify(crypto.randomBytes);

const algorithm = 'aes-256-ctr';
const IV_LENGTH = 16;

function createKey(password) {
  return crypto.createHash('sha256').update(String(password)).digest();
}

function encrypt(text, password) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, createKey(password), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(text, password) {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, createKey(password), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = {
  getHash(pass, salt, itiration, length) {
    return pbkdf2Async(pass, salt, itiration || 60000, length || 512, 'sha512').call(
      'toString',
      'hex'
    );
  },

  encrypt,
  decrypt,

  async randomSalt(count = 128, encoding = 'hex') {
    let bytes = await randomBytes(count);
    return bytes.toString(encoding);
  },
};
