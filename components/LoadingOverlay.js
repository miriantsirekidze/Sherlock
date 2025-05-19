import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');


const LoadingOverlay = () => {
  return (
    <View style={styles.loadingOverlay}>
      <StatusBar style='dark'/>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#333',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: width,
    height: height
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default LoadingOverlay;
