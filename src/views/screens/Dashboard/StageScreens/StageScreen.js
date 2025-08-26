import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from '../../../components/ImageComponent/IconComponent';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../../config/colors';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, unlikePost , getPosts } from '../../../../redux/slices/stageSlice/postSlice';
import timeAgo from './../../../../utils/timeago'; // utility to format time
import config from '../../../../config'; // ✅ baseURL here
import PostMediaGrid from '../../../components/Mediapicker/PostMediaGrid'; // ✅ reusable media grid component
import AppText from '../../../components/AppText';
const StageScreen = ({ navigation }) => {
  const { user: profileUser } = useSelector(state => state.profile);
  const userRole = profileUser?.role;
  const [expandedPostId, setExpandedPostId] = useState(null); // expand/collapse per post
  const { posts, loading, error } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const [liking, setLiking] = useState({});
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);
  const handleLikeToggle = async post => {
    if (liking[post.id]) return; // already processing
    setLiking(prev => ({ ...prev, [post.id]: true }));

    const alreadyLiked = post.likes?.some(l => l.user_id === profileUser?.id);
    try {
      if (alreadyLiked) {
        await dispatch(unlikePost(post.id));
      } else {
        await dispatch(likePost(post.id));
      }
    } finally {
      setLiking(prev => ({ ...prev, [post.id]: false }));
    }
  };
  const renderPost = ({ item }) => {
    const expanded = expandedPostId === item.id;
    const isLiked = item.likes?.some(l => l.user_id === profileUser?.id);
    const userAvatar = item.user?.image
      ? `${config.userimageURL}${item.user.image}`
      : 'https://ui-avatars.com/api/?name=' + item.user?.name; // fallback avatar

    return (
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
              color={isLiked ? colors.primary : '#666'}
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
  };

  if (loading) {
    return (
      <FlatList
        data={[1, 2, 3, 4]} // fake placeholders
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => <ShimmerCard />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppText style={{ color: 'red' }}>{error}</AppText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Stage Feed</AppText>
      </View>

      {/* Post List */}
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Action Button */}
      {userRole === 'provider' && (
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateStage')}
      >
        <Icon name="create-outline" size={28} color="#fff" />
      </TouchableOpacity>
       )} 
    </View>
  );
};

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
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary ?? '#1877f2',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default StageScreen;

const ShimmerCard = () => {
  return (
    <View style={stylesshimmer.card}>
      {/* User info shimmer */}
      <View style={stylesshimmer.userInfoRow}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={stylesshimmer.avatar}
        />
        <View style={stylesshimmer.userInfoText}>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={stylesshimmer.userName}
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={stylesshimmer.userSubText}
          />
        </View>
      </View>

      {/* Post content shimmer */}
      <View style={styles.postContent}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={stylesshimmer.postLineFull}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={stylesshimmer.postLineShort}
        />
      </View>

      {/* Post image shimmer */}
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={stylesshimmer.postImage}
      />

      {/* Actions shimmer */}
      <View style={stylesshimmer.actionsRow}>
        {[1, 2, 3].map(i => (
          <ShimmerPlaceholder
            key={i}
            LinearGradient={LinearGradient}
            style={stylesshimmer.actionButton}
          />
        ))}
      </View>
    </View>
  );
};
const stylesshimmer = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfoText: {
    marginLeft: 10,
  },
  userName: {
    width: 120,
    height: 12,
    borderRadius: 6,
    marginBottom: 6,
  },
  userSubText: {
    width: 80,
    height: 10,
    borderRadius: 5,
  },
  postContent: {
    marginVertical: 12,
  },
  postLineFull: {
    width: '100%',
    height: 14,
    borderRadius: 7,
    marginBottom: 6,
  },
  postLineShort: {
    width: '80%',
    height: 14,
    borderRadius: 7,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  actionButton: {
    width: 60,
    height: 20,
    borderRadius: 6,
  },
});
