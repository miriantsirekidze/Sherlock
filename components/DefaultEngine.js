import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import store$ from '../state';

const DefaultEngine = () => {
  const [isToggled, setIsToggled] = useState('Lens');

  useEffect(() => {
    const currentEngine = store$.defaultEngine.get();
    setIsToggled(currentEngine);
  }, []);

  useEffect(() => {
    store$.defaultEngine.set(isToggled);
  }, [isToggled]);



  const ButtonComponent = ({ title, icon }) => (
    <View style={styles.iconWrapper}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={() => setIsToggled(title)}
      >
        <Image source={icon} style={styles.icon} />
        <Text style={styles.iconTitleText}>{title}</Text>
      </TouchableOpacity>
      {isToggled === title && <FontAwesome6 name="check" size={22} color="white" />}
    </View>
  );

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.title}>Default Search Engine</Text>
      <View style={styles.dropdown}>
        <View style={{ gap: 10, marginTop: 10 }}>
          <ButtonComponent title="Lens" icon={require('../assets/icons/lens.png')} />
          <ButtonComponent title="Yandex" icon={require('../assets/icons/yandex.png')} />
          <ButtonComponent title="Bing" icon={require('../assets/icons/bing.png')} />
          <ButtonComponent title="TinEye" icon={require('../assets/icons/tineye.png')} />
          <ButtonComponent title="Pimeyes" icon={require('../assets/icons/pimeyes.png')} />
        </View>
      </View>
    </View>
  );
};

export default DefaultEngine;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTitleText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 15,
  },
  icon: {
    height: 26,
    width: 26,
    resizeMode: 'contain',
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdown: {
    overflow: 'hidden',
    height: 'auto'
  },
});
