import crypto from 'crypto';

const ALGORITHM = 'aes-256-ctr';

export default class Cipher {
  encrypt(plaintext, passowrd) {
    const cipher = crypto.createCipher(ALGORITHM, passowrd);
    let crypted = cipher.update(plaintext, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }


  decrypt(encrypted, password) {
    const decipher = crypto.createDecipher(ALGORITHM, password);
    let dec = decipher.update(encrypted, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}
