
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
// Update these import paths as needed for your project structure
import AppText from '../AppText';
import PostMediaGrid from '../Mediapicker/PostMediaGrid';
import Icon from '../ImageComponent/IconComponent';
const PostCard = ({
  item,
  expanded,
  isLiked,
  userAvatar,
  colors,
  navigation,
  timeAgo,
  setExpandedPostId,
  liking,
  handleLikeToggle,
  config,
}) => (
  <View style={styles.card}>
    {/* User Info */}
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('AccountScreen', { userId: item.user.id })
      }
    >
      <View style={styles.postHeader}>
        {/* LEFT SIDE: Avatar + Name + Time */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <View style={{ marginLeft: 10 }}>
            <AppText style={styles.userName}>{item.user?.name}</AppText>
            <AppText style={styles.time}>{timeAgo(item.created_at)}</AppText>
          </View>
        </View>
        {/* RIGHT SIDE: Options Icon */}
        <Icon name="ellipsis-horizontal" size={20} color="#666" />
      </View>
    </TouchableOpacity>

    {/* Post Content */}
    <View style={styles.descriptionContainer}>
      <AppText style={styles.description}>
        {expanded
          ? item.content || ''
          : (item.content || '').substring(0, 100) +
            ((item.content?.length || 0) > 100 ? '...' : '')}
      </AppText>
      {item.content && item.content.length > 100 && (
        <TouchableOpacity
          onPress={() => setExpandedPostId(expanded ? null : item.id)}
        >
          <AppText style={styles.seeMore}>
            {expanded ? 'See less' : 'See more'}
          </AppText>
        </TouchableOpacity>
      )}
    </View>

    {/* Post Image */}
    {item.attachments?.length > 0 && (
      <PostMediaGrid
        attachments={item.attachments.map(
          a => `${config.postAttachmentImageURL}${a.attachment}`,
        )}
        onPressImage={index => {
          // 🔥 later you can open full-screen viewer here
          console.log('Open image at index:', index);
        }}
      />
    )}

    {/* Divider */}
    <View style={styles.divider} />

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
          color={isLiked ? (colors?.primary ?? '#1877f2') : '#666'}
        />
        <AppText style={styles.actionText}>
          {item.likes?.length || 0} Like
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Icon name="chatbubble-outline" size={20} color="#666" />
        <AppText style={styles.actionText}>Comment</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Icon name="arrow-redo-outline" size={20} color="#666" />
        <AppText style={styles.actionText}>Share</AppText>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 0,
    padding: 18,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  seeMore: {
    color: '#1877f2',
    fontWeight: 'bold',
    marginTop: 4,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
});

export default PostCard;
