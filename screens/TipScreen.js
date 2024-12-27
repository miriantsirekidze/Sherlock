import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'

import { useNavigation } from '@react-navigation/native';

const TipScreen = ({ route }) => {

  const { title, description, image } = route.params;

  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      title: title,
      headerTitleStyle: {
        fontSize: 18
      }
    })
  }, [navigation, title])

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center'}}>
        <View style={{ height: 200, width: '95%' }}>
          <Image style={{ height: '100%', width: '100%', borderRadius: 15 }} source={image} />
        </View>
        <Text style={{ color: 'white', marginVertical: 20, marginHorizontal: 10, fontSize: 16, fontWeight: '600' }}>   {description}</Text>
      </ScrollView>
    </View>
  )
}

export default TipScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  }
})