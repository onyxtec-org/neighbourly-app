import React from 'react';
import { View, StyleSheet,Image } from 'react-native';
////import FastImage from '@d11/react-native-fast-image';

function ImageComponent({ source, style, height, width, resizeMode = 'cover' }) {
  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={[
          { height: height || 50, width: width || 50 },
          style
        ]}
        resizeMode={resizeMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ImageComponent;
