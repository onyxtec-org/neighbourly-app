import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../../config/colors';
import NextButton from '../../components/ButtonComponents/NextButton';
import storage from '../../../app/storage';
// ✅ Import your SVGs
import Slide1Svg from '../../../assets/illustrations/slide1.svg';
import Slide2Svg from '../../../assets/illustrations/slide2.svg';
import Slide3Svg from '../../../assets/illustrations/slide3.svg';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Empower',
    subtitle: 'Yourself With\nQuick Knowledge',
   
  },
  {
    id: '2',
    title: 'Provider Will',
    subtitle: 'Elevate Your Reading\nWith Quick Insights',
    SvgImage: Slide1Svg,
  },
  {
    id: '3',
    title: 'Consumer Can',
    subtitle: 'Elevate Your Reading\nWith Quick Insights',
    SvgImage: Slide2Svg,
  },
  {
    id: '4',
    title: 'Consumer Can',
    subtitle: 'Elevate Your Reading\nWith Quick Insights',
    SvgImage: Slide3Svg,
  },
];

const OnboardingScreen = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async() => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login');
      await storage.setFirstTimeUser();
      

    }
  };

  const handleSkip = async() => {
    navigation.replace('Login');
    await storage.setFirstTimeUser();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderItem = React.useCallback(({ item }) => {
    const SvgImage = item.SvgImage;
    return (
      <View style={[styles.slide, { width }]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        {item.SvgImage && <SvgImage width="90%" height="60%" /> }{/* ✅ Direct SVG usage */}
      </View>
    );
  }, []);

  return (
    <LinearGradient
      colors={[colors.linearGradient2, colors.linearGradient1]}
      style={styles.container}
    >
      {/* Onboarding Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* Skip Button */}
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Next Button */}
        <NextButton index={currentIndex} onPress={handleNext} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  skipText: {
    fontSize: 16,
    color: colors.black,
  },
});

export default OnboardingScreen;
