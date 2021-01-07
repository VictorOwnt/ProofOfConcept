import React, {useEffect, useState} from 'react';
import {SafeAreaView, ActivityIndicator, Platform} from 'react-native';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import TitleDialog from '../../components/TitleDialog/TitleDialog';
import RNFetchBlob from 'rn-fetch-blob';
import {RNFFmpeg} from 'react-native-ffmpeg';
import styles from './styles';

//Gebruik RNCamera voor in app camera,
export default function VideoScreen({route, navigation}) {
  const [video, setVideo] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const dirs = RNFetchBlob.fs.dirs;
  const savePath = `${dirs.CacheDir}/video.mp4`;
  const savePath2 = `${dirs.CacheDir}/videoConverted.mp4`;

  useEffect(() => {
    setVisible(route.params.visible);
    if (route.params.response.uri) {
      setVideo(route.params.response.uri);
    } else {
      //OP IOS WORDT FIRESTORE DOWNLOAD URL AFSPELEN NIET ONDERSTEUND, MOET DUS LOCAAL OPGESLAGEN & GECONVERTEERD WORDEN
      if (Platform.OS === 'ios') {
        RNFetchBlob.fetch('GET', route.params.response).then((res) => {
          RNFetchBlob.fs.writeFile(savePath, res.data, 'base64').then(() => {
            RNFFmpeg.executeAsync(
              `-y -i ${savePath} -c:v libx264 ${savePath2}`,
              async (completedExecution) => {
                if (completedExecution.returnCode === 0) {
                  setVideo(savePath2);
                } else {
                  alert(
                    'er ging iets mis bij het laden van deze video, probeer het opnieuw!',
                  );
                }
              },
            ).then(() => {
              RNFetchBlob.fs.unlink(savePath);
            });
          });
        });
      } else {
        setVideo(route.params.response);
      }
    }
    setLoading(false);
  }, [
    route.params.response.uri,
    route.params.response,
    route.params.visible,
    savePath,
    savePath2,
  ]);

  //Voor de visibilty af te handelen
  const onCancelPress = () => {
    setError('');
    setVisible(false);
    navigation.goBack();
  };

  //TODO add thumbnail & deleteknop
  return (
    <SafeAreaView style={styles.container}>
      {loading ? <ActivityIndicator /> : <VideoPlayer video={video} />}
      <TitleDialog
        visibility={visible}
        uid={route.params.uid}
        errorMsg={error}
        type={'video'}
        data={route.params.response}
        onCancelPress={onCancelPress}
      />
    </SafeAreaView>
  );
}
