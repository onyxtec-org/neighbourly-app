import React, { useRef, useState, useCallback, useEffect } from 'react';
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
  Modal,
  TextInput,
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
import AdvancedLoadingPopup from '../../../components/AdvancedLoadingIndicator';
import CustomPopup from '../../../components/CustomPopup';
import AppText from '../../../components/AppText';
import Seperator from '../../../components/Seperator';
import moment from 'moment';
import AppTextInput from '../../../components/AppTextInput';
import UserCard from '../../../components/JobComponents/UserCard';
import { postJobReview } from '../../../../redux/slices/reviewSlice/reviewSlice';
import BackButtonWithColor from '../../../components/ButtonComponents/BackButtonWithColor';
import HeaderWithContainer from '../../../components/HeaderComponent/HeaderWithContainer';
import { createOffer } from '../../../../redux/slices/jobSlice/offerSlice/offerSlice';
import { formatStatusText } from '../../../../utils/stringHelpers';
const { width } = Dimensions.get('window');
const CARD_HEIGHT = 300;

const JobDetailsScreen = ({ navigation, route }) => {
  const { jobId, userRole, status } = route.params;
  //console.log('role', userRole, status);
  const { user } = useSelector(state => state.profile);
  const aauthUser = user?.id ?? null;

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
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [myReview, setMyReview] = useState({});
  const [popupConfig, setPopupConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    action: null,
    jobId: null,
  });
  const startsAt = new Date(job?.starts_at); // your API date string
  const now = new Date();
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

  const handleStatusChangePopup = action => {
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

  const onRejectedPress = jobId => {
    // Show confirmation popup before rejecting
    setPopupConfig({
      title: 'Reject Job',
      message:
        'Are you sure you want to reject this job? This action cannot be undone.',
      confirmText: 'Reject',
      action: 'reject',
      jobId,
    });
    setPopupVisible(true);
  };

  const handleConfirmAction = async () => {
    const { action, jobId } = popupConfig;
    setPopupVisible(false);
    setIsLoading(true);

    if (action === 'reject') {
      console.log('action', action, jobId);
      const payload = {
        job_id: jobId,
        status: 'rejected',
      };

      try {
        const res = await dispatch(createOffer(payload)).unwrap();

        if (res?.success) {
          setIsLoading(false);
          setIsRejected(true);
          showToast('This job has been rejected.', 'error');
        } else {
          showToast(res?.message || 'Failed to reject job', 'error');
        }
      } catch (error) {
        console.log('error', error);

        showToast('Something went wrong. Please try again.', 'error');
      }
    }
  };
  const InfoRow = ({ label, value, labelStyle, valueStyle }) => {
    return (
      <View style={styles.locationRow}>
        <AppText style={styles.boldtext}>{label} </AppText>
        <AppText style={styles.locationText}>{value}</AppText>
      </View>
    );
  };
  console.log('job data in job details', job);
  useEffect(() => {
    if (job?.reviews && aauthUser) {
      const review = job.reviews.find(r => r.reviewer_id === aauthUser);
      setMyReview(review);
    }
  }, [job, aauthUser]);

  const alreadyReviewed = job?.reviews?.some(
    review =>
      review.reviewer_id === aauthUser && review.reviewer_type === userRole, // 'consumer' or 'provider'
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Media Section */}
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{
              height: 220,
              width: '100%',
              borderRadius: 12,
              marginBottom: 16,
            }}
          />

          {/* Title Row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 20, width: '50%', borderRadius: 6 }}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 32, width: 100, borderRadius: 8 }}
            />
          </View>

          {/* Location Row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 16, width: 16, borderRadius: 8, marginRight: 8 }}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 16, width: '40%', borderRadius: 6 }}
            />
          </View>

          {/* KM & Payment Row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 24, width: 60, borderRadius: 12 }}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 24, width: 80, borderRadius: 12 }}
            />
          </View>

          {/* Description */}
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{
              height: 20,
              width: '30%',
              borderRadius: 6,
              marginBottom: 8,
            }}
          />
          {[1, 2, 3].map(i => (
            <ShimmerPlaceholder
              key={i}
              LinearGradient={LinearGradient}
              style={{
                height: 14,
                width: '100%',
                borderRadius: 6,
                marginBottom: 6,
              }}
            />
          ))}

          {/* Info Rows */}
          {[1, 2, 3, 4].map(i => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={{ height: 16, width: '30%', borderRadius: 6 }}
              />
              <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={{ height: 16, width: '50%', borderRadius: 6 }}
              />
            </View>
          ))}

          {/* User Card */}
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{
              height: 100,
              width: '100%',
              borderRadius: 12,
              marginBottom: 16,
            }}
          />

          {/* Bottom Buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
          >
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 44, width: '45%', borderRadius: 12 }}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ height: 44, width: '45%', borderRadius: 12 }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) return <AppText>Error: {error}</AppText>;
  if (!job) return <AppText>No job data found.</AppText>;

  const mediaSource = job?.attachments || [];
  const hasMultipleMedia = mediaSource.length > 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.mainCard}>
          <View style={styles.mediaCard}>
            <HeaderWithContainer
              backButtonBoxColor={colors.white}
              borderColor={colors.white}
            />

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

              {userRole === 'consumer' &&
              (job.status === 'open'||job.status==='invited') &&
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
                //now >= startsAt
                true && (
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
                    onPress={() => {
                      handleStatusChangePopup(
                        status === 'my_jobs' ? 'in_progress' : 'completed',
                      );
                    }}
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
                )
              ) : userRole === 'provider' &&
                (status === 'new' ||
                  job?.my_offer?.status === 'pending_approval') ? (
                // ✅ Provider with new / my_offer.pending_approval
                <View style={styles.rateBox}>
                  <AppText style={styles.rateText}>
                    {job?.accepted_offer
                      ? `$${job.accepted_offer.rate}`
                      : `$${job.rate}`}
                    /
                  </AppText>
                  <AppText style={styles.perHrText}>
                    {formatStatusText(job.price_type)}
                  </AppText>
                </View>
              ) : null}
            </View>

            {/* Location Row */}
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.black}
              />
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

            <Seperator color={colors.lightGray} />

            <AppText style={styles.sectionHeading}>Description</AppText>
            <AppText style={styles.jobDescription}>{job.description}</AppText>

            <InfoRow label={'Services:'} value={job.service.name} />

            <InfoRow
              label={'Start Date:'}
              value={moment(job.starts_at).format('MMM D, YYYY ')}
            />

            {/* <InfoRow
              label={'End Date:'}
              value={moment(job.ends_at).format('MMM D, YYYY ')}
            /> */}

            <InfoRow
              label={'Estimated Time:'}
              value={`${job.no_of_hours} hrs`}
            />

            <InfoRow
              label={'Price Type:'}
              value={
                job.price_type === 'per_hour' ? 'Per hour' : job.price_type
              }
            />
            {/* User Details Card */}
            {userRole === 'provider' ? (
              // === Show Consumer Card ===

              <UserCard
                user={job.consumer}
                onPress={() =>
                  navigation.navigate('AccountScreen', {
                    userId: job.consumer?.id,
                  })
                }
                averageRating={job.consumer?.average_rating}
                status={status}
                userRole={userRole}
                alreadyReviewed={alreadyReviewed}
                onRatePress={() => setIsRatingModalVisible(true)}
                isSubmitted={reviewSubmitted}
                myReview={myReview}
              />
            ) : (
              // === Show Provider Card only if offer accepted ===
              job.accepted_offer && (
                <UserCard
                  user={job.accepted_offer?.provider}
                  onPress={() =>
                    navigation.navigate('AccountScreen', {
                      userId: job.accepted_offer?.provider?.id,
                    })
                  }
                  averageRating={job.accepted_offer?.provider?.average_rating}
                  status={status}
                  userRole={userRole}
                  alreadyReviewed={alreadyReviewed}
                  onRatePress={() => setIsRatingModalVisible(true)}
                  isSubmitted={reviewSubmitted}
                  myReview={myReview}
                />
              )
            )}

            {userRole === 'provider' &&
              ((status === 'new' && job.my_offer === null && !isRejected) ||
                status === 'invited') && (
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
                      onPress={() => onRejectedPress(job.id)}
                    >
                      <AppText style={styles.outlineButtonText}>Ignore</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
          </View>

          {userRole === 'provider' &&
            status !== 'new' &&
            job?.my_offer?.status !== 'pending_approval' && (
              <View style={styles.bottomContainer}>
                <View style={styles.bottomLeft}>
                  <AppText style={styles.rateText}>
                    {job?.accepted_offer
                      ? `$${job.accepted_offer.rate}`
                      : `$${job.rate}`}
                    /{' '}
                    <AppText style={{ fontSize: 14 }}>
                      {formatStatusText(job.price_type)}
                    </AppText>
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
      {/* Consumer Case */}
      {userRole === 'consumer' && (
        <View style={styles.bottomContainer}>
          {/* Left Section */}
          <View style={styles.bottomLeft}>
            <AppText style={styles.rateText}>
              {job?.accepted_offer
                ? `$${job.accepted_offer.rate}`
                : `$${job.rate}`}
              /{' '}
              <AppText style={{ fontSize: 14 }}>
                {formatStatusText(job.price_type)}
              </AppText>
            </AppText>

            <View style={styles.paymentContainer}>
              <AppText style={styles.paymentText}>
                {job.payment_type || 'Cash'}
              </AppText>
            </View>
          </View>

          {job?.accepted_offer && (
            <TouchableOpacity
              style={[styles.chatButton, { backgroundColor: colors.primary }]}
              onPress={() =>
                navigation.navigate('ChatScreen', { jobId: job.id })
              }
            >
              <AppText style={styles.chatButtonText}>Chat</AppText>
            </TouchableOpacity>
          )}
        </View>
      )}
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

          if (popupTitle.includes('Completed')) {
            setIsRatingModalVisible(true);
          }
        }}
      />
      <CustomPopup
        visible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="Success"
        message="Your review has been submitted successfully!"
        icon="checkmark-circle-outline"
        iconColor={colors.green}
        confirmText="OK"
        onConfirm={() => setShowSuccessPopup(false)}
        showCancel={false}
      />
      <CustomPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        title={popupConfig.title}
        message={popupConfig.message}
        icon={
          popupConfig.action === 'reject'
            ? 'close-circle-outline'
            : 'checkmark-circle-outline'
        }
        iconColor={popupConfig.action === 'reject' ? colors.red : colors.green}
        cancelText="Cancel"
        confirmText={popupConfig.confirmText}
        onCancel={() => setPopupVisible(false)}
        onConfirm={handleConfirmAction}
      />

      <Modal
        transparent
        visible={isRatingModalVisible}
        animationType="fade"
        onRequestClose={() => setIsRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <AppText style={styles.modalTitle}>Rate User</AppText>
              <TouchableOpacity onPress={() => setIsRatingModalVisible(false)}>
                <AppText style={styles.closeIcon}>✕</AppText>
              </TouchableOpacity>
            </View>

            {/* Rating Stars */}
            <View style={styles.rateStarsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setSelectedRating(star)}
                >
                  <AppText
                    style={[
                      styles.rateStar,
                      { color: star <= selectedRating ? '#FFD700' : '#ccc' },
                    ]}
                  >
                    ★
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>

            {/* Review Text Input */}
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review..."
              placeholderTextColor="#888"
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  opacity: selectedRating === 0 ? 0.5 : 1,
                },
              ]}
              //|| reviewComment.trim() === ''// add this if we want to make review mandatory
              disabled={selectedRating === 0}
              onPress={async () => {
                if (selectedRating === 0) return;

                setIsSubmitting(true);

                try {
                  const response = await dispatch(
                    postJobReview({
                      jobId: job.id,
                      body: { rating: selectedRating, comment: reviewComment },
                    }),
                  ).unwrap();

                  setIsSubmitting(false);
                  setShowSuccessPopup(true);
                  setIsRatingModalVisible(false);
                  setMyReview({
                    rating: selectedRating,
                    comment: reviewComment,
                  });
                  setReviewSubmitted(true);
                } catch (error) {
                  setIsSubmitting(false);
                  console.error('Review submission error:', error);
                }
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <AppText style={styles.submitText}>Submit</AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AdvancedLoadingPopup visible={isLoading} size={80} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  mainCard: {
    backgroundColor: colors.white,
    overflow: 'hidden', // Ensures media does not spill out of the card
  },
  mediaCard: {
    width: '100%',
    height: CARD_HEIGHT,
    position: 'relative',
    backgroundColor: '#e0e0e0', // Placeholder color
  },

  carouselImage: {
    width: width - 0,
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
    marginTop: 4,
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
    zIndex: 2,
  },

  bottomContainer: {
    //position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
  ratingColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  ratingLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },

  starsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  star: {
    fontSize: 16,
    color: colors.starColor, // Gold for selected
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
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 5,
  },
  jobDescription: {
    fontSize: 15,
    color: colors.black,
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
    color: colors.black,
  },
  boldtext: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.black,
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
    marginBottom: 5,
  },

  perHrText: {
    fontSize: 10,
    color: '#666',
  },
  giveRatingBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  giveRatingText: {
    color: '#fff',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeIcon: {
    fontSize: 20,
    color: '#333',
  },
  rateStarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  rateStar: {
    fontSize: 30,
    marginHorizontal: 5,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobDetailsScreen;
