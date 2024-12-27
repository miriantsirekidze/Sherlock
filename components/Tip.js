import React from 'react';
import { StyleSheet, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

const Tip = ({ title, description, image }) => {

  const navigation = useNavigation()
  
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.5} onPress={() => navigation.navigate("Tip", {title, description, image})}>
      <Image source={image} style={{ position: 'absolute', width: '100%', height: '100%' }} />
      <Text style={[styles.title, title == "Sherlock" ? {textAlign: 'right'} : null]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Tip;

const styles = StyleSheet.create({
  container: {
    height: height * 0.23,
    width: width * 0.95,
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 10,
    backgroundColor: '#333'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    margin: 10,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    margin: 5
  },
});

