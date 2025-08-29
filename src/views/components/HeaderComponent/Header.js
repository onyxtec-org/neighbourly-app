import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from './../ImageComponent/IconComponent';
import AppText from './../AppText';
import BackButton from './../ButtonComponents/BackButton';
import colors from '../../../config/colors';

function Header({ title, bookmark = true, icon, onIconPress, isIcon, onSharePress }) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Back button */}
      <BackButton
        style={styles.backButton}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('DashboardRouter');
          }
        }}
        iconColor={colors.black}
      />

      {/* Title */}
      <AppText style={styles.headerTitle} numberOfLines={1}>
        {title}
      </AppText>

      {/* Right Side Icons */}
      <View style={styles.rightIcons}>
        {/* Bookmark */}
        {bookmark && (
          <TouchableOpacity onPress={() => console.log('Bookmark pressed')}>
            <Ionicons
              name="bookmark-outline"
              size={22}
              color="#333"
              style={styles.iconSpacing}
            />
          </TouchableOpacity>
        )}

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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    elevation: 2,
    shadowColor: '#000',
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

export default Header;






