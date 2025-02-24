import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const ModalComponent = ({ visible, onClose, children }) => {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          {/* Header with full width */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {/* Content */}
          <View style={styles.content}>
            {children}
          </View>
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
    width: '60%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%', // Ensure the header takes full width of the modal
    marginBottom: 16, // Add spacing below the header
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