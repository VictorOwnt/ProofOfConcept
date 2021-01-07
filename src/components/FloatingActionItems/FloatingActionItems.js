import {PermissionsAndroid, Platform} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';

//TOESTEMMING VEREIST VANAF MARSHMALLOW VERSIE VAN ANDROID (API 23 EN BOVEN)
//NIET VEREIST BIJ IOS, MAAR KAN ER ZEKER OOK INGESTOKEN WORDEN
const checkPermissionsCamera = async (navigation) => {
  if (Platform.OS === 'android') {
    try {
      const cameraUsage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (cameraUsage === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.launchCamera({mediaType: 'photo'}, async (response) => {
          if (response.uri != null) {
            navigation.navigate('Camera', {response: response, visible: true});
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    ImagePicker.launchCamera({mediaType: 'photo'}, async (response) => {
      if (response.uri != null) {
        navigation.navigate('Camera', {response: response, visible: true});
      }
    });
  }
};

const checkPermissionsVideo = async (navigation) => {
  if (Platform.OS === 'android') {
    try {
      const cameraUsage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (cameraUsage === PermissionsAndroid.RESULTS.GRANTED) {
        try {
          const microphoneUsage = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          );
          if (microphoneUsage === PermissionsAndroid.RESULTS.GRANTED) {
            ImagePicker.launchCamera(
              {mediaType: 'video', videoQuality: 'high'},
              async (response) => {
                if (response.uri != null) {
                  navigation.navigate('Video', {
                    response: response,
                    visible: true,
                  });
                }
              },
            );
          }
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    ImagePicker.launchCamera(
      {mediaType: 'video', videoQuality: 'high'},
      async (response) => {
        if (response.uri != null) {
          navigation.navigate('Video', {
            response: response,
            visible: true,
          });
        }
      },
    );
  }
};

const checkPermissionsAudio = async (navigation) => {
  if (Platform.OS === 'android') {
    try {
      const storageUsage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (storageUsage === PermissionsAndroid.RESULTS.GRANTED) {
        try {
          const microphoneUsage = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          );
          if (microphoneUsage === PermissionsAndroid.RESULTS.GRANTED) {
            navigation.navigate('Audio');
          }
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
      return;
    }
  } else {
    navigation.navigate('Audio');
  }
};

const convertToBase64 = (res, navigation, destination) => {
  let response = {};
  let data = '';
  RNFetchBlob.fs.readStream(res.uri, 'base64', 4095).then((ifstream) => {
    ifstream.open();
    ifstream.onData((chunk) => {
      data += chunk;
    });
    ifstream.onError((err) => {
      console.log(err);
    });
    ifstream.onEnd(() => {
      response = {
        fileName: res.name,
        fileSize: res.size,
        type: res.type,
        uri: res.uri,
        base64: data,
      };
      navigation.navigate(destination, {
        response: response,
        visible: true,
      });
    });
  });
};

const pickFiles = async (navigation) => {
  try {
    const res = await DocumentPicker.pick({
      type: DocumentPicker.types.images, //DocumentPicker.types.allFiles,
    });
    const type = res.type.split('/')[0];
    switch (type) {
      case 'image':
        convertToBase64(res, navigation, 'Camera');
        break;
      /*VIDEO IS PRAKTISCH NIET HAALBAAR, heb het uitgewerkt en het staat nu in commentaar.
      De documenntpicker pakt een speciale uri voor het bestand de content uri. Deze kan niet opgeslagen
      worden in firebase omdat de toegang daarvoor geweigerd wordt.
      De video moet dus omgezet worden naar base64, wat al niet praktisch is voor grote videos, maakt ook het bestand
      groter, daarna moet de base64 locaal weer omgezet worden in video formaat en opgeslagen worden op het toestel,
      wat er dus voor zorgt dat de video 2 maal op uw toestel staat. Dit is op zich allemaal niet zo een probleem, maar
      voor een video van 1 minuut moet het ook heeel lang laden om van video naar base64 omgezet te worden en hetzelfde
      geldt voor het proberen afspelen van die video daarna uit de backpack. Bovenop is wat hierboven beschreven staat
      enkel het geval voor Android, voor IOS zou de video nog eens EXTRA omgezet moeten worden naar afspeelbaar formaat, wat
      nog langer zou duren.
      case 'video':
        convertToBase64(res, navigation, 'Video');
        break;*/
    }
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('canceled');
    } else {
      throw err;
    }
  }
};

const FloatingActionItems = [
  {
    label: 'Filmen',
    onItemPress: (item, index, navigation) => {
      checkPermissionsVideo(navigation);
    },
    icon: 'video',
  },
  {
    label: 'Inspreken',
    onItemPress: (item, index, navigation) => {
      checkPermissionsAudio(navigation);
    },
    icon: 'audio',
  },
  {
    label: 'Schrijven',
    onItemPress: (item, index, navigation) => {
      navigation.navigate('TextEditor');
    },
    icon: 'text',
  },
  {
    label: 'Tekenen',
    onItemPress: (item, index, navigation) => {
      navigation.navigate('Canvas');
    },
    icon: 'drawing',
  },
  {
    label: 'Foto Nemen',
    onItemPress: (item, index, navigation) => {
      checkPermissionsCamera(navigation);
    },
    icon: 'picture',
  },
  {
    label: 'Bestand Toevoegen',
    onItemPress: (item, index, navigation) => {
      pickFiles(navigation);
    },
    icon: 'file',
  },
];

export default FloatingActionItems;
