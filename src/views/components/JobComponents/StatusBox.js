import React from 'react';
import { View, StyleSheet ,Platform} from 'react-native';
import AppText from '../AppText';
const isAndroid=Platform.OS==='android';

function StatusBox({color, text}) {
 const bigint = parseInt(color.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const capitalizeFirst = text =>
  text.charAt(0).toUpperCase() + text.slice(1);
  return (
    <View
      style={[
        styles.statusBox,
        {backgroundColor: `rgba(${r}, ${g}, ${b}, ${0.2})`},
      ]}>
      {text &&
       <AppText 
       style={[styles.statusText,  {color: color}]}
       numberOfLines={1}
      >{capitalizeFirst(text)}
      </AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
 statusBox: {
   
    borderRadius:30,
    alignItems:'center',
    justifyContent:'center',
    paddingVertical:8,
    paddingHorizontal:20
  },
  statusText: {
    fontSize: 10,
    textAlign: 'center',

  },
});

export default StatusBox;