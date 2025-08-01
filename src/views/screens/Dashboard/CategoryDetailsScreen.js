import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../../config/colors';

const CategoryDetailsScreen = ({ route, navigation }) => {
  const { category } = route.params;

  // const handleServicePress = (service) => {
  //   navigation.navigate('JobCreateScreen', { service });
  // };
  const handleServicePress = (service) => {
    navigation.navigate('JobCreateScreen', {
      serviceId: service.id,      // 👈 Send the ID
      serviceName: service.name,  // (optional) Send name or full object if needed
    });
  };

  const renderSubCategory = ({ item }) => (
    <View style={styles.subCategoryContainer}>
      <Text style={styles.subCategoryTitle}>{item.name}</Text>
      <View style={styles.subServiceList}>
        {item.services?.map(service => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceRow}
            onPress={() => handleServicePress(service)}
          >
            <Ionicons name="settings-outline" size={20} color={colors.medium} />
            <Text style={styles.serviceText}>{service.name}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.lightGrey} style={styles.chevronIcon} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
         <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Category Details</Text>
        <View style={styles.iconButton} /> {/* Spacer */}
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with Back Button and Category Name */}
       


        {/* Top Services */}
        {category.services?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <View style={styles.serviceGrid}>
              {category.services.map(service => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
                  onPress={() => handleServicePress(service)}
                >
                  <Ionicons name="construct-outline" size={32} color={colors.primary} />
                  <Text style={styles.serviceCardText}>{service.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Subcategories and Their Services */}
        {category.children?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Explore More Categories</Text>
            <FlatList
              data={category.children}
              keyExtractor={(item) => item.id.toString()}
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