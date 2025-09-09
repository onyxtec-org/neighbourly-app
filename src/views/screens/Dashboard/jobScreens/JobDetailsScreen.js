import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '../../../components/ImageComponent/IconComponent';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchJobDetails,
  clearJobDetails,
} from '../../../../redux/slices/jobSlice/jobDetailSlice';
import ZoomableImage from '../../../components/ImageComponent/ZoomableImage';
import Video from 'react-native-video';
import config from '../../../../config';
import colors from '../../../../config/colors';
import CreateOfferPopup from '../../../screens/Dashboard/jobScreens/offers/CreateOfferPopup';
import { useFocusEffect } from '@react-navigation/native';
import { updateJobStatus } from '../../../../redux/slices/jobSlice/UpdateJobStatusSlice';
import CustomToast from '../../../components/CustomToast';
import AppActivityIndicator from '../../../components/AppActivityIndicator';
import CustomPopup from '../../../components/CustomPopup';
import AppText from '../../../components/AppText';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 300;

const JobDetailsScreen = ({ navigation, route }) => {
  const { jobId, userRole, status } = route.params;
  console.log('role', userRole, status);

  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const dispatch = useDispatch();
  const { job, loading, error } = useSelector(state => state.jobDetail);
  const [showOffer, setShowOffer] = useState(false);
  const [inProgress, setInProgress] = useState(
    inProgress || job?.status === 'in_progress',
  ); // Initialize based on job status
  const [completed, setCompleted] = useState(
    completed || job?.status === 'completed',
  ); // Initialize based on job status
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchJobDetails(jobId));

      return () => {
        dispatch(clearJobDetails());
      };
    }, [dispatch, jobId]),
  );

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const statusChange = async () => {
    setIsLoading(true);
    try {
      const newStatus = status === 'my_jobs' ? 'in_progress' : 'completed';
      const res = await dispatch(
        updateJobStatus({
          jobId: jobId,
          status: newStatus,
        }),
      );

      if (res?.payload.statusCode === 200) {
        setIsLoading(false);
        if (newStatus === 'in_progress') {
          setInProgress(true);
        } else {
          setCompleted(true);
        }
        showToast(res?.payload.message, 'success');
      } else {
        setIsLoading(false);
        showToast(res?.payload.message, 'error');
      }
    } catch (error) {
      setIsLoading(false);
      showToast('something went wrong', 'success');
    }
  };

  const handlePopupOpen = action => {
    if (action === 'in_progress') {
      setPopupTitle('Mark as In Progress');
      setPopupMessage('Are you sure you want to mark this job as In Progress?');
    } else if (action === 'completed') {
      setPopupTitle('Mark as Completed');
      setPopupMessage('Are you sure you want to mark this job as Completed?');
    }
    setShowPopup(true);
  };

  const onScrollEnd = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
    setPlayingIndex(null);
  };

  const onLoadStart = index => {
    setLoadingStates(prev => ({ ...prev, [index]: true }));
  };

  const onLoadEnd = index => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
  };

  const onInterestedPersonPress = () => {
    const offers = job.offers;
    navigation.navigate('OffersScreen', { offers });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={styles.shimmerHeader}
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={styles.shimmerMedia}
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={styles.shimmerTitle}
          />
          {[1, 2, 3].map(i => (
            <ShimmerPlaceholder
              key={i}
              LinearGradient={LinearGradient}
              style={styles.shimmerLine}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
  if (error) return <AppText>Error: {error}</AppText>;
  if (!job) return <AppText>No job data found.</AppText>;

  const mediaSource = job?.attachments || [];
  const hasMultipleMedia = mediaSource.length > 1;

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.mainCard}>
          <View style={styles.mediaCard}>
            {/* Back button */}
            <View style={styles.backButtonContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
            </View>

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
                            source={{ uri: url + '?thumbnail' }}
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

                // ✅ Image case with ZoomableImage
                return (
                  <View style={styles.mediaContainer}>
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
              ListEmptyComponent={() => (
                <View style={styles.emptyMedia}>
                  <Ionicons name="image-outline" size={48} color="#999" />
                </View>
              )}
            />
          </View>

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

          <View style={styles.contentContainer}>
            {/* Title + Action Button Row */}
            <View style={styles.titleRow}>
              {/* Left: Job Title */}
              <AppText
                style={styles.jobTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {job.title}
              </AppText>

              {/* Right Side Conditional Content */}
              {userRole === 'consumer' &&
              Number(job?.offers?.length) > 0 &&
              job.accepted_offer === null ? (
                // ✅ Consumer → View Offers Button
                <TouchableOpacity
                  style={[styles.smallButton, styles.primaryButton]}
                  onPress={onInterestedPersonPress}
                >
                  <AppText style={styles.smallButtonText}>View Offers</AppText>
                </TouchableOpacity>
              ) : userRole === 'provider' &&
                (status === 'my_jobs' || status === 'in_progress') ? (
                // ✅ Provider → Mark as Progress/Complete Button
                <TouchableOpacity
                  style={[
                    styles.smallButton,
                    {
                      backgroundColor:
                        status === 'in_progress'
                          ? completed
                            ? colors.completed
                            : colors.inProgress
                          : inProgress
                          ? colors.inProgress
                          : colors.pending,
                    },
                  ]}
                  onPress={() =>
                    handlePopupOpen(
                      status === 'my_jobs' ? 'in_progress' : 'completed',
                    )
                  }
                  disabled={status === 'in_progress' ? completed : inProgress}
                >
                  <AppText style={styles.smallButtonText}>
                    {status === 'my_jobs'
                      ? inProgress
                        ? 'In Progress'
                        : 'Mark as In Progress'
                      : completed
                      ? 'Completed'
                      : 'Mark as Complete'}
                  </AppText>
                </TouchableOpacity>
              ) : (
                // ✅ NEW CASE: Provider with new / my_offer.pending_approval
                userRole === 'provider' &&
                (status === 'new' ||
                  job?.my_offer?.status === 'pending_approval') && (
                  <View style={styles.rateBox}>
                    <AppText style={styles.rateText}>
                      {job?.rate ? `$${job.rate}/` : '$0.00'}
                    </AppText>
                    <AppText style={styles.perHrText}>per hr</AppText>
                  </View>
                )
              )}
            </View>

            {/* Location Row */}
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <AppText style={styles.locationText}>{job.location}</AppText>
            </View>

            {/* Circular KM container */}
            <View style={styles.kmContainerRow}>
              <View style={styles.kmContainer}>
                <AppText style={styles.kmText}>
                  {job.distance || '0'} km
                </AppText>
              </View>

              {userRole === 'provider' &&
                (status === 'new' ||
                  job?.my_offer?.status === 'pending_approval') && (
                  <View style={styles.paymentContainer}>
                    <AppText style={styles.paymentText}>
                      {job.payment_type || 'Cash'}
                    </AppText>
                  </View>
                )}
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Description */}
            <AppText style={styles.sectionHeading}>Description</AppText>
            <AppText style={styles.jobDescription}>{job.description}</AppText>

            <View style={styles.locationRow}>
              <AppText style={styles.boldtext}>services: </AppText>
              <AppText style={styles.locationText}>{job.location}</AppText>
            </View>

            <View style={styles.locationRow}>
              <AppText style={styles.boldtext}>Start Date: </AppText>
              <AppText style={styles.locationText}>
                {job.starts_at.substring(0, 10)}
              </AppText>
            </View>

            <View style={styles.locationRow}>
              <AppText style={styles.boldtext}>End Date: </AppText>
              <AppText style={styles.locationText}>
                {job.ends_at.substring(0, 10)}
              </AppText>
            </View>

            <View style={styles.locationRow}>
              <AppText style={styles.boldtext}>Estimated Time: </AppText>
              <AppText
                style={styles.locationText}
              >{`${job.no_of_hours} hrs`}</AppText>
            </View>

            <View style={styles.locationRow}>
              <AppText style={styles.boldtext}>Price Type: </AppText>
              <AppText style={styles.locationText}>
                {job.price_type === 'per_hour' ? 'Per hour' : job.price_type}
              </AppText>
            </View>

            {/* User Details Card */}
            {userRole === 'provider' ? (
              // === Show Consumer Card ===
              <View style={styles.userCard}>
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
                        uri: job.consumer?.image
                          ? `${config.userimageURL}${job.consumer?.image}`
                          : 'https://via.placeholder.com/150',
                      }}
                      style={styles.userImage}
                    />
                    <View style={styles.userInfo}>
                      {/* Row for Username + Rating text */}
                      <View style={styles.rowInline}>
                        <AppText style={styles.userName}>
                          {job.consumer?.name || 'Unknown User'}
                        </AppText>
                        <AppText style={styles.ratingLabel}> Rating</AppText>
                      </View>

                      {/* Row for ScreenName + Stars */}
                      <View style={styles.rowInline}>
                        <AppText style={styles.userScreenName}>
                          {job.consumer?.screenName || '@unknown'}
                        </AppText>
                        <View style={styles.starsRow}>
                          {[...Array(5)].map((_, index) => (
                            <AppText key={index} style={styles.star}>
                              ★
                            </AppText>
                          ))}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // === Show Provider Card only if offer accepted ===
              job.accepted_offer && (
                <View style={styles.userCard}>
                  <View style={styles.userRow}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('AccountScreen', {
                          userId: job.accepted_offer?.provider?.id,
                        })
                      }
                      style={styles.userInfoTouchable}
                    >
                      <Image
                        source={{
                          uri: job.accepted_offer?.provider?.image
                            ? `${config.userimageURL}${job.accepted_offer?.provider?.image}`
                            : 'https://via.placeholder.com/150',
                        }}
                        style={styles.userImage}
                      />
                      <View style={styles.userInfo}>
                        {/* Row for Username + Rating text */}
                        <View style={styles.rowInline}>
                          <AppText style={styles.userName}>
                            {job.accepted_offer?.provider?.name ||
                              'Unknown Provider'}
                          </AppText>
                          <AppText style={styles.ratingLabel}> Rating</AppText>
                        </View>

                        {/* Row for ScreenName + Stars */}
                        <View style={styles.rowInline}>
                          <AppText style={styles.userScreenName}>
                            {job.accepted_offer?.provider?.screenName ||
                              '@unknown'}
                          </AppText>
                          <View style={styles.starsRow}>
                            {[...Array(5)].map((_, index) => (
                              <AppText key={index} style={styles.star}>
                                ★
                              </AppText>
                            ))}
                          </View>
                        </View>

                        {/* === Offer Details (Consumer side only) === */}
                        <AppText style={styles.offerDetails}>
                          Rate: {job.accepted_offer?.rate} | Hours:{' '}
                          {job.accepted_offer?.no_of_hours}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            )}

            {userRole === 'provider' &&
              status === 'new' &&
              job.my_offer === null && (
                <View style={styles.footerContainer}>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => setShowOffer(true)}
                      style={[
                        styles.button,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <AppText style={styles.actionButtonText}>Apply</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: '#f0f0f0' }]}
                    >
                      <AppText style={styles.outlineButtonText}>Ignore</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
          </View>
          {/* Consumer Case */}
          {userRole === 'consumer' && (
            <View style={styles.bottomContainer}>
              {/* Left Section */}
              <View style={styles.bottomLeft}>
                <AppText style={styles.rateText}>
                  {job?.rate ? `$${job.rate}/per hr` : '$0.00/per hr'}
                </AppText>

                <View style={styles.paymentContainer}>
                  <AppText style={styles.paymentText}>
                    {job.payment_type || 'Cash'}
                  </AppText>
                </View>
              </View>

              {job?.accepted_offer && (
                <TouchableOpacity
                  style={[
                    styles.chatButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() =>
                    navigation.navigate('ChatScreen', { jobId: job.id })
                  }
                >
                  <AppText style={styles.chatButtonText}>Chat</AppText>
                </TouchableOpacity>
              )}
            </View>
          )}

          {userRole === 'provider' &&
            status !== 'new' &&
            job?.my_offer?.status !== 'pending_approval' && (
              <View style={styles.bottomContainer}>
                <View style={styles.bottomLeft}>
                  <AppText style={styles.rateText}>
                    {job?.rate ? `$${job.rate}/per hr` : '$0.00/per hr'}
                  </AppText>

                  <View style={[styles.paymentContainer, { marginTop: 6 }]}>
                    <AppText style={styles.paymentText}>
                      {job.payment_type || 'Cash'}
                    </AppText>
                  </View>
                </View>

                {/* Chat Button */}
                {job?.accepted_offer && (
                  <TouchableOpacity
                    style={[
                      styles.chatButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() =>
                      navigation.navigate('ChatScreen', { jobId: job.id })
                    }
                  >
                    <AppText style={styles.chatButtonText}>Chat</AppText>
                  </TouchableOpacity>
                )}
              </View>
            )}
        </View>
      </ScrollView>

      {/* Popups & Toasts */}
      <CustomToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      <CreateOfferPopup
        visible={showOffer}
        onClose={() => setShowOffer(false)}
        jobId={job.id}
        priceType={job.price_type}
      />
      <CustomPopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        title={popupTitle}
        message={popupMessage}
        icon={
          popupTitle.includes('Completed')
            ? 'checkmark-done-outline'
            : 'time-outline'
        }
        iconColor={
          popupTitle.includes('Completed') ? colors.green : colors.orange
        }
        confirmText="Yes"
        cancelText="Cancel"
        onCancel={() => setShowPopup(false)}
        onConfirm={() => {
          setShowPopup(false);
          statusChange();
        }}
      />
      {isLoading && <AppActivityIndicator />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden', // Ensures media does not spill out of the card
  },
  mediaWrapper: {
    width, // full screen width
    height: CARD_HEIGHT,
    backgroundColor: '#e0e0e0', // grey border background
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullMedia: {
    width: '100%',
    height: '100%',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: colors.gray,
    padding: 8,
    borderRadius: 10,
  },
  mediaCard: {
    width: '100%',
    height: CARD_HEIGHT,
    position: 'relative',
    backgroundColor: '#e0e0e0', // Placeholder color
  },
  statusOverlay: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 5,
  },
  carouselImage: {
    width: width -0,
    height: '100%',
  },
  mediaContainer: {
    width: width - 0,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  userScreenName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
    zIndex: 2,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    marginTop: 16,

    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 }, // 👈 shadow upar ki taraf
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },

  bottomLeft: {
    flexDirection: 'column',
  },
  paymentContainer: {
    marginTop: 0,
    paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: 'green',
    borderRadius: 16,
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  paymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },

  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  paginationDotsInline: {
    flexDirection: 'row',
    justifyContent: 'center', // horizontally center
    alignItems: 'center',
    // marginBottom: 8, // job title se space
    marginTop: 8, // media se space
    alignSelf: 'center', // parent ke andar center me lane ke liye
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
    backgroundColor: '#c1c1c1',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    zIndex: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  starsRow: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
    color: '#FFD700', // golden
    marginHorizontal: 1,
  },
  emptyMedia: {
    width: width - 32,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  contentContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  jobDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginBottom: 5,
    textAlign: 'justify',
  },
  footerContainer: {
    flex: 1, // parent ko full space
    justifyContent: 'flex-end', // neeche chipka do
  },
  buttonContainer: {
    flexDirection: 'column', // ek ke neeche ek
    padding: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 6,
  },
  actionButtonRow: {
    flexDirection: 'column', // make them side by side
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20, // little breathing space below
  },
  actionButton: {
    flex: 1, // equal width
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },

  outlineButton: {
    backgroundColor: '#fff',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  outlineButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userCard: {
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 20,
    marginBottom: 16,
    marginTop: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  userInfo: {
    flex: 1, // 👈 ensures row takes full width
  },
  userInfoTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  offerDetails: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  offerNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    fontStyle: 'italic',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 0,
    fontSize: 14,
    color: '#666',
  },
  boldtext: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  kmContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
  },
  kmContainer: {
    width: 60,
    height: 30,
    borderRadius: 30,
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  kmText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  rateBox: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  rateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  perHrText: {
    fontSize: 10,
    color: '#666',
  },
});

export default JobDetailsScreen;
