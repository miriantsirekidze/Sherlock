import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Toggle = () => {

  const [toggleGeneral, setToggleGeneral] = useState(true)
  const [toggleAnime, setToggleAnime] = useState(false)

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center',  }}>
        <TouchableOpacity style={styles.toggleContainer} onPress={() => { setToggleGeneral(!toggleGeneral) }}>
          {toggleGeneral && <MaterialIcons name="check" size={18} color="#ECDFCC" style={{ textAlign: 'center' }} />}
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: 'white', marginLeft: 10 }}>General Search</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
        <TouchableOpacity style={styles.toggleContainer} onPress={() => { setToggleAnime(!toggleAnime) }}>
          {toggleAnime && <MaterialIcons name="check" size={18} color="#ECDFCC" style={{ textAlign: 'center' }} />}
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: 'white', marginLeft: 10 }}>Anime Search</Text>
      </View>
    </View>
  )
}

export default Toggle

const styles = StyleSheet.create({
  toggleContainer: {
    height: 25,
    width: 25,
    borderRadius: 5,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ECDFCC'
  }
})