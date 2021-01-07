import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import LocalSvg from '../../components/LocalSvg/LocalSvg';
import PaintButtons from '../../components/PaintButtons/PaintButtons';
import Collapsible from 'react-native-collapsible';
import {SliderHuePicker} from 'react-native-slider-color-picker';
import styles from './styles';
import tinycolor from 'tinycolor2';
import StrokeWidthButtons from '../../components/StrokeWidthButtons/StrokeWidthButtons';
import TitleDialog from '../../components/TitleDialog/TitleDialog';
import RNFetchBlob from 'rn-fetch-blob';

export default function CanvasScreen({route, navigation}) {
  const canvas = useRef();
  const sliderColorPicker = useRef();
  const [sliderWidth, setSliderWidth] = useState(
    Dimensions.get('window').width,
  );
  const [strokeColor, setStrokeColor] = useState(styles.gray.color);
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [eraser, setEraser] = useState(false);
  const [oldColor, setOldColor] = useState(styles.gray.color);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState();
  /*
  const [textArray, setTextArray] = useState([]);
  const [textInput, setTextInput] = useState(false);*/
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [colorPickerCollapsed, setColorPickerCollapsed] = useState(true);
  const [strokeWidthCollapsed, setStrokeWidthCollapsed] = useState(true);
  const dirs = RNFetchBlob.fs.dirs;
  const tmpDir = dirs.DocumentDir.slice(0, dirs.DocumentDir.length - 9) + 'tmp';
  const savePath = Platform.select({
    ios: `${tmpDir}/drawing.png`,
    android: 'sdcard/Pictures/drawing.png',
  });

  const changeColor = (color, resType) => {
    if (resType === 'end') {
      setStrokeColor(tinycolor(color).toHexString());
      setColorPickerCollapsed(true);
      setIsCollapsed(true);
    }
  };

  const paintChange = (color) => {
    setEraser(false);
    setStrokeColor(color);
    setIsCollapsed(!isCollapsed);
  };

  const strokeWidthChange = (width) => {
    setStrokeWidth(width);
    setStrokeWidthCollapsed(!strokeWidthCollapsed);
  };

  const onCancelPress = () => {
    setError('');
    setVisible(false);
  };

  useEffect(() => {
    let isMounted = true;
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (isMounted) {
        setSliderWidth(Dimensions.get('window').width);
        setColorPickerCollapsed(true);
      }
    });
    return () => {
      isMounted = false;
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.width}>
        <View style={styles.column}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.functionButton}
              onPress={() => {
                navigation.goBack();
              }}>
              <LocalSvg path="back" />
            </TouchableOpacity>
            <View style={styles.undoRedoButtons}>
              <TouchableOpacity
                style={styles.functionButton}
                onPress={() => {
                  canvas.current.undo();
                }}>
                <LocalSvg path="undo" />
              </TouchableOpacity>
              <LocalSvg path={'split'} state={true} />
              <TouchableOpacity
                style={styles.functionButton}
                onPress={() => {
                  /*DE PACKAGE HEB IK HIER ZELF AANGEPAST, DEZE FUNCTIONALITEIT ZIT ER ANDERS NIET IN
                  IN @terrylinla/src/SketchCanvas.js
                  state = {
                    text: null,
                    redoPaths: []
                  }

                  undo() {
                    let lastId = -1;
                    this._paths.forEach(d => lastId = d.drawer === this.props.user ? d.path.id : lastId)
                    this.state.redoPaths.push(this._paths.filter(p => p.path.id === lastId)[0])
                    if (lastId >= 0) this.deletePath(lastId)
                    return lastId
                  }

                  redo() {
                    if (this.state.redoPaths.length >= 1) {
                      this.addPath(this.state.redoPaths[this.state.redoPaths.length - 1]);
                      this.state.redoPaths.pop();
                    }
                  }

                  in de onResponderGrant in de componentWillMount onderaan toevoegen:
                  this.setState({
                    redoPaths: []
                  })

                  */
                  canvas.current.redo();
                }}>
                <LocalSvg path="redo" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.functionButton}
              onPress={() => {
                canvas.current.save(
                  'png',
                  true,
                  '',
                  'drawing',
                  true,
                  false,
                  false,
                );
                //opslaan verloopt niet asynchroon -_-
                setTimeout(() => {
                  RNFetchBlob.fs
                    .readFile(savePath, 'base64')
                    .then((drawing) => {
                      setData(drawing);
                    });
                  setVisible(true);
                }, 1000);
              }}>
              <LocalSvg path="save" />
            </TouchableOpacity>
          </View>
          <SketchCanvas
            //text={textArray}
            ref={(ref) => (canvas.current = ref)}
            style={styles.canvas}
            /*onStrokeStart={(x, y) => {
              if (textInput) {
                const data = {
                  text: 'TEXT',
                  font: '',
                  fontSize: 20,
                  fontColor: 'red',
                  overlay: 'TextOnSketch',
                  anchor: {x: 0, y: 0},
                  position: {x: x, y: y},
                  coordinate: 'Absolute',
                  alignment: 'Center',
                  lineHeightMultiple: 1.2,
                };
                setTextArray((prevTextArray) => [...prevTextArray, data]);
              }
            }}
            onStrokeEnd={(data) => {
              if (textInput) {
                canvas.current.deletePath(data.path.id);
              }
            }}*/
            /* LAAD ZE GEWOON IN ALS AFBEELDING, NIET MEER AANPASBAAR..
            localSourceImage={{
              filename: 'sdcard/Pictures/drawing.png',
              //directory: SketchCanvas.MAIN_BUNDLE,
              mode: 'AspectFit',
            }}*/
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
          />
          <TitleDialog
            visibility={visible}
            uid={route.params.uid}
            errorMsg={error}
            type={'drawing'}
            data={data}
            onCancelPress={onCancelPress}
          />
          <View style={styles.row}>
            <View style={styles.column}>
              <Collapsible
                style={styles.collapsed}
                collapsed={strokeWidthCollapsed}>
                <View style={styles.rowStrokeWidth}>
                  <StrokeWidthButtons
                    changeStrokeWidth={strokeWidthChange}
                    strokeColor={eraser ? styles.gray.color : strokeColor}
                  />
                </View>
              </Collapsible>
              <Collapsible
                style={styles.collapsed}
                collapsed={colorPickerCollapsed}>
                <SliderHuePicker
                  style={styles.collapsed2}
                  ref={(view) => {
                    sliderColorPicker.current = view;
                  }}
                  trackStyle={[
                    {
                      height: 12,
                      width: sliderWidth - 48,
                    },
                  ]}
                  thumbStyle={styles.thumb}
                  useNativeDriver={true}
                  onColorChange={changeColor}
                />
              </Collapsible>
              <Collapsible style={styles.collapsed} collapsed={isCollapsed}>
                <View style={styles.row}>
                  <PaintButtons changeColor={paintChange} />
                  <TouchableOpacity
                    style={styles.functionButton}
                    onPress={() => {
                      setColorPickerCollapsed(!colorPickerCollapsed);
                    }}>
                    <LocalSvg path="paint" />
                  </TouchableOpacity>
                </View>
              </Collapsible>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.functionButton}
                  onPress={() => {
                    setIsCollapsed(!isCollapsed);
                    setStrokeWidthCollapsed(true);
                  }}>
                  <LocalSvg
                    path="paint"
                    state={true}
                    color={eraser ? oldColor : strokeColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.functionButton}
                  onPress={() => {
                    setStrokeWidthCollapsed(!strokeWidthCollapsed);
                    setIsCollapsed(true);
                    setColorPickerCollapsed(true);
                  }}>
                  <LocalSvg
                    path={eraser ? 'eraser' : 'pencil'}
                    color={strokeColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.functionButton}
                  onPress={() => {
                    alert('nog niet ondersteund, zelf te implementeren');
                    //setTextInput(!textInput);
                  }}>
                  <LocalSvg path="textDraw" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.functionButton}
                  onPress={() => {
                    if (!eraser) {
                      setOldColor(strokeColor);
                      setStrokeColor(styles.invisible.color);
                      setEraser(true);
                    } else {
                      setStrokeColor(oldColor);
                      setEraser(false);
                    }
                  }}>
                  <LocalSvg path="eraser" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
