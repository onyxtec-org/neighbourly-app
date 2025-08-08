import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../../redux/slices/categoriesSlice';
import colors from '../../../../config/colors';

const ProviderHomeScreen = ({ navigation }) => {
  const { myServices } = useSelector(state => state.services);

  useEffect(() => {
    if (myServices.length === 0) {
      navigation.navigate('ServicesSelection');
    }
  }, [myServices.length, navigation]);

  const dispatch = useDispatch();
  const { categories, status } = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate('CategoryDetailsScreen', { category: item })
      }
    >
      <View style={styles.cardImageWrapper}>
        <Image
          source={{
            uri: item.image?.trim()
              ? item.image
              : 'https://via.placeholder.com/300x200.png?text=No+Image',
          }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardLabel}>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* AppBar */}
        <View style={styles.appBar}>
          <TouchableOpacity style={styles.locationContainer}>
            <Ionicons
              name="location-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.locationText}>Your Location</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Category Header */}
        <View style={styles.categoryHeader}>
          <Text style={styles.helpText}>My services</Text>
          {categories.length > 4 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('AllCategoriesScreen')}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <View style={styles.content}>
          {status === 'loading' ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <FlatList
              data={categories.length > 4 ? categories.slice(0, 4) : categories}
              horizontal
              keyExtractor={item => item.id.toString()}
              renderItem={renderCategory}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              style={{ maxHeight: 180 }}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  appBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 8, fontSize: 16 },
  content: { paddingLeft: 8 },
  helpText: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  cardContainer: {
    width: 140,
    height: 160,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardImageWrapper: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.8,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardLabel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },

  seeAllText: {
    fontSize: 14,
    color: colors.primary,
  },
});

export default ProviderHomeScreen;
