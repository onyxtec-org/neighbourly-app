import React from 'react';
import { View, StyleSheet, TouchableOpacity, } from 'react-native';
import Ionicons from './ImageComponent/IconComponent';
import colors from '../../config/colors';
import AppText from './AppText';

function SearchBar({ placeholder, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.searchContainer}
    >
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <AppText style={styles.searchInput}>{placeholder}</AppText>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',       // white background
    borderRadius: 16,              // rounded corners
    borderWidth: 1,                // thin border
    borderColor: colors.borderColor,           // light grey border
    height: 56,                    
    width: '100%',                 
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 12, color: 'gray' ,size:25 }, // grey icon
  searchInput: { flex: 1, fontSize: 18, color: 'gray' }, // grey text
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    // marginTop: 8,
  },
  searchContainer: {
    paddingHorizontal: 1,
  },
});
export default SearchBar;
