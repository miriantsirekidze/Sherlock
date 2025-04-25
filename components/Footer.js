import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const Footer = () => {
  const navigation = useNavigation()

  const openTOS = () =>
    navigation.navigate('WebViewScreen', {
      url: 'https://sherlock.expo.app/tos',
    })

  const openPrivacy = () =>
    navigation.navigate('WebViewScreen', {
      url: 'https://sherlock.expo.app/privacy',
    })

  return (
    <View style={styles.container}>
      <Text style={styles.link} onPress={openTOS}>
        Terms of Service
      </Text>
      <Text style={styles.link} onPress={openPrivacy}>
        Privacy Policy
      </Text>
    </View>
  )
}

export default Footer

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    color: '#F1F1F1',
    marginVertical: 5,
  },
})
