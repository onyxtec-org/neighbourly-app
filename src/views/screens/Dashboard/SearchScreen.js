import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices } from '../../../redux/slices/servicesSlice';
import Ionicons from '../../components/IconComponent';
import colors from '../../../config/colors';
import NoRecordFound from '../../components/NoRecordFound';
import AppText from '../../components/AppText';
import Header from '../../components/Header';
const SearchScreen = ({ navigation, route }) => {
  const { type ,onSelect } = route.params || {};
  const handleItemPress = (item) => {
    if (onSelect) {
      onSelect(item); // Send data back
    }
    navigation.goBack(); // Go back to SelectionScreen
  };

  const dispatch = useDispatch();
  const { services, status, categoryMap } = useSelector(
    state => state.services,
  );
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const filteredResults = query.trim()
    ? services.filter(
        item =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const hasSearched = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Header title={'Search Services'} bookmark={false}/>
    
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textMedium} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for services..."
          value={query}
          onChangeText={setQuery}
          autoFocus
          placeholderTextColor={colors.textMedium}
        />
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {status === 'loading' ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : hasSearched && filteredResults.length === 0 ? (
          <NoRecordFound message="No results found!" marginTop={30} />
        ) : (
          <FlatList
            data={filteredResults}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => {
              const categoryName =
                categoryMap[item.category_id] || 'Uncategorized';
              return (
                <TouchableOpacity
                  onPress={() => {
                    type === 'selection'
                      ? handleItemPress(item)
                      : navigation.navigate('JobCreateScreen', {
                          service: item,
                        });
                  }}
                  style={styles.card}
                >
                  <View style={styles.iconCircle}>
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.cardContent}>
                    <AppText style={styles.cardTitle}>{item.name}</AppText>
                    <AppText style={styles.categoryText}>{categoryName}</AppText>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    margin: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 13,
    color: colors.textMedium,
    marginTop: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
    marginLeft: 10,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loader: {
    marginTop: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textMedium,
    marginTop: 2,
  },
});

export default SearchScreen;
