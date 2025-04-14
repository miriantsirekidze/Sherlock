import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const LoadingOverlay = () => {
  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.lottieContainer}>
        <LottieView
          source={require('../assets/loading1.json')}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: '#333',
    opacity: 1,
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: width / 1.5,
    height: height / 1.5
  },
  lottieContainer: {
    height: width * 0.60, 
    width: width * 0.60, 
    borderRadius: 20, 
    backgroundColor: '#F2F2F2', 
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default LoadingOverlay;
