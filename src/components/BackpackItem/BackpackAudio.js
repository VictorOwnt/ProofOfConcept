import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AudioSvg from '../../../assets/audio.svg';
import proofOfConceptApi from '../../api/proofOfConceptApi';
import styles from './styles';

const BackpackAudio = ({item}) => {
  const navigation = useNavigation();
  const [audio, setAudio] = useState();

  useEffect(() => {
    proofOfConceptApi.getAudioFromFirestorage(item.data).then((audioUrl) => {
      setAudio(audioUrl);
    });
  }, [item.data]);

  const onItemPress = (itemSelected) => {
    const audioFile = {
      id: itemSelected.id,
      title: itemSelected.title,
      type: itemSelected.type,
      audioUrl: audio,
    };
    navigation.navigate('Audio', {item: audioFile});
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => onItemPress(item)}>
        <AudioSvg />
        <Text numberOfLines={1}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackpackAudio;
