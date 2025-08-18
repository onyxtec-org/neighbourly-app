import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const OfferCard = ({ offer, onAccept, onReject }) => {
  return (
    <View style={styles.card}>
      {/* Left: Offer Details */}
      <View style={{ flex: 1 }}>
        {/* Static consumer name */}
        <Text style={styles.consumerName}>{offer.provider?.name || 'Consumer Name'}</Text>

        {/* Dynamic Offer Details */}
        <Text style={styles.detail}>Rate: ${offer.rate}</Text>
        <Text style={styles.detail}>No. of Hours: {offer.no_of_hours}</Text>
        <Text style={styles.detail}>Status: {offer.status}</Text>
      </View>

      {/* Right: Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => onReject(offer.id)}>
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => onAccept(offer.id)}>
          <Text style={styles.acceptText}>Accept</Text>
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
    alignItems: 'center',
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
