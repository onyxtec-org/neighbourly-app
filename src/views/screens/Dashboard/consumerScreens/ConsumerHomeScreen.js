// export default HomeScreen;
import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,   // 👈 import SafeAreaView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../../redux/slices/categorySlice/categoriesSlice';
import DashboardGrid from '../../../../views/components/DashboardGridComponent';
import { fetchFeaturedCategories } from '../../../../redux/slices/consumerSlice/featuredCategoriesSlice';
import { fetchFeaturedServices } from '../../../../redux/slices/consumerSlice/featuredServicesSlice';
import CategoryContainer from '../../../components/CategoryContainerComponent';
import colors from '../../../../config/colors';
import SearchBar from '../../../components/SearchBar';
import config from '../../../../config';
import AppBar from '../../../components/HeaderComponent/AppBar';
import AppText from '../../../components/AppText';
import Image from '../../../components/ImageComponent/ImageComponent';
import { selectJobsByTab } from '../../../../redux/selectors/jobSelector';
import Icon from '../../../components/ImageComponent/IconComponent';
import ServicesListingCard from '../../../components/services/ServicesListingCard';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { categories, status } = useSelector(state => state.categories);
  const { categories: featuredCategories, status: topCatStatus } = useSelector(
    state => state.featuredCategories,
  );
  const { services: featuredServices, status: topServStatus } = useSelector(
    state => state.featuredServices,
  );
  const { user: profileUser } = useSelector(state => state.profile);
const userRole = profileUser?.role;

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchFeaturedCategories());
    dispatch(fetchFeaturedServices());
  }, [dispatch]);

  const jobsByStatus = {
    pending: useSelector(selectJobsByTab('pending', userRole)),
    my_jobs: useSelector(selectJobsByTab('my_jobs', userRole)),
    in_progress: useSelector(selectJobsByTab('in_progress', userRole)),
    completed: useSelector(selectJobsByTab('completed', userRole)),
  };
  const renderCategoryCard = (item) => {
    console.log(`image ${config.categoriesImageURL}${item.image}`);
    return (
      <CategoryContainer
        title={item.name}
        image={ `${config.categoriesImageURL}${item.image}` }
        onPress={() => navigation.navigate('CategoryDetail', { category: item })}
      />
    );
  };
  // const renderCard = (item, isService = false) => {
  //   const displayName = isService ? item.name : item.title || item.name;

  //   return (
  //     <TouchableOpacity
  //       style={styles.cardContainer}
  //       onPress={() => {
  //         if (isService) {
  //           navigation.navigate('JobCreateScreen', {
  //             serviceId: item.id,
  //             serviceName: item.name,
  //           });
  //         } else {
  //           navigation.navigate('CategoryDetailsScreen', { category: item });
  //         }
  //       }}
  //     >
  //       <View style={styles.cardImageWrapper}>
  //         {item.image ? (
  //           <Image
  //             source={{ uri: item.image }}
  //             style={styles.cardImage}
  //             resizeMode="cover"
  //           />
  //         ) : (
  //           <Icon
  //             name="construct-outline"
  //             size={80}
  //             color={colors.primary}
  //             style={{ alignSelf: 'center', marginTop: 10 }}
  //           />
  //         )}
  //       </View>
  //       <View style={styles.cardLabel}>
  //         <AppText style={styles.categoryName}>{displayName}</AppText>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <SafeAreaView style={styles.safeArea}>  
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* AppBar */}
          <AppBar />

          {/* Search */}
          <View style={styles.searchContainer}>
            <SearchBar
              placeholder="Search"
              onPress={() => navigation.navigate('SearchScreen')}
            />
          </View>

          <DashboardGrid
            items={[
              [
                { title: `Open → ${jobsByStatus.pending?.count || 0}`, backgroundColor: colors.purpleColor },
                { title: `To Start → ${jobsByStatus.my_jobs?.count || 0}`, backgroundColor: colors.pinkColor },
              ],
              [
                { title: `In Progress → ${jobsByStatus.in_progress?.count || 0}`, backgroundColor: colors.LightBlueColor },
                { title: `Completed → ${jobsByStatus.completed?.count || 0}`, backgroundColor: colors.lightgreenishColor },
              ],
            ]}
          />

          {/* All Categories */}
          {/* <View style={styles.categoryHeader}>
            <AppText style={styles.helpText}>Choose a category</AppText>
            {categories.length > 4 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('AllCategoriesScreen')}
              >
                <AppText style={styles.seeAllText}>See All</AppText>
              </TouchableOpacity>
            )}
          </View> */}

          {/* <View style={styles.content}>
            {status === 'loading' ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <FlatList
                data={categories.length > 4 ? categories.slice(0, 4) : categories}
                horizontal
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => renderCard(item)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 8 }}
                style={{ maxHeight: 180 }}
              />
            )}
          </View> */}

          {/* Top Categories */}
          {featuredCategories?.length > 0 && (
            <>
              <View style={styles.categoryHeader}>
                <AppText style={styles.helpText}>Categories</AppText>
              </View>
              <View style={styles.content}>
                {topCatStatus === 'loading' ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                  <FlatList
                    data={featuredCategories}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => renderCategoryCard(item)}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 8 }}
                    style={{ maxHeight: 180 }}
                  />
                )}
              </View>
            </>
          )}

          {/* Top Services */}
          {featuredServices?.length > 0 && (
            <>
              <View style={styles.categoryHeader}>
                <AppText style={styles.helpText}>Services</AppText>
              </View>
              <View style={styles.content}>
                {topServStatus === 'loading' ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                  featuredServices.map(service => (
                    <ServicesListingCard
                      key={service.id}
                      service={service}
                      onPress={() =>
                        navigation.navigate('JobCreateScreen', {
                          serviceId: service.id,
                          serviceName: service.name,
                        })
                      }
                    />
                  ))
                )}
              </View>
            </>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' }, // 👈 ensures safe area
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingLeft: 8 },
  helpText: { fontSize: 17, fontWeight: '700',fontStyle: 'bold', marginBottom: 15 },
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
  cardImage: { width: '100%', height: '100%' },
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
  seeAllText: { fontSize: 14, color: colors.primary },
  categoryHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  searchContainer: { paddingHorizontal: 16, marginTop: 10 },
});

export default HomeScreen;
