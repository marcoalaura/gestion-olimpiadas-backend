import Rijndael = require('rijndael-js');

// longitud de la clave 16/24/32 bytes (128/192/256 bit)
const key = '1234567890____16'; // TODO obtener desde env EMPAQUETADO_LLAVE

// El modo ECB no requiere un Vector de inicialización
// const iv = crypto.randomBytes(16).toString('hex');
const iv = null;

function encrypt(text: string): string {
  const cipher = new Rijndael(key, 'ecb');

  // Rijndael.encrypt(plaintext, blockSize[, iv]) -> <Array></Array>
  const ciphertext = Buffer.from(cipher.encrypt(text, '128', iv));

  const result = ciphertext.toString('base64');
  return result;
}

function decrypt(textBase64: string): string {
  const cipher = new Rijndael(key, 'ecb');

  const ciphertext = Buffer.from(textBase64, 'base64');

  // Rijndael.decrypt(ciphertext, blockSize[, iv]) -> <Array>
  const buffer = Buffer.from(cipher.decrypt(ciphertext, '128', iv));

  const result = buffer.toString().replace(/\x00/g, '');
  return result;
}

export { decrypt, encrypt };
