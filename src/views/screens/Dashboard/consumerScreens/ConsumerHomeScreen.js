import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../../redux/slices/categorySlice/categoriesSlice';
import { getJobs } from '../../../../redux/slices/jobSlice/jobSlice';
import DashboardGrid from '../../../../views/components/DashboardGridComponent';
import { fetchFeaturedCategories } from '../../../../redux/slices/consumerSlice/featuredCategoriesSlice';
import { fetchFeaturedServices } from '../../../../redux/slices/consumerSlice/featuredServicesSlice';
import CategoryContainer from '../../../components/CategoryContainerComponent';
import colors from '../../../../config/colors';
import SearchBar from '../../../components/SearchBar';
import config from '../../../../config';
import AppBar from '../../../components/HeaderComponent/AppBar';
import AppText from '../../../components/AppText';
import Icon from '../../../components/ImageComponent/IconComponent';
import ServicesListingCard from '../../../components/services/ServicesListingCard';
import { selectJobsByTab } from '../../../../redux/selectors/jobSelector';

// shimmer + animation
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import Animated, { FadeInDown } from 'react-native-reanimated';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
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
    dispatch(getJobs());
  }, [dispatch]);

  const jobsByStatus = {
    pending: useSelector(selectJobsByTab('pending', userRole)),
    my_jobs: useSelector(selectJobsByTab('my_jobs', userRole)),
    in_progress: useSelector(selectJobsByTab('in_progress', userRole)),
    completed: useSelector(selectJobsByTab('completed', userRole)),
  };

  const renderCategoryCard = item => {
    return (
      <CategoryContainer
        title={item.name}
        image={`${config.categoriesImageURL}${item.image}`}
        onPress={() =>
          navigation.navigate('CategoryDetailsScreen', { category: item })
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* AppBar - stays fixed */}
          <AppBar />
  
          {/* Scrollable content */}
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {/* Search */}
            <View style={styles.searchContainer}>
              <SearchBar
                placeholder="Search"
                onPress={() => navigation.navigate("SearchScreen")}
              />
            </View>
  
            <DashboardGrid
              items={[
                [
                  {
                    title: `Open → ${jobsByStatus.pending?.count || 0}`,
                    backgroundColor: colors.purpleColor,
                  },
                  {
                    title: `To Start → ${jobsByStatus.my_jobs?.count || 0}`,
                    backgroundColor: colors.pinkColor,
                  },
                ],
                [
                  {
                    title: `In Progress → ${jobsByStatus.in_progress?.count || 0}`,
                    backgroundColor: colors.LightBlueColor,
                  },
                  {
                    title: `Completed → ${jobsByStatus.completed?.count || 0}`,
                    backgroundColor: colors.lightgreenishColor,
                  },
                ],
              ]}
            />
  
            {/* Top Categories */}
            {featuredCategories?.length > 0 || topCatStatus === "loading" ? (
              <>
                <View style={styles.categoryHeader}>
                  <AppText style={styles.helpText}>Categories</AppText>
                  <TouchableOpacity
                    style={styles.seeAllContainer}
                    onPress={() => navigation.navigate("AllCategoriesScreen")}
                    activeOpacity={0.7}
                  >
                    <AppText style={styles.seeAllText}>See All</AppText>
                    <Icon
                      name="chevron-forward"
                      size={16}
                      color={colors.primary}
                      style={{ marginLeft: 3 }}
                    />
                  </TouchableOpacity>
                </View>
  
                <View style={styles.content}>
                  {topCatStatus === "loading" ? (
                    <FlatList
                      data={[1, 2, 3, 4]}
                      horizontal
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={() => (
                        <View style={styles.shimmerCard}>
                          <ShimmerPlaceHolder style={styles.shimmerImage} />
                          <ShimmerPlaceHolder style={styles.shimmerText} />
                        </View>
                      )}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 10 }}
                    />
                  ) : (
                    <FlatList
                      data={featuredCategories}
                      horizontal
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => (
                        <Animated.View
                          entering={FadeInDown.delay(index * 120).springify()}
                        >
                          {renderCategoryCard(item)}
                        </Animated.View>
                      )}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 10 }}
                      style={{ maxHeight: 180 }}
                    />
                  )}
                </View>
              </>
            ) : null}
  
            {/* Top Services */}
            {featuredServices?.length > 0 || topServStatus === "loading" ? (
              <>
                <View style={styles.categoryHeader}>
                  <AppText style={styles.helpText}>Services</AppText>
                </View>
                <View style={styles.content}>
                  {topServStatus === "loading" ? (
                    <View>
                      {[1, 2, 3].map((i) => (
                        <View key={i} style={styles.shimmerServiceCard}>
                          <ShimmerPlaceHolder style={styles.shimmerImage} />
                          <ShimmerPlaceHolder style={styles.shimmerText} />
                        </View>
                      ))}
                    </View>
                  ) : (
                    featuredServices.map((service, index) => (
                      <Animated.View
                        key={service.id}
                        entering={FadeInDown.delay(index * 150).springify()}
                      >
                        <ServicesListingCard
                          service={service}
                          image={`${config.serviceImageURL}${service.image}`}
                          onPress={() =>
                            navigation.navigate("JobCreateScreen", {
                              serviceId: service.id,
                              serviceName: service.name,
                            })
                          }
                        />
                      </Animated.View>
                    ))
                  )}
                </View>
              </>
            ) : null}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};  

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingLeft: 14, paddingRight: 14 },
  helpText: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 15,
  },
  categoryHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  searchContainer: { paddingHorizontal: 16, marginTop: 10 },

  // shimmer styles
  shimmerCard: {
    width: 140,
    height: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  shimmerImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },
  shimmerText: {
    marginTop: 8,
    height: 15,
    width: '70%',
    borderRadius: 8,
  },
  shimmerServiceCard: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f2f2f2',
  },
});

export default HomeScreen;
