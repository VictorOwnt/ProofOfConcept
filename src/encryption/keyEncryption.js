const apiUrl = 'https://encryptdecryptionapi-74hxklrydq-ey.a.run.app';

const kek = {
  encrypt: function encrypt(plainText) {
    return fetch(`${apiUrl}/encrypt`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plainText: plainText,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        return responseData.data;
      });
  },
  decrypt: function decrypt(cipherText) {
    return fetch(`${apiUrl}/decrypt`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cipherText: cipherText,
      }),
    }).then((response) => {
      return response.json();
    });
  },
};

export default kek;
