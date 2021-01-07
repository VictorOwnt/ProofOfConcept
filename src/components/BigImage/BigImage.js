import React from 'react';
import FastImage from 'react-native-fast-image';
import styles from './styles';

//TODO IOS PATH
const BigImage = ({url, isDrawing}) => {
  return (
    <FastImage
      style={styles.image}
      source={{
        uri: isDrawing ? `data:image/gif;base64,${url}` : url,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

export default BigImage;
