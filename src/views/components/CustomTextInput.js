import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  required = false,
  error = '',
  style = {},
  showEyeIcon = true, // ✅ optional prop
  ...rest
}) => {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const showPasswordToggle = secureTextEntry && showEyeIcon;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={[styles.inputWrapper, error ? styles.errorInput : null]}>
        <TextInput
          value={value}
          onChangeText={text => onChangeText(text.replace(/^\s+/, ''))}
          placeholder={placeholder}
          secureTextEntry={hidePassword}
          placeholderTextColor="#999" 
          keyboardType={keyboardType}
          style={[styles.input, style]}
          {...rest}
        />

        {showPasswordToggle && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={hidePassword ? 'eye-off' : 'eye'}
              size={20}
              color="#888"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: '#333',
    fontSize: 16,
  },
  icon: {
    marginLeft: 8,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 13,
  },
  required: {
    color: 'red',
  },
});

export default CustomTextInput;
