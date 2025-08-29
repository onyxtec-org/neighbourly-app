import React, { useRef, useState, useEffect, useCallback } from 'react';
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
import StatusBox from '../../../components/JobComponents/StatusBox';
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
import Header from '../../../components/HeaderComponent/Header';
import { useFocusEffect } from '@react-navigation/native';
import { updateJobStatus } from '../../../../redux/slices/jobSlice/UpdateJobStatusSlice';
import CustomToast from '../../../components/CustomToast';
import AppActivityIndicator from '../../../components/AppActivityIndicator';
import CustomPopup from '../../../components/CustomPopup';
import AppText from '../../../components/AppText';

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 250;

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
  const [inProgress, setInProgress] = useState(false);
  const [completed, setCompleted] = useState(false);
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
      const res = await dispatch(
        updateJobStatus({
          jobId: jobId,
          status: status === 'my_jobs' ? 'in_progress' : 'completed',
        }),
      );

      if (res?.payload.statusCode === 200) {
        setIsLoading(false);

        if (status === 'my_jobs') {
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
    //status==='my_jobs'?setInProgress(true):setCompleted(true);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Fake title */}
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{
              width: '60%',
              height: 24,
              marginBottom: 16,
              borderRadius: 6,
            }}
          />

          {/* Fake image/video carousel */}
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{
              width: '100%',
              height: 220,
              marginBottom: 20,
              borderRadius: 12,
            }}
          />

          {/* Fake text lines */}
          {[1, 2, 3].map(i => (
            <ShimmerPlaceholder
              key={i}
              LinearGradient={LinearGradient}
              style={{
                width: '100%',
                height: 18,
                marginBottom: 12,
                borderRadius: 4,
              }}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
  if (error) return <AppText>Error: {error}</AppText>;
  if (error) return <AppText>Error: {error}</AppText>;
  if (!job) return <AppText>No job data found.</AppText>;
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

  const onInterestedPersonPress = () => {
    const offers = job.offers;
    navigation.navigate('OffersScreen', { offers });
  };

  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={18} color="#666" />
      <View style={styles.infoTextContainer}>
        <AppText style={styles.infoLabel}>{label}</AppText>
        <AppText style={styles.infoText}>{value}</AppText>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={'Job details'} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Job Title (Above Image Carousel) */}

        <View style={styles.mediaCard}>
          {job?.status && (
            <View style={styles.statusOverlay}>
              <StatusBox
                color={colors.statusColors(job?.status)}
                text={job?.status}
              />
            </View>
          )}
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

              // For images:
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
            // 👇 Default placeholder when no media
            ListEmptyComponent={() => (
              <View style={styles.emptyMedia}>
                <Ionicons name="image-outline" size={48} color="#999" />
              </View>
            )}
          />

          {/* Pagination Dots */}
          {job?.attachments?.length > 1 && (
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
          {job?.attachments?.length > 1 && (
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

        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <AppText style={styles.heading}>Job Title</AppText>
            <AppText style={styles.jobTitle}>{job.title}</AppText>
          </View>
        </View>

        {/* Divider line for separation */}
        <View style={styles.divider} />

        {/* Description section heading */}
        <AppText style={styles.sectionHeading}>Description</AppText>

        {/* Description text */}
        <AppText style={styles.jobDescription}>{job.description}</AppText>

        {/* Main Details Card (Start Date, Estimated Time, Payment Type, Location, Price, Buttons) */}
        <View style={styles.mainDetailsCard}>
          {/* Start Date */}
          <View style={styles.rowWrapper}>
            <InfoItem
              icon={'calendar-outline'}
              label={'Start Date'}
              value={job.starts_at.substring(0, 10)}
            />

            <InfoItem
              icon={'hourglass-outline'}
              label={'Estimated Time'}
              value={`${job.no_of_hours} hrs`}
            />
          </View>

          {/* Estimated Time & Payment Type (Grouped) */}
          <View style={styles.rowWrapper}>
            <InfoItem
              icon={'wallet-outline'}
              label={'Price Time'}
              value={job.price_type === 'perhour' ? 'Per hour' : job.price_type}
            />
            {job.price_type === 'fixed' ? (
              <InfoItem
                icon={'wallet-outline'}
                label={'Amount'}
                value={`$${parseFloat(job.rate)}`}
              />
            ) : (
              <View style={styles.pricingContainer}>
                <AppText style={styles.priceText}>
                  ${job.rate}
                  <AppText style={styles.perText}> / hr</AppText>
                </AppText>
                <AppText style={styles.estimatedTotal}>
                  Estimated Total: $
                  {(parseFloat(job.rate) * parseFloat(job.no_of_hours)).toFixed(
                    2,
                  )}
                </AppText>
              </View>
            )}
          </View>

          <View style={styles.rowWrapper}>
            
             <InfoItem
              icon={'wallet-outline'}
              label={'Payment Type'}
              value={ job?.payment_type}
            />
            {status === 'my_jobs' && userRole === 'provider' && (
              <TouchableOpacity
                style={[
                  styles.progressButton,
                  {
                    backgroundColor: inProgress
                      ? colors.inProgress
                      : colors.pending,
                  },
                ]}
                onPress={() => handlePopupOpen('in_progress')}
                disabled={inProgress}
              >
                <AppText style={styles.progressButtonText}>
                  {inProgress ? 'In Progress' : 'Mark as In Progress'}
                </AppText>
              </TouchableOpacity>
            )}

            {status === 'in_progress' && userRole === 'provider' && (
              <TouchableOpacity
                style={[
                  styles.progressButton,
                  {
                    backgroundColor: completed
                      ? colors.completed
                      : colors.inProgress,
                  },
                ]}
                onPress={() => handlePopupOpen('completed')}
                disabled={completed}
              >
                <AppText style={styles.progressButtonText}>
                  {completed ? 'Completed' : 'Mark as Complete'}
                </AppText>
              </TouchableOpacity>
            )}
          </View>

          {/* Location (Separate) */}
          <View style={[styles.infoItem, styles.infoItemFullWidth]}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <View style={styles.infoTextContainer}>
              <AppText style={styles.infoLabel}>Location</AppText>
              <AppText style={styles.infoText}>{job.location}</AppText>
            </View>
          </View>

          {/* Action Buttons (Small, Text-Based) */}
          {userRole === 'consumer' &&
          Number(job?.offers?.length) > 0 &&
          job.accepted_offer === null ? (
            <TouchableOpacity
              style={styles.textButton}
              onPress={onInterestedPersonPress}
            >
              <AppText style={styles.textButtonText}>View Offers</AppText>
            </TouchableOpacity>
          ) : (
            status === 'new' &&
            job.my_offer === null && (
              <View style={styles.textButtonRow}>
                <TouchableOpacity
                  style={[styles.textButton, { marginRight: 10 }]}
                >
                  <AppText style={styles.textButtonText}>Ignore</AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowOffer(true)}
                  style={[styles.textButton, styles.filledButton]}
                >
                  <AppText
                    style={[styles.textButtonText, styles.filledButtonText]}
                  >
                    Interested
                  </AppText>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
        {userRole === 'provider' ? (
          // Show Consumer Section
          <View style={styles.mainDetailsCard}>
            <View>
              <AppText style={styles.sectionHeading}>Consumer</AppText>
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
                    uri: job.consumer?.image
                      ? `${config.userimageURL}${job.consumer?.image}`
                      : 'https://via.placeholder.com/150', // fallback if null
                  }}
                  style={styles.userImage}
                />
                <View style={styles.userInfo}>
                  <AppText style={styles.userName}>
                    {job.consumer?.name || 'Unknown User'}
                  </AppText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.chatButton}>
                <AppText style={styles.textButtonText}>Chat</AppText>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // If role = consumer
          job.accepted_offer !== null && (
            <View style={styles.mainDetailsCard}>
              <View>
                <AppText style={styles.sectionHeading}>Provider</AppText>
              </View>
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
                    <AppText style={styles.userName}>
                      {job.accepted_offer?.provider?.name || 'Unknown Provider'}
                    </AppText>

                    {/* === Offer Details === */}
                    <AppText style={styles.offerDetails}>
                      Rate: {job.accepted_offer?.rate} | Hours:{' '}
                      {job.accepted_offer?.no_of_hours}
                    </AppText>
                    {job.accepted_offer?.note && (
                      <AppText style={styles.offerNote}>
                        Note: {job.accepted_offer?.note}
                      </AppText>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.chatButton}>
                  <AppText style={styles.textButtonText}>Chat</AppText>
                </TouchableOpacity>
              </View>
            </View>
          )
        )}

        <CustomToast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onHide={() => setToastVisible(false)}
        />
        {/* Description Section (At the very bottom) */}

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
    marginTop: 0,
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
  titleContainer: {
    flexDirection: 'column',
  },
  heading: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
    marginHorizontal: 15,
    marginTop: 15,
    textTransform: 'uppercase',
    marginBottom: 8,
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
    backgroundColor: '#f2f2f2', // light gray instead of black
    borderRadius: 15,
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
    backgroundColor: '#f2f2f2', // light gray instead of black
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'center',
    color: colors.primary,
  },
  progressButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  completeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'center',
    color: colors.primary,
  },

  emptyMedia: {
    width: width, // 👈 FlatList card jitna wide
    height: CARD_HEIGHT, // 👈 card jitna tall
    justifyContent: 'center',
    alignItems: 'center', // 👈 horizontal center bhi
    backgroundColor: '#f2f2f2',
  },
  emptyImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    tintColor: '#aaa', // optional for gray tone
  },
  statusOverlay: {
    position: 'absolute',
    top: 10, // 👈 card ke top se 10px
    right: 10, // 👈 card ke right se 10px
    zIndex: 5, // 👈 FlatList ke upar dikhane ke liye
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
});

export default JobDetailsScreen;