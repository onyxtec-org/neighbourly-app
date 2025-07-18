import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Icon = ({
  name,
  color,
  size = 24,
  style,
  focused,
  onPress,
  ...props
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialIcons name={name} size={size} color={color} {...props} />
    </TouchableOpacity>
  );
};
export default Icon;
