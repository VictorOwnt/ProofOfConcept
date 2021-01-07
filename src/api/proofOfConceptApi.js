import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import dek from '../encryption/dataEncryption';
import kek from '../encryption/keyEncryption';

const proofOfConceptApi = {
  //KEK => KEY ENCRYPTION, nu wordt DATA 2 maal geencrypteerd
  saveInFirestore: async function saveInFirestore(uid, data) {
    try {
      dek.generateKey(uid).then((key) => {
        dek.encryptData(JSON.stringify(data), key).then(async (dekdata) => {
          await kek.encrypt(JSON.stringify(dekdata)).then(async (kekdata) => {
            await firebase
              .firestore()
              .collection('users')
              .doc(uid)
              .collection('backpack')
              .add({
                key: key,
                data: kekdata,
                createdAt: new Date(),
              });
            //OPGELOST MET TIMEOUT OP DE NAVIAGITE
            /*.then(async (ref) => {
                await firebase
                  .firestore()
                  .collection('users')
                  .doc(uid)
                  .collection('backpack')
                  .doc(ref.id.toString())
                  .get()
                  .then((doc) => {
                    if (doc.exists) {
                      bool = true;
                    }
                  });
              });*/
          });
        });
      });
    } catch (e) {
      console.error(e);
    } finally {
      return true;
    }
  },
  getFromFirestore: async function getFromFirestore(uid) {
    let docList = [];
    try {
      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .collection('backpack')
        .get()
        .then(async (snapshot) => {
          await Promise.all(
            snapshot.docs.map(async (doc) => {
              await kek.decrypt(doc.data().data).then(async (res) => {
                await dek
                  .decryptData(JSON.parse(res), doc.data().key)
                  .then((result) => {
                    const object = JSON.parse(result);
                    docList.push({
                      id: doc.id,
                      title: object.title,
                      data: object.data,
                      type: object.type,
                      base64: object.base64,
                      createdAt: doc.data().createdAt,
                    });
                  });
              });
            }),
          );
        });
    } catch (e) {
      console.error(e);
    } finally {
      const sortedDocList = docList.sort((a, b) => {
        return (
          new Date(
            a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000,
          ) -
          new Date(
            b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000,
          )
        );
      });
      return sortedDocList;
    }
  },
  updateInFirestore: async function updateInFirestore(uid, data, docRef) {
    try {
      dek.generateKey(uid).then((key) => {
        dek.encryptData(JSON.stringify(data), key).then(async (dekdata) => {
          await kek.encrypt(JSON.stringify(dekdata)).then(async (kekdata) => {
            await firebase
              .firestore()
              .collection('users')
              .doc(uid)
              .collection('backpack')
              .doc(docRef)
              .update({
                key: key,
                data: kekdata,
                createdAt: new Date(),
              });
          });
        });
      });
    } catch (e) {
      console.error(e);
    } finally {
      return true;
    }
  },
  deleteFromFirestore: async function deleteFromFirestore(uid, docRef) {
    try {
      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .collection('backpack')
        .doc(docRef)
        .delete();
    } catch (e) {
      console.error(e);
    } finally {
      return true;
    }
  },
  savePictureInFirestorage: async function savePictureInFirestorage(uid, data) {
    try {
      //unieke filename
      /*const extension = data.fileName.split('.').pop();
      const name = data.fileName.split('.').slice(0, -1).join('.');
      const uploadUri = name + Date.now() + '.' + extension;*/
      const ref = storage().ref(
        '/users/' + uid + '/backpack/' + data.fileName, //Voor unieke => uploadUri
      );
      if (data.base64) {
        //VOOR DOCUMENTPICKER, KAN ANDERS NIET IN FIRESTORE OPGESLAGEN WORDEN
        await ref.putString(data.base64).then(async (res) => {
          console.log(res);
          const dataObject = {
            title: res.metadata.name,
            data: res.metadata.fullPath,
            type: 'image',
            base64: true,
          };
          await this.saveInFirestore(uid, dataObject);
        });
      } else {
        await ref.putFile(data.uri).then(async (res) => {
          const dataObject = {
            title: res.metadata.name,
            data: res.metadata.fullPath,
            type: 'image',
            base64: false,
          };
          await this.saveInFirestore(uid, dataObject);
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      return true;
    }
  },
  getPictureFromFirestorage: async function getPictureFromFirestorage(path) {
    let downloadUrl = '';
    try {
      await storage()
        .ref(path)
        .getDownloadURL()
        .then((url) => {
          downloadUrl = url;
        });
    } catch (e) {
      console.error(e);
    } finally {
      return downloadUrl;
    }
  },
  saveVideoInFirestorage: async function saveVideoInFireStorage(uid, data) {
    try {
      //unieke filename
      /*const extension = data.fileName.split('.').pop();
      const name = data.fileName.split('.').slice(0, -1).join('.');
      const uploadUri = name + Date.now() + '.' + extension;*/

      const ref = storage().ref(
        '/users/' + uid + '/backpack/' + data.fileName, //Voor unieke => uploadUri
      );
      if (data.base64) {
        //VOOR DOCUMENTPICKER, KAN ANDERS NIET IN FIRESTORE OPGESLAGEN WORDEN
        await ref.putString(data.base64).then(async (res) => {
          console.log(res);
          const dataObject = {
            title: res.metadata.name,
            data: res.metadata.fullPath,
            type: 'video',
            base64: true,
          };
          await this.saveInFirestore(uid, dataObject);
        });
      } else {
        await ref.putFile(data.uri).then(async (res) => {
          const dataObject = {
            title: res.metadata.name,
            data: res.metadata.fullPath,
            type: 'video',
            base64: false,
          };
          await this.saveInFirestore(uid, dataObject);
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      return true;
    }
  },
  getVideoFromFirestorage: async function getVideoFromFirestorage(path) {
    let downloadUrl = '';
    try {
      await storage()
        .ref(path)
        .getDownloadURL()
        .then((url) => {
          downloadUrl = url;
        });
    } catch (e) {
      console.error(e);
    } finally {
      return downloadUrl;
    }
  },
  saveAudioInFireStorage: async function saveAudioInFireStorage(uid, doc) {
    try {
      const ref = storage().ref(
        '/users/' + uid + '/backpack/' + doc.title, //Voor unieke => uploadUri
      );
      await ref.putString(doc.data).then(async (res) => {
        const dataObject = {
          title: doc.title,
          data: res.metadata.fullPath,
          type: 'audio',
        };
        await this.saveInFirestore(uid, dataObject);
      });
    } catch (e) {
      console.error(e);
    } finally {
      return true;
    }
  },
  getAudioFromFirestorage: async function getAudioFromFirestorage(path) {
    let audioString = '';
    try {
      await storage()
        .ref(path)
        .getDownloadURL()
        .then((audio) => {
          audioString = audio;
        });
    } catch (e) {
      console.error(e);
    } finally {
      return audioString;
    }
  },
  removeAudioFromStorage: async function removeAudioFromStorage(
    uid,
    path,
    docRef,
  ) {
    try {
      await storage()
        .ref('/users/' + uid + '/backpack/' + path)
        .delete()
        .then(async () => {
          await this.deleteFromFirestore(uid, docRef);
        });
    } catch (e) {
      console.error(e);
    } finally {
      return true;
    }
  },
  saveDrawingInFirestorage: async function saveDrawingInFirestorage(uid, doc) {
    try {
      const ref = storage().ref(
        '/users/' + uid + '/backpack/' + doc.title, //Voor unieke => uploadUri
      );
      await ref.putString(doc.data).then(async (res) => {
        const dataObject = {
          title: doc.title,
          data: res.metadata.fullPath,
          type: 'drawing',
        };
        await this.saveInFirestore(uid, dataObject);
      });
    } catch (e) {
      console.error(e);
    } finally {
      return true;
    }
  },
  getDrawingFromFirestorage: async function getDrawingFromFirestorage(path) {
    let drawingString = '';
    try {
      await storage()
        .ref(path)
        .getDownloadURL()
        .then((drawing) => {
          drawingString = drawing;
        });
    } catch (e) {
      console.error(e);
    } finally {
      return drawingString;
    }
  },
};

export default proofOfConceptApi;
