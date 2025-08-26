import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../../config/colors';

const VerfiyUserScreen = ({ navigation }) => {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>
        Complete the following steps to proceed
      </Text>

      {/* Step 1 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepText}>1. Verify user via email</Text>

        <Ionicons name="checkmark-circle" size={24} color="green" />
      </View>

      {/* Step 2 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepText}>2. Select services</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ServicesSelection')}
        >
          <Text style={styles.addText}>Add Services</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: '500',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  verifyText: {
    color: '#fff',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addText: {
    color: '#fff',
    fontSize: 14,
  },
});
export default VerfiyUserScreen;
