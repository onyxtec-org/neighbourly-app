import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../../../config/colors";
import Text from './../AppText';
import Icon from "./../ImageComponent/IconComponent";


function AppButton({
  title,
  onPress,
  marginVertical,
  textStyle,
  btnStyles,
  IconName,
  iconColor = colors.white, // ✅ Default icon color is white
  ...otherProps
}) {
  return (
    <TouchableOpacity
      style={[styles.button, btnStyles]}
      onPress={onPress}
      {...otherProps}
    >
      <View style={styles.contentWrapper}>
        {IconName && (
          <Icon
          pressed={false} // 👈 Ensure the icon is clickable
            name={IconName}
            color={iconColor}
            isFocused={true}
          />
        )}
        <Text style={[styles.text, textStyle, !IconName && { marginLeft: 0 }]}>
          {title}
        </Text>
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
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10, // Space only when icon is present
  },
});

export default AppButton;
