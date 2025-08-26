import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from './IconComponent';
import colors from '../../../config/colors';
import ImagePickerModal from './ImagePickerModal';

const CircularImagePicker = ({ size = 120, onImagePicked, defaultImageUri = null }) => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false); // 👈 loader state
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setImageUri(defaultImageUri);
  }, [defaultImageUri]);

  const handleImagePicked = asset => {
    setImageUri(asset.uri);
    onImagePicked?.(asset);
    setModalVisible(false);
  };

  const iconSize = size / 8;
  const iconContainerSize = size / 5;

  return (
    <View style={styles.container}>
      <View style={[styles.wrapper, { width: size, height: size }]}>
        <View
          style={[
            styles.imageWrapper,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          {imageUri ? (
            <>
              {loading && (
                <ActivityIndicator
                  style={StyleSheet.absoluteFill}
                  size="small"
                  color={colors.primary}
                />
              )}
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                onLoadStart={() => setLoading(true)} // 👈 start loading
                onLoadEnd={() => setLoading(false)}   // 👈 stop loading
              />
            </>
          ) : (
            <Ionicons name="person-outline" size={size / 2} color="#A0A0A0" />
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.cameraIconContainer,
            {
              width: iconContainerSize,
              height: iconContainerSize,
              borderRadius: iconContainerSize / 3,
              right: size * -0.0,
              bottom: size * 0.1,
            },
          ]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="camera" size={iconSize} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImagePicked={handleImagePicked}
      />
    </View>
  );
};

export default CircularImagePicker;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraIconContainer: {
    position: 'absolute',
    backgroundColor: colors.primary || '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
});
