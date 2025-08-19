import React from 'react';
import { View, StyleSheet ,Platform,Text} from 'react-native';

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
       <Text 
       style={[styles.statusText,  {color: color}]}
       numberOfLines={1}
      >{capitalizeFirst(text)}
      </Text>}
    </View>
  );
}

const styles = StyleSheet.create({
 statusBox: {
    width: isAndroid?70:80,
    height: isAndroid?20:30,
    borderRadius:isAndroid?10:20,
    alignItems:'center',
    justifyContent:'center',
  },
  statusText: {
    fontSize: 10,
    textAlign: 'center',

  },
});

export default StatusBox;