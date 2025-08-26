import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from './IconComponent';
import AppText from './AppText';
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
  showError=true,
  showEyeIcon = true,
  maxLength,
  showCharCount = false,
  rightIcon = null,
  onRightIconPress = null,
  ...rest
}) => {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const showPasswordToggle = secureTextEntry && showEyeIcon;

  const handleTextChange = (text) => {
    const trimmed = text.replace(/^\s+/, ''); // Trim starting spaces
    onChangeText(trimmed);
  };

  return (
    <View style={styles.container}>
      {label && (
        <AppText style={styles.label}>
          {label}
          {required && <AppText style={styles.required}> *</AppText>}
        </AppText>
      )}

      <View style={[styles.inputWrapper, error ? styles.errorInput : null]}>
        <TextInput
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          secureTextEntry={hidePassword}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
          maxLength={maxLength}
          style={[styles.input, style]}
          {...rest}
        />

        {/* Right-side icon: password toggle or custom icon */}
        {showPasswordToggle ? (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={hidePassword ? 'eye-off' : 'eye'}
              size={20}
              color="#888"
              style={styles.icon}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress}>
            <View style={styles.icon}>{rightIcon}</View>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.footerRow}>
        {error ? (
          <AppText style={styles.errorText}>{error}</AppText>
        ) : (
          <View />
        )}

        {maxLength && showCharCount && (
          <AppText style={styles.charCount}>
            {value?.length || 0}/{maxLength}
          </AppText>
        )}
      </View>

      {/* {showError && error ? <Text style={styles.errorText}>{error}</Text> : null} */}
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
  required: {
    color: 'red',
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
  },
  charCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});

export default CustomTextInput;
