import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '../ImageComponent/IconComponent';
import AppText from '../AppText';

function InfoItems({icon,title,text}) {
  return (
   <View style={styles.infoRow}>
      <Icon name={icon} size={20} color="#888" />
      <View style={styles.textContainer}>
       {title && <AppText style={styles.label}>{title}</AppText>}
        <AppText style={styles.value}>{text}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  textContainer: {
    marginLeft: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
});

export default InfoItems;