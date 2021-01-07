import React, {useEffect, useState} from 'react';
import proofOfConceptApi from '../../api/proofOfConceptApi';
import Dialog from 'react-native-dialog';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';

//handleSave => meegeven als functie
const TitleDialog = ({
  visibility,
  errorMsg,
  item,
  type,
  uid,
  data,
  onCancelPress,
}) => {
  const [visible, setVisible] = useState(visibility); //visibility van de titledialog
  const isEdit = item ? true : false; // checken of het edit of nieuw is
  const [title, setTitle] = useState(isEdit ? item.title : ''); //titel van de tekst
  const [error, setError] = useState(errorMsg); //error voor als er geen titel ingevoerd werd
  const navigation = useNavigation();

  useEffect(() => {
    setVisible(visibility);
    setError(errorMsg);
  }, [visibility, errorMsg]);

  //Title onchange listener
  const onChangeText = (text: string) => {
    setTitle(text);
  };

  //Wat er gebeurd bij de save (na popup alert)
  const handleSave = () => {
    if (title === '' || title === null) {
      setError('Er moet een titel ingegeven worden!');
    } else {
      if (isEdit) {
        const doc = {title: title, data: data, type: type};
        proofOfConceptApi.updateInFirestore(uid, doc, item.id).then((bool) => {
          if (bool) {
            //ZONDER TIMEOUT WORDT NIET CORRECT GELADEN, GOD KNOWS WHY
            setTimeout(() => {
              navigation.goBack();
            }, 1000);
          }
        });
      } else {
        setVisible(false);
        const doc = {title: title, data: data, type: type};
        switch (type) {
          case 'text':
            proofOfConceptApi.saveInFirestore(uid, doc).then((bool) => {
              if (bool) {
                //ZONDER TIMEOUT WORDT NIET CORRECT GELADEN, GOD KNOWS WHY
                setTimeout(() => {
                  navigation.goBack();
                }, 1000);
              }
            });
            break;
          case 'image':
            data.fileName = title;
            proofOfConceptApi
              .savePictureInFirestorage(uid, data)
              .then((bool) => {
                if (bool) {
                  //ZONDER TIMEOUT WORDT NIET CORRECT GELADEN, GOD KNOWS WHY
                  setTimeout(() => {
                    navigation.goBack();
                  }, 1000);
                }
              });
            break;
          case 'video':
            data.fileName = title;
            proofOfConceptApi.saveVideoInFirestorage(uid, data).then((bool) => {
              if (bool) {
                //ZONDER TIMEOUT WORDT NIET CORRECT GELADEN, GOD KNOWS WHY
                setTimeout(() => {
                  navigation.goBack();
                }, 1000);
              }
            });
            break;
          case 'audio':
            proofOfConceptApi.saveAudioInFireStorage(uid, doc).then((bool) => {
              if (bool) {
                //ZONDER TIMEOUT WORDT NIET CORRECT GELADEN, GOD KNOWS WHY
                setTimeout(() => {
                  navigation.goBack();
                }, 1000);
              }
            });
            break;
          case 'drawing':
            proofOfConceptApi
              .saveDrawingInFirestorage(uid, doc)
              .then((bool) => {
                if (bool) {
                  //ZONDER TIMEOUT WORDT NIET CORRECT GELADEN, GOD KNOWS WHY
                  setTimeout(() => {
                    navigation.goBack();
                  }, 1000);
                }
              });
        }
      }
    }
  };

  return (
    <Dialog.Container visible={visible}>
      <Dialog.Title>Vul een titel in</Dialog.Title>
      <Dialog.Input
        label="Title"
        style={styles.input}
        onChangeText={onChangeText}
        value={title}
      />
      <Dialog.Description style={styles.error}>{error}</Dialog.Description>
      <Dialog.Button label="Annuleren" onPress={onCancelPress} />
      <Dialog.Button
        label={isEdit ? 'Updaten' : 'Opslaan'}
        onPress={handleSave}
      />
    </Dialog.Container>
  );
};

export default TitleDialog;
