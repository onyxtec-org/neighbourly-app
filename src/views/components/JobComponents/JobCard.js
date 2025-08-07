import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Text,
} from 'react-native';
import colors from '../../../config/colors';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StatusBox from './StatusBox';

const isAndroid = Platform.OS === 'android';

function JobCard({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => console.log('Job clicked')}
      activeOpacity={0.9}
    >
      {/* Header: Title and Status */}
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <StatusBox
          color={colors.statusColors(item.status)}
          text={item.status}
        />
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Ionicons
          name="document-text-outline"
          size={16}
          color={colors.gray}
          style={styles.icon}
        />
        <Text numberOfLines={3} ellipsizeMode="tail" style={styles.description}>
          {item.description}
        </Text>
      </View>

      {/* Duration and Rate */}
      <View style={styles.infoRow}>
        {item.price_type !== 'fixed' && (
          <>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.gray}
              style={styles.icon}
            />
            <Text style={styles.infoText}>{item.no_of_hours}</Text>
          </>
        )}

        <Ionicons
          name="cash-outline"
          size={16}
          color={colors.gray}
          style={[styles.icon, { marginLeft: 20 }]}
        />
        <Text style={styles.infoText}>{item.rate}/hr</Text>
      </View>

      {/* Payment Type */}
      <View style={styles.infoRow}>
        <Ionicons
          name="card-outline"
          size={16}
          color={colors.gray}
          style={styles.icon}
        />
        <Text style={styles.infoText}>{item.payment_type || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: isAndroid ? 180 : 190,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.primary,
    padding: 12,
    marginVertical: 8,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 24,
    color: colors.primary,
    flexShrink: 1,
    marginRight: 8,
  },
  descriptionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'flex-start',
  },
  description: {
    fontSize: 16,
    color: colors.dark,
    flex: 1,
    marginLeft: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  icon: {
    marginRight: 5,
  },
  infoText: {
    fontSize: 16,
    color: colors.medium,
  },
});

export default JobCard;
