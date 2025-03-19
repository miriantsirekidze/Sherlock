import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Button = ({ onPress, icon, text }) => {

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
      <MaterialCommunityIcons name={icon} size={18} color={'#EEE'} style={{ marginLeft: 5 }} />
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: "#333",
    marginTop: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  text: {
    fontWeight: '600',
    color: '#EEE'
  }
})