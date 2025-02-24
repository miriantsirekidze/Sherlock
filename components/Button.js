import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Button = ({onPress, icon, text}) => {

  const conditional = text == "Pick Another"

  return (
    <TouchableOpacity style={[conditional ? styles.button2 : styles.button1]} onPress={onPress}>
      <View style={styles.buttonContainer}>
        <Text style={styles.text}>{text}</Text>
        {conditional ? null : <MaterialCommunityIcons name={icon} size={18} color={'#EEE'} style={{ marginLeft: 5 }} />}
      </View>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
  button1: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#333",
    marginHorizontal: 5,
    elevation: 5
  },
  button2: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontWeight: '600',
    color: '#EEE'
  }
})