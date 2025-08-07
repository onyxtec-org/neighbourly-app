import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

function ImageComponent({src,imageStyles,height,width}) {
  return (
    <View style={styles.container}>
      <Image source={src} style={imageStyles} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ImageComponent;
