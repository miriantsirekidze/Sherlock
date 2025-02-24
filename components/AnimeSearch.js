import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import store$ from '../state';

const AnimeSearch = () => {
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    const currentEngine = store$.anime.get()
    setIsToggled(currentEngine);
  }, []);

  useEffect(() => {
    store$.anime.set(isToggled);
  }, [isToggled]);

  return (
    <View>
      <TouchableOpacity onPress={() => setIsToggled(!isToggled)} style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        {isToggled ? <FontAwesome6 name="check-square" size={24} color="white" /> : <FontAwesome6 name="square" size={24} color="white" />}
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginLeft: 10 }}>Anime Search</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AnimeSearch

const styles = StyleSheet.create({})