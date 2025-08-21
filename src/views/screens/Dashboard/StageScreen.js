import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../../config/colors';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../../../redux/slices/postSlice';
import { likePost, unlikePost } from '../../../redux/slices/postSlice';
import config from '../../../config'; // ✅ baseURL here
import PostMediaGrid from '../../components/Mediapicker/PostMediaGrid'; // ✅ reusable media grid component

const StageScreen = ({ navigation }) => {
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

    const alreadyLiked = post.likes?.some(l => l.user_id === 'me');
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

    const userAvatar = item.user?.image
      ? `${config.userimageURL}${item.user.image}`
      : 'https://ui-avatars.com/api/?name=' + item.user?.name; // fallback avatar


    return (
      <View style={styles.card}>
        {/* User Info */}
        <View style={styles.postHeader}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.userName}>{item.user?.name}</Text>
            <Text style={styles.time}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
          <Icon
            name="ellipsis-horizontal"
            size={20}
            color="#666"
            style={{ marginLeft: 'auto' }}
          />
        </View>

        {/* Post Content */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            {expanded
              ? item.content || ''
              : (item.content || '').substring(0, 100) +
                ((item.content?.length || 0) > 100 ? '...' : '')}
          </Text>
          {item.content && item.content.length > 100 && (
            <TouchableOpacity
              onPress={() => setExpandedPostId(expanded ? null : item.id)}
            >
              <Text style={styles.seeMore}>
                {expanded ? 'See less' : 'See more'}
              </Text>
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
            disabled={liking[item.id]} // disable while processing
            onPress={() => handleLikeToggle(item)}
          >
            <Icon
              name={
                item.likes?.some(l => l.user_id === 'me')
                  ? 'thumbs-up'
                  : 'thumbs-up-outline'
              }
              size={20}
              color={
                item.likes?.some(l => l.user_id === 'me')
                  ? colors.primary
                  : '#666'
              }
            />
            <Text style={styles.actionText}>
              {item.likes?.length || 0} Like
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chatbubble-outline" size={20} color="#666" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="arrow-redo-outline" size={20} color="#666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary ?? '#1877f2'} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stage Feed</Text>
      </View>

      {/* Post List */}
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateStage')}
      >
        <Icon name="create-outline" size={28} color="#fff" />
      </TouchableOpacity>
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
