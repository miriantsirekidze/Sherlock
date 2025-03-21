import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ContainerItem from './ContainerItem';
import DatePicker from 'react-native-date-picker';
import DropDownItem from './DropDownItem';
import { countryData } from '../data/country';
import { languageData } from '../data/language'

const Filter = () => {
  const [url, setUrl] = useState('https://www.google.com/searchbyimage?image_url=${url}&client=firefox-b-d');
  const [toggleAlert, setToggleAlert] = useState(false);
  const [openBefore, setOpenBefore] = useState(false);
  const [openAfter, setOpenAfter] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const [keyword, setKeyword] = useState(null);
  const [website, setWebsite] = useState(null);
  const [domain, setDomain] = useState(null);
  const [removeWebsite, setRemoveWebsite] = useState(null);
  const [removeDomain, setRemoveDomain] = useState(null);
  const [beforeDate, setBeforeDate] = useState(null);
  const [afterDate, setAfterDate] = useState(null);
  const [language, setLanguage] = useState(null);
  const [country, setCountry] = useState(null);

  const clearFilters = () => {
    setKeyword(null);
    setWebsite(null);
    setDomain(null);
    setRemoveWebsite(null);
    setRemoveDomain(null);
    setBeforeDate(null);
    setAfterDate(null);
    setLanguage(null);
    setCountry(null);
  };

  const CustomAlert = () => {
    return (
      <Modal
        transparent={true}
        visible={toggleAlert}
        animationType='fade'
        onRequestClose={() => setToggleAlert(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ alignItems: 'center', justifyContent: 'space-between', height: '100%', backgroundColor: '#333', borderRadius: 10, width: '70%', height: 'auto' }}>

            <Text style={{ color: 'white', padding: 20, letterSpacing: 0.5 }}>{alertText}</Text>
            <View style={{ width: '100%' }}>
              <View style={{ width: '100%', height: 1, backgroundColor: '#666' }} />
              <TouchableOpacity onPress={() => setToggleAlert(false)} style={{ marginVertical: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View>
      <CustomAlert />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Filters for Google Images</Text>
          <Image source={require('../assets/icons/google.png')} style={{ height: 24, width: 24, marginLeft: 10 }} />
        </View>
        <TouchableOpacity onPress={clearFilters} style={{ marginLeft: 'auto' }}>
          <Text style={{ color: '#FFFFFF90', fontSize: 16, fontWeight: 'bold' }}>Reset</Text>
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'space-between', marginVertical: 10 }}>
      <DropDownItem
          text={"Try to get webpages that are in certain language"}
          placeholder={'Danish'}
          icon="language-outline"
          value={language}
          isFocus={isFocus}
          data={languageData}
          setValue={setLanguage}
          setIsFocus={setIsFocus}
          customAlert={() => {
            setAlertText("This filter allows you to find images from webpages written in a specific language. For example, choosing Danish will return results from pages in Danish. This is helpful when you're looking for content in a particular language. Note that some of the languages are missing because Google doesn't support them.");
            setToggleAlert(true);
          }}
        />
        <DropDownItem
          text={"Try to get webpages from certain country"}
          icon="earth-outline"
          placeholder={'Georgia'}
          value={country}
          isFocus={isFocus}
          data={countryData}
          setIsFocus={setIsFocus}
          setValue={setCountry}
          customAlert={() => {
            setAlertText("Use this filter to find images from webpages associated with a specific country or region. Choosing Georgia, for example, will return results from Georgia. This could be useful for finding region-specific content or perspectives.");
            setToggleAlert(true);
          }}
        />
        <ContainerItem
          text="Search for a keyword or a sentence."
          placeholder={"cat"}
          value={keyword}
          onChangeText={setKeyword}
          customAlert={() => {
            setAlertText("Use this filter to search for specific keywords or phrases within Google Images. For example, searching for 'cat' will return webpages with word 'cat' in them. This is useful when you're looking for something specific and want to narrow down your results.");
            setToggleAlert(true);
          }}
        />
        <ContainerItem
          text="Find results from specific website."
          placeholder={"facebook.com"}
          value={website}
          onChangeText={setWebsite}
          customAlert={() => {
            setAlertText("This filter allows you to restrict your search results to images from a particular website. For example, using 'facebook.com' will show only images hosted on Facebook. This is helpful when you know the source of the content you're looking for.");
            setToggleAlert(true);
          }}
        />
        <ContainerItem
          text="Get results only from specific domain extension."
          placeholder={".com"}
          value={domain}
          onChangeText={setDomain}
          customAlert={() => {
            setAlertText("Use this filter to find images from websites with a specific domain extension, such as .com, .org, or .edu. For example, '.com' will return results only from websites ending with .com. This is useful for targeting content from specific types of organizations or regions.");
            setToggleAlert(true);
          }}
        />
        <ContainerItem
          text="Remove specific website from the results."
          placeholder={"instagram.com"}
          value={removeWebsite}
          onChangeText={setRemoveWebsite}
          customAlert={() => {
            setAlertText("This filter lets you exclude images from a particular website. For example, using 'instagram.com' will remove all results from Instagram. This is helpful when you want to avoid certain sources in your search results.");
            setToggleAlert(true);
          }}
        />
        <ContainerItem
          text="Remove a specific domain extension from results."
          placeholder={".org"}
          value={removeDomain}
          onChangeText={setRemoveDomain}
          customAlert={() => {
            setAlertText("Use this filter to exclude images from websites with a specific domain extension. For example, '.org' will remove all results from .org websites. This is useful when you want to focus on results from other types of domains, such as .org or .gov.");
            setToggleAlert(true);
          }}
        />
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.text}>Results before or after certain date.</Text>
            <TouchableOpacity onPress={() => {
              setAlertText("This filter allows you to find images that were published or indexed before or after a specific date. For example, before:2025-01-01 will show results from before January 1, 2025, and after:2025-01-01 will show results after January 1, 2025. This is could be helpful for finding older or historical content. Also, you can use either 'before', 'after' or both filters at once.");
              setToggleAlert(true);
            }} style={{ marginRight: 10 }}>
              <MaterialCommunityIcons name="help" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <View style={[styles.inputContainer, { width: '44%' }]}>
              <View style={[styles.textInput, { justifyContent: 'center' }]}>
                <Text style={{ color: beforeDate ? '#EDEADE' : '#FFFFFF90' }}>{beforeDate == null ? 'before' : beforeDate.toISOString().split('T')[0]}</Text>
              </View>
              <TouchableOpacity style={styles.clearIcon} onPress={() => setOpenBefore(true)}>
                <MaterialCommunityIcons name="calendar-month" size={24} color="white" />
              </TouchableOpacity>
              <DatePicker
                modal
                open={openBefore}
                date={beforeDate || new Date()}
                mode='date'
                onConfirm={(selectedDate) => {
                  setOpenBefore(false);
                  setBeforeDate(selectedDate);
                }}
                onCancel={() => setOpenBefore(false)}
              />
            </View>
            <View style={[styles.inputContainer, { width: '44%', marginLeft: '2%' }]}>
              <View style={[styles.textInput, { justifyContent: 'center' }]}>
                <Text style={{ color: afterDate ? '#EDEADE' : '#FFFFFF90' }}>{afterDate == null ? 'after' : afterDate.toISOString().split('T')[0]}</Text>
              </View>
              <TouchableOpacity style={styles.clearIcon} onPress={() => setOpenAfter(true)}>
                <MaterialCommunityIcons name="calendar-month" size={24} color="white" />
              </TouchableOpacity>
              <DatePicker
                modal
                open={openAfter}
                date={afterDate || new Date()}
                mode='date'
                onConfirm={(selectedDate) => {
                  setOpenAfter(false);
                  setAfterDate(selectedDate);
                }}
                onCancel={() => setOpenAfter(false)}
              />
            </View>
            {(beforeDate !== null || afterDate !== null) && (
              <TouchableOpacity style={[styles.checkIcon, { marginLeft: 'auto' }]}>
                <MaterialCommunityIcons name="check" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 14,
    flexShrink: 1
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    width: '90%',
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    position: 'relative',
    elevation: 5
  },
  textInput: {
    flex: 1,
    color: '#EDEADE',
    height: '100%',
    paddingRight: 35,
  },
  clearIcon: {
    position: 'absolute',
    right: 10,
  },
  container: {
    marginVertical: 5,
    width: '100%',
    padding: 15,
    backgroundColor: '#444',
    borderRadius: 20,
    elevation: 8,
    overflow: 'hidden'
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkIcon: {
    height: 35,
    width: 35,
    borderRadius: 5,
    backgroundColor: '#EDEADE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  }
});