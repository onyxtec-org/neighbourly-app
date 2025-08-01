import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const PhoneNumberInput = ({
  label = 'Phone',
  countryCode,
  onChangeCountryCode,
  phoneNumber,
  onChangePhoneNumber,
  required = false,
  error = '',
}) => {
  return (
    <View style={styles.container}>
      {/* Main Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Inputs */}
      <View style={styles.row}>
        {/* Country Code with "+" */}
        <View style={styles.codeContainer}>
          <View style={styles.codeWrapper}>
            <Text style={styles.plus}>+</Text>
            <TextInput
              value={countryCode}
              onChangeText={text => {
                // Only allow numeric values
                const numericText = text.replace(/[^0-9]/g, '');
                onChangeCountryCode(numericText);
              }}
              keyboardType="number-pad"
              placeholderTextColor="#999" // 👈 Add this line
              style={styles.codeInput}
              placeholder="92"
              maxLength={2}
            />
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.phoneContainer}>
          <TextInput
            value={phoneNumber}
            onChangeText={onChangePhoneNumber}
            placeholder="3001234567"
            placeholderTextColor="#999" // 👈 Add this line
            keyboardType="number-pad"
            style={styles.phoneInput}
            maxLength={15}
          />
        </View>
      </View>

      {/* Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  required: {
    color: 'red',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  codeContainer: {
    width: 50,
  },
  codeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  plus: {
    fontSize: 16,
    color: '#999',
    marginRight: 4,
  },
  codeInput: {
    fontSize: 16,
    flex: 1,
    color: '#333',
    padding: 0,
  },
  phoneContainer: {
    flex: 1,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 13,
  },
});
