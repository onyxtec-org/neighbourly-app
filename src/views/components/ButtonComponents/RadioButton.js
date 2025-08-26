import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../../config/colors';
import AppText from './AppText';
const RadioButton = ({ label, value, selected, onPress }) => {
  return (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
      <View style={[styles.outerCircle]}>
        {selected && <View style={styles.innerCircle} />}
      </View>
      <AppText style={styles.label}>{label}</AppText>
    </TouchableOpacity>
  );
};

const RadioButtonGroup = ({ options, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState(options[0].value);

  const handlePress = (value) => {
    setSelectedValue(value);
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <RadioButton
          key={option.value}
          label={option.label}
          value={option.value}
          selected={selectedValue === option.value}
          onPress={() => handlePress(option.value)}
          
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
flexDirection:'row',
justifyContent:'space-between'
    },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 16,
  },
});

export default RadioButtonGroup;