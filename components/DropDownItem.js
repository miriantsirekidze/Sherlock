import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const DropDownItem = ({ value, setValue, setIsFocus, isFocus, data, text, customAlert, placeholder, icon }) => {
  const [display, setDisplay] = useState(!!value); // Initialize display based on value

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
          placeholderStyle={[{ fontSize: 14 }, value !== null ? { color: '#EDEADE' } : { color: '#FFFFFF90' }]}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={{ borderRadius: 10, backgroundColor: '#333', overflow: 'hidden' }}
          itemTextStyle={{ color: '#EDEADE', fontSize: 15 }}
          itemContainerStyle={{ backgroundColor: '#333'}}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          minHeight={200}
          maxHeight={300}
          labelField="key"
          valueField="code"
          placeholder={!isFocus && !value ? placeholder : value || 'select'}
          searchPlaceholder="Search..."
          value={value}
          backgroundColor='#00000095'
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.code); // Update value with the selected item's code
            setDisplay(true); // Set display to true when a value is selected
          }}
          renderLeftIcon={() => {
            if (value) {
              // If a value is selected, show the "close-circle" icon to reset the selection
              return (
                <TouchableOpacity onPress={() => {
                  setValue(null); // Reset value to null
                  setDisplay(false); // Set display to false
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
              // If no value is selected, show the default icon
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
          <TouchableOpacity style={styles.checkIcon}>
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
    padding: 15,
    backgroundColor: '#444',
    borderRadius: 20,
    elevation: 8,
  },
  dropdown: {
    borderRadius: 10,
    backgroundColor: '#333',
    width: '90%',
    height: 40,
    paddingHorizontal: 10,
    marginTop: 10,
    position: 'relative',
    elevation: 8,
  },
  icon: {
    marginRight: 5,
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