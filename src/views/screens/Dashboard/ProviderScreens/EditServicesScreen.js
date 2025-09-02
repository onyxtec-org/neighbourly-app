import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from '../../../components/ImageComponent/IconComponent';
import { useDispatch, useSelector } from 'react-redux';
import CustomToast from '../../../components/CustomToast';
import colors from '../../../../config/colors';
import ServicesCard from '../../../components/services/ServicesCard';
import {
  fetchServices,
  addServices,
  setMyServices,
} from '../../../../redux/slices/servicesSlice/servicesSlice';
import SearchBar from '../../../components/SearchBar';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import storage from '../../../../app/storage';
import AppActivityIndicator from '../../../components/AppActivityIndicator';
import AppText from '../../../components/AppText';
import Header from '../../../components/HeaderComponent/Header';

const EditServicesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { status, services, myServices } = useSelector(state => state.services);
  const { categories } = useSelector(state => state.categories);

  const [selectedCustomServiceNames, setSelectedCustomServiceNames] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [customService, setCustomService] = useState('');
  const [expandedCategoryIds, setExpandedCategoryIds] = useState([]);
  const [customServices, setCustomServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  /** ✅ Fetch services on mount */
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);


  /** ✅ Initialize selected services and handle uncategorized */
useEffect(() => {

  console.log('my serrvices', myServices);
  
  if (myServices && myServices.length > 0) {
    // ✅ Auto-select normal services by ID
    const normalIds = myServices
      .filter(s => s.category !== null)
      .map(s => Number(s.id));

    setSelectedServiceIds(normalIds);

    // ✅ Find custom or uncategorized services (category === null or type === 'custom')
    const customAndUncategorized = myServices.filter(
      s => s.category === null || s.type === 'custom'
    );

    // ✅ Merge them into customServices
    setCustomServices(prev => {
      const existingNames = prev.map(item => item.name.toLowerCase());
      const newOnes = customAndUncategorized.filter(
        s => !existingNames.includes(s.name.toLowerCase())
      );
      return [...prev, ...newOnes];
    });

    // ✅ Auto-select them by name
    setSelectedCustomServiceNames(customAndUncategorized.map(s => s.name));
  }
}, [myServices]);

  /** ✅ Pre-select existing user services when categories and myServices load */
  useEffect(() => {
    if (myServices && myServices.length > 0 && categories.length > 0) {
      const ids = myServices.map(service => Number(service.id));
      const expandedIds = [...new Set(myServices.map(s => s.category_id))]; // Expand categories of selected services

      setSelectedServiceIds(ids);
      setSelectedServices(myServices);
      setExpandedCategoryIds(expandedIds);
    }
  }, [myServices, categories]);

  useFocusEffect(
    useCallback(() => {
      console.log('Selected service IDs:', selectedServiceIds);
    }, [selectedServiceIds]),
  );

  const toggleCategory = categoryId => {
    setExpandedCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const toggleSelectService = service => {
    setSelectedServiceIds(prevIds => {
      if (prevIds.includes(service.id)) {
        return prevIds.filter(id => id !== service.id);
      } else {
        return [...prevIds, service.id];
      }
    });

    setSelectedServices(prevServices => {
      const exists = prevServices.some(s => s.id === service.id);
      if (exists) {
        return prevServices.filter(s => s.id !== service.id);
      } else {
        return [...prevServices, service];
      }
    });
  };

  const toggleSelectCustomService = serviceName => {
    setSelectedCustomServiceNames(prevCustomNames => {
      const isSelected = prevCustomNames.includes(serviceName);
      const updatedCustomNames = isSelected
        ? prevCustomNames.filter(name => name !== serviceName)
        : [...prevCustomNames, serviceName];

      setSelectedServices(prevServices => {
        if (isSelected) {
          return prevServices.filter(s => s.name !== serviceName);
        } else {
          return [...prevServices, { id: null, name: serviceName, type: 'custom' }];
        }
      });

      return updatedCustomNames;
    });
  };

  const handleAddCustomService = () => {
    const trimmed = customService.trim();
    if (!trimmed) return;

    const existsInServices =
      services.some(s => s.name.toLowerCase() === trimmed.toLowerCase()) ||
      customServices.some(s => s.name.toLowerCase() === trimmed.toLowerCase());

    if (existsInServices) {
      setToastMessage('Service already exists');
      setToastType('error');
      setToastVisible(true);
      return;
    }

    const newService = { id: `custom-${Date.now()}`, name: trimmed };

    setCustomServices(prev => [...prev, newService]);
    setSelectedCustomServiceNames(prev => [...prev, trimmed]);
    setSelectedServices(prev => [...prev, { ...newService, id: Number(newService.id) }]);
    setCustomService('');
    setShowCustomInput(false);
  };

  const selectedSearch = service => {
    setSelectedServices(prev => {
      const numericService = { ...service, id: Number(service.id) };
      if (!prev.some(s => s.id === numericService.id)) {
        return [...prev, numericService];
      }
      return prev;
    });

    setSelectedServiceIds(prevIds => {
      const serviceId = Number(service.id);
      if (!prevIds.includes(serviceId)) {
        return [...prevIds, serviceId];
      }
      return prevIds;
    });
  };

  const handleUpdateServices = async () => {
    setIsLoading(true);
    console.log('✅ Selected Preset Service IDs:', selectedServiceIds);
    console.log('🛠️ Selected Custom Service Names:', selectedCustomServiceNames);

    const body = {
      service_ids: selectedServiceIds,
      new_services: selectedCustomServiceNames,
    };

    
    try {
      const result = await dispatch(addServices(body)).unwrap();

      if (result.statusCode === 200) {
        await storage.storeUser(result.data.user);
        dispatch(setMyServices(result.data.user.services));
        setIsLoading(false);
        setToastMessage(result.message);
        setToastType('success');
        setToastVisible(true);

        navigation.pop();
      } else {
        setToastMessage(result.message);
        setToastType('error');
        setToastVisible(true);
      }
    } catch (error) {
      console.log('Failed to update service:', error);
    }
  };

  const renderCategory = ({ item: category }) => {
    const isExpanded = expandedCategoryIds.includes(category.id);

    return (
      <View>
        <TouchableOpacity
          onPress={() => toggleCategory(category.id)}
          style={styles.categoryHeader}
        >
          <AppText style={styles.categoryTitle}>{category.name}</AppText>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.cardWrapContainer}>
            {category.services?.map(service => (
              <ServicesCard
                key={service.id}
                item={service}
                isSelected={selectedServiceIds.includes(Number(service.id))}
                onToggleSelect={() => toggleSelectService(service)}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header */}
           
            <Header title={'Edit Services'} bookmark={false}/>
            {/* Search */}
            <SearchBar
              placeholder='Search or add services'
              onPress={() => {
                navigation.navigate('SearchScreen', {
                  type: 'selection',
                  onSelect: selectedItem => {
                    selectedSearch(selectedItem);
                  },
                });
              }}
            />

            {/* Selected Services */}
            {selectedServices.length > 0 && (
              <View style={styles.selectedContainer}>
                <AppText style={styles.selectedTitle}>
                  Selected Services ({selectedServices.length})
                </AppText>
                <View style={styles.selectedWrap}>
                  {selectedServices.map(service => (
                    <View key={service.id} style={styles.selectedBadge}>
                      <AppText>{service.name}</AppText>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Categories */}
            <View style={styles.content}>
              {status === 'loading' ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <FlatList
                  data={categories}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderCategory}
                  extraData={selectedServiceIds}
                  scrollEnabled={false}
                />
              )}
            </View>

            {/* Add Custom */}
            <TouchableOpacity
              style={styles.addCustomRoundButton}
              onPress={() => setShowCustomInput(prev => !prev)}
            >
              <Ionicons name="add" size={20} color={colors.primary} />
              <AppText style={styles.addCustomText}>Add Custom</AppText>
            </TouchableOpacity>

            {showCustomInput && (
              <View style={styles.customInputRow}>
                <TextInput
                  placeholder="Enter custom service name"
                  placeholderTextColor="#888"
                  style={styles.customInput}
                  value={customService}
                  onChangeText={setCustomService}
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddCustomService}
                >
                  <AppText style={styles.addButtonText}>Add</AppText>
                </TouchableOpacity>
              </View>
            )}

            {customServices.length > 0 && (
              <View style={styles.customServicesContainer}>
                <AppText style={styles.customServicesTitle}>Custom Services</AppText>
                <View style={styles.cardWrapContainer}>
                  {customServices.map(service => (
                    <ServicesCard
                      key={service.name}
                      item={service}
                      isSelected={selectedCustomServiceNames.includes(service.name)}
                      onToggleSelect={() => toggleSelectCustomService(service.name)}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Update Button */}
            <TouchableOpacity
              style={[
                styles.logButton,
                { backgroundColor: selectedServiceIds.length >= 1 ? colors.primary : '#ccc' },
              ]}
              onPress={handleUpdateServices}
              disabled={selectedServiceIds.length < 1}
            >
              <AppText style={styles.logButtonText}>Update Services</AppText>
            </TouchableOpacity>
          </View>
          {isLoading && <AppActivityIndicator />}
        </ScrollView>
        <CustomToast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onHide={() => setToastVisible(false)}
        />
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  content: { paddingHorizontal: 8, marginTop: 12 },

  selectedContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
  },
  selectedTitle: { fontWeight: 'bold' },
  selectedWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  selectedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },

  addCustomRoundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  addCustomText: {
    marginLeft: 6,
    color: colors.primary,
    fontWeight: '600',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  customInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#000',
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  logButton: {
    padding: 12,
    margin: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  customServicesContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  customServicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  cardWrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});

export default EditServicesScreen;
