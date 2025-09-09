import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import SvgComponent from '../ImageComponent/SvgComponent';
import { onboardingNext } from '../../../config/icons';
import colors from '../../../config/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const NextButton = ({ index, onPress, totalSteps = 4 }) => {
  const circleSize = 50; // Button size
  const strokeWidth = 4;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: (index + 1) / totalSteps, // Progress fraction
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, index, totalSteps]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0], // Start full offset, end no offset
  });

  const iconSize = circleSize * 0.7;

  return (
    <TouchableOpacity style={styles.nextButton} onPress={onPress}>
      <View style={{ width: circleSize, height: circleSize, alignItems: 'center', justifyContent: 'center' }}>
        <Svg height={circleSize} width={circleSize}>
          {/* Background circle */}
          <Circle
            stroke="#c7c7e8"
            fill="none"
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />

          {/* Animated progress circle */}
          <AnimatedCircle
            stroke={colors.primary}
            fill="none"
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${circleSize / 2}, ${circleSize / 2}`}
          />
        </Svg>

        {/* SVG Icon inside */}
        <View style={{ position: 'absolute', width: iconSize, height: iconSize }}>
          <SvgComponent svgMarkup={onboardingNext()} setWidth="100%" setHeight="100%" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  nextButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NextButton;
