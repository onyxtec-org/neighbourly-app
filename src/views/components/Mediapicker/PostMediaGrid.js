
import React, { useRef, useState } from 'react';
  import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
  } from 'react-native';

  const { width, height } = Dimensions.get('window');
  const IMAGE_HEIGHT = 250;
  const PostMediaGrid = ({ attachments = [], onPressImage }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
  
    if (!attachments || attachments.length === 0) return null;
  
    const handleScroll = e => {
      const index = Math.round(e.nativeEvent.contentOffset.x / width);
      setActiveIndex(index);
    };
  
    return (
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={attachments}
          keyExtractor={(_, i) => i.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onPressImage?.(index)}
              style={{
                width, // ✅ make each item full screen
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          )}
        />
  
        {attachments.length > 1 && (
          <View style={styles.dotsContainer}>
            {attachments.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };
  

  const styles = StyleSheet.create({
    container: {
      marginTop: 8,
    },
    imageWrapper: {
      width: width, // ✅ match FlatList item width
      height: height * 0.5,
      backgroundColor: '#e0e0e0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#ccc',
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: '#1877f2',
      width: 8,
      height: 8,
    },
  });

  export default PostMediaGrid;
