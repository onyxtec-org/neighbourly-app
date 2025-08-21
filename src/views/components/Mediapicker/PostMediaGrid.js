// export default PostMediaGrid;

import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PostMediaGrid = ({ attachments = [], onPressImage }) => {
  if (!attachments || attachments.length === 0) return null;

  const displayImages = attachments.slice(0, 4); // only first 4 displayed
  const extraCount = attachments.length - 4;

  return (
    <View style={styles.container}>
      {attachments.length === 1 && (
        <TouchableOpacity
          style={styles.singleWrapper}
          onPress={() => onPressImage?.(0)}
          activeOpacity={0.9}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: attachments[0] }}
              style={styles.singleImage}
              resizeMode="contain" // ✅ keep proportions
            />
          </View>
        </TouchableOpacity>
      )}

      {attachments.length === 2 && (
        <View style={styles.row}>
          {attachments.map((att, index) => (
            <TouchableOpacity
              key={index}
              style={styles.halfWrapper}
              onPress={() => onPressImage?.(index)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: att }}
                style={styles.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {attachments.length === 3 && (
        <View>
          <TouchableOpacity
            style={styles.fullWidthWrapper}
            onPress={() => onPressImage?.(0)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: attachments[0] }}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.row}>
            {attachments.slice(1).map((att, index) => (
              <TouchableOpacity
                key={index + 1}
                style={styles.threehalfWrapper}
                onPress={() => onPressImage?.(index + 1)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: att }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {attachments.length === 4 && (
        <View style={styles.grid2x2}>
          {attachments.map((att, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quarterWrapper}
              onPress={() => onPressImage?.(index)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: att }}
                style={styles.image}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {attachments.length > 4 && (
        <View style={styles.grid2x2}>
          {displayImages.map((att, index) => {
            const isLast = index === 3;
            return (
              <TouchableOpacity
                key={index}
                style={styles.quarterWrapper}
                onPress={() => onPressImage?.(index)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: att }}
                  style={styles.image}
                  resizeMode="contain"
                />
                {isLast && (
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>+{extraCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000', // so images with transparent background look clean
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  imageWrapper: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0', // ✅ gray instead of black
    justifyContent: 'center',
    alignItems: 'center',
  },
  singleWrapper: {
    width: '100%',
    // height: 300, // ✅ full width, fixed height (keeps proportion with contain)
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },
  halfWrapper: {
    flex: 1,
    height: 180,
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  threehalfWrapper: {
    flex: 1,
    height: 120,
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  fullWidthWrapper: {
    width: '100%',
    height: 200,
    borderBottomWidth: 0.5,
    borderColor: '#fff',
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quarterWrapper: {
    width: '50%',
    height: 150,
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default PostMediaGrid;
