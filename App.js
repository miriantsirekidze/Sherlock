import React, {useEffect} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import TipScreen from './screens/TipScreen';
import Saved from './screens/Saved';
import WebViewScreen from './screens/WebViewScreen';
import useCleanOldFiles from './deletion';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'CaudexBold': require('./assets/fonts/CaudexBold.ttf'),
    'CaudexBoldItalic': require('./assets/fonts/CaudexBoldItalic.ttf'),
    'CaudexItalic': require('./assets/fonts/CaudexItalic.ttf'),
    'CaudexRegular': require('./assets/fonts/CaudexRegular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  useCleanOldFiles();

  const RootStack = createNativeStackNavigator({
    screens: {
      Home: { screen: HomeScreen, options: { headerShown: false } },
      Search: { screen: SearchScreen, options: { headerShown: false } },
      Tip:    { screen: TipScreen },
      Saved:  { screen: Saved },
      WebViewScreen: { screen: WebViewScreen },
    },
    screenOptions: {
      headerShown: true,
      headerStyle: { backgroundColor: '#333' },
      headerTintColor: '#fff',
      animation: 'ios_from_right',
    },
  });
  const Navigation = createStaticNavigation(RootStack);

  return (
    <>
      <StatusBar style="light" />
      <Navigation />
    </>
  );
}
