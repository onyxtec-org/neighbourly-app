import React from 'react';
import { View, StyleSheet, Image, Text,FlatList } from 'react-native';
import JobCard from './JobCard';
import NoRecordFound from '../NoRecordFound';

function JobListings({ data ,emptyMessage}) {
  const renderItem = ({ item }) => <JobCard item={item} />;
  const ListEmptyComponent = () => {
    return (
      <View>
       <NoRecordFound message={emptyMessage}/>
      </View>
    );
  };
  return (
    <View style={styles.container}>

      <FlatList
      
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noTasksIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    tintColor: '#a0a0a0',
  },
  noTasksTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noTasksDescription: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default JobListings;
