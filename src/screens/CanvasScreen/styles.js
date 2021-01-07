import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CDF9EC',
  },
  width: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  undoRedoButtons: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2.5,
    marginVertical: 8,
  },
  functionButton: {
    marginHorizontal: 5,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  collapsed: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderRadius: 5,
  },
  collapsed2: {
    marginHorizontal: 20,
  },
  rowStrokeWidth: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  thumb: {
    width: 20,
    height: 20,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.35,
  },
  gray: {
    color: '#5A5A5A',
  },
  invisible: {
    color: '#00000000',
  },
});
