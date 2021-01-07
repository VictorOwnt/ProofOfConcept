import {Dimensions, StyleSheet} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);

export default StyleSheet.create({
  view: {
    backgroundColor: '#CDF9EC',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPlayer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    color: '#0000FF',
  },
  textDuration: {
    color: '#0000FF',
    marginRight: 40,
  },
  button: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    marginTop: 20,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
    width: 200,
    height: 100,
    borderColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'row',
  },
  audioPlayer: {
    alignItems: 'center',
  },
  rowButton: {
    marginHorizontal: 25,
  },
  timerText: {
    color: '#0000FF',
    fontSize: 20,
  },
  timer: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: '#FFFFFF',
    width: 80,
  },
  slider: {
    width: 0.7 * screenWidth,
    marginRight: 10,
  },
  track: {
    height: 5,
    borderRadius: 1,
  },
  thumb: {
    width: 15,
    height: 15,
    borderRadius: 7,
    backgroundColor: '#0000FF',
  },
  sliderColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderAndIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
