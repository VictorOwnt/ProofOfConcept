import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import VideoImage from '../VideoImage/VideoImage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import proofOfConceptApi from '../../api/proofOfConceptApi';
import styles from './styles';

const BackpackVideo = ({item}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');

  useEffect(() => {
    proofOfConceptApi.getVideoFromFirestorage(item.data).then((videoUrl) => {
      setUrl(videoUrl);
      setLoading(false);
    });
  }, [item.base64, item.data]);

  const onItemPress = (itemSelected) => {
    navigation.navigate('Video', {response: url});
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => onItemPress(item)}>
        {loading ? <ActivityIndicator /> : <VideoImage url={url} />}
        <Text numberOfLines={1}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackpackVideo;
