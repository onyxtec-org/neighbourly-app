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
  ActivityIndicator,
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
const { width } = Dimensions.get('window');
const CARD_HEIGHT = 250;

const JobDetailsScreen = ({ navigation, route }) => {
  const { jobId , role} = route.params;
  console.log('role', role);
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
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
  const onScrollEnd = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
    setPlayingIndex(null);
  };

  const scrollPrev = () => {
    if (activeIndex > 0) {
      flatListRef.current.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
    }
  };

  const scrollNext = () => {
    if (activeIndex < job.attachments.length - 1) {
      flatListRef.current.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  };

  const onLoadStart = index => {
    setLoadingStates(prev => ({ ...prev, [index]: true }));
  };

  const onLoadEnd = index => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
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

        <View style={styles.mediaCard}>
          <FlatList
            data={job?.attachments || []}
            ref={flatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollEnd}
            keyExtractor={(item, index) => index.toString()}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            renderItem={({ item, index }) => {
              if (!item || !item.attachment || !item.file_type) return null;

              const url = `${config.attachmentimageURL}${item.attachment}`;
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
                          source={{ uri: url + '?thumbnail' }} // your thumbnail url here
                          style={styles.carouselImage}
                          resizeMode="cover"
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

              // For images:
              return (
                <View style={styles.mediaContainer}>
                  <Image
                    source={{ uri: url }}
                    style={styles.carouselImage}
                    resizeMode="cover"
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
                </View>
              );
            }}
          />

          {/* Pagination Dots */}
          {job.attachments.length > 1 && (
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
          )}

          {/* Left/Right Arrows */}
          {job.attachments.length > 1 && (
            <>
              <TouchableOpacity
                onPress={scrollPrev}
                style={[styles.arrowButton, styles.arrowLeft]}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back-outline" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={scrollNext}
                style={[styles.arrowButton, styles.arrowRight]}
                activeOpacity={0.7}
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
        {/* Just show job title without “Title” label */}
        <Text style={styles.jobTitle}>{job.title}</Text>

        {/* Divider line for separation */}
        <View style={styles.divider} />

        {/* Description section heading */}
        <Text style={styles.sectionHeading}>Description</Text>

        {/* Description text */}
        <Text style={styles.jobDescription}>{job.description}</Text>
        {/* Main Details Card (Start Date, Estimated Time, Payment Type, Location, Price, Buttons) */}
        <View style={styles.mainDetailsCard}>
          {/* Start Date */}
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
                <Text style={styles.infoLabel}>Price Type</Text>
                <Text style={styles.infoText}>
                  {job.price_type === 'perhour' ? 'Per hour' : job.price_type}
                </Text>
              </View>
            </View>

            {job.price_type === 'fixed' ? (
              <View style={styles.infoItem}>
                <Ionicons name="wallet-outline" size={18} color="#666" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Amount</Text>
                  <Text style={styles.infoText}>${parseFloat(job.rate)}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.pricingContainer}>
                <Text style={styles.priceText}>
                  ${job.rate}
                  <Text style={styles.perText}> / hr</Text>
                </Text>
                <Text style={styles.estimatedTotal}>
                  Estimated Total: $
                  {(parseFloat(job.rate) * parseFloat(job.no_of_hours)).toFixed(
                    2,
                  )}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.rowWrapper}>
            <View style={styles.infoItem}>
              <Ionicons name="wallet-outline" size={18} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Payment Type</Text>
                <Text style={styles.infoText}>{job.payment_type}</Text>
              </View>
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
        <View style={styles.mainDetailsCard}>
          <View>
            <Text style={styles.sectionHeading}>Consumer</Text>
          </View>
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
    backgroundColor: '#ffffff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    elevation: 2,
    shadowColor: '#000',
  },
  backButton: {
    width: 30,
  },
  headerTitle: {
    fontSize: 18,
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
    paddingBottom: 20,
  },
  mainDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 15,
    padding: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 15,
  },
  infoGrid: {
    marginBottom: 15,
    paddingBottom: 10,
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
    marginBottom: 8,
    flexShrink: 1,
  },
  infoItemFullWidth: {
    width: '100%',
    marginBottom: 10,
  },
  infoTextContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  pricingContainer: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  perText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: 'normal',
  },
  estimatedTotal: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
    fontWeight: '500',
  },
  textButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#3498db',
    borderWidth: 1,
    marginTop: 10,
  },
  chatButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#3498db',
    borderWidth: 1,
    marginTop: 10,
    marginRight: 10,
  },
  textButtonText: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 15,
  },
  textButtonRow: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
    gap: 50,
  },
  filledButton: {
    backgroundColor: '#3498db',
  },
  filledButtonText: {
    color: '#fff',
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
    backgroundColor: '#ccc',
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

  jobTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2c3e50',
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 8,
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: '400',
    color: '#7f8c8d', // lighter grey for subtle heading
    marginHorizontal: 15,
    marginBottom: 6,
    textTransform: 'uppercase', // subtle uppercase for professional look
    letterSpacing: 1,
  },

  jobDescription: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginHorizontal: 15,
    marginBottom: 20,
    textAlign: 'justify',
  },

  divider: {
    height: 1,
    backgroundColor: '#ecf0f1', // light grey divider
    marginHorizontal: 15,
    marginBottom: 10,
  },

  mediaCard: {
    width: width,
    height: CARD_HEIGHT,
    backgroundColor: '#000',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    marginTop: 8,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  mediaContainer: {
    width: width,
    height: CARD_HEIGHT,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  carouselImage: {
    width: width,
    height: CARD_HEIGHT,
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
    zIndex: 2,
  },
  paginationDotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -15,
    zIndex: 3,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#85c1e9',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#3498db',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    padding: 2,
    backgroundColor: '#3498db',
    zIndex: 10,
  },
  arrowLeft: {
    left: 10,
    color: '#3498db',
    transform: [{ translateY: -15 }],
  },
  arrowRight: {
    right: 10,
    color: '#3498db',
    transform: [{ translateY: -15 }],
  },
});

export default JobDetailsScreen;
