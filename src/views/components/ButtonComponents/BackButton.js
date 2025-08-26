import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from './../ImageComponent/IconComponent';
import colors from '../../../config/colors';

const BackButton = ({
  onPress,
  iconSize = 22,
  iconColor = colors.primary,
  style,
}) => {
  return (
    <Icon
      name="arrow-back"
      size={iconSize}
      color={iconColor}
      style={[style, styles.container]}
      onPress={onPress}
    />
  );
};

export default BackButton;

const styles = StyleSheet.create({
  //   container: {
  //     width: 36,
  //     height: 36,
  //     borderRadius: 18,
  //     backgroundColor: '#f2f2f2',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     elevation: 2,
  //   },
});
