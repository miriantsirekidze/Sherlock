import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import {overrides} from '../data/languageOverrides' 

const DropDownItem = ({ value, setValue, setIsFocus, isFocus, data, text, customAlert, placeholder, icon, onSubmit }) => {
  const [tempValue, setTempValue] = useState(value);
  const [display, setDisplay] = useState(false);

  const countryToEmoji = iso =>
    iso
      .toUpperCase()
      .replace(/./g, c =>
        String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
      );
  
  const getFlagEmoji = (code = '') => {
    if (overrides[code]) {
      return countryToEmoji(overrides[code]);
    }
  
    const region = code.includes('-')
      ? code.split('-')[1]
      : code;
  
    if (/^[A-Za-z]{2}$/.test(region)) {
      return countryToEmoji(region);
    }
  
    return '';
  };
  

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.text}>{text}</Text>
        <TouchableOpacity onPress={customAlert} style={{ marginRight: 10 }}>
          <MaterialCommunityIcons name="help" size={18} color="white" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={[{ fontSize: 14 }, tempValue !== null ? { color: '#EDEADE' } : { color: '#FFFFFF90' }]}
          selectedTextStyle={[styles.selectedTextStyle, display ? { color: '#EDEADE' } : { color: '#FFFFFF50' }]}
          containerStyle={{ borderRadius: 15, backgroundColor: '#333', overflow: 'hidden' }}
          itemTextStyle={{ color: '#EDEADE', fontSize: 15,}}
          itemContainerStyle={{ backgroundColor: '#333' }}
          activeColor='#222'
          inputSearchStyle={styles.inputSearchStyle}
          renderItem={dataItem => (
            <View style={styles.item}>
              <Text style={styles.flag}>{getFlagEmoji(dataItem.code)}</Text>
              <Text style={styles.itemText}>{dataItem.key}</Text>
            </View>
          )}
          iconStyle={styles.iconStyle}
          data={data}
          search
          minHeight={200}
          maxHeight={345}
          labelField="key"
          valueField="code"
          placeholder={!isFocus && !tempValue ? placeholder : tempValue || 'select'}
          searchPlaceholder="Search..."
          value={tempValue}
          backgroundColor="#00000095"
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setTempValue(item.code);
            setDisplay(true);
          }}
          renderLeftIcon={() => {
            if (tempValue) {
              return (
                <TouchableOpacity onPress={() => {
                  setTempValue(null);
                  setDisplay(false);
                  setValue(null); 
                }}>
                  <MaterialCommunityIcons
                    style={styles.icon}
                    color={isFocus ? '#EDEADE' : '#FFFFFF90'}
                    name="close-circle"
                    size={20}
                  />
                </TouchableOpacity>
              );
            } else {
              return (
                <Ionicons
                  style={styles.icon}
                  color={isFocus ? '#EDEADE' : '#FFFFFF90'}
                  name={icon}
                  size={20}
                />
              );
            }
          }}
        />
        {display && (
          <TouchableOpacity style={styles.checkIcon} onPress={() => {
            onSubmit(tempValue);
            setDisplay(false);
            setValue(tempValue); 
          }}>
            <MaterialCommunityIcons name="check" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default DropDownItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#444',
    borderRadius: 20,
    elevation: 8,
  },
  dropdown: {
    borderRadius: 10,
    backgroundColor: '#333',
    width: '87%',
    height: 40,
    paddingHorizontal: 10,
    marginTop: 10,
    position: 'relative',
    elevation: 8,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  flag: {
    fontSize: 18,
    marginRight: 8,
  },
  itemText: {
    color: '#EDEADE',
    fontSize: 15,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#EDEADE',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    borderRadius: 10,
    color: '#EDEADE',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 14,
    flexShrink: 1,
  },
  checkIcon: {
    height: 35,
    width: 35,
    borderRadius: 5,
    backgroundColor: '#EDEADE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
