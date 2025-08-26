import React from 'react';
import { View, StyleSheet,TouchableOpacity,Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../config/colors';
function SearchBar({ placeholder, onPress }) {
  return (
<TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <View style={styles.searchBar}>
      <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
      <Text style={styles.searchInput}>{placeholder}</Text>
    </View>
  </TouchableOpacity>  );
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
});

export default SearchBar;