import {NativeModules} from 'react-native';
var Aes = NativeModules.Aes;
const dek = {
  //Genereren van sleutel
  generateKey: function generateKey(uid) {
    return Aes.pbkdf2(uid, 'salt', 5000, 256);
  },

  //Encrypteren van de data met DEK
  encryptData: async function encryptData(text, key) {
    const iv = await Aes.randomKey(16);
    const cipher = await Aes.encrypt(text, key, iv);
    return {cipher, iv};
  },

  //Decrypteren van de data met DEK
  decryptData: function decryptData(encryptedData, key) {
    return Aes.decrypt(encryptedData.cipher, key, encryptedData.iv);
  },
};

export default dek;
