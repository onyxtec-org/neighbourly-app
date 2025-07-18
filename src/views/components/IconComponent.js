
import React from "react";
import { TouchableOpacity } from "react-native";
import  MaterialIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import  FontAwesome  from 'react-native-vector-icons/FontAwesome';



const Icon = ({ name,color, size=24, focused, type='material',onPress,...props }) => {
    return   <TouchableOpacity onPress={onPress}>

    { type === 'fontAwesome' ? (
      <FontAwesome name={name} size={size} color={color} {...props} />
    ) : (
      <MaterialIcons name={name} size={size} color={color} {...props} />
    )}
    </TouchableOpacity>
}
export default Icon;
