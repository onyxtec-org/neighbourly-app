// components/CustomDropdown.js

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const isAndroid = Platform.OS === 'android';

const CustomDropdown = ({
  label = '',
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
  placeholder = 'Select an option',
  multiple = false,
  mode = 'BADGE',
  listMode = 'SCROLLVIEW',
  disabled = false,
  required = false,
  customIcon = 'chevron-down',
  zIndex = 1000,
  styleOverrides = {},
  ...props
}) => {
  return (
    <View style={[styles.wrapper, { zIndex }]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      ) : null}

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeholder}
        style={[styles.dropdown, styleOverrides]}
        dropDownContainerStyle={styles.dropdownContainer}
        ArrowDownIconComponent={() =>
          !disabled && <Ionicons name={customIcon} size={20} color="#999" />
        }
        disabled={disabled}
        multiple={multiple}
        mode={mode}
        listMode={listMode}
        textStyle={styles.text}
        {...props}
      />

      {props.error && <Text style={styles.errorText}>{props.error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  required: {
    color: 'red',
  },
  dropdown: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: hp('5.5%'),
    paddingHorizontal: 13,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  text: {
    fontSize: hp('1.8%'),
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomDropdown;
