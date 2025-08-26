import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../config/colors';

function Seperator({color=colors.lightGray,height=1,circularEnds=false}) {
    return (
        <View style={{flexDirection:'row',alignItems:'center'}}>

        {circularEnds && <View style={[styles.dot, {backgroundColor: color}]} />}
        <View style={[styles.seprerator,{backgroundColor:color,height:height}]}/>
        {circularEnds && <View style={[styles.dot, {backgroundColor: color}]} />}
        </View>
    );
}

export default Seperator;
const styles = StyleSheet.create({
    seprerator:{
        width:'100%',
       
    },
     dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
})