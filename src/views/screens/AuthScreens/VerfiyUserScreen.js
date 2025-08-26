import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Ionicons from '../../components/ImageComponent/IconComponent';
import colors from '../../../config/colors';
import AppText from '../../components/AppText';
const VerfiyUserScreen = ({ navigation }) => {
  const [isVerified, setIsVerified] = useState(false);

 return (
  <SafeAreaView style={styles.container}>
    <AppText style={styles.headerText}>
      Complete the following steps to proceed
    </AppText>

    {/* Step 1 */}
    <View style={styles.stepContainer}>
      <AppText style={styles.stepText}>1. Verify user via email</AppText>
      <Ionicons name="checkmark-circle" size={24} color="green" />
    </View>

    {/* Step 2 */}
    <View style={styles.stepContainer}>
      <AppText style={styles.stepText}>2. Select services</AppText>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ServicesSelection')}
      >
        <AppText style={styles.addText}>Add Services</AppText>
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
