import React from "react";
import { StyleSheet, TouchableOpacity ,View} from "react-native";
import colors from "../config/colors";
import Text from './AppText'
import Icon from "./IconComponent";
function AppButton({ title, onPress, marginVertical,textStyle,btnStyles,IconName, ...otherProps }) {

    
    return (
        <TouchableOpacity
            style={[styles.button, btnStyles]}
            onPress={onPress}
            {...otherProps}>
             <View style={{flexDirection:'row'}}>
             {IconName && <Icon name={IconName} color={colors.white} isFocused={true}/>}
            <Text style={[styles.text,textStyle ]}>{title}</Text>
                </View>   
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        width: "100%",
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft:10
    },
});

export default AppButton;