import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Purchases from 'react-native-purchases';

export default function Donation({ visible, onRequestClose }) {

  const [thanks, setThanks] = useState(false);

  const ThanksModal = ({ visible, onRequestClose }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <View style={{ marginVertical: 15 }}>
            <Text style={styles.modalText}>Thanks for your contribution!</Text>
            <TouchableOpacity style={styles.doneButton} onPress={onRequestClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const onDonate = async (packageIdentifier) => {
    console.log("🛎️ onDonate called for:", packageIdentifier);
    try {
      const { current } = await Purchases.getOfferings();
      console.log("▶️ offerings.current:", current);

      const pkg = current?.availablePackages.find(
        p => p.identifier === packageIdentifier
      );

      console.log("📦 pkg resolved:", pkg);

      if (!pkg) {
        console.warn(`Package ${packageIdentifier} not found`);
        return;
      }

      const purchaseInfo = await Purchases.purchasePackage(pkg);
      console.log("🎉 purchaseInfo:", purchaseInfo);
      setThanks(true)
    } catch (e) {
      if (!e.userCancelled) {
        ToastAndroid.show('Sorry, something went wrong.', ToastAndroid.SHORT)
      }
    }
  };


  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Donation</Text>
            <TouchableOpacity onPress={onRequestClose}>
              <MaterialCommunityIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>
            <Text style={{ fontWeight: '600' }}>Sherlock</Text> is and always will be free. If you think the app has helped you and want to donate, see below:
          </Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.donationContainer} onPress={() => onDonate('Donation_0.50')}>
              <Text style={styles.donationText}>$0.50</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.donationContainer} onPress={() => onDonate('Donation_1')}>
              <Text style={styles.donationText}>$1.00</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.donationContainer} onPress={() => onDonate('Donation_2')}>
              <Text style={styles.donationText}>$2.00</Text>
            </TouchableOpacity>
          </View>
          <ThanksModal visible={thanks} onRequestClose={() => setThanks(false)} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '80%',
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 8
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700'
  },
  description: {
    color: '#FFFFFF95',
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  donationContainer: {
    backgroundColor: '#444',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15
  },
  donationText: {
    color: 'white',
    fontSize: 16
  },
});
