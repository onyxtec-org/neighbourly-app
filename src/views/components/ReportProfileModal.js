import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import AppText from './AppText';
import CustomTextInput from './CustomTextInput';
import AppButton from '../components/ButtonComponents/AppButton';
import CustomDropdown from '../components/customdropdown';
import colors from '../../config/colors';

const REPORT_REASONS = [
  { label: 'Fake profile', value: 'Fake profile' },
  { label: 'Spam or misleading', value: 'Spam or misleading' },
  { label: 'Inappropriate content', value: 'Inappropriate content' },
  { label: 'Harassment or abusive', value: 'Harassment or abusive' },
];

const ReportProfileModal = ({ visible, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [comment, setComment] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState(REPORT_REASONS);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!selectedReason) {
      setError('Reason is required');
      return;
    }
    onSubmit({ reason: selectedReason, note: comment });
    setSelectedReason(null);
    setError('');
    setComment('');
    onClose();
  };

  
  const handleReasonChange = (value) => {
    setSelectedReason(value);
    if (value) {
      setError('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <AppText style={styles.title}>🚨 Report Profile</AppText>
              {/* <AppText style={styles.subtitle}>
                Please select a reason and add an optional note.
              </AppText> */}

              <CustomDropdown
                label="Select Reason"
                open={dropdownOpen}
                value={selectedReason}
                items={dropdownItems}
                setOpen={setDropdownOpen}
                setValue={handleReasonChange} 
                setItems={setDropdownItems}
                placeholder="Choose reason"
                required
                zIndex={2000}
                error={error}
              />

              <CustomTextInput
                label="Note (optional)"
                multiline
                value={comment}
                onChangeText={setComment}
                placeholder="Add more details..."
                style={{
                  height: 100,
                  textAlignVertical: 'top',
                  marginTop: 3,
                  borderRadius: 8,
                }}
              />

              <AppButton
                title="Submit Report"
                onPress={handleSubmit}
                btnStyles={styles.submitButton}
                textStyle={styles.submitButtonText}
                IconName="alert-circle"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
export default ReportProfileModal;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  submitButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
