import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import Ionicons from './ImageComponent/IconComponent';
import AppText from './AppText';
const { width } = Dimensions.get('window');

const ICONS = {
  success: 'checkmark-circle-outline',
  error: 'close-circle-outline',
  warning: 'warning-outline',
};

const COLORS = {
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
};

const CustomToast = ({
  visible,
  message,
  type = 'success',
  duration = 3000,
  onHide,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Slide-in and fade-in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          // Slide-out and fade-out
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -100,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(onHide);
        }, duration);
      });
    }
  }, [duration, onHide, opacity, translateY, visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: COLORS[type] || COLORS.success },
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Ionicons
        name={ICONS[type] || ICONS.success}
        size={22}
        color="#fff"
        style={styles.icon}
      />
      <AppText style={styles.toastText}>
        {typeof message === 'string'
          ? message
          : message?.message || 'Something went wrong'}
      </AppText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 50,
    left: width * 0.1,
    right: width * 0.1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  toastText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
});

export default CustomToast;
