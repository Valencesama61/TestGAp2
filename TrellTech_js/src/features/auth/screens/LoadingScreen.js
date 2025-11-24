import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar, Animated, Easing } from 'react-native';

export default function LoadingScreen({ onFinish }) {
  const rotateOuter = useRef(new Animated.Value(0)).current;
  const rotateMiddle = useRef(new Animated.Value(0)).current;
  const rotateInner = useRef(new Animated.Value(0)).current;

  const pulseInner = useRef(new Animated.Value(1)).current;
  const pulseMiddle = useRef(new Animated.Value(1)).current;
  const pulseOuter = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation animations
    const createAnimation = (animatedValue, duration, clockwise = true) => {
      return Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
    };

    createAnimation(rotateOuter, 4000).start();
    createAnimation(rotateMiddle, 3000, false).start();
    createAnimation(rotateInner, 2000).start();

    // Vibration / pulse ripple effect
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseInner, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseInner, { toValue: 1, duration: 200, useNativeDriver: true }),

        Animated.timing(pulseMiddle, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseMiddle, { toValue: 1, duration: 200, useNativeDriver: true }),

        Animated.timing(pulseOuter, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOuter, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start(() => pulse());
    };

    pulse();

    const timer = setTimeout(() => onFinish(), 3000);
    return () => clearTimeout(timer);
  }, []);

  const rotateOuterInterpolate = rotateOuter.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotateMiddleInterpolate = rotateMiddle.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const rotateInnerInterpolate = rotateInner.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6A0DAD" />

      <Animated.View
        style={[
          styles.ringOuter,
          {
            transform: [
              { rotate: rotateOuterInterpolate },
              { scale: pulseOuter },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.ringMiddle,
            {
              transform: [
                { rotate: rotateMiddleInterpolate },
                { scale: pulseMiddle },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.ringInner,
              {
                transform: [
                  { rotate: rotateInnerInterpolate },
                  { scale: pulseInner },
                ],
              },
            ]}
          />
        </Animated.View>
      </Animated.View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>TrellTech</Text>
        <Text style={styles.subtitle}>Your planning platform</Text>
      </View>

      <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0079BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  ringMiddle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 5,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    letterSpacing: 2,
  },
  spinner: {
    marginTop: 20,
  },
});
