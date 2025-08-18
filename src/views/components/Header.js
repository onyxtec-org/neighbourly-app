import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Header({ title,bookmark=true }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{title}</Text>

      {  bookmark?(<View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => console.log('Bookmark pressed')}>
            <Ionicons
              name="bookmark-outline"
              size={22}
              color="#333"
              style={styles.iconSpacing}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Share pressed')}>
            <Ionicons name="share-social-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>):<Text>   </Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
    header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    elevation: 2,
    shadowColor: '#000',
  },
  backButton: {
    width: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 60,
  },

  iconSpacing: {
    marginRight: 10,
  },
});

export default Header;
