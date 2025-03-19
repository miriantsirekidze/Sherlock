import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text, ScrollView, Dimensions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const {height} = Dimensions.get('window')

const ModalComponent = ({ visible, onClose, children }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView  showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {children}
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
    width: '90%',
    height:  0.85 * height 
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
  content: {
    width: '100%',
  },
});

export default ModalComponent;