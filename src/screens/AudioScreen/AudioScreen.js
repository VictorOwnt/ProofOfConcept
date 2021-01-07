import React, {useState, useEffect, useCallback} from 'react';
import {Platform, Text, View, SafeAreaView} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import Slider from 'react-native-slider';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LocalSvg from '../../components/LocalSvg/LocalSvg';
import styles from './styles';
import TitleDialog from '../../components/TitleDialog/TitleDialog';
import RNFetchBlob from 'rn-fetch-blob';
import proofOfConceptApi from '../../api/proofOfConceptApi';

const audioRecorderPlayer = new AudioRecorderPlayer();

//DURATION KOMT ER PAS BIJ ALS JE OP PLAY DRUKT, LUKT OP GEEN ENKELE ANDERE MANIER WANT MET REACT NATIVE KAN JE NIET
//VAN EEN BASE64 BESTAND HET BESTAND OMZETTEN NAAR AUDIO OM ZO DE DURATIE AF TE LEZEN, KAN ENKEL VIA DE AUDIOPLAYER.
export default function AudioScreen({route, navigation}) {
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [recordTime, setRecordTime] = useState('00:00');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [startedPlaying, setStartedPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState();
  const dirs = RNFetchBlob.fs.dirs;
  const recordPath = Platform.select({
    ios: 'audio.m4a',
    android: 'sdcard/audio.mp3',
  });
  const savePath = Platform.select({
    ios: `${dirs.CacheDir}/${recordPath}`,
    android: 'sdcard/audio.mp3',
  });

  //Voor callback, anders werkt het niet
  const [itemId, setItemId] = useState();
  const [title, setTitle] = useState();

  useEffect(() => {
    if (route.params.item) {
      setItemId(route.params.item.id);
      setTitle(route.params.item.title);
      setHasRecorded(true);
      RNFetchBlob.fetch('GET', route.params.item.audioUrl).then((res) => {
        RNFetchBlob.fs.writeFile(savePath, res.data, 'base64');
      });
    }
    navigation.addListener('beforeRemove', (e) => {
      if (!startedPlaying) {
        //Geen media aan het afspelen, kan gewoon terugkeren
        return;
      }

      e.preventDefault();

      onStopPlay(false).then(() => {
        navigation.dispatch(e.data.action);
      });
    });
  }, [navigation, onStopPlay, savePath, route.params.item, startedPlaying]);

  const onStartRecord = async () => {
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const result = await audioRecorderPlayer.startRecorder(
      recordPath,
      audioSet,
    );
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordTime(
        audioRecorderPlayer.mmssss(Math.floor(e.current_position)).slice(0, -3),
      );
      return;
    });
    console.log(result);
    setIsRecording(true);
  };

  const onPauseRecord = async () => {
    alert('Voorlopig nog niet ondersteund');
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    setHasRecorded(true);
    console.log(result);
  };

  const onStartPlay = async () => {
    const res = await audioRecorderPlayer.startPlayer(recordPath);
    console.log('PLAYING');
    audioRecorderPlayer.setVolume(1.0);
    audioRecorderPlayer.addPlayBackListener(async (e) => {
      if (e.current_position === e.duration) {
        audioRecorderPlayer
          .stopPlayer()
          .catch((err) =>
            console.log(
              'Dit is noodzakelijk, geeft anders deze error weer: ' + err,
            ),
          );
      }
      setCurrentPositionSec(
        Platform.OS === 'android'
          ? e.current_position
          : parseFloat(e.current_position, 10), //ANDERS FOUTMELDING OP IOS
      ); //CURRENTPOSITIONSEC uw bol die gaat verlopen
      setCurrentDurationSec(
        Platform.OS === 'android' ? e.duration : parseFloat(e.duration, 10), //ANDERS FOUTMELDING OP IOS
      ); //CurrentDurationSec is de maximale duur
      setPlayTime(
        audioRecorderPlayer.mmssss(Math.floor(e.current_position)).slice(0, -3), //Opwaartse counter voor playtime
      );
      setDuration(
        audioRecorderPlayer.mmssss(Math.floor(e.duration)).slice(0, -3), //Duur totaal om weer te geven
      );
      setStartedPlaying(true);
      return;
    });
  };

  const onPausePlay = async () => {
    const result = await audioRecorderPlayer.pausePlayer();
    console.log(result);
  };

  //Deze functie zit ook in een callback om het afspelen van geluid te stoppen als er op de back button geduwt wordt.
  //Gebruik ik als functie voor verwijderknop
  const onStopPlay = useCallback(
    async (online) => {
      const deleteFile = async (filePath) => {
        RNFetchBlob.fs.exists(filePath).then(async (res) => {
          if (res) {
            await RNFetchBlob.fs
              .unlink(recordPath)
              .then(() => console.log('File deleted succesfully local!'));
            if (online) {
              await proofOfConceptApi
                .removeAudioFromStorage(route.params.uid, title, itemId)
                .then((bool) => {
                  if (bool) {
                    console.log('File deleted succesfully online!');
                  }
                });
            }
          }
        });
      };
      const result = await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setDuration('00:00');
      setPlayTime('00:00');
      setCurrentDurationSec(0);
      setCurrentPositionSec(0);
      deleteFile(recordPath);
      setHasRecorded(false);
      console.log(result);
    },
    [recordPath, route.params.uid, title, itemId],
  );

  const onSavePress = () => {
    setVisible(true);
    RNFetchBlob.fs.readFile(savePath, 'base64').then((res) => {
      setData(res);
    });
    //deleteFile(path, true);
  };

  const onCancelPress = () => {
    setError('');
    setVisible(false);
  };

  const onSeek = (value) => {
    const seek =
      Platform.OS === 'android' ? Math.round(value) / 1000 : Math.round(value);
    audioRecorderPlayer.seekToPlayer(seek);
    setPlayTime(
      new Date(Platform.OS === 'android' ? seek * 1000 : seek)
        .toISOString()
        .substr(14, 5),
    );
  };

  return isRecording ? (
    <SafeAreaView style={styles.view}>
      <View style={styles.timer}>
        <Text style={styles.timerText}>{recordTime}</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.rowButton}
          onPress={() => onStopRecord()}>
          <LocalSvg path={'stopRecording'} />
        </TouchableOpacity>
        <LocalSvg path="split" />
        <TouchableOpacity
          style={styles.rowButton}
          onPress={() => onPauseRecord()}>
          <LocalSvg path={'pauseRecording'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  ) : hasRecorded ? (
    <SafeAreaView style={styles.view}>
      <View>
        <View style={styles.saveButton}>
          {route.params.item ? null : (
            <TouchableOpacity onPress={() => onSavePress()}>
              <LocalSvg path={'save'} width={32} heighth={33} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.viewPlayer}>
          <View style={styles.sliderColumn}>
            <LocalSvg path={'sound'} />
          </View>
          <View style={styles.sliderRow}>
            <Text style={styles.textPlayTime}>{playTime}</Text>
            <Text style={styles.textDuration}>{duration}</Text>
          </View>
          <View style={styles.audioPlayer}>
            <View style={styles.sliderAndIcon}>
              <Slider
                maximumValue={Math.max(
                  currentDurationSec,
                  1,
                  currentPositionSec + 1,
                )}
                style={styles.slider}
                onSlidingStart={onPausePlay}
                onSlidingComplete={onSeek}
                value={currentPositionSec}
                minimumTrackTintColor={'#95E8CD'}
                maximumTrackTintColor={'#6BBDA4'}
                thumbStyle={styles.thumb}
                trackStyle={styles.track}
              />
              <TouchableOpacity
                onPress={() =>
                  route.params.item ? onStopPlay(true) : onStopPlay(false)
                }>
                <LocalSvg path={'remove'} />
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.rowButton}
                onPress={() => onStartPlay()}>
                <LocalSvg path={'playAudio'} />
              </TouchableOpacity>
              <LocalSvg path="split" />
              <TouchableOpacity
                style={styles.rowButton}
                onPress={() => onPausePlay()}>
                <LocalSvg path={'pauseAudio'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TitleDialog
          visibility={visible}
          uid={route.params.uid}
          errorMsg={error}
          type={'audio'}
          data={data}
          onCancelPress={onCancelPress}
        />
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.view}>
      <Text style={styles.text}>
        Druk op de rode bol om een geluidsfragment op te nemen!
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => onStartRecord()}>
        <LocalSvg path={'record'} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
