import React from 'react';
import { View, StyleSheet, TouchableOpacity, } from 'react-native';
import Ionicons from './ImageComponent/IconComponent';
import colors from '../../config/colors';
import AppText from './AppText';

function SearchBar({ placeholder, onPress, title }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.searchContainer}
    >
      <AppText style={styles.helpText}>{title}</AppText>

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
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: { marginRight: 8, color: colors.primary },
  searchInput: { flex: 1, fontSize: 16, color: 'gray' },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  helpText: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});

export default SearchBar;
