import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../../config/colors';

function ServicesCard({ item, isSelected, onToggleSelect }) {
  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          backgroundColor: isSelected ? colors.primary : colors.white,
          borderColor: colors.primary,
        },
      ]}
      onPress={onToggleSelect}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Text
          style={[
            styles.categoryName,
            { color: isSelected ? colors.white : colors.primary },
          ]}
        >
          {item.name}
        </Text>

        {isSelected && (
          <TouchableOpacity onPress={onToggleSelect} style={styles.crossButton}>
            <Ionicons name="close" size={14} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
cardContainer: {
  paddingHorizontal: 16,
  height: 36,
  borderRadius: 18,
  borderWidth: 1.5,
  justifyContent: 'center',
  borderColor: colors.primary,
  maxWidth: '100%',
},
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },

  crossButton: {
    marginLeft: 8,
  },
});

export default ServicesCard;
