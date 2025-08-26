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
  ScrollView, 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../../redux/slices/categorySlice/categoriesSlice';
import { fetchFeaturedCategories } from '../../../../redux/slices/consumerSlice/featuredCategoriesSlice';
import { fetchFeaturedServices } from '../../../../redux/slices/consumerSlice/featuredServicesSlice';
import colors from '../../../../config/colors';
import SearchBar from '../../../components/SearchBar';
import AppBar from '../../../components/HeaderComponent/AppBar';
import AppText from '../../../components/AppText';
const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { categories, status } = useSelector(state => state.categories);
  const { categories: featuredCategories, status: topCatStatus } = useSelector(
    state => state.featuredCategories
  );
  const { services: featuredServices, status: topServStatus } = useSelector(
    state => state.featuredServices
  );

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchFeaturedCategories());
    dispatch(fetchFeaturedServices());
    dispatch(fetchFeaturedServices()).then((res) => {
      console.log("Featured Services API Result:", res.payload); // 👈 yahan se clear hoga
    }); 
    dispatch(fetchFeaturedCategories()).then((res) => {
      console.log("Featured Categories API Result:", res.payload); // 👈 yahan se clear hoga
    });  }, [dispatch]);

  // Render reusable card
  const renderCard = (item, isService = false) => {
    const displayName = isService ? item.name : (item.title || item.name); // ✅ Service ke liye name, category ke liye title fallback
    
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => {
          if (isService) {
            navigation.navigate('JobCreateScreen', {
              serviceId: item.id,
              serviceName: item.name,
            });
          } else {
            navigation.navigate('CategoryDetailsScreen', { category: item });
          }
        }}
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
          <AppText style={styles.categoryName}>{displayName}</AppText>
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 20 }} // 👈 allows full scroll
        showsVerticalScrollIndicator={false}
      >
        {/* AppBar */}
         <AppBar/>

        {/* Search */}
        <View style={styles.searchContainer}>
          <AppText style={styles.helpText}>I need help with</AppText>
          <SearchBar
            placeholder='Try "Mount TV" or "leaky tap"'
            onPress={() => navigation.navigate('SearchScreen')}
          />
        </View>

        {/* All Categories */}
        <View style={styles.categoryHeader}>
          <AppText style={styles.helpText}>Choose a category</AppText>
          {categories.length > 4 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('AllCategoriesScreen')}
            >
              <AppText style={styles.seeAllText}>See All</AppText>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.content}>
          {status === 'loading' ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <FlatList
              data={
                categories.length > 4 ? categories.slice(0, 4) : categories
              }
              horizontal
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => renderCard(item)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              style={{ maxHeight: 180 }}
            />
          )}
        </View>

        {/* Top Categories */}
      <View style={styles.categoryHeader}>
          <AppText style={styles.helpText}>Top Categories</AppText>
        </View>
        <View style={styles.content}>
          {topCatStatus === 'loading' ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <FlatList
              data={featuredCategories}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => renderCard(item)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              style={{ maxHeight: 180 }}
            />
          )}
        </View> 

        {/* Top Services */}
       <View style={styles.categoryHeader}>
          <AppText style={styles.helpText}>Top Services</AppText>
        </View>
        <View style={styles.content}>
          {topServStatus === 'loading' ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <FlatList
              data={featuredServices}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => renderCard(item, true)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              style={{ maxHeight: 180 }}
            />
          )}
        </View> 
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

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
  categoryHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
     searchContainer: {
    padding: 16,
  },
});

export default HomeScreen;
