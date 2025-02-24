import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

const TipScreen = ({ route }) => {
  const { title, time, description, image } = route.params;
  const navigation = useNavigation();

  const [loaded, error] = useFonts({
    'CaudexBold': require('../assets/fonts/CaudexBold.ttf'),
    'CaudexBoldItalic': require('../assets/fonts/CaudexBoldItalic.ttf'),
    'CaudexItalic': require('../assets/fonts/CaudexItalic.ttf'),
    'CaudexRegular': require('../assets/fonts/CaudexRegular.ttf')
  });


  useEffect(() => {
    navigation.setOptions({
      title: title,
      headerTitleStyle: {
        fontSize: 20,
        fontFamily: 'CaudexBold',
      },
    });
  }, [navigation, title]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const linkStyle = { "backgroundColor": "#00000050", "borderRadius": 15, "color": "#cec", "padding": 15, "textDecorationLine": "underline" }
  const normalize = (obj) =>
    obj ? JSON.stringify(Object.fromEntries(Object.entries(obj).sort())) : null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', marginVertical: 10, }}>
        <View style={{ height: 200, width: '95%', marginTop: 20 }}>
          <Image
            style={{ height: '100%', width: '100%', borderRadius: 15, resizeMode: 'contain' }}
            source={image}
          />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{time.date} -</Text>
          <MaterialIcons name="access-time" size={16} color="#E0E0E0" style={{ marginHorizontal: 5 }} />
          <Text style={styles.timeText}>{time.duration}</Text>
        </View>
        <View style={{ marginBottom: '10%' }}>
          {description.map((segment, index) => {
            const isLink = normalize(segment.style) === normalize(linkStyle);
            return (
              <Text
                key={index}
                style={[styles.bodyText, segment.style]}
                android_hyphenationFrequency="full"
                selectable
                onPress={() => {
                  if (isLink) {
                    navigation.navigate('WebViewScreen', { url: segment.text });
                  }
                }}
              >
                {segment.text}
              </Text>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default TipScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F1F',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  timeText: {
    color: '#E0E0E0',
    fontSize: 14,
    fontFamily: 'CaudexRegular',
  },
  bodyText: {
    color: '#E0E0E0',
    marginVertical: 5,
    marginHorizontal: '5%',
    fontSize: 16,
    fontFamily: 'CaudexRegular',
    letterSpacing: 0.5,
    lineHeight: 24,
    flexWrap: 'wrap',  // Ensures text wraps without causing overflow
  },
});
