// export default CreateOfferPopup;
import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createOffer } from '../../../../../redux/slices/jobSlice/offerSlice/offerSlice';
import colors from '../../../../../config/colors';
import CustomTextInput from '../../../../components/CustomTextInput';
import AppButton from '../../../../components/ButtonComponents/AppButton';
import CustomToast from '../../../../components/CustomToast';
import AppText from '../../../../components/AppText';
const CreateOfferPopup = ({
  visible,
  onClose,
  jobId,
  priceType = 'hourly',
  onOfferSent,
}) => {
  const [proposedTime, setProposedTime] = useState('');
  const [rate, setRate] = useState('');

  const [errors, setErrors] = useState({});
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [hasOffered, setHasOffered] = useState(false);

  useEffect(() => {
    setHasOffered(false);
  }, [jobId]);

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.offers || state.offer || {});

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const validateFields = () => {
    let newErrors = {};
    if (!proposedTime) newErrors.proposedTime = 'Number of hours is required';
    if (!rate) newErrors.rate = 'Rate is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateFields()) return;

    const payload = {
      job_id: jobId,
      no_of_hours: proposedTime, // keep original input
      rate: parseFloat(rate),
      price_type: priceType,
      note: 'Acc',
    };

    dispatch(createOffer(payload))
      .unwrap()
      .then(res => {
        if (res?.success) {
          setHasOffered(true); // prevent multiple submissions
          showToast('Offer sent successfully!', 'success');
          onClose();
          onOfferSent?.();
          setProposedTime('');
          setRate('');
          setErrors({});
        } else {
          showToast(res?.message || 'Failed to send offer', 'error');
        }
      })
      .catch(() => {
        showToast('Something went wrong. Please try again.', 'error');
      });
  };

  return (
    <>
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.container}>
                <AppText style={styles.title}>Offer</AppText>

                <CustomTextInput
                  label="Rate"
                  required
                  value={rate}
                  onChangeText={text => {
                    setRate(text);
                    setErrors(prev => ({ ...prev, rate: undefined }));
                  }}
                  placeholder="Enter rate"
                  keyboardType="numeric"
                  error={errors.rate}
                />

                <CustomTextInput
                  label="Number of Hours"
                  required
                  value={proposedTime}
                  onChangeText={text => {
                    setProposedTime(text);
                    setErrors(prev => ({ ...prev, proposedTime: undefined }));
                  }}
                  placeholder="Enter number of hours"
                  keyboardType="numeric"
                  error={errors.proposedTime}
                />

                <View style={styles.buttonRow}>
                  <AppButton
                    title={loading ? '' : 'Submit Offer'}
                    onPress={handleSubmit}
                    btnStyles={[
                      styles.submitButton,
                      (loading || hasOffered) && styles.disabledButton,
                    ]}
                    textStyle={styles.submitText}
                    IconName={loading ? null : 'send'}
                    disabled={loading || hasOffered}
                  />
                  {loading && (
                    <ActivityIndicator
                      color="#fff"
                      style={styles.loaderInsideButton}
                    />
                  )}

                  <AppButton
                    title="Cancel"
                    onPress={onClose}
                    btnStyles={styles.cancelButton}
                    textStyle={styles.cancelText}
                    IconName="close"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </>
  );
};

export default CreateOfferPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  submitText: {
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: colors.danger,
  },
  cancelText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.6,
  },
  loaderInsideButton: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
