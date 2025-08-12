import React from 'react';
import { View, StyleSheet ,Text} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

function MyServicesScreen(props) {
    const { myServices } = useSelector(state => state.services);

  return (
<View style={styles.card}>
          <Text style={styles.cardTitle}>My Services</Text>
          {myServices && myServices.length > 0 ? (
            myServices.map((service, index) => (
              <View key={index}>
                <View style={styles.infoRow}>
                  <Icon name="construct-outline" size={20} color="#888" />
                  <View style={styles.textContainer}>
                    <Text style={styles.value}>
                      {service.name || 'Unnamed Service'}
                    </Text>
                  </View>
                </View>
                {index < myServices.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))
          ) : (
            <View style={styles.infoRow}>
              <Icon name="alert-circle-outline" size={20} color="#888" />
              <View style={styles.textContainer}>
                <Text style={styles.value}>No services found</Text>
              </View>
            </View>
          )}
        </View>  );
}

const styles = StyleSheet.create({
  container: {},
    textContainer: {
    marginLeft: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
    value: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
    divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 35,
  },
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

export default MyServicesScreen;