import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text, ScrollView, Dimensions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeIn, FadeOut, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Filter from './Filter';
import Optional from './Optional';

const { height } = Dimensions.get('window');

const ModalComponent = ({ visible, onClose, isUrl }) => {
  const [activeTab, setActiveTab] = useState('optional');

  const underlineOffset = useSharedValue(0);
  const underlineWidth = useSharedValue(0);

  const [tabLayouts, setTabLayouts] = useState({ optional: null, filter: null });

  const onTabLayout = (tabName, event) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => ({ ...prev, [tabName]: { x, width } }));
  };

  useEffect(() => {
    if (tabLayouts[activeTab]) {
      underlineOffset.value = withTiming(tabLayouts[activeTab].x, { duration: 300 });
      underlineWidth.value = withTiming(tabLayouts[activeTab].width, { duration: 300 });
    }
  }, [activeTab, tabLayouts, underlineOffset, underlineWidth]);

  const animatedUnderlineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: underlineOffset.value }],
      width: underlineWidth.value,
    };
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              onPress={() => setActiveTab('optional')}
              style={styles.tab}
              onLayout={event => onTabLayout('optional', event)}>
              <Text style={[styles.tabText, activeTab === 'optional' && styles.activeTabText]}>
                Options
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('filter')}
              style={styles.tab}
              onLayout={event => onTabLayout('filter', event)}>
              <Text style={[styles.tabText, activeTab === 'filter' && styles.activeTabText]}>
                Filter
              </Text>
            </TouchableOpacity>
            <Animated.View style={[styles.underline, animatedUnderlineStyle]} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} overScrollMode='never'>
            <View style={styles.content}>
              {activeTab === 'optional' ? (
                <Animated.View key="optional" entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
                  <Optional isUrl={isUrl} />
                </Animated.View>
              ) : (
                <Animated.View key="filter" entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
                  <Filter />
                </Animated.View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#252728',
    borderRadius: 20,
    padding: 20,
    width: '95%',
    height: 0.85 * height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
  },
  closeButton: {
    marginLeft: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 10,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  tabText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  underline: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'white',
    bottom: 0,
  },
  content: {
    width: '100%',
  },
});

export default ModalComponent;
