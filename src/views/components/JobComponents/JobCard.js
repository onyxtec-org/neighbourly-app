import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import colors from '../../../config/colors';
import { useNavigation } from '@react-navigation/native';
import Icon from '../ImageComponent/IconComponent';
import StatusBox from './StatusBox';
import { useSelector } from 'react-redux';
import { formatStatusText } from '../../../utils/stringHelpers';
import AppText from '../AppText';
const isAndroid = Platform.OS === 'android';

function JobCard({
  item,
  onPress,
  onInterestedPress,
  onRejectedPress,
  status,
}) {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const { user: profileUser } = useSelector(state => state.profile);

  // Dynamic sizes based on screen width
  const cardHeight = height * 0.23; // 23% of screen height
  const titleFont = width * 0.06; // ~6% of width
  const textFont = width * 0.04; // ~4% of width
  const iconSize = width * 0.045; // icon size relative to width
  const checkBtnSize = width * 0.1; // 10% of width

  return (
    <TouchableOpacity
      style={[styles.container, { height: cardHeight }]}
      onPress={() => onPress(item.id, status, item)}
    >
      <View style={[styles.contentContainer, { width: '75%' }]}>
        {/* Title */}
        <AppText
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[
            styles.title,
            {
              fontSize: titleFont,
              lineHeight: titleFont * 1.2,
              paddingBottom: 2,
            },
          ]}
        >
          {item.title}
        </AppText>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Icon
            name="document-text-outline"
            size={iconSize}
            color={colors.gray}
            style={styles.icon}
          />
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.description, { fontSize: textFont }]}
          >
            {item.description}
          </AppText>
        </View>

        {/* Duration and Rate */}
        <View style={styles.infoRow}>
          <Icon
            name="time-outline"
            size={iconSize}
            color={colors.gray}
            style={styles.icon}
          />
          <AppText style={[styles.infoText, { fontSize: textFont }]}>
            {item.no_of_hours}
          </AppText>

          <Icon
            name="cash-outline"
            size={iconSize}
            color={colors.gray}
            style={[styles.icon, { marginLeft: 20 }]}
          />
          <AppText style={[styles.infoText, { fontSize: textFont }]}>
            {Number(item.rate) % 1 === 0
              ? Number(item.rate).toFixed(0)
              : Number(item.rate).toString()}{' '}
            {item.price_type === 'fixed' ? '' : '/hr'}
          </AppText>
        </View>

        {/* Payment Type */}
        <View style={styles.infoRow}>
          <Icon
            name="card-outline"
            size={iconSize}
            color={colors.gray}
            style={styles.icon}
          />
          <AppText style={[styles.infoText, { fontSize: textFont }]}>
            {item.payment_type || 'N/A'}
          </AppText>
        </View>

        <View style={styles.infoRow}>
          <Icon
            name="briefcase-outline"
            size={iconSize}
            color={colors.gray}
            style={styles.icon}
          />
          <AppText style={[styles.infoText, { fontSize: textFont }]}>
            {item.service.name || 'N/A'}
          </AppText>
        </View>
      </View>

      <View style={styles.header}>
        <StatusBox
          color={colors.statusColors(item.status)}
          text={
            item.my_offer && item.accepted_offer === null
              ? formatStatusText(item.my_offer.status)
              : formatStatusText(item.status)
          }
        />

        {profileUser.role === 'provider' && item.my_offer === null && (
          <View style={styles.actionsColumn}>
            <TouchableOpacity
              style={[styles.actionButton, styles.offerButton]}
              onPress={() => onInterestedPress(item.id, item.price_type)}
              activeOpacity={0.8}
            >
              <AppText style={styles.actionButtonText}>Offer</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => onRejectedPress(item.id, 'rejected')}
              activeOpacity={0.8}
            >
              <AppText style={styles.actionButtonText}>Reject</AppText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
    justifyContent: 'flex-start',
  },
  title: {
    fontWeight: '700',
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
    color: colors.medium,
  },
  actionsColumn: {
    flexDirection: 'column',
    gap: 10, // better spacing
    marginTop: 30,
  },
  actionButton: {
    paddingVertical: 5,
    borderRadius: 30, // pill shape
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  offerButton: {
    backgroundColor: '#4CAF50', // green
  },
  rejectButton: {
    backgroundColor: '#E53935', // red
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default JobCard;
