// export default ServicesListingCard;
import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import Icon from '../ImageComponent/IconComponent';
import AppText from '../AppText';
import colors from '../../../config/colors';

const ServicesListingCard = ({ service, image, onPress }) => {

  return (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => onPress(service)}
      activeOpacity={0.8}
    >
      {service.image ? (
        <View style={styles.serviceImageWrapper}>
          <Image
            source={{ uri: image }}
            style={styles.serviceImage}
            onError={e => console.log('Image load error:', e.nativeEvent)}
            onLoad={() => console.log('Image loaded:', image)}
          />
        </View>
      ) : (
        <View style={styles.serviceImageWrapper}>
          <Icon
            name="construct-outline"
            size={22}
            color={colors.primary}
            style={styles.iconInside}
          />
        </View>
      )}

      <View style={styles.textAndChevronContainer}>
        <AppText style={styles.serviceName}>{service.name}</AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 14,
    backgroundColor: colors.white,

    // Make bottom border stronger
    borderBottomWidth: 1.2,
    borderBottomColor: colors.borderColor,
  },
  textAndChevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  serviceImageWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: 15,
    borderWidth: 1,
    borderColor: colors.borderColor || '#ddd',
    backgroundColor: colors.white,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,

    // Android elevation
    elevation: 4,

    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    resizeMode: 'cover',
  },
  iconInside: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  serviceName: {
    fontSize: 15,
    color: colors.dark,
    fontWeight: '500',
    flex: 1,
  },
});

export default ServicesListingCard;
