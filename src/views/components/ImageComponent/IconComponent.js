import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../../config/colors';

const Icon = ({
  name,
  color=colors.primary,
  size = 24,
  style,
  onPress,
  pressed = true, // 👈 New flag to control if it's clickable
  ...props
}) => {
  if (pressed) {
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <Ionicons name={name} size={size} color={color} {...props} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={style}>
      <Ionicons name={name} size={size} color={color} {...props} />
    </View>
  );
};

export default Icon;
