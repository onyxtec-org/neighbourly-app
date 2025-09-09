import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Ionicons from '../../../components/ImageComponent/IconComponent';
import colors from '../../../../config/colors';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { resetJobState } from '../../../../redux/slices/jobSlice/jobSlice';
import AppText from '../../../components/AppText';
import Header from '../../../components/HeaderComponent/Header';
import ServicesListingCard from '../../../components/services/ServicesListingCard';
const CategoryDetailsScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const dispatch = useDispatch();
  const handleServicePress = service => {
    dispatch(resetJobState());
    navigation.navigate('JobCreateScreen', {
      serviceId: service.id,
      serviceName: service.name,
    });
  };

  const renderSubCategory = ({ item }) => (
    <View style={styles.subCategoryContainer}>
      <AppText style={styles.subCategoryTitle}>{item.name}</AppText>
      <View style={styles.subServiceList}>
        {item.services?.map(service => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceRow}
            onPress={() => handleServicePress(service)}
          >
            <Ionicons name="settings-outline" size={20} color={colors.medium} />
            <AppText style={styles.serviceText}>{service.name}</AppText>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.lightGrey}
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={'Category Details'} bookmark={false} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {category.services?.length > 0 && (
          <>
            <AppText style={styles.sectionTitle}>Popular Services</AppText>
            <View style={styles.serviceList}>
              {category.services.map(service => (
                <ServicesListingCard
                  key={service.id}
                  service={service}
                  onPress={handleServicePress}
                />
              ))}
            </View>
          </>
        )}

        {/* Subcategories and Their Services */}
        {category.children?.length > 0 && (
          <>
            <AppText style={styles.sectionTitle}>
              Explore More Categories
            </AppText>
            <FlatList
              data={category.children}
              keyExtractor={item => item.id.toString()}
              renderItem={renderSubCategory}
              scrollEnabled={false}
              ListFooterComponent={<View style={{ height: 30 }} />}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },

  serviceList: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 25,
    paddingVertical: 5,
    paddingHorizontal: 5,
    elevation: 1,
  },
  serviceListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  serviceImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 15,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  serviceIconPlaceholder: {
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 15,
  },
  serviceName: {
    flex: 1,
    fontSize: 15,
    color: colors.dark,
    fontWeight: '500',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 15,
    marginTop: 25,
    paddingBottom: 5,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: colors.white,
    paddingVertical: 25,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 1,
  },
  serviceCardText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.dark,
  },
  subCategoryContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',

    elevation: 1,
  },
  subCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.lightBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  subServiceList: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    justifyContent: 'space-between',
  },
  serviceText: {
    marginLeft: 15,
    fontSize: 15,
    color: colors.dark,
    flex: 1,
  },
  chevronIcon: {
    marginLeft: 10,
  },
});

export default CategoryDetailsScreen;
