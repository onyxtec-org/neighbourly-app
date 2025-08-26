import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Header({ title, bookmark = true, icon, onIconPress ,isIcon}) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>

      {/* Right Side Icons */}
      <View style={styles.rightIcons}>
        {bookmark && (
          <>
            <TouchableOpacity onPress={() => console.log('Bookmark pressed')}>
              <Ionicons
                name="bookmark-outline"
                size={22}
                color="#333"
                style={styles.iconSpacing}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Share pressed')}>
              <Ionicons
                name="share-social-outline"
                size={22}
                color="#333"
                style={styles.iconSpacing}
              />
            </TouchableOpacity>
          </>
        )}
        {isIcon && (
          <TouchableOpacity
            onPress={onIconPress}
          >
            <Ionicons name={icon} size={24} color="#000" />
          </TouchableOpacity>
        )}
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
    flex: 1, // Takes up remaining space
    textAlign: 'center', // Centers title text
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
