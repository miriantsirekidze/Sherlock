import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ContainerItem = ({ text, placeholder, value, onChangeText, customAlert }) => {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (value !== null) {
      setDisplay(true);
    } else {
      setDisplay(false);
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.text}>{text}</Text>
        <TouchableOpacity onPress={customAlert} style={{ marginRight: 10 }}>
          <MaterialCommunityIcons name="help" size={18} color="white" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor={'#FFFFFF90'}
            value={value}
            onChangeText={(text) => onChangeText(text)}
          />
          {display && (
            <TouchableOpacity style={styles.clearIcon} onPress={() => onChangeText(null)}>
              <MaterialCommunityIcons name="close-circle" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        {display && (
          <TouchableOpacity style={styles.checkIcon}>
            <MaterialCommunityIcons name="check" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ContainerItem

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 14,
    flexShrink: 1
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    width: '90%',
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    position: 'relative',
    elevation: 5
  },
  textInput: {
    flex: 1,
    color: '#EDEADE',
    height: '100%',
    paddingRight: 35,
  },
  clearIcon: {
    position: 'absolute',
    right: 10,
  },
  container: {
    marginVertical: 5,
    width: '100%',
    padding: 15,
    backgroundColor: '#444',
    borderRadius: 20,
    elevation: 8,
    overflow: 'hidden'
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkIcon: {
    height: 35,
    width: 35,
    borderRadius: 5,
    backgroundColor: '#EDEADE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  }
});