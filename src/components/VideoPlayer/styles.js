import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    resizeMode: 'cover',
    zIndex: 10,
    height: '100%',
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
