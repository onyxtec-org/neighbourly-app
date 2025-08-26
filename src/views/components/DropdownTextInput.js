import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from './IconComponent';
import AppText from './AppText';
const DropdownTextInput = ({
  label,
  required,
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const items = [
    { label: '1 hour to 2 hour', value: '1 hour to 2 hour' },
    { label: '2 hour to 5 hour', value: '2 hour to 5 hour' },
    { label: '5 hour to 10 hour', value: '5 hour to 10 hour' },
    { label: 'Custom', value: 'custom' },
  ];

  useEffect(() => {
    if (value === 'custom') {
      setCustomMode(true);
    } else if (value) {
      setCustomMode(false);
      setCustomValue('');
    }
  }, [value]);

  const handleSelection = selected => {
    if (selected === 'custom') {
      setCustomMode(true);
      setOpen(false); // Close dropdown
      onChange('');
      Keyboard.dismiss(); // ensure keyboard closes before showing input
    } else {
      setCustomMode(false);
      setCustomValue('');
      onChange(selected);
    }
  };

  const handleCustomChange = text => {
    const numericText = text.replace(/[^0-9:.]/g, '');
    setCustomValue(numericText);
    onChange(numericText);
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <AppText style={styles.label}>
          {label}
          {required && <AppText style={styles.required}> *</AppText>}
        </AppText>
      )}

      {!customMode ? (
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={callback => {
            const val = callback(value);
            handleSelection(val);
          }}
          placeholder={placeholder}
          style={[styles.dropdown, error && styles.errorBorder]}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.text}
          zIndex={5000}
          zIndexInverse={1000}
          ArrowDownIconComponent={() => (
            <Ionicons name="chevron-down" size={20} color="#999" />
          )}
          ArrowUpIconComponent={() => (
            <Ionicons name="chevron-up" size={20} color="#999" />
          )}
        />
      ) : (
        <View style={[styles.customInputContainer, error && styles.errorBorder]}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter estimated time (e.g. 2)"
            placeholderTextColor="#999"
            value={customValue}
            onChangeText={handleCustomChange}
            onFocus={() => setOpen(false)} // close dropdown if open
          />
          <TouchableOpacity
            onPress={() => {
              setCustomMode(false);
              setCustomValue('');
              onChange('');
              Keyboard.dismiss();
            }}
          >
            <Ionicons name="close" size={22} color="#999" />
          </TouchableOpacity>
        </View>
      )}

      {error && <AppText style={styles.errorText}>{error}</AppText>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    zIndex: Platform.OS === 'android' ? 1000 : 5000,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  required: {
    color: 'red',
  },
  dropdown: {
    borderColor: '#ccc',
    minHeight: 50,
    borderRadius: 6,
    paddingHorizontal: 10,
    zIndex: 5000,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
    zIndex: 5000,
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    minHeight: 50,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
  },
  errorBorder: {
    borderColor: 'red',
  },
});

export default DropdownTextInput;
