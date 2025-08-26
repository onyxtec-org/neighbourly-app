import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../../config/colors';

const Icon = ({
  name,
  color = colors.primary,
  size = 24,
  style,
  onPress,
  pressed = false, // 👈 default false now
  ...props
}) => {
  if (pressed && onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <Ionicons name={name} size={size} color={color} {...props} />
      </TouchableOpacity>
    );
  }

  return <Ionicons name={name} size={size} color={color} style={style} {...props} />;
};


export default Icon;
