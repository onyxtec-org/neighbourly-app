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
import AppText from '../../../components/AppText';
import PostCard from '../../../components/StageComponents/PostCard';
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
    : 'https://ui-avatars.com/api/?name=' + item.user?.name;

  return (
    <PostCard
      item={item}
      expanded={expanded}
      isLiked={isLiked}
      userAvatar={userAvatar}
      colors={colors}
      navigation={navigation}
      timeAgo={timeAgo}
      setExpandedPostId={setExpandedPostId}
      liking={liking}
      handleLikeToggle={handleLikeToggle}
      config={config}
    />
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
