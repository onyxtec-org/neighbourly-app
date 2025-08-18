import React, { useState } from 'react';
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import OfferCard from '../../components/OfferCard';
import Header from '../../components/Header';
import apiClient from '../../../api/client'; // adjust path
import CustomToast from '../../components/CustomToast';
const OfferListScreen = ({ navigation,route }) => {
  const initialOffers = (route.params?.offers || []).filter(
    o => o.status === 'pending',
  );
  const [offers, setOffers] = useState(initialOffers);
  const [loadingId, setLoadingId] = useState(null); // which offer is being updated

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };
  const onOfferRejected = async id => {
    try {
      setLoadingId(id);

      const body = { status: 'rejected' };
      const response = await apiClient.post(`/offers/${id}/status`, body);

      console.log('respons---->', response);

      if (response.status === 200) {
        // Remove rejected offer locally
        setOffers(prev => prev.filter(o => o.id !== id));
      } else {
        Alert.alert('Error', response.data?.message || 'Offer update failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error or server not reachable');
    } finally {
      setLoadingId(null);
    }
  };

  const onOfferAccepted = async id => {
    try {
      setLoadingId(id);

      const body = { status: 'accepted' };
      const response = await apiClient.post(`/offers/${id}/status`, body);

      console.log('respons---->', response);

      if (response.status === 200) {
        setOffers([]);
        showToast('Offer has been accepted!', 'success');
        navigation.pop(2);

      } else {
        Alert.alert('Error', response.data?.message || 'Offer update failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error or server not reachable');
    } finally {
      setLoadingId(null);
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <OfferCard
        offer={item}
        onAccept={() => onOfferAccepted(item.id)}
        onReject={() => onOfferRejected(item.id)}
      />
      {loadingId === item.id && (
        <ActivityIndicator
          style={{ marginVertical: 8 }}
          size="small"
          color="blue"
        />
      )}
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Offers</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Offers" bookmark={false} />

      <FlatList
        data={offers}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

export default OfferListScreen;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 17,
  },
});
