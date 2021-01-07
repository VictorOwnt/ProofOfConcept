import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import SmallImage from '../SmallImage/SmallImage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import proofOfConceptApi from '../../api/proofOfConceptApi';
import styles from './styles';
import RNFetchBlob from 'rn-fetch-blob';

const BackpackImage = ({item}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');

  useEffect(() => {
    proofOfConceptApi.getPictureFromFirestorage(item.data).then((imageUrl) => {
      item.base64
        ? RNFetchBlob.fetch('GET', imageUrl).then((res) => {
            setUrl(`data:image/jpeg;base64,${res.data}`);
          })
        : setUrl(imageUrl);
      setLoading(false);
    });
  }, [item.base64, item.data]);

  const onItemPress = (itemSelected) => {
    navigation.navigate('Camera', {response: url});
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => onItemPress(item)}>
        {loading ? <ActivityIndicator /> : <SmallImage url={url} />}
        <Text numberOfLines={1}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackpackImage;
