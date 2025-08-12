// export default CustomImageViewer;
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Dimensions, Image } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ZoomableImage = ({ uri, style, placeholderUri }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (uri) {
      Image.getSize(
        uri,
        (width, height) => setImgDimensions({ width, height }),
        (error) => {
          console.warn('Failed to get image size:', error);
          setImgDimensions({ width: 0, height: 0 });
        }
      );
    }
  }, [uri]);

  if (!uri) {
    return (
      <TouchableOpacity>
        <Image source={{ uri: placeholderUri }} style={style} />
      </TouchableOpacity>
    );
  }

  const images = [
    {
      url: uri,
      width: imgDimensions.width,
      height: imgDimensions.height,
    },
  ];

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image source={{ uri }} style={style} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <ImageViewer
          imageUrls={images}
          enableSwipeDown={true}
          onSwipeDown={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
          renderHeader={() => (
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <View style={styles.closeIconCircle}>
                <Ionicons name="close" size={24} color="white" />
              </View>
            </TouchableOpacity>
          )}
          backgroundColor="rgba(0,0,0,0.95)"
          saveToLocalByLongPress={false}
          enablePreload={true}
          renderIndicator={() => null}
          imageStyle={{ resizeMode: 'contain' }}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 5,
  },
  closeIconCircle: {
    backgroundColor: 'rgba(0,0,0,0.6)', // semi-transparent black
    borderRadius: 20,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    // optional: add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // optional: elevation for Android shadow
    elevation: 5,
  },
  
});

export default ZoomableImage;
