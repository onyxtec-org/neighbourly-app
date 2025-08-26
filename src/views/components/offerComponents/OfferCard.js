import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from './../AppText';
import { formatStatusText } from '../../../utils/stringHelpers';

const OfferCard = ({ offer, onAccept, onReject }) => {
  const provider = offer.provider || {};
  
  return (
    <View style={styles.card}>
      {/* Left: Offer Details */}
      <View style={{ flex: 1 }}>
        {/* Provider Name */}
        <AppText style={styles.consumerName}>
          {provider.name || 'Provider Name'}
        </AppText>

        {/* Dynamic Offer Details */}
        <AppText style={styles.detail}>Rate: ${offer.rate}</AppText>
        <AppText style={styles.detail}>No. of Hours: {offer.no_of_hours}</AppText>
        <AppText style={styles.detail}>Status: {formatStatusText(offer.status)}</AppText>

        {/* Completed Jobs Info */}
        <AppText  style={styles.detail}>
          Jobs Completed for This Service: {provider.completed_jobs_by_service_count ?? 0}
        </AppText>
        <AppText  style={styles.detail}>
          Total Jobs Completed: {provider.completed_jobs_count ?? 0}
        </AppText>
      </View>

      {/* Right: Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => onReject(offer.id)}
        >
          <AppText style={styles.rejectText}>Reject</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => onAccept(offer.id)}
        >
          <AppText style={styles.acceptText}>Accept</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  consumerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  completedJobs: {
    fontSize: 13,
    marginTop: 4,
    color: '#007bff', // blue for emphasis
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 6,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#ff4d4d',
  },
  acceptButton: {
    backgroundColor: '#4caf50',
  },
  rejectText: {
    color: '#fff',
    fontSize: 14,
  },
  acceptText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default OfferCard;
