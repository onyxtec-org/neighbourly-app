import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import AppText from '../AppText';
import LinearGradient from 'react-native-linear-gradient'; 
import colors from '../../../config/colors';
import config from '../../../config';
import Icon from '../ImageComponent/IconComponent';
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const UserCard = ({
  user,
  onPress,
  averageRating,
  status,
  userRole,
  alreadyReviewed,
  onRatePress,
  isSubmitted,
  myReview,
}) => {
  const [expanded, setExpanded] = useState(false);

  const ratingToShow =
    status === 'completed' && myReview?.rating != null
      ? myReview.rating
      : averageRating != null
      ? averageRating
      : 0;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.userCard}>
      <View style={styles.userRow}>
        {/* Column 1: User Image */}
        <TouchableOpacity onPress={onPress}>
          <LinearGradient
                     colors={['#133FDB', '#B7004D']}
                     start={{ x: 0, y: 0 }}
                     end={{ x: 1, y: 1 }}
                     style={styles.gradientBorder}
                   >
                     <View style={styles.innerCircle}>
                     <Image
                         source={
                           user?.image
                             ? { uri: `${config.userimageURL}${user?.image}` }
                             : require('../../../assets/images/profile_icon.jpeg')
                         }
                         style={styles.userImage}
                       />
                     </View>
                   </LinearGradient>
        </TouchableOpacity>

        {/* Column 2: Name & Slug */}
        <View style={styles.userInfoColumn}>
          <AppText style={styles.userName}>
            {user?.name || 'Unknown User'}
          </AppText>
          <AppText style={styles.userScreenName}>
            {user?.slug || '@unknown'}
          </AppText>
        </View>

        {/* Column 3: Rating & Review */}
        <View style={styles.ratingColumn}>
          {!isSubmitted && status === 'completed' && !alreadyReviewed ? (
            <TouchableOpacity
              style={styles.giveRatingBtn}
              onPress={onRatePress}
            >
              <AppText style={styles.giveRatingText}>Rate this user</AppText>
            </TouchableOpacity>
          ) : (
            <View style={styles.reviewBox}>
              <AppText style={styles.ratingLabel}>
                {status === 'completed' ? 'My Rating' : 'Average Rating'}
              </AppText>

              {/* Stars */}
              <View style={styles.ratingRow}>
                <View style={styles.starsRow}>
                  {[...Array(5)].map((_, index) => (
                    <Icon
                      key={index}
                      name={index < ratingToShow ? 'star' : 'star-outline'}
                      size={14}
                      color={colors.starColor}
                      style={styles.starIcon}
                    />
                  ))}
                </View>

                <AppText style={styles.ratingValue}>
                  {Number(ratingToShow).toFixed(1)}
                </AppText>
              </View>

              {/* Review Comment with "See More" */}
              {status === 'completed' && myReview?.comment && (
                <View>
                  <AppText
                    style={styles.reviewComment}
                    numberOfLines={expanded ? 0 : 2}
                  >
                    {myReview.comment}
                  </AppText>
                  {myReview.comment.length > 60 && (
                    <TouchableOpacity onPress={toggleExpand}>
                      <AppText style={styles.seeMoreText}>
                        {expanded ? 'See Less' : 'See More'}
                      </AppText>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
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
    marginVertical: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
  },
  userImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    flexShrink: 1,
    maxWidth: 160,
    alignItems: 'flex-end',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },

  star: {
    fontSize: 16,
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
  reviewComment: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
  seeMoreText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
ratingRow: {
  flexDirection: 'row',
  alignItems: 'center',     // centers icon row + text vertically
},

starsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 6,           // space between stars and number
  // remove any marginBottom here
},

starIcon: {
  marginHorizontal: 1,
},

ratingValue: {
  fontSize: 12,  // slightly smaller than star size
  lineHeight: 14,    // match the star height for baseline alignment
  includeFontPadding: false, // Android: removes extra top padding
  textAlignVertical: 'center',
  color: '#555',
},
gradientBorder: {
  width: 52,
  height: 52,
  borderRadius: 27,
  justifyContent: 'center',
  alignItems: 'center',
},
innerCircle: {
  width: 48, // slightly smaller to create spacing
  height: 48,
  borderRadius: 24,
  backgroundColor: 'white', // space color
  justifyContent: 'center',
  alignItems: 'center',
},
});

export default UserCard;
