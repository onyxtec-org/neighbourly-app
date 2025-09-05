// DashboardGrid.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomContainer from './CustomContainer';

function DashboardGrid({ items }) {
  return (
    <View style={styles.grid}>
      {items.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((item, colIndex) => (
            <CustomContainer
              key={colIndex}
              title={item.title}
              backgroundColor={item.backgroundColor}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default DashboardGrid;
