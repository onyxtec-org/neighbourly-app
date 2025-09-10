import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../AppText';
import ReviewCard from './ReviewCard';
import Seperator from '../Seperator';

const ReviewsList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  return (
    <View style={styles.card}>
      <AppText style={styles.cardTitle}>
        Reviews ({reviews.length})
      </AppText>

      {reviews
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((review, index) => (
          <View key={index}>
            <ReviewCard review={review} />
            {index < reviews.length - 1 && (
              <View style={{ marginVertical: 10 }}>
                <Seperator color="#f0f0f0" />
              </View>
            )}
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
});

export default ReviewsList;
