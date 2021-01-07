import React from 'react';
import {SafeAreaView, ActivityIndicator, View, FlatList} from 'react-native';
import FloatingActionButton from '../../components/FloatingActionButton/FloatingActionButton';
import BackpackItem from '../../components/BackpackItem/BackpackItem';
import {useFetchFromFirestore} from '../../hooks/useFetchFromFirestore';
import styles from './styles';

export default function BackpackScreen({route, navigation}) {
  const [data, loading] = useFetchFromFirestore(route.params.uid, navigation);

  //SVG ICONEN WERKEN PERFECT, MAAR VOOR DE BACKGROUND IS DIT NIET MOGELIJK
  //Als er nu gebruik gemaakt wordt van de svg, dan schaalt deze mee, maar de verhouding past totaal niet omdat
  //die voor de tablet in horizontale modus is gemaakt. ==> SVG OPNIEUW MAKEN, ANDERE DIMENSIES
  //Om gebruik te kunnen maken van het BackgroundImage component in React Native moet de png gebruikt worden.
  //Dit werkt ook niet, omdat de png bestanden te groot zijn, de BackgroundImageComponent geeft dan gewoon niets weer.
  //De backpack png zal dus moeten gecompresseerd worden alvorens dit zal werken
  return loading ? (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <View>
        <FlatList
          data={Object.values(data)}
          renderItem={(item) => BackpackItem(item)}
          keyExtractor={(item) => item.id}
          numColumns={3}
        />
      </View>
      <FloatingActionButton uid={route.params.uid} />
    </SafeAreaView>
  );
}
