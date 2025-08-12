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

function JobCard({ item, onPress }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(item.id)}>
      <View style={styles.contentContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {item.title}
        </Text>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Ionicons
            name="document-text-outline"
            size={16}
            color={colors.gray}
            style={styles.icon}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.description}
          >
            {item.description}
          </Text>
        </View>

        {/* Duration and Rate */}
        <View style={styles.infoRow}>
          <>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.gray}
              style={styles.icon}
            />
            <Text style={styles.infoText}>{item.no_of_hours}</Text>
          </>

          <Ionicons
            name="cash-outline"
            size={16}
            color={colors.gray}
            style={[styles.icon, { marginLeft: 20 }]}
          />
          <Text style={styles.infoText}>
            {Number(item.rate) % 1 === 0
              ? Number(item.rate).toFixed(0)
              : Number(item.rate).toString()}{' '}
            {item.price_type === 'fixed' ? '' : '/hr'}
          </Text>
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
        <View style={styles.infoRow}>
          <Ionicons
            name="briefcase-outline"
            size={16}
            color={colors.gray}
            style={styles.icon}
          />
          <Text style={styles.infoText}>{item.service.name || 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.header}>
        <View>
          <StatusBox
            color={colors.statusColors(item.status)}
            text={item.status}
          />
          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.checkCircle,
                { borderColor: colors.checkGreen, marginRight: 5 },
              ]}
              onPress={() => console.log('Interested in job')}
            >
              <Ionicons name="checkmark" size={20} color={colors.checkGreen} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.checkCircle, { borderColor: colors.checkRed }]}
              onPress={() => console.log('Not interested in job')}
            >
              <Ionicons
                name="close-outline"
                size={20}
                color={colors.checkRed}
              />
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    width: '25%',
  },
  contentContainer: {
    width: '75%',
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JobCard;
