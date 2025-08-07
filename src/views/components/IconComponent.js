import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Icon = ({
  name,
  color,
  size = 24,
  style,
  onPress,
  pressed = false, // 👈 New flag to control if it's clickable
  ...props
}) => {
  if (pressed) {
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <MaterialIcons name={name} size={size} color={color} {...props} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={style}>
      <MaterialIcons name={name} size={size} color={color} {...props} />
    </View>
  );
};

export default Icon;
