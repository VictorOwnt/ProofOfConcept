import React, {useRef, useState} from 'react';
import {SafeAreaView, ActivityIndicator, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import LocalSvg from '../../components/LocalSvg/LocalSvg';
import styles from './styles';
import TitleDialog from '../../components/TitleDialog/TitleDialog';

export default function TextEditor({route, navigation}) {
  const richText = useRef(); //reference to the RichEditor component
  const [visible, setVisible] = useState(false); //visibility van de titledialog
  const [error, setError] = useState(''); //error voor als er geen titel ingevoerd werd
  const isEdit = route.params.item ? true : false; // checken of het edit of nieuw is
  const [article, setArticle] = useState(''); //tekst die geschreven wordt
  const [loading, setLoading] = useState(true);

  //Wordt aangeroepen na initalisatie richtexteditor, is nodig voor toolbar boven editor te krijgen
  const editorInitializedCallback = () => {
    setLoading(false);
  };

  //Custom functie voor op de toolbar
  const underline = () => {
    richText.current?.underline();
  };

  //Wat er gebeurd bij het op de opslaan knop druken
  const onSavePress = (text) => {
    setVisible(true);
  };

  //Voor de visibilty af te handelen
  const onCancelPress = () => {
    setError('');
    setVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <RichToolbar
          style={[styles.richBar]}
          editor={richText}
          iconSize={40}
          selectedIconTint="#16F48A"
          actions={[actions.setBold, actions.setItalic, 'underline']}
          iconMap={{
            [actions.setBold]: ({selected}) => (
              <LocalSvg path="bold" state={selected} />
            ),
            [actions.setItalic]: ({selected}) => (
              <LocalSvg path="italic" state={selected} />
            ),
            underline: ({selected}) => (
              <LocalSvg path="underline" state={selected} />
            ),
          }}
          undeline={underline}
        />
      )}
      <RichEditor
        ref={richText}
        initialContentHTML={isEdit ? route.params.item.data : ''}
        style={styles.rich}
        placeholder={'Begin hier te schrijven'}
        onChange={(text) => setArticle(text)}
        editorInitializedCallback={editorInitializedCallback}
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onSavePress(article)}>
            <Text style={styles.buttonTitle}>
              {isEdit ? 'Updaten' : 'Opslaan'}
            </Text>
          </TouchableOpacity>
          <TitleDialog
            visibility={visible}
            errorMsg={error}
            item={route.params.item}
            type={'text'}
            uid={route.params.uid}
            data={article}
            onCancelPress={onCancelPress}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
