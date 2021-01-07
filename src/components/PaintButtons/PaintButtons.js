import React from 'react';
import {TouchableOpacity} from 'react-native';
import LocalSvg from '../LocalSvg/LocalSvg';
import styles from './styles';

const colors = [
  styles.gray.color,
  styles.yellow.color,
  styles.red.color,
  styles.blue.color,
  styles.green.color,
];

const PaintButtons = ({changeColor}) => {
  return colors.map((color, key) => {
    return (
      <TouchableOpacity
        key={key}
        style={styles.functionButton}
        onPress={() => changeColor(color)}>
        <LocalSvg path="paint" state={true} color={color} />
      </TouchableOpacity>
    );
  });
};

export default PaintButtons;
