import React from 'react';
import {TouchableOpacity} from 'react-native';
import LocalSvg from '../LocalSvg/LocalSvg';
import styles from './styles';

const paths = [
  {path: 'notThick', width: 3},
  {path: 'mediumThick', width: 6},
  {path: 'superThick', width: 10},
];

const StrokeWidthButtons = ({changeStrokeWidth, strokeColor}) => {
  return paths.map((item, key) => {
    return (
      <TouchableOpacity
        key={key}
        style={styles.functionButton}
        onPress={() => changeStrokeWidth(item.width)}>
        <LocalSvg path={item.path} color={strokeColor} />
      </TouchableOpacity>
    );
  });
};

export default StrokeWidthButtons;
