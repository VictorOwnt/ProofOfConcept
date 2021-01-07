import React from 'react';
import BackpackAudio from './BackpackAudio';
import BackpackImage from './BackpackImage';
import BackpackText from './BackpackText';
import BackpackVideo from './BackpackVideo';
import BackpackDrawing from './BackpackDrawing';

const BackpackItem = ({item}) => {
  const returnSwitch = (type) => {
    switch (item.type) {
      case 'text':
        return <BackpackText item={item} />;
      case 'image':
        return <BackpackImage item={item} />;
      case 'video':
        return <BackpackVideo item={item} />;
      case 'audio':
        return <BackpackAudio item={item} />;
      case 'drawing':
        return <BackpackDrawing item={item} />;
    }
  };

  return returnSwitch(item.type);
};

export default BackpackItem;
