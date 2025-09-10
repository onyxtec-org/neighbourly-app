import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import colors from "../../../config/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import AppText from "../AppText";
function SocialButton(props) {
  return (
    <TouchableOpacity
      style={[styles.button, props.style]}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <View style={styles.buttonContent}>
        {props.LogoIcon && props.LogoIcon()}
        <AppText style={[ styles.text,props.textStyle]}>
          {props.title}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: "4%",
    elevation: 2,
    shadowColor: colors.lightGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    
    backgroundColor: colors.white,
    marginBottom: hp("5%"),
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center", 
    alignItems: "center",
    paddingHorizontal: hp("0.5%"),
  },
  text: {
    paddingLeft: hp("2%"),
   
    textAlign: "center", 
    color: colors.darkGray,
  },
});

export default SocialButton;
