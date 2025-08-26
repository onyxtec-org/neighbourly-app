import React, { useState } from 'react';
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import OfferCard from '../../../../components/offerComponents/OfferCard';
import Header from '../../../../components/HeaderComponent/Header';
import CustomToast from '../../../../components/CustomToast';
import CustomPopup from '../../../../components/CustomPopup';
import colors from '../../../../../config/colors';
import { useDispatch } from 'react-redux';
import { offerStatusUpdate } from '../../../../../redux/slices/jobSlice/offerSlice/offerSlice';
const OfferListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const initialOffers = (route.params?.offers || []).filter(
    o => o.status === 'pending',
  );
  const [offers, setOffers] = useState(initialOffers);
  const [loadingId, setLoadingId] = useState(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    action: null, // 'accept' or 'reject'
    offerId: null,
  });

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleConfirmAction = async () => {
    const { action, offerId } = popupConfig;
    setPopupVisible(false);
    if (!action || !offerId) return;

    try {
      setLoadingId(offerId);

      const body = { status: action === 'accept' ? 'accepted' : 'rejected' };
      const response = await dispatch(offerStatusUpdate({ body, id: offerId }));


           
      if (response.payload.data.success) {
        if (action === 'accept') {
          setOffers([]);
          showToast('Offer has been accepted!', 'success');
          navigation.pop(2);
        } else {
          setOffers(prev => prev.filter(o => o.id !== offerId));
          showToast('Offer has been rejected!', 'success');
        }
      } else {
        showToast(response.data?.message || 'Offer update failed','error');
      }
    } catch (error) {
              showToast(error?.message || 'Network error or server not reachable','error');

    
    } finally {
      setLoadingId(null);
    }
  };

  const onOfferAccepted = id => {
    setPopupConfig({
      title: 'Accept Offer',
      message:
        'Are you sure you want to accept this offer? This action cannot be undone.',
      confirmText: 'Accept',
      action: 'accept',
      offerId: id,
    });
    setPopupVisible(true);
  };

  const onOfferRejected = id => {
    setPopupConfig({
      title: 'Reject Offer',
      message:
        'Are you sure you want to reject this offer? This action cannot be undone.',
      confirmText: 'Reject',
      action: 'reject',
      offerId: id,
    });
    setPopupVisible(true);
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

      <CustomPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        title={popupConfig.title}
        message={popupConfig.message}
        icon={
          popupConfig.action === 'accept'
            ? 'checkmark-circle-outline'
            : 'close-circle-outline'
        }
        iconColor={popupConfig.action === 'accept' ? colors.green : colors.red}
        cancelText="Cancel"
        confirmText={popupConfig.confirmText}
        onCancel={() => setPopupVisible(false)}
        onConfirm={handleConfirmAction}
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
