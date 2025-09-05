import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from './../ImageComponent/IconComponent';
import AppText from './../AppText';
import BackButton from './../ButtonComponents/BackButton';
import colors from '../../../config/colors';
import BackButtonWithColor from '../ButtonComponents/BackButtonWithColor';
function HeaderWithContainer({ title, icon, onIconPress, isIcon,onSharePress,backButtonBoxColor,borderColor }) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Back button */}
      <BackButtonWithColor
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('DashboardRouter');
          }
        }}
        color={backButtonBoxColor}
        borderColor={borderColor}
      />


      {/* Title */}
      { title && <AppText style={styles.headerTitle} numberOfLines={1}>
        {title}
      </AppText>}

      {/* Right Side Icons */}
      <View style={styles.rightIcons}>
       

        {/* Share (always visible if onSharePress exists) */}
        {onSharePress && (
          <TouchableOpacity onPress={onSharePress}>
            <Ionicons
              name="share-social-outline"
              size={22}
              color="#333"
              style={styles.iconSpacing}
            />
          </TouchableOpacity>
        )}

        {/* Custom Right Icon */}
        {isIcon && (
          <TouchableOpacity onPress={onIconPress}>
            <Ionicons name={icon} size={24} color="#000" />
          </TouchableOpacity>
        )}
        {!isIcon && <AppText> </AppText>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',

  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 12,
  },
});

export default HeaderWithContainer;
