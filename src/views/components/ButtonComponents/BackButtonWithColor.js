import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '../ImageComponent/IconComponent';
import colors from '../../../config/colors';
function BackButtonWithColor({ onPress,color='transparent',borderColor=colors.lightGray,style }) {
  return (
    <View style={[styles.backButtonContainer,style ]}>
      <TouchableOpacity onPress={onPress} style={[styles.backButton,{ backgroundColor: color,opacity:0.4,borderColor:borderColor,borderWidth:1 }]}>
        <Ionicons name="chevron-back" size={22} color={colors.black}  />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonContainer: {
   
   
  },
  backButton: {
    backgroundColor: colors.gray,
    padding: 8,
    borderRadius: 10,
  },
});

export default BackButtonWithColor;
