import React from 'react';
import FastImage from 'react-native-fast-image';
import LocalSvg from '../LocalSvg/LocalSvg';
import styles from './styles';

const VideoImage = ({url /*, base64*/}) => {
  return (
    <FastImage
      style={styles.image}
      source={
        /*base64
          ? require('../../../assets/background.png')
          : */
        {
          uri: url,
        }
      }
      resizeMode={FastImage.resizeMode.contain}>
      <LocalSvg style={styles.svg} path={'play'} />
    </FastImage>
  );
};

export default VideoImage;
