import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import VideoImage from '../VideoImage/VideoImage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import proofOfConceptApi from '../../api/proofOfConceptApi';
import styles from './styles';
// import RNFetchBlob from 'rn-fetch-blob';

const BackpackVideo = ({item}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  //const path = `sdcard/${item.title}.mp4`;

  useEffect(() => {
    proofOfConceptApi.getVideoFromFirestorage(item.data).then((videoUrl) => {
      //DIT IS VOOR DE VIDEOS VIA DOCUMENTPICKER, GAAT SUPER TRAAG, OMZETTEN NAAR BASE64 OM DAN TERUG OM TE ZETTEN
      //NAAR AFSPEELBAAR FORMAAT EN TERUG LOCAAL OPSLAAN OP EEN ANDERE LOCATIE..
      /*item.base64
        ? RNFetchBlob.fetch('GET', videoUrl).then((res) => {
            RNFetchBlob.fs
              .writeStream(
                path,
                // encoding, should be one of `base64`, `utf8`, `ascii`
                'base64',
                // should data append to existing content ?
                false,
              )
              .then((ofstream) => ofstream.write(res.data))
              .then((ofstream) => setUrl(path))
              .catch(console.error);
          })
        : */
      setUrl(videoUrl);
      setLoading(false);
    });
  }, [item.base64, item.data /*, path*/]);

  const onItemPress = (itemSelected) => {
    navigation.navigate('Video', {response: url /*, base64: item.base64*/});
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => onItemPress(item)}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <VideoImage url={url} /*base64={item.base64} */ />
        )}
        <Text numberOfLines={1}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackpackVideo;
