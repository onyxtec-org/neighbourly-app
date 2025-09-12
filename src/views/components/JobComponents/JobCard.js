import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import colors from '../../../config/colors';
import AppText from '../AppText';
import Image from '../ImageComponent/ImageComponent';
import config from '../../../config';
import Icon from '../ImageComponent/IconComponent';
import { formatStatusText } from '../../../utils/stringHelpers';
import { useSelector } from 'react-redux';
import StatusBox from './StatusBox';
function JobCard({
  item,
  onPress,
  onAcceptPress,
  onRejectPress,
  onReinvitePress,
  status,
}) {
  const { width } = useWindowDimensions();
  const imageSize = width * 0.24; // responsive image size
  const { user: profileUser } = useSelector(state => state.profile);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item.id, status, item)}
    >
      {/* Left: Image */}
      <Image
        source={
          item.attachments.length > 0
            ? {
                uri: `${config.attachmentimageURL}${item.attachments[0].attachment}`,
              }
            : require('../../../assets/images/job_placeholder.png')
        }
        style={[
          styles.image,
          {
            width: imageSize,
            height:
              profileUser.role === 'provider' ? imageSize + 60 : imageSize + 30,
          },
        ]}
      />

      {/* Right: Content */}
      <View style={styles.contentContainer}>
        {/* Title */}
        <AppText style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </AppText>

        <View style={{ flexDirection: 'row' }}>
          <Icon
            name="location"
            size={14}
            color={colors.gray}
            style={{ marginRight: 2 }}
          />
          <AppText
            style={styles.location}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.location}
          </AppText>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Icon
            name="hourglass"
            size={14}
            color={colors.gray}
            style={{ marginRight: 2 }}
          />
          <AppText style={styles.location}>
            {item.no_of_hours} {item.no_of_hours > 1 ? 'hrs' : 'hr'}
          </AppText>
        </View>
        {/* Price */}
        <View style={{ flexDirection: 'row' }}>
          {/* <Icon
            name="cash-outline"
            size={14}
            color={colors.gray}
            style={{ marginRight: 2 }}
          /> */}
          <AppText style={styles.price}>
            { item.accepted_offer? `$${item.accepted_offer.rate}`:`$${item.rate}`}/{' '}
            <AppText style={{ fontSize: 10 }}>
              {formatStatusText(item.price_type)}
            </AppText>
          </AppText>
        </View>

        {/* Service */}
       {item.status==='rejected'|| item.status==='declined'?( <AppText style={styles.service}>
          <AppText style={styles.serviceLabel}>Info: </AppText>
          {item.status==='rejected'?`Job rejected by the provider`:`Offer declined by the Consumer`}
        </AppText>):( <AppText style={styles.service}>
          <AppText style={styles.serviceLabel}>Service: </AppText>
          {item.service.name}
        </AppText>)}

        {/* Action Buttons */}
        {profileUser.role === 'provider' &&
          (item.my_offer === null || item.status === 'invited') && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => onAcceptPress(item.id, item.price_type)}
              >
                <AppText style={styles.acceptButtonText}>Accept</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => onRejectPress(item.id, 'rejected')}
              >
                <AppText style={styles.rejectButtonText}>Reject</AppText>
              </TouchableOpacity>
            </View>
          )}
      </View>

      {/* Distance Badge */}
      {/* <View style={{ flexDirection: 'column' }}>
        
        <View style={styles.distanceBadge}>
          <AppText style={styles.badgeText}>1 km</AppText>
        </View>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor:
                item.payment_type === 'cash' ? colors.green : colors.blue,
            },
          ]}
        >
          <AppText style={styles.badgeText}>{item.payment_type}</AppText>
        </View>
      </View> */}

    <View style={{ flexDirection: 'column' }}>
        <StatusBox
          color={colors.statusColors(item.status)}
          text={
            item.my_offer && item.accepted_offer === null
              ? formatStatusText(item.my_offer.status)
              : formatStatusText(item.status)
          }
        />

        {/* Badges */}
      {(item.status!=='rejected'&&item.status!='declined') &&  <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <View style={styles.distanceBadge}>
            <AppText style={styles.badgeText}>1 km</AppText>
          </View>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  item.payment_type === 'cash' ? colors.green : colors.blue,
              },
            ]}
          >
            <AppText style={styles.badgeText}>{item.payment_type}</AppText>
          </View>
        </View>}

        {/* Re-invite Button */}
        {profileUser.role === 'consumer' && item.status === 'completed' && (
          <TouchableOpacity
            style={styles.reinviteButton}
            onPress={() => onReinvitePress(item)}
          >
            <Icon
              name="refresh"
              size={14}
              color={colors.white}
              style={{ marginRight: 6 }}
            />
            <AppText style={styles.reinviteText}>Re-invite</AppText>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 10,
    marginVertical: 10,
  },
  image: {
    borderRadius: 10,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.black,
    marginBottom: 4,
  },
  service: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 12,
  },
  serviceLabel: {
    fontWeight: '700',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  acceptButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  rejectButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.black,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  rejectButtonText: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 14,
  },
  distanceBadge: {
    position: 'absolute',
    right: 5,
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeBadge: {
    position: 'absolute',
    top: 25,
    right: 5,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    color: colors.black,
  },
  reinviteButton: {
    position: 'absolute',
    top: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,

    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // for Android shadow
  },
  reinviteText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default JobCard;
