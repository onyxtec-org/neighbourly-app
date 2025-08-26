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
  Alert,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices,addServices, setMyServices } from '../../../../redux/slices/servicesSlice';
import CustomToast from '../../../components/CustomToast';
import colors from '../../../../config/colors';
import ServicesCard from '../../../components/services/ServicesCard';

const ServicesSelectScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { services, addStatus, myServices } = useSelector(
    state => state.services,
  );

  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [customService, setCustomService] = useState('');
  const [customServiceName, setCustomServiceName] = useState('');

  const [customServicesList, setCustomServicesList] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
console.log('my services--------',myServices);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const toggleSelectService = id => {
    setSelectedServiceIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id],
    );
  };

  const handleAddCustomService = () => {
    const trimmed = customService.trim();
    if (!trimmed) return;

    const newService = {
      id: `custom_${Date.now()}`,
      name: trimmed,
      isCustom: true,
    };

    setCustomServicesList(prev => [...prev, newService]);
    setSelectedServiceIds(prev => [...prev, newService.id]);
    setCustomService('');
    setShowCustomInput(false);
    Keyboard.dismiss();
  };

  const handleLogSelected = async () => {
    const selected = [...services, ...customServicesList].filter(service =>
      selectedServiceIds.includes(service.id),
    );

    const customServiceNames = selected
      .filter(service => service.isCustom)
      .map(service => service.name);

    const presetServiceIds = selected
      .filter(service => !service.isCustom)
      .map(service => service.id);

    console.log(' Custom Service Names:', customServiceNames);
    console.log(' Preset Service IDs:', presetServiceIds);

    const body = {
      service_ids: presetServiceIds, // Existing service IDs
      new_services: customServiceNames, // New services to create unduer 'Other' category
    };

    try {
      const result = await dispatch(addServices(body)).unwrap();

      if (result.statusCode === 200) {
        setToastMessage(result.message);
        setToastType('success');
        setToastVisible(true);        
        dispatch(setMyServices(result.data.user.services))
        navigation.pop();

      } else {
        setToastMessage(result.message);
        setToastType('error');
        setToastVisible(true);
      }
    } catch (error) {
      console.log(' Failed to add service:', error);
    }
  };


  const allServices = [...services, ...customServicesList];

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

        {/* Services Header */}
        <View style={styles.categoryHeader}>
          <Text style={styles.helpText}>
            Select Services{' '}
            <Text style={styles.minimumText}>(atleast 1 existing service required)</Text>
          </Text>
        </View>

        {/* Services List */}
        <View style={styles.content}>
          {addStatus === 'loading' ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <ScrollView
              style={{ maxHeight: 180 }}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  paddingHorizontal: 8,
                }}
              >
                {allServices.map(item => (
                  <View
                    key={item.id.toString()}
                    style={{
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <ServicesCard
                      item={item}
                      isSelected={selectedServiceIds.includes(item.id)}
                      onToggleSelect={() => toggleSelectService(item.id)}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
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
        <CustomToast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onHide={() => setToastVisible(false)}
        />
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
});

export default ServicesSelectScreen;
