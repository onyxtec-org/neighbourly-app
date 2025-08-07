import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import colors from '../../config/colors';

const TermsAndConditionsModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Terms & Conditions</Text>
              <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>1. Introduction</Text>
                <Text style={styles.paragraph}>
                  Welcome to <Text style={styles.highlight}>Neighbourly</Text>. By accessing or using our app,
                  you agree to be bound by these terms. Neighbourly connects users with trusted service providers
                  like plumbers, electricians, and other home services.
                </Text>

                <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
                <Text style={styles.paragraph}>
                  Users must provide accurate information, treat service providers with respect, and not misuse
                  the platform for any illegal activity.
                </Text>

                <Text style={styles.sectionTitle}>3. Service Providers</Text>
                <Text style={styles.paragraph}>
                  All professionals listed on Neighbourly are independent contractors. While we aim to verify each
                  profile, Neighbourly is not liable for any service outcome.
                </Text>

                <Text style={styles.sectionTitle}>4. Payments</Text>
                <Text style={styles.paragraph}>
                  Payments for services must be made through the app’s secure gateway. Neighbourly does not store
                  credit/debit card details.
                </Text>

                <Text style={styles.sectionTitle}>5. Cancellation Policy</Text>
                <Text style={styles.paragraph}>
                  Cancellations must be made at least 2 hours prior to the appointment. Frequent cancellations may
                  lead to account suspension.
                </Text>

                <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
                <Text style={styles.paragraph}>
                  Neighbourly is not responsible for any direct or indirect damages arising from service use. Users
                  agree to use the app at their own risk.
                </Text>

                <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
                <Text style={styles.paragraph}>
                  We may update these terms from time to time. Continued use of the app after changes implies
                  acceptance.
                </Text>

                <Text style={styles.sectionTitle}>8. Contact Us</Text>
                <Text style={styles.paragraph}>
                  For questions or concerns about these terms, please contact us at support@neighbourly.app.
                </Text>
              </ScrollView>

              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TermsAndConditionsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '88%',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
    color: '#444',
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  content: {
    marginBottom: 20,
  },
  highlight: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});