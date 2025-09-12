import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AppText from '../AppText';
import Icon from '../ImageComponent/IconComponent';
import colors from '../../../config/colors';
import config from '../../../config';
const OfferCard = ({ offer, onAccept, onReject }) => {
  const provider = offer.provider || {};
  const rating = Number(provider.average_rating ?? 0);

  return (
    <View style={styles.card}>
      {/* Row 1: Avatar + Name + Jobs */}
        <Image
          source={
            provider.image
              ? { uri: `${config.userimageURL}${provider.image}` }
              : require('../../../assets/images/profile_icon.jpeg')
          }
          style={styles.avatar}
        />
        <View style={{flexDirection:'column',flex:1}}>

        
      <View style={styles.headerRow}>


        <View style={{ flex: 1, marginLeft: 12 }}>
          <AppText style={styles.name}>{provider.name || 'Person Name'}</AppText>
          <AppText style={styles.subTitle}>Offer from Provider</AppText>

          {/* Stars below name */}
          <View style={styles.ratingRow}>
            <View style={styles.starsRow}>
              {[...Array(5)].map((_, index) => (
                <Icon
                  key={index}
                  name={index < rating ? 'star' : 'star-outline'}
                  size={14}
                  color={colors.starColor}
                  style={styles.starIcon}
                />
              ))}
            </View>
            <AppText style={styles.ratingValue}>{`(${rating.toFixed(1)})`}</AppText>
          </View>
        </View>

        {/* Jobs count aligned right */}
        <View style={styles.jobCountContainer}>
          <AppText>{`${offer.provider.completed_jobs_by_service_count} Jobs`}</AppText>
          <AppText style={styles.jobCountText}>(Completed)</AppText>
        </View>
      </View>

      {/* Row 2: Rate + Hours */}
      <View style={styles.infoRow}>
        <AppText style={styles.rate}>${offer.rate}</AppText>
        <AppText style={styles.per}>/per hr</AppText>
        <View style={styles.divider} />
        <AppText style={styles.hours}>{offer.no_of_hours} hrs</AppText>
        <AppText style={styles.smallText}>(task completion)</AppText>
      </View>

      {/* Row 3: Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => onAccept(offer.id)}
        >
          <AppText style={styles.acceptText}>Accept</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => onReject(offer.id)}
        >
          <AppText style={styles.rejectText}>Reject</AppText>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

export default OfferCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // ✅ stack sections
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  subTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  starsRow: {
    flexDirection: 'row',
  },
  starIcon: {
    marginHorizontal: 1,
  },
  ratingValue: {
    fontSize: 12,
    color: colors.lightBrown,
    marginLeft: 6,
  },
  jobCountContainer: {
    flexDirection:'row',
    alignItems: 'baseline',
    justifyContent:'space-between'
  },
  jobCountText: {
    color: colors.lightBrown,
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  rate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  per: {
    fontSize: 13,
    color: colors.lightBrown,
    marginLeft: 2,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  hours: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  smallText: {
    fontSize: 12,
    color: colors.lightBrown,
    marginLeft: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#0A063C',
  },
  rejectButton: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  acceptText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  rejectText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});