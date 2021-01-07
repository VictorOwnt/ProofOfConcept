import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import TextSvg from '../../../assets/text.svg';
import styles from './styles';

const BackpackText = ({item}) => {
  const navigation = useNavigation();
  const onItemPress = (itemSelected) => {
    navigation.navigate('TextEditor', {item: itemSelected});
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => onItemPress(item)}>
        <TextSvg />
        <Text numberOfLines={1}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackpackText;
