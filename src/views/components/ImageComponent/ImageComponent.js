import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from '@d11/react-native-fast-image';

function ImageComponent({ source, style, height, width, resizeMode = FastImage.resizeMode.cover }) {
  return (
    <View style={styles.container}>
      <FastImage
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
