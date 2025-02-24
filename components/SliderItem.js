import React from 'react'
import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('screen');

const SliderItem = ({ item }) => {

  const navigation = useNavigation();
  const { title, shortDescription, image, description, time } = item;

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.touchable} onPress={() => navigation.navigate("Tip", { title, image, description, time })} activeOpacity={0.8}>
        <Image source={image} style={[title == 'Sherlock' ? styles.sherlock : styles.image]} />
        <View style={styles.tipContainer}>
          <View style={styles.titleAndTime}>
            <Text style={styles.titleStyle}>{title}</Text>
            <View style={styles.timeContainer}>
              <MaterialIcons name="access-time" size={15} color="#E0E0E0" style={{ marginHorizontal: 5 }} />
              <Text style={styles.timeText}>{time.duration}</Text>
            </View>
          </View>
          <Text style={styles.description}>{shortDescription}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default SliderItem

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    width: width,
    height: '100%',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5
  },
  tipContainer: { 
    position: 'absolute', 
    bottom: 0, 
    padding: 10, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    width: '100%', 
    height: '35%', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30 
  },
  description: {
    color: 'white', 
    fontSize: 13, 
    fontWeight: '500', 
    margin: 5
  },
  titleStyle: {
    color: 'white', 
    fontSize: 18, 
    fontWeight: '600', 
    margin: 5, 
    flexShrink: 1
  },
  titleAndTime: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  timeText: {
    color: '#E0E0E0',
    fontSize: 13,
  },
  image: {
    width: '90%',
    height: '65%',
    borderRadius: 15,
    resizeMode: 'contain',
  },
  sherlock: {
    width: '90%',
    height: '50%',
    borderRadius: 15,
    resizeMode: 'contain',
    marginTop: '10%'
  },
  touchable: {
    width: width * 0.7,
    height: '90%',
    borderRadius: 30,
    backgroundColor: '#1F1F1F',
    elevation: 10,
    alignItems: 'center'
  }
})  