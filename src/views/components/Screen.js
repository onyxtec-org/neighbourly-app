import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../config/colors";

function Screen({
  children,
  style,
  statusBarColor = Platform.OS === "ios" ? colors.white : colors.primary,
  barStyle = Platform.OS === "ios" ? "dark-content" : "light-content",
}) {
  return (
    <>
      <SafeAreaView />
      <SafeAreaView style={styles.bottomSafeArea}>
        <StatusBar barStyle={barStyle} backgroundColor={statusBarColor} />
        <View style={[styles.view, style]}>{children}</View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: hp("2%"),
  },
  bottomSafeArea: {
    flex: 1,
  },
});

export default Screen;