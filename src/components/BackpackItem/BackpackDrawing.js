import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import proofOfConceptApi from '../../api/proofOfConceptApi';
import DrawingSvg from '../../../assets/drawing.svg';
import RNFetchBlob from 'rn-fetch-blob';
import styles from './styles';

const BackpackDrawing = ({item}) => {
  const navigation = useNavigation();
  const [drawing, setDrawing] = useState();

  useEffect(() => {
    proofOfConceptApi
      .getDrawingFromFirestorage(item.data)
      .then((drawingUrl) => {
        setDrawing(drawingUrl);
      });
  }, [item.data]);

  const onItemPress = (itemSelected) => {
    RNFetchBlob.fetch('GET', drawing).then((res) => {
      const response = {data: res.data};
      navigation.navigate('Camera', {response: response, isDrawing: true});
    });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => onItemPress(item)}>
        <DrawingSvg />
        <Text numberOfLines={1}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackpackDrawing;
