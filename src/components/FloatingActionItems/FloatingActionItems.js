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

const getFilePath = (res, navigation, destination) => {
  let response = {};
  let type = '';
  switch (destination) {
    case 'Camera':
      type = 'image';
      break;
    case 'Video':
      type = 'video';
      break;
    case 'Audio':
      type = 'audio';
  }
  RNFetchBlob.fs.stat(res.uri).then((file) => {
    response = {
      fileName: file.filename,
      fileSize: file.size,
      type: type,
      uri: 'file://' + file.path,
    };
    navigation.navigate(destination, {
      response: response,
      visible: true,
    });
  });
};

const pickFiles = async (navigation) => {
  try {
    const res = await DocumentPicker.pick({
      type: [
        DocumentPicker.types.images,
        DocumentPicker.types.audio,
        DocumentPicker.types.video,
      ],
    });
    const type = res.type.split('/')[0];
    switch (type) {
      case 'image':
        getFilePath(res, navigation, 'Camera');
        break;
      case 'video':
        getFilePath(res, navigation, 'Video');
        break;
      case 'audio':
        getFilePath(res, navigation, 'Audio');
        break;
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
