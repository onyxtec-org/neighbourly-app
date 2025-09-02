import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import Icon from '../ImageComponent/IconComponent';
import AppText from '../AppText';
import colors from '../../../config/colors';
const ServicesListingCard = ({ service, onPress }) => {
  return (
  <TouchableOpacity
  style={[styles.serviceListItem, { width: '100%' }]} // ✅ Full width
  onPress={() => onPress(service)}
>
  {service.image ? (
    <View style={styles.serviceImageContainer}>
      <Image source={{ uri: service.image }} style={styles.serviceImage} />
    </View>
  ) : (
    <Icon
      name="construct-outline"
      size={28}
      color={colors.primary}
      style={styles.serviceIconPlaceholder}
    />
  )}

  <View style={styles.textAndChevronContainer}>
    <AppText style={styles.serviceName}>{service.name}</AppText>
    <Icon
      name="chevron-forward"
      size={20}
      color={colors.lightGrey}
      style={styles.chevronIcon}
    />
  </View>
</TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  serviceListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // ✅ Ensures text and chevron spread out
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.white, // ✅ Changed from red to white (if needed)
  },
  textAndChevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // ✅ Allows this container to stretch
    justifyContent: 'space-between',
  },
  serviceImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 15,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  serviceIconPlaceholder: {
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 15,
  },
  serviceName: {
    fontSize: 15,
    color: colors.dark,
    fontWeight: '500',
    flex: 1, // ✅ Makes the text take remaining space
  },
  chevronIcon: {
    marginLeft: 10,
  },
});

export default ServicesListingCard;
