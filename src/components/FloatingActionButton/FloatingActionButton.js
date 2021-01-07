import React, {useState} from 'react';
import {Image} from 'react-native';
import {FloatingMenu} from 'react-native-floating-action-menu';
import FloatingActionItems from '../FloatingActionItems/FloatingActionItems';
import {useNavigation} from '@react-navigation/native';
import LocalSvg from '../LocalSvg/LocalSvg';
import styles from './styles';

const FloatingActionButton = (uid) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation();

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleItemPress = (item, index) => {
    setMenuOpen(false);
    item.onItemPress(item, index, navigation, uid);
  };

  const renderMenuIcon = (menuState) => {
    const {menuButtonDown} = menuState;

    return isMenuOpen ? (
      <LocalSvg path={'multiply'} state={menuButtonDown} />
    ) : (
      <LocalSvg path={'plus'} state={menuButtonDown} />
    );
  };

  const renderItemIcon = (item, index, menuState) => {
    const {itemsDown} = menuState;

    const isItemPressed = itemsDown[index];

    return <LocalSvg path={item.icon} state={isItemPressed} />;
  };

  return (
    <FloatingMenu
      isOpen={isMenuOpen}
      items={FloatingActionItems}
      primaryColor={styles.fab.color}
      renderItemIcon={renderItemIcon}
      renderMenuIcon={renderMenuIcon}
      onMenuToggle={handleMenuToggle}
      onItemPress={handleItemPress}
    />
  );
};

export default FloatingActionButton;
