import React from 'react';
import FastImage from 'react-native-fast-image';
import styles from './styles';

const SmallImage = (url) => {
  return (
    <FastImage
      style={styles.image}
      source={{
        uri: url.url,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

export default SmallImage;
