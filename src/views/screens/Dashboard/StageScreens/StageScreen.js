import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '../../../components/HeaderComponent/AppBar';
import Icon from '../../../components/ImageComponent/IconComponent';
import colors from '../../../../config/colors';
import config from '../../../../config';
import {
  getPosts,
  likePost,
  unlikePost,
} from '../../../../redux/slices/stageSlice/postSlice';
import PostCard from '../../../components/StageComponents/PostCard';

const StageScreen = ({ navigation }) => {
  const { user: profileUser } = useSelector(state => state.profile);
  const userRole = profileUser?.role;
  const { posts } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const [leftColumn, setLeftColumn] = useState([]);
  const [rightColumn, setRightColumn] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [liking, setLiking] = useState({});

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  // Split posts into 2 columns
  useEffect(() => {
    let left = [],
      right = [];
    posts.forEach((item, index) => {
      if (index % 2 === 0) left.push(item);
      else right.push(item);
    });
    setLeftColumn(left);
    setRightColumn(right);
  }, [posts]);

  // ✅ Toggle Like
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

  const renderItem = (item, index, big = false) => {
    const firstAttachment = item.attachments?.[0]?.attachment;
    const postImage = firstAttachment
      ? `${config.postAttachmentImageURL}${firstAttachment}`
      : 'https://via.placeholder.com/300x200';

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, { height: big ? 220 : 180 }]}
        onPress={() => {
          setSelectedIndex(posts.findIndex(p => p.id === item.id));
          setModalVisible(true);
        }}
      >
        <Image source={{ uri: postImage }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBar />

      {/* Feed */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Left column */}
        <View style={styles.column}>
          {leftColumn.map((item, idx) => renderItem(item, idx, idx % 2 === 0))}
        </View>

        {/* Right column */}
        <View style={styles.column}>
          {rightColumn.map((item, idx) => renderItem(item, idx, idx % 2 !== 0))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      {userRole === 'provider' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateStage')}
        >
          <Icon name="create-outline" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* ✅ Fullscreen Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.backdrop}>
          
          <FlatList
            data={
              selectedIndex !== null
                ? [
                    posts[selectedIndex],
                    ...posts.filter((_, i) => i !== selectedIndex),
                  ]
                : posts
            }
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              
              <PostCard
                item={item}
                expanded={false}
                isLiked={item.likes?.some(l => l.user_id === profileUser?.id)}
                userAvatar={
                  item.user?.image
                    ? `${config.userimageURL}${item.user.image}`
                    : 'https://ui-avatars.com/api/?name=' + item.user?.name
                }
                colors={colors}
                navigation={navigation}
                setExpandedPostId={() => {}}
                liking={liking}
                handleLikeToggle={handleLikeToggle}
                config={config}
              />
            )}
          />

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalVisible(false)}
          >
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 6,
    paddingTop: 6,
    alignItems: 'flex-center',
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 6,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderWidth: 2,        
    borderColor: '#fff',   
    padding: 4,            
    borderRadius: 100,      
    backgroundColor: 'transparent', 
  },
  
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background.
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 85 : 60, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingBottom: 20,
  },
});

export default StageScreen;
