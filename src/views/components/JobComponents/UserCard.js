import React from 'react';
import { View, Image, TouchableOpacity,StyleSheet } from 'react-native';
import AppText from '../AppText';
import colors from '../../../config/colors';
import config from '../../../config';
const UserCard = ({
  user,
onPress,
  averageRating,
  status,
  userRole,
  alreadyReviewed,
  onRatePress,
  isSubmitted,
}) => {

  console.log('isSubmitted', isSubmitted);
  
  return (
    <View style={styles.userCard}>
      <View style={styles.userRow}>
        {/* Column 1: User Image */}
        <TouchableOpacity
          onPress={onPress
          }
        >
          <Image
            source={{
              uri: user?.image
                ? `${config.userimageURL}${user?.image}`
                : 'https://via.placeholder.com/150',
            }}
            style={styles.userImage}
          />
        </TouchableOpacity>

        {/* Column 2: Name & Slug */}
        <View style={styles.userInfoColumn}>
          <AppText style={styles.userName}>{user?.name || 'Unknown User'}</AppText>
          <AppText style={styles.userScreenName}>{user?.slug || '@unknown'}</AppText>
        </View>

        {/* Column 3: Rating & Button */}
        <View style={styles.ratingColumn}>
          <AppText style={styles.ratingLabel}>Rating</AppText>

          {/* Stars */}
          <View style={styles.starsRow}>
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <AppText
                  key={index}
                  style={[
                    styles.star,
                    { color: starValue <= averageRating ? '#FFD700' : '#ccc' },
                  ]}
                >
                  ★
                </AppText>
              );
            })}
          </View>

          {/* Rate Button */}
          {!isSubmitted && status === 'completed' &&
            !alreadyReviewed &&
          (
              <TouchableOpacity
                style={styles.giveRatingBtn}
                onPress={onRatePress}
              >
                <AppText style={styles.giveRatingText}>Rate this user</AppText>
              </TouchableOpacity>
            )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 20,
    marginBottom: 16,
    marginTop: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfoColumn: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userScreenName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ratingColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  star: {
    fontSize: 16,
    color: '#FFD700', // Gold for selected
    marginHorizontal: 1,
  },
  giveRatingBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  giveRatingText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default UserCard;
