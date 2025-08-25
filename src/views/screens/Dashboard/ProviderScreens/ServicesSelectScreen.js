import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import CustomToast from '../../../components/CustomToast';
import colors from '../../../../config/colors';
import ServicesCard from '../../../components/services/ServicesCard';
import {
  fetchServices,
  addServices,
  setMyServices,
} from '../../../../redux/slices/servicesSlice';
import SearchBar from '../../../components/SearchBar';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { CommonActions } from '@react-navigation/native';
import storage from '../../../../app/storage';
import AppActivityIndicator from '../../../components/AppActivityIndicator';
const ServicesSelectScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.services);
  const { categories } = useSelector(state => state.categories);
  const { services } = useSelector(state => state.services);
  console.log('services-', services);
  console.log('categories--', categories);

  const [selectedCustomServiceNames, setSelectedCustomServiceNames] = useState(
    [],
  );

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

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch,]);

  useFocusEffect(
    useCallback(() => {
      console.log('selected service id', selectedServiceIds);
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

      // Update combined list based on the isSelected flag
      setSelectedServices(prevServices => {
        console.log('prevois sercivs', prevServices);

        if (isSelected) {
          // Removing
          return prevServices.filter(s => s.name !== serviceName);
        } else {
          // Adding
          return [
            ...prevServices,
            { id: null, name: serviceName, type: 'custom' },
          ];
        }
      });

      return updatedCustomNames;
    });
  };

  // const handleAddCustomService = () => {
  //   const trimmed = customService.trim();
  //   if (trimmed) {
  //     const newService = {
  //       id: `custom-${Date.now()}`,
  //       name: trimmed,
  //     };

  //     setCustomServices(prev => [...prev, newService]); // add to display list
  //     setSelectedCustomServiceNames(prev => [...prev, trimmed]); // mark as selected
  //     setSelectedServices(prev => [...prev, newService]); // ✅ add to selected services
  //     setCustomService('');
  //     setShowCustomInput(false);
  //   }
  // };

  const handleAddCustomService = () => {
    const trimmed = customService.trim();

    if (!trimmed) return;

    // Check if service already exists in normal or custom services (case-insensitive)
    const existsInServices =
      services.some(s => s.name.toLowerCase() === trimmed.toLowerCase()) ||
      customServices.some(s => s.name.toLowerCase() === trimmed.toLowerCase());

    if (existsInServices) {
      setToastMessage('Service already exists');
      setToastType('error');
      setToastVisible(true);
      return;
    }

    const newService = {
      id: `custom-${Date.now()}`,
      name: trimmed,
    };

    setCustomServices(prev => [...prev, newService]); // add to display list
    setSelectedCustomServiceNames(prev => [...prev, trimmed]); // mark as selected
    setSelectedServices(prev => [
      ...prev,
      { ...newService, id: Number(newService.id) },
    ]); // also add to selected
    setCustomService('');
    setShowCustomInput(false);
    console.log('new servie', newService);
  };

  const selectedSearch = service => {
    setSelectedServices(prev => {
      const numericService = { ...service, id: Number(service.id) }; // ensure id is number
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

  const handleLogSelected = async () => {
    setIsLoading(true);
    console.log('✅ Selected Preset Service IDs:', selectedServiceIds);
    console.log(
      '🛠️ Selected Custom Service Names:',
      selectedCustomServiceNames,
    );

    const body = {
      service_ids: selectedServiceIds, // Existing service IDs
      new_services: selectedCustomServiceNames, // New services to create unduer 'Other' category
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

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          }),
        );
      } else {
        setToastMessage(result.message);
        setToastType('error');
        setToastVisible(true);
      }
    } catch (error) {
      console.log(' Failed to add service:', error);
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
          <Text style={styles.categoryTitle}>{category.name}</Text>
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // adjust offset for header
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
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

            {/* Services Header */}
            <View style={styles.categoryHeader}>
              <Text style={styles.helpText}>
                Select Service{' '}
                <Text style={styles.minimumText}>
                  (atleast 1 existing service required)
                </Text>
              </Text>
            </View>

            {/* Search */}
            <SearchBar
              placeholder='Try "Mount TV" or "leaky tap"'
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
            <View style={{ marginTop: 16 }}>
              {selectedServices.length > 0 && (
                <View
                  style={{
                    padding: 10,
                    backgroundColor: '#f0f0f0',
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontWeight: 'bold' }}>
                    Selected Services ({selectedServices.length})
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: 8,
                    }}
                  >
                    {selectedServices.map(service => (
                      <View
                        key={service.id}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          margin: 4,
                          backgroundColor: '#e0e0e0',
                          borderRadius: 20,
                        }}
                      >
                        <Text>{service.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Services List */}
            <View style={styles.content}>
              {status === 'loading' ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <FlatList
                  data={categories}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderCategory}
                  extraData={selectedServiceIds}
                  scrollEnabled={false} // Disable inner scroll, rely on ScrollView
                />
              )}
            </View>

            {/* Add Custom Button */}
            <TouchableOpacity
              style={styles.addCustomRoundButton}
              onPress={() => setShowCustomInput(prev => !prev)}
            >
              <Ionicons name="add" size={20} color={colors.primary} />
              <Text style={styles.addCustomText}>Add Custom</Text>
            </TouchableOpacity>

            {/* Custom Input Field */}
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
                  <Text style={styles.addButtonText}>Add Service</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Custom Services */}
            {customServices.length > 0 && (
              <View style={styles.customServicesContainer}>
                <Text style={styles.customServicesTitle}>Custom Services</Text>
                <View style={styles.cardWrapContainer}>
                  {customServices.map(service => (
                    <ServicesCard
                      key={service.name}
                      item={service}
                      isSelected={selectedCustomServiceNames.includes(
                        service.name,
                      )}
                      onToggleSelect={() =>
                        toggleSelectCustomService(service.name)
                      }
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Log Button */}
            <TouchableOpacity
              style={[
                styles.logButton,
                {
                  backgroundColor:
                    selectedServiceIds.length >= 1 ? colors.primary : '#ccc',
                },
              ]}
              onPress={handleLogSelected}
              disabled={selectedServiceIds.length < 1}
            >
              <Text style={styles.logButtonText}>Add services</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 8, fontSize: 16 },
  categoryHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  helpText: { fontSize: 18, fontWeight: 'bold' },
  seeAllText: { fontSize: 14, color: colors.primary },
  content: { paddingLeft: 8, marginTop: 12 },

  // Add Custom Round Button
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

  // Custom input row
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
  minimumText: {
    fontSize: 14,
    color: 'gray',
    fontWeight: 'normal',
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
    gap: 10, // optional spacing between cards (RN 0.71+)
  },
});

export default ServicesSelectScreen;
