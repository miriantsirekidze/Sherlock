import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const width = Dimensions.get('window').width;

const AnimatedSearchButton = ({ urlText, setUrlText, handleSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonWidth = useSharedValue(100);
  const inputRef = useRef(null); // Reference for TextInput


  const animatedStyle = useAnimatedStyle(() => ({
    width: buttonWidth.value,
  }));

  const handleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      buttonWidth.value = withTiming(width * 0.8, { duration: 300 });

      // Focus on the TextInput after animation completes
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const handleCollapse = () => {
    if (isExpanded) {
      setIsExpanded(false);
      buttonWidth.value = withTiming(100, { duration: 300 });
    }
  };

  const handleSearchPress = () => {
    handleSearch(urlText); // Pass the current URL to be validated only when search is pressed
  };
  

  return (
    <Animated.View style={[styles.animatedButton, animatedStyle]}>
      {!isExpanded ? (
        <TouchableOpacity onPress={handleExpand} style={styles.iconButton}>
          <Text style={{ color: 'white' }}>URL</Text>
          <MaterialCommunityIcons name="link" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <Animated.View style={styles.expandedContainer}>
          <TextInput
            ref={inputRef} // Assign the ref
            style={styles.textInput}
            placeholder="URL"
            placeholderTextColor="#aaa"
            value={urlText}
            onChangeText={setUrlText}
            onBlur={handleCollapse} 
          />
          <TouchableOpacity onPress={handleSearchPress}>
            <MaterialCommunityIcons name="search-web" size={24} color="white" style={styles.searchIcon} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default AnimatedSearchButton;

const styles = StyleSheet.create({
  animatedButton: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  expandedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 15,
    paddingHorizontal: 5,
  },
  searchIcon: {
    marginHorizontal: 5,
  },
});
