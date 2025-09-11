import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from '../../../components/AppText';
import PostCard from '../../../components/StageComponents/PostCard';
import colors from '../../../../config/colors';
import config from '../../../../config';
import { likePost, unlikePost, addComment, deleteComment } from '../../../../redux/slices/stageSlice/postSlice';
import HeaderWithContainer from '../../../components/HeaderComponent/HeaderWithContainer';
import { generateBranchLink } from '../../../../utils/branchUtils';
import ShareBottomSheet from '../../../components/ShareBottomSheet';
import { SafeAreaView } from 'react-native-safe-area-context';

const PostDetailsScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const { user: profileUser } = useSelector(state => state.profile);
  const dispatch = useDispatch();

  const [liking, setLiking] = useState({});
  const [branchLink, setBranchLink] = useState('');
  const [isShareSheetVisible, setIsShareSheetVisible] = useState(false);

  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []); // ✅ local state

  const handleLikeToggle = async post => {
    if (liking[post.id]) return;
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

  const handleSharePost = async post => {
    try {
      const url = await generateBranchLink({
        id: post.id,
        type: 'post',
        title: `${post.user?.name}'s Post on Neighbourly`,
        description: post.content || 'Check out this post on Neighbourly!',
      });
      setBranchLink(url);
      setIsShareSheetVisible(true);
    } catch (error) {
      console.error('Error generating Branch link for post:', error);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    dispatch(addComment({ postId: post.id, comment: newComment }));

    const tempComment = {
      id: Date.now(),
      comment: newComment,
      user: profileUser,
      user_id: profileUser?.id,
    };
    setComments(prev => [tempComment, ...prev]);
    setNewComment('');
  };

  const handleDeleteComment = async commentId => {
    try {
      await dispatch(deleteComment({ postId: post.id, commentId }));
      setComments(prev => prev.filter(c => c.id !== commentId));
      console.log('✅ Comment deleted successfully:', commentId);
      // Alert.alert('Success', 'Comment deleted successfully!');
    } catch (error) {
      console.error('❌ Failed to delete comment:', error);
      // Alert.alert('Error', 'Failed to delete comment. Please try again.');
    }
  };

  const confirmDelete = (commentId) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteComment(commentId) },
      ]
    );
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Image
        source={{
          uri: item.user?.image
            ? `${config.userimageURL}${item.user.image}`
            : 'https://ui-avatars.com/api/?name=' + item.user?.name,
        }}
        style={styles.avatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeaderContainer}>
          <AppText style={styles.commentAuthor}>{item.user?.name}</AppText>
          {item.user_id === profileUser?.id && (
            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
              <Ionicons name="ellipsis-vertical" size={18} color={colors.dark} />
            </TouchableOpacity>
          )}
        </View>
        <AppText style={styles.commentText}>{item.comment}</AppText>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithContainer
        title="Post Details"
        backButtonBoxColor={colors.white}
        borderColor={colors.primary}
      />

      <ScrollView style={styles.content}>
        <PostCard
          item={post}
          expanded={true}
          isLiked={post.likes?.some(l => l.user_id === profileUser?.id)}
          userAvatar={
            post.user?.image
              ? `${config.userimageURL}${post.user.image}`
              : 'https://ui-avatars.com/api/?name=' + post.user?.name
          }
          colors={colors}
          navigation={navigation}
          mediaWidth={323}
          cardBackgroundColor="#f0f2f5"
          cardWidth="94%"
          setExpandedPostId={() => {}}
          liking={liking}
          handleLikeToggle={handleLikeToggle}
          handelsharePost={handleSharePost}
          config={config}
        />

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <AppText style={styles.commentHeader}>Comments</AppText>
          {comments.length === 0 ? (
            <AppText style={styles.noComment}>No comments yet</AppText>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCommentItem}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
      {!isShareSheetVisible && (
        <View style={styles.inputBar}>
          <Image
            source={{
              uri: profileUser?.image
                ? `${config.userimageURL}${profileUser.image}`
                : 'https://ui-avatars.com/api/?name=' + profileUser?.name,
            }}
            style={styles.avatar}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Write a comment..."
            placeholderTextColor="#999"
            value={newComment}
            onChangeText={setNewComment}
            multiline={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, { opacity: newComment.trim() ? 1 : 0.5 }]}
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      {/* Share BottomSheet */}
      <ShareBottomSheet
        url={branchLink}
        onClose={() => setIsShareSheetVisible(false)}
        visible={isShareSheetVisible}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1 },
  commentsSection: { marginTop: 20, paddingHorizontal: 15, paddingBottom: 20 },
  commentHeader: { fontWeight: 'bold', fontSize: 18, color: colors.dark, marginBottom: 15 },
  noComment: { fontStyle: 'italic', color: colors.medium, textAlign: 'center', marginTop: 20 },
  commentItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  avatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
  commentContent: { flex: 1, backgroundColor: '#f0f2f5', borderRadius: 15, padding: 10 },
  commentHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentAuthor: { fontWeight: 'bold', fontSize: 14, color: colors.dark },
  commentText: { fontSize: 14, marginTop: 2, color: colors.medium },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  inputField: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostDetailsScreen;
