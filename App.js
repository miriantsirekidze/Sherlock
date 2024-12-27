import { StatusBar } from 'expo-status-bar';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import TipScreen from './screens/TipScreen';
import Saved from './screens/Saved';
import Settings from './screens/Settings';

export default function App() {

  const RootStack = createNativeStackNavigator({
    screens: {
      Home: {
        screen: HomeScreen,
        options: { headerShown: false }
      },
      Search: {
        screen: SearchScreen,
        options: { headerShown: false }
      },
      Tip: {
        screen: TipScreen,
      },
      Saved: {
        screen: Saved
      },
      Settings: {
        screen: Settings
      }
    },
    screenOptions: {
      headerShown: true,
      headerStyle: { backgroundColor: '#333' },
      headerTintColor: '#fff', animation: 'ios_from_right',
    }
  });

  const Navigation = createStaticNavigation(RootStack);

  return (
    <>
      <StatusBar style='auto' />
      <Navigation />
    </>
  );
}

