
// // export default DropdownTextInput;
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import DropDownPicker from 'react-native-dropdown-picker';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const DropdownTextInput = ({
//   label,
//   isRequired = false,
//   value,
//   onChange,
//   error,
//   placeholder = 'Select estimated time',
// }) => {
//   const [open, setOpen] = useState(false);
//   const [customMode, setCustomMode] = useState(false);
//   const [items, setItems] = useState([
//     { label: '1 hour to 2 hour', value: '1 hour to 2 hour' },
//     { label: '2 hour to 5 hour', value: '2 hour to 5 hour' },
//     { label: '5 hour to 10 hour', value: '5 hour to 10 hour' },
//     { label: 'Custom', value: 'custom' },
//   ]);

//   const handleChange = (selectedValue) => {
//     if (selectedValue === 'custom') {
//       setCustomMode(true);
//       onChange('');
//     } else {
//       setCustomMode(false);
//       onChange(selectedValue);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {!!label && (
//         <Text style={styles.label}>
//           {label}
//           {isRequired && <Text style={styles.required}> *</Text>}
//         </Text>
//       )}

//       {!customMode ? (
//         <>
//           <DropDownPicker
//             open={open}
//             value={value}
//             items={items}
//             setOpen={setOpen}
//             setValue={(callback) => handleChange(callback(null))}
//             setItems={setItems}
//             placeholder={placeholder}
//             style={[
//               styles.dropdown,
//               error && { borderColor: 'red' },
//             ]}
//             dropDownContainerStyle={{
//               borderColor: '#ccc',
//               backgroundColor: '#fff',
//             }}
//             textStyle={styles.dropdownText}
//             placeholderStyle={{ color: '#999' }}
//             ArrowDownIconComponent={() => (
//               <Ionicons name="chevron-down" size={20} color="#999" />
//             )}
//             ArrowUpIconComponent={() => (
//               <Ionicons name="chevron-up" size={20} color="#999" />
//             )}
//           />
//         </>
//       ) : (
//         <View style={styles.customInputWrapper}>
//           <TextInput
//             placeholder="Enter estimated time"
//             placeholderTextColor="#999"
//             value={value}
//             onChangeText={onChange}
//             style={[styles.customInput, error && { borderColor: 'red' }]}
//           />
//           <TouchableOpacity onPress={() => setCustomMode(false)}>
//             <Ionicons name="close" size={22} color="#999" />
//           </TouchableOpacity>
//         </View>
//       )}

//       {!!error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 20,
//     zIndex: 1000, // important to ensure dropdown overlaps
//   },
//   label: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 6,
//   },
//   required: {
//     color: 'red',
//   },
//   dropdown: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 6,
//     minHeight: 50,
//     paddingHorizontal: 10,
//   },
//   dropdownText: {
//     fontSize: 15,
//     color: '#333',
//   },
//   customInputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 6,
//     paddingHorizontal: 10,
//     backgroundColor: '#fff',
//     minHeight: 50,
//     justifyContent: 'space-between',
//   },
//   customInput: {
//     flex: 1,
//     fontSize: 15,
//     color: '#333',
//   },
//   errorText: {
//     fontSize: 13,
//     color: 'red',
//     marginTop: 4,
//   },
// });
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
      onChange('');
    } else {
      setCustomMode(false);
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
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {!customMode ? (
        <View style={styles.dropdownWrapper}>
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
        </View>
      ) : (
        <View style={[styles.customInputContainer, error && styles.errorBorder]}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter estimated time (e.g. 2)"
            placeholderTextColor="#999"
            value={customValue}
            onChangeText={handleCustomChange}
          />
          <TouchableOpacity
            onPress={() => {
              setCustomMode(false);
              setCustomValue('');
              onChange('');
            }}
          >
            <Ionicons name="close" size={22} color="#999" />
          </TouchableOpacity>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    zIndex: 1000, 
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  required: {
    color: 'red',
  },
  dropdownWrapper: {
    zIndex: 5000, // Ensures dropdown appears on top
  },
  dropdown: {
    borderColor: '#ccc',
    minHeight: 50,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
    zIndex:  1000, 
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
