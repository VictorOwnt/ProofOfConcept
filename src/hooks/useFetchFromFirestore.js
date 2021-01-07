//import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import proofOfConceptApi from '../api/proofOfConceptApi';

export function useFetchFromFirestore(uid, navigation) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  //TODO wat ik ook probeer, gaat niet lukken met react native
  // de useIsFocused en de addListener zijn 2 officiele methoden van React Navigation, werken beiden niet.
  //const isFocused = useIsFocused();
  // enige manier is om het nu te doen met checken in firestore of het er in staat, duurt wel eeuwen nu.
  //OPGELOST MET TIMEOUT OP DE NAVIGATIE!

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await proofOfConceptApi.getFromFirestore(uid).then((docList) => {
        //if (isFocused) {
        setData(docList);
        setLoading(false);
        //}
      });
    });

    return unsubscribe;
  }, [/*isFocused,*/ navigation, uid]);
  return [data, loading];
}
