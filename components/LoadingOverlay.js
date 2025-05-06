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
    zIndex: 9999,            // extra-high so nothing can draw above it
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
    borderRadius: 25, 
    backgroundColor: '#C1C1C1', 
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default LoadingOverlay;
