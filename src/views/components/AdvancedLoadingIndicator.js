// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, Modal } from 'react-native';
// import Svg, { Circle } from 'react-native-svg';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withRepeat,
//   withTiming,
//   interpolate,
//   Easing,
// } from 'react-native-reanimated';

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// export default function AdvancedLoadingPopup({
//   visible = false,
//   size = 70,
//   strokeWidth = 6,
//   colors = ['#6A00F4', '#00D4FF'],
//   label = 'Loading...',
//   showLabel = true,
// }) {
//   const rotation = useSharedValue(0);
//   const pulse = useSharedValue(0);

//   useEffect(() => {
//     rotation.value = withRepeat(
//       withTiming(1, { duration: 1600, easing: Easing.linear }),
//       -1,
//       false
//     );
//     pulse.value = withRepeat(
//       withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
//       -1,
//       true
//     );
//   }, [pulse, rotation]);

//   const ringStyle = useAnimatedStyle(() => ({
//     transform: [{ rotate: `${rotation.value * 360}deg` }],
//   }));

//   const pulseStyle = useAnimatedStyle(() => {
//     const scale = interpolate(pulse.value, [0, 1], [0.9, 1.1]);
//     return { transform: [{ scale }] };
//   });

//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;

//   return (
//     <Modal visible={visible} transparent animationType="fade">
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           {/* Loader */}
//           <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
//             {/* Rotating Ring */}
//             <Animated.View style={[ringStyle, StyleSheet.absoluteFill]}>
//               <Svg width={size} height={size}>
//                 <AnimatedCircle
//                   stroke={colors[0]}
//                   strokeWidth={strokeWidth}
//                   strokeLinecap="round"
//                   fill="none"
//                   r={radius}
//                   cx={size / 2}
//                   cy={size / 2}
//                   strokeDasharray={`${circumference * 0.7}, ${circumference}`}
//                 />
//               </Svg>
//             </Animated.View>

//             {/* Pulsating Center */}
//             <Animated.View
//               style={[
//                 pulseStyle,
//                 {
//                   width: size * 0.35,
//                   height: size * 0.35,
//                   borderRadius: size * 0.2,
//                   backgroundColor: colors[1],
//                 },
//               ]}
//             />
//           </View>

//           {showLabel && <Text style={styles.label}>{label}</Text>}
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.25)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: 140,
//   },
//   label: {
//     marginTop: 12,
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
// });

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  Extrapolate,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Custom hook for ripple animation styles
function useRippleAnimatedStyle(ripple, delay = 0) {
  return useAnimatedStyle(() => {
    const animatedValue = interpolate(
      ripple.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP,
    );

    const scale = interpolate(
      animatedValue,
      [0, 0.7, 1],
      [0, 1.2, 1.2],
    );

    const opacity = interpolate(
      animatedValue,
      [0, 0.4, 0.7, 1],
      [0, 0.6, 0.3, 0],
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });
}

export default function AdvancedLoadingPopup({
  visible = false,
  size = 120,
  label = 'Loading...',
  showLabel = true,
}) {
  const ripple = useSharedValue(0);

  useEffect(() => {
    ripple.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [ripple]);

  const rippleStyle1 = useRippleAnimatedStyle(ripple, 0.2);
  const rippleStyle2 = useRippleAnimatedStyle(ripple, 0.4);
  const rippleStyle3 = useRippleAnimatedStyle(ripple, 0.6);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Main Loader Container */}
          <View style={[styles.loaderWrapper, { width: size, height: size }]}>
            {/* Pulsating Center */}
            <Animated.View style={[styles.centerCircle, { width: size * 0.2, height: size * 0.2 }]} />
            
            {/* Ripple Rings */}
            <Animated.View style={[styles.ripple, rippleStyle1]} />
            <Animated.View style={[styles.ripple, rippleStyle2]} />
            <Animated.View style={[styles.ripple, rippleStyle3]} />
          </View>

          {showLabel && <Text style={styles.label}>{label}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  loaderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerCircle: {
    borderRadius: 999,
    backgroundColor: '#6A00F4',
    zIndex: 2,
  },
  ripple: {
    position: 'absolute',
    borderWidth: 5,
    borderRadius: 999,
    borderColor: '#00D4FF',
    width: '100%',
    height: '100%',
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
});

// import React, { useEffect } from "react";
// import { Dimensions, Modal, View, StyleSheet } from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withRepeat,
//   withTiming,
// } from "react-native-reanimated";

// const { width, height } = Dimensions.get("window");

// const AdvancedLoader = ({ visible }) => {
//   const rotation = useSharedValue(0);

//   useEffect(() => {
//     rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false);
//   }, [rotation]);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ rotate: `${rotation.value}deg` }],
//   }));

//   return (
//     <Modal transparent visible={visible} animationType="fade">
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           <Animated.View style={[styles.orbit, animatedStyle]}>
//             {Array.from({ length: 6 }).map((_, i) => (
//               <View
//                 key={i}
//                 style={[
//                   styles.dot,
//                   {
//                     transform: [
//                       { rotate: `${(i * 360) / 6}deg` },
//                       { translateY: -30 },
//                     ],
//                   },
//                 ]}
//               />
//             ))}
//           </Animated.View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     width: 100,
//     height: 100,
//     borderRadius: 20,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 10,
//   },
//   orbit: {
//     width: 60,
//     height: 60,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "#6C63FF",
//     position: "absolute",
//   },
// });

// export default AdvancedLoader;


