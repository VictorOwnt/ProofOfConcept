import React, {useRef, useState} from 'react';
import Video from 'react-native-video';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import styles from './styles';
import {Platform, View} from 'react-native';

const VideoPlayer = ({video, base64}) => {
  const videoPlayer = useRef();
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);
  const [isLoading, setIsLoading] = useState(true);

  const onSeek = (seek) => {
    videoPlayer?.current.seek(seek);
  };

  const onSeeking = (currentVideoTime) => setCurrentTime(currentVideoTime);

  const onPaused = (newState) => {
    setPaused(!paused);
    setPlayerState(newState);
  };

  const onReplay = () => {
    videoPlayer?.current.seek(0);
    setCurrentTime(0);
    if (Platform.OS === 'android') {
      setPlayerState(PLAYER_STATES.PAUSED);
      setPaused(true);
    } else {
      setPlayerState(PLAYER_STATES.PLAYING);
      setPaused(false);
    }
  };

  const onProgress = (data) => {
    if (!isLoading) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    setDuration(Math.round(data.duration));
    setIsLoading(false);
  };

  const onLoadStart = () => {
    setIsLoading(true);
  };

  const onEnd = () => {
    setPlayerState(PLAYER_STATES.ENDED);
    setCurrentTime(duration);
  };

  const onError = (error) => {
    console.log(error);
  };

  //ERROR OP IOS, videos die op IOS gemaakt zijn kunnen niet afspelen op Android en omgekeerd
  return (
    <View>
      <Video
        onLoadStart={onLoadStart}
        //poster={'https://baconmockup.com/300/200/'}
        //posterResizeMode={'cover'}
        onLoad={onLoad}
        onProgress={onProgress}
        onEnd={onEnd}
        onError={onError}
        paused={paused}
        ref={(ref) => (videoPlayer.current = ref)}
        resizeMode={'cover'}
        source={{
          uri: /*base64 ? 'file:///' + video :*/ video /*, type: 'mp4'*/,
        }}
        style={styles.video}
      />
      <MediaControls
        isFullScreen={true}
        duration={duration}
        isLoading={isLoading}
        progress={currentTime}
        onPaused={onPaused}
        onReplay={onReplay}
        onSeek={onSeek}
        onSeeking={onSeeking}
        mainColor={'red'}
        playerState={playerState}
      />
    </View>
  );
};

export default VideoPlayer;
