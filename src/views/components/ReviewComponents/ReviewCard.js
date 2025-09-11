import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import AppText from '../AppText';
import ZoomableImage from '../ImageComponent/ZoomableImage';
import Icon from '../ImageComponent/IconComponent';
import colors from '../../../config/colors';
import config from '../../../config';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.comment && review.comment.length > 120;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  return (
    <View style={styles.reviewContainer}>
      {/* Reviewer Info */}
      <View style={styles.reviewerRow}>
        <ZoomableImage
          uri={
            review.reviewer?.image
              ? `${config.userimageURL}${review.reviewer.image}`
              : null
          }
          placeholder={require('../../../assets/images/profile_icon.jpeg')}
          style={styles.reviewerImage}
        />

        <View style={styles.nameRatingRow}>
          <AppText style={styles.reviewerName}>
            {review.reviewer?.name || 'Anonymous'}
          </AppText>
          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon
                key={i}
                name={i < review.rating ? 'star' : 'star-outline'}
                size={14}
                color={colors.starColor}
              />
            ))}
            <AppText style={styles.ratingValue}>
              {` (${review.rating.toFixed(1)})`}
            </AppText>
          </View>
        </View>
      </View>

      {/* Review Text */}
      <View style={styles.reviewWrapper}>
        <AppText
          style={styles.reviewText}
          numberOfLines={expanded ? undefined : 3}
          ellipsizeMode="tail"
        >
          {review.comment || 'No comment provided'}
        </AppText>

        {isLong && (
          <TouchableOpacity style={styles.seeMoreContainer} onPress={toggleExpand}>
            <AppText style={styles.seeMoreText}>
              {expanded ? 'See less' : 'See more'}
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewContainer: {
    marginBottom: 16,
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nameRatingRow: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 13,
    color: '#555',
    marginLeft: 4,
  },
  reviewWrapper: {
    marginTop: 4,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  seeMoreContainer: {
    marginTop: 4,
  },
  seeMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default ReviewCard;
