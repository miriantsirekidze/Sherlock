import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('screen');

const Pagination = ({ items, scrollX }) => {
  // Custom spring config
  const springConfig = {
    damping: 60,
    stiffness: 90,
    mass: 0.5,
    overshootClamping: false,
    restDisplacementThreshold: 0.03,
    restSpeedThreshold: 0.03,
  };

  return (
    <View style={styles.container}>
      {items.map((_, index) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const dotWidth = withSpring(
            interpolate(
              scrollX.value,
              [(index - 1) * width, index * width, (index + 1) * width],
              [8, 8, 8],
              Extrapolation.CLAMP
            ),
            springConfig
          );

          const opacity = withSpring(
            interpolate(
              scrollX.value,
              [(index - 1) * width, index * width, (index + 1) * width],
              [0.5, 1, 0.5],
              Extrapolation.CLAMP
            ),
            springConfig
          );

          const dotColor = interpolateColor(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            ['#555', '#F1F1F1', '#555']
          );

          return {
            width: dotWidth,
            backgroundColor: dotColor,
            opacity,
          };
        });

        return (
          <Animated.View style={[styles.dot, animatedDotStyle]} key={index} />
        );
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    bottom: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
});
