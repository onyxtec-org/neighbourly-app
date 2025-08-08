import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchJobDetails,
  clearJobDetails,
} from '../../redux/slices/jobDetailSlice';
import Video from 'react-native-video';
import config from '../../config';
import colors from '../../config/colors';
import CreateOfferPopup from '../screens/CreateOfferPopup';
const { width } = Dimensions.get('window'); // Get screen width for responsive images

const JobDetailsScreen = ({ navigation, route }) => {
  const { jobId } = route.params;
  const role = 'provider';
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();
  const { job, loading, error } = useSelector(state => state.jobDetail);
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    dispatch(fetchJobDetails(jobId));

    return () => {
      dispatch(clearJobDetails());
    };
  }, [dispatch, jobId]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (!job) return <Text>No job data found.</Text>;
  // Function to scroll to the next image in the carousel
  const scrollNext = () => {
    const nextIndex = (activeIndex + 1) % job.attachments.length;
    flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
    setActiveIndex(nextIndex);
  };

  // Function to scroll to the previous image in the carousel
  const scrollPrev = () => {
    const prevIndex =
      (activeIndex - 1 + job.attachments.length) % job.attachments.length;
    flatListRef.current.scrollToIndex({ animated: true, index: prevIndex });
    setActiveIndex(prevIndex);
  };

  // Update active index when the user scrolls the FlatList
  const onScrollEnd = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveIndex(currentIndex);
  };
  console.log('Job Attachments:', job.attachments);
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Job Details</Text>

        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => console.log('Bookmark pressed')}>
            <Ionicons
              name="bookmark-outline"
              size={22}
              color="#333"
              style={styles.iconSpacing}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Share pressed')}>
            <Ionicons name="share-social-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Job Title (Above Image Carousel) */}

        <View style={styles.mediaContainer}>
          <FlatList
            data={job?.attachments || []}
            ref={flatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollEnd}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              if (!item || !item.attachment || !item.file_type) {
                return null; // Skip if invalid
              }

              const url = `${config.attachmentimageURL}${item.attachment}`;
              console.log('Attachment URL:', url);

              const isVideo = item.file_type.includes('video');

              return isVideo ? (
                <Video
                  source={{ uri: url }}
                  style={styles.carouselImage}
                  resizeMode="cover"
                  controls
                />
              ) : (
                <Image
                  source={{ uri: url }}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              );
            }}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />

          {job.attachments.length > 1 && (
            <>
              {/* Pagination Dots */}
              <View style={styles.paginationDotsContainer}>
                {job.attachments.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      activeIndex === index && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
              {/* Navigation Arrows */}
              <TouchableOpacity
                onPress={scrollPrev}
                style={[styles.arrowButton, styles.arrowLeft]}
              >
                <Ionicons name="chevron-back-outline" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={scrollNext}
                style={[styles.arrowButton, styles.arrowRight]}
              >
                <Ionicons
                  name="chevron-forward-outline"
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>
            </>
          )}
        </View>
        <Text
          style={styles.jobTitle}
          numberOfLines={1} // Restrict to a single line
          ellipsizeMode="tail" // Add "..." at the end if truncated
        >
          {job.title}
        </Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.sectionHeading}>Job Description</Text>
          <Text style={styles.jobDescription}>{job.description}</Text>
        </View>

        
        {/* Main Details Card (Start Date, Estimated Time, Payment Type, Location, Price, Buttons) */}
        <View style={styles.mainDetailsCard}>
          {/* Start Date */}
          <View style={styles.userRow}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AccountScreen', {
                  userId: job.consumer?.id,
                })
              }
              style={styles.userInfoTouchable}
            >
              <Image
                source={{
                  uri: `${config.userimageURL}${job.consumer?.image}`,
                }}
                style={styles.userImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {job.consumer?.name || 'Unknown User'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.chatButton}>
              <Text style={styles.textButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowWrapper}>
            <View style={[styles.infoItem]}>
              <Ionicons name="calendar-outline" size={18} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Start Date</Text>
                <Text style={styles.infoText}>
                  {job.starts_at.substring(0, 10)}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="hourglass-outline" size={18} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Estimated Time</Text>
                <Text style={styles.infoText}>{job.no_of_hours} hrs</Text>
              </View>
            </View> 
          </View>

          {/* Estimated Time & Payment Type (Grouped) */}
          <View style={styles.rowWrapper}>
            <View style={styles.infoItem}>
              <Ionicons name="wallet-outline" size={18} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Payment Type</Text>
                <Text style={styles.infoText}>{job.payment_type}</Text>
              </View>
            </View>
            <View style={styles.pricingContainer}>
              <Text style={styles.priceText}>
                ${job.rate}
                <Text style={styles.perText}> / hr</Text>
              </Text>
              <Text style={styles.estimatedTotal}>
                Estimated Total: $
                {parseFloat(job.rate) * parseFloat(job.no_of_hours)}
              </Text>
            </View>
          </View>

          {/* Location (Separate) */}
          <View style={[styles.infoItem, styles.infoItemFullWidth]}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoText}>{job.location}</Text>
            </View>
          </View>

          {/* Action Buttons (Small, Text-Based) */}
          {role === 'consumer' ? (
            <TouchableOpacity style={styles.textButton}>
              <Text style={styles.textButtonText}>View Interested Persons</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.textButtonRow}>
              <TouchableOpacity
                style={[styles.textButton, { marginRight: 10 }]}
              >
                <Text style={styles.textButtonText}>Ignore</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowOffer(true)}
                style={[styles.textButton, styles.filledButton]}
              >
                <Text style={[styles.textButtonText, styles.filledButtonText]}>
                  Interested
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Description Section (At the very bottom) */}
      
        <CreateOfferPopup
          visible={showOffer}
          onClose={() => setShowOffer(false)}
          userJobId={job.id}
          priceType={job.price_type}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff', // Light background for the whole screen
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14, // Slightly reduced padding
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    elevation: 2,
    shadowColor: '#000',
  },
  backButton: {
    width: 30, // Ensures the title remains centered
  },
  headerTitle: {
    fontSize: 18, // Smaller header title
    fontWeight: '700',
    color: '#333',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 60,
  },

  iconSpacing: {
    marginRight: 10,
  },
  container: {
    paddingBottom: 20, // Add padding at the bottom for scroll
  },
  jobTitle: {
    fontSize: 18, // Reduced from 26
    fontWeight: 'bold',
    color: '#2c3e50',
    marginHorizontal: 15,
    marginTop: 15, // Space from header
    marginBottom: 15, // Space before image carousel
    // These two properties handle single-line truncation with ellipsis
    flexShrink: 1, // Allow text to shrink
  },
  mediaContainer: {
    width: width,
    height: width * 0.6, // Slightly shorter images for more compact look
    marginBottom: 15, // Reduced space
    position: 'relative',
    backgroundColor: '#e0e0e0',
  },
  paginationDotsContainer: {
    position: 'absolute',
    bottom: 10, // Reduced space
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 7, // Smaller dots
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 3, // Reduced space
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 9, // Slightly larger active dot
    height: 9,
    borderRadius: 4.5,
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }], // Smaller vertical adjustment
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6, // Smaller padding
    borderRadius: 20, // Smaller circular button
    width: 40, // Smaller width
    height: 40, // Smaller height
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLeft: {
    left: 8, // Reduced space
  },
  arrowRight: {
    right: 8, // Reduced space
  },
  mainDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12, // Slightly smaller border radius
    marginHorizontal: 15,
    padding: 18, // Slightly reduced padding
    elevation: 4, // Slightly less shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 15, // Reduced space before description card
  },
  infoGrid: {
    marginBottom: 15, // Space before pricing
    paddingBottom: 10, // Padding before pricing
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Reduced space between items
    flexShrink: 1, // Allows text to shrink
  },
  infoItemFullWidth: {
    width: '100%', // For items that should take full width
    marginBottom: 10,
  },
  infoTextContainer: {
    marginLeft: 10, // Reduced margin
    flexShrink: 1,
  },
  infoLabel: {
    fontSize: 12, // Smaller label font
    color: '#888',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 14, // Smaller text font
    color: '#333',
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  pricingContainer: {
    paddingVertical: 12, // Reduced padding
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 15, // Space before buttons
  },
  priceText: {
    fontSize: 18, // Reduced from 36
    fontWeight: 'bold',
    color: '#27ae60',
  },
  perText: {
    fontSize: 16, // Reduced from 18
    color: '#7f8c8d',
    fontWeight: 'normal',
  },
  estimatedTotal: {
    fontSize: 12, // Reduced from 18
    color: '#555',
    marginTop: 5, // Reduced margin
    fontWeight: '500',
  },
  textButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8, // Slightly less rounded
    alignItems: 'center',
    borderColor: '#3498db', // Blue border for primary action
    borderWidth: 1,
    marginTop: 10, // Space from pricing
  },
  chatButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8, // Slightly less rounded
    alignItems: 'center',
    borderColor: '#3498db', // Blue border for primary action
    borderWidth: 1,
    marginTop: 10, // Space from pricing
    marginRight: 10,
  },
  textButtonText: {
    color: '#3498db', // Blue text for primary action
    fontWeight: '600',
    fontSize: 15, // Smaller button text
  },
  textButtonRow: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center', // 👈 Keeps buttons close
    gap: 50, // 👈 adds space between buttons (if supported in your React Native version)
  },
  filledButton: {
    backgroundColor: '#3498db',
  },
  filledButtonText: {
    color: '#fff',
  },
  descriptionCard: {
    padding: 15,
  },
  sectionHeading: {
    fontSize: 18, // Reduced from 20
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8, // Reduced margin
  },
  jobDescription: {
    fontSize: 14, // Reduced from 16
    color: '#555',
    lineHeight: 22, // Adjusted line height
    textAlign: 'justify',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    justifyContent: 'space-between',
  },

  userInfoTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  userImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#ccc', // fallback color
  },

  userInfo: {
    flexShrink: 1,
  },

  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  mediaWrapper: {
    width: width,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  loaderOverlay: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderText: {
    color: '#fff',
    fontSize: 16,
  },

  carouselImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
    zIndex: 1,
  },
});

export default JobDetailsScreen;
