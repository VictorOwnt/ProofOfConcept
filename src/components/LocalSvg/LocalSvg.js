import React from 'react';
import PlusSvg from '../../../assets/plus.svg';
import MultiplySvg from '../../../assets/multiply.svg';
import CreateVideoSvg from '../../../assets/createVideo.svg';
import CreateAudioSvg from '../../../assets/createAudio.svg';
import CreateTextSvg from '../../../assets/createText.svg';
import CreateDrawingSvg from '../../../assets/createDrawing.svg';
import CreatePictureSvg from '../../../assets/createPicture.svg';
import AddFileSvg from '../../../assets/addFile.svg';
import BoldSvg from '../../../assets/bold.svg';
import ItalicSvg from '../../../assets/italic.svg';
import UnderlineSvg from '../../../assets/underline.svg';
import PlaySvg from '../../../assets/play-outline.svg';
import RecordSvg from '../../../assets/record.svg';
import SplitSvg from '../../../assets/split.svg';
import StopRecordingSvg from '../../../assets/stop.svg';
import PauseRecordingSvg from '../../../assets/pause.svg';
import PlayAudioSvg from '../../../assets/play.svg';
import PauseAudioSvg from '../../../assets/pause.svg';
import SoundSvg from '../../../assets/geluid.svg';
import TrashSvg from '../../../assets/prullenbak.svg';
import SaveSvg from '../../../assets/opslaan.svg';
import BackSvg from '../../../assets/back.svg';
import EraserSvg from '../../../assets/eraser.svg';
import UndoSvg from '../../../assets/undo.svg';
import PencilSvg from '../../../assets/pencil.svg';
import TextDrawSvg from '../../../assets/textDraw.svg';
import RedoSvg from '../../../assets/redo.svg';
import PaintSvg from '../../../assets/paint.svg';
import PaintPickerSvg from '../../../assets/paintPicker.svg';
import SuperThickSvg from '../../../assets/superThick.svg';
import MediumThickSvg from '../../../assets/mediumThick.svg';
import NotThickSvg from '../../../assets/notThick.svg';

import styles from './styles';

const LocalSvg = ({path, state, color}) => {
  const returnSwitch = (type) => {
    switch (path) {
      case 'plus':
        return (
          <PlusSvg color={state ? styles.svg.tintColor : styles.svg.color} />
        );
      case 'multiply':
        return (
          <MultiplySvg
            color={state ? styles.svg.tintColor : styles.svg.color}
          />
        );
      case 'video':
        return <CreateVideoSvg />;
      case 'audio':
        return <CreateAudioSvg />;
      case 'text':
        return <CreateTextSvg />;
      case 'drawing':
        return <CreateDrawingSvg />;
      case 'picture':
        return <CreatePictureSvg />;
      case 'file':
        return <AddFileSvg />;
      case 'play':
        return <PlaySvg />;
      case 'bold':
        return (
          <BoldSvg
            color={
              state ? styles.textEditIcon.tintColor : styles.textEditIcon.color
            }
          />
        );
      case 'italic':
        return (
          <ItalicSvg
            color={
              state ? styles.textEditIcon.tintColor : styles.textEditIcon.color
            }
          />
        );
      case 'underline':
        return (
          <UnderlineSvg
            color={
              state ? styles.textEditIcon.tintColor : styles.textEditIcon.color
            }
          />
        );
      case 'record':
        return <RecordSvg />;
      case 'split':
        return <SplitSvg height={state ? 50 : 100} />;
      case 'stopRecording':
        return <StopRecordingSvg />;
      case 'pauseRecording':
        return <PauseRecordingSvg color={styles.pauseRecording.color} />;
      case 'playAudio':
        return <PlayAudioSvg />;
      case 'pauseAudio':
        return <PauseAudioSvg color={styles.pauseAudio.color} />;
      case 'sound':
        return <SoundSvg />;
      case 'remove':
        return <TrashSvg />;
      case 'save':
        return <SaveSvg />;
      case 'back':
        return <BackSvg />;
      case 'eraser':
        return <EraserSvg />;
      case 'undo':
        return <UndoSvg />;
      case 'pencil':
        return <PencilSvg color={color} />;
      case 'textDraw':
        return <TextDrawSvg />;
      case 'redo':
        return <RedoSvg />;
      case 'paint':
        return state ? <PaintSvg color={color} /> : <PaintPickerSvg />;
      case 'superThick':
        return <SuperThickSvg color={color} />;
      case 'mediumThick':
        return <MediumThickSvg color={color} />;
      case 'notThick':
        return <NotThickSvg color={color} />;
    }
  };

  return returnSwitch(path);
};

export default LocalSvg;
