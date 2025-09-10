import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions, 
} from 'react-native';
import AppText from '../AppText';
import Icon from '../ImageComponent/IconComponent';
import Image from '../ImageComponent/ImageComponent';
import TruncatedText from '../TruncatedText';
import Ionicons from '../ImageComponent/IconComponent';
import Video from 'react-native-video';
import ZoomableImage from './../ImageComponent/ZoomableImage';
import { useSelector } from 'react-redux';
import colors from '../../../config/colors';
  const { height } = Dimensions.get('window');

const PostCard = ({
  item,
  expanded,
  isLiked,
  userAvatar,
  colors,
  navigation,
  liking,
  mediaWidth = 300,   
  mediaHeight = height * 0.5, 
  handleLikeToggle,
  handelsharePost,
  config,
  // 🔥 new optional props
  cardBackgroundColor = '#fff',
  cardWidth = '94%',
  cardHeight, // optional height
}) => {
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const { user: profileUser } = useSelector(state => state.profile);

  const mediaSource = item.attachments || [];
  const hasMultipleMedia = mediaSource.length > 1;

  const onLoadStart = index => {
    setLoadingStates(prev => ({ ...prev, [index]: true }));
  };

  const onLoadEnd = index => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
  };

  const onScrollEnd = e => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x /
        e.nativeEvent.layoutMeasurement.width,
    );
    setActiveIndex(index);
    setPlayingIndex(null);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBackgroundColor,
          width: cardWidth,
          ...(cardHeight ? { height: cardHeight } : {}),
        },
      ]}
    >
      {/* User Info */}
      
        <View style={styles.postHeader}>
          {/* LEFT SIDE: Avatar + Name + Time */}
          <TouchableOpacity
        onPress={() =>
          navigation.navigate('AccountScreen', { userId: item.user.id })
        }
      >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
            <View style={{ marginLeft: 10 }}>
              <AppText style={styles.userName}>{item.user?.name}</AppText>
              <AppText style={styles.time}>@{item.user?.slug}</AppText>
            </View>
          </View>
          </TouchableOpacity>
          {/* RIGHT SIDE: Options Icon */}
          <Icon name="ellipsis-horizontal" size={20} color="#666" />
        </View>
      {/* Post Content */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('PostDetails', { post: item })}
      >
        <View style={styles.descriptionContainer}>
          {expanded ? (
            <AppText style={styles.description}>{item.content || ''}</AppText>
          ) : (
            <TruncatedText text={item.content} post={item} navigation={navigation} />
          )}
        </View>
      </TouchableOpacity>

      {/* 🔥 Media Carousel */}
      {mediaSource.length > 0 && (
        <View style={styles.mediaCard}>
          <FlatList
            data={mediaSource}
            ref={flatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollEnd}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              if (!item || !item.attachment || !item.file_type) return null;

              const url = `${config.postAttachmentImageURL}${item.attachment}`;
              const isVideo = item.file_type.includes('video');
              const isPlaying = playingIndex === index;
              const isLoading = loadingStates[index];

              if (isVideo) {
                return (
                  <TouchableOpacity
                    style={styles.mediaContainer}
                    onPress={() => setPlayingIndex(index)}
                    activeOpacity={1}
                  >
                    {!isPlaying && (
                      <>
                        <Image
                          source={{ uri: url + '?thumbnail' }}
                          style={styles.carouselImage}
                          resizeMode="contain"
                          onLoadStart={() => onLoadStart(index)}
                          onLoadEnd={() => onLoadEnd(index)}
                        />
                        {isLoading && (
                          <ActivityIndicator
                            size="large"
                            color="#fff"
                            style={styles.loadingIndicator}
                          />
                        )}
                        <Ionicons
                          name="play-circle"
                          size={64}
                          color="rgba(255,255,255,0.8)"
                          style={styles.playIcon}
                        />
                      </>
                    )}

                    {isPlaying && (
                      <Video
                        source={{ uri: url }}
                        style={styles.carouselImage}
                        resizeMode="cover"
                        controls
                        paused={!isPlaying}
                        onLoadStart={() => onLoadStart(index)}
                        onLoad={() => onLoadEnd(index)}
                      />
                    )}
                    {isPlaying && isLoading && (
                      <ActivityIndicator
                        size="large"
                        color="#fff"
                        style={styles.loadingIndicator}
                      />
                    )}
                  </TouchableOpacity>
                );
              }

              // ✅ Image case with ZoomableImage
              return (
                <View style={[
                  styles.mediaContainer,
                  { width: mediaWidth, height: mediaHeight }
                ]}>
                  <ZoomableImage
                    uri={url}
                    placeholderUri="https://placehold.co/600x400/e0e0e0/000000?text=Image"
                    style={styles.carouselImage}
                  />
                  {isLoading && (
                    <ActivityIndicator
                      size="large"
                      color="#fff"
                      style={styles.loadingIndicator}
                    />
                  )}
                </View>
              );
            }}
          />

          {hasMultipleMedia && (
            <View style={styles.paginationDotsInline}>
              {mediaSource.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    activeIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          disabled={liking[item.id]}
          onPress={() => handleLikeToggle(item)}
        >
          <Icon
            name={isLiked ? 'thumbs-up' : 'thumbs-up-outline'}
            size={20}
            color={isLiked ? colors?.primary ?? '#1877f2' : '#666'}
          />
          <AppText style={styles.actionText}>{item.likes?.length || 0}</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('PostDetails', { post: item })}
        >
          <Icon name="chatbubble-outline" size={20} color="#666" />
          <AppText style={styles.actionText}>{item.comments?.length || 0}</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handelsharePost?.(item)}
        >
          <Icon name="arrow-redo-outline" size={20} color="#666" />
        </TouchableOpacity>

        {item.user?.id !== profileUser?.id && (
  <TouchableOpacity
    style={styles.actionButton}
    onPress={() =>
      navigation.navigate('JobCreateScreen', {
        serviceId: item.service,
        userId: item.user?.id,
      })
    }
  >
    <Icon name="briefcase-outline" size={20} color="#666" />
  </TouchableOpacity>
)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: '#dcdcdc',
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  descriptionContainer: {
    marginVertical: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  mediaCard: {
    marginTop: 10,
  },
  mediaContainer: {
    width: 300,
    height: height * 0.5,
    // marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.lightGray,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
  },
  paginationDotsInline: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#333',
  },
});

export default PostCard;
