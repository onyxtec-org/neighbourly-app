import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { fetchCategories } from '../../../../redux/slices/categorySlice/categoriesSlice';
import colors from '../../../../config/colors';

const AllCategoriesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { categories, status } = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('CategoryDetailsScreen', { category: item })
      }
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: item.image?.trim()
              ? item.image
              : 'https://via.placeholder.com/300x200.png?text=No+Image',
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <>
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Services</Text>
        <View style={styles.iconButton} /> {/* Spacer */}
      </View>
    <View style={styles.container}>
      <Text style={styles.heading}>All Categories</Text>
      {status === 'loading' ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  iconButton: {
    width: 32,
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
});

export default AllCategoriesScreen;
