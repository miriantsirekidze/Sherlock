import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ContainerItem from './ContainerItem';
import DatePicker from 'react-native-date-picker';
import DropDownItem from './DropDownItem';
import { countryData } from '../data/country';
import { languageData } from '../data/language';
import { Feather } from '@expo/vector-icons';
import store$ from '../state';

const Filter = () => {
  const [filters, setFilters] = useState({
    keyword: null,
    website: null,
    domain: null,
    removeWebsite: null,
    removeDomain: null,
    language: null,
    country: null,
    beforeDate: null,
    afterDate: null,
  });

  useEffect(() => {
    const storedFilters = store$.imagesParameters.get();
    setFilters({
      keyword: storedFilters.keyword,
      website: storedFilters.website,
      domain: storedFilters.domain,
      removeWebsite: storedFilters.removeWebsite,
      removeDomain: storedFilters.removeDomain,
      language: storedFilters.language,
      country: storedFilters.country,
      beforeDate: storedFilters.beforeDate,
      afterDate: storedFilters.afterDate,
    });
  }, []);

  const updateParameter = useCallback((key, value) => {
    const currentValue = store$.imagesParameters.get()[key];
    if (currentValue === value) return; // Do nothing if the value is unchanged.
    setFilters(prev => ({ ...prev, [key]: value }));
    if (value) {
      store$.addParameter(key, value);
    } else {
      store$.imagesParameters[key].set(null);
      console.log(`Cleared parameter [${key}]`);
    }
  }, []);

  const updateContainerValue = (key, value) => {
    updateParameter(key, value);
  };

  const clearFilters = () => {
    updateParameter('keyword', null);
    updateParameter('website', null);
    updateParameter('domain', null);
    updateParameter('removeWebsite', null);
    updateParameter('removeDomain', null);
    updateParameter('language', null);
    updateParameter('country', null);
    updateParameter('beforeDate', null);
    updateParameter('afterDate', null);
  };

  const [toggleAlert, setToggleAlert] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const formatDate = (dateVal) => {
    const d = new Date(dateVal);
    let month = d.toLocaleString('en-US', { month: 'short' });
    if (!month.endsWith('.')) {
      month = month + '.';
    }
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const tagPrefixes = {
    keyword: 'Keyword: ',
    website: '+ Website: ',
    domain: '+ Domain: ',
    removeWebsite: '- Website: ',
    removeDomain: '- Domain: ',
    language: 'Language: ',
    country: 'Country: ',
    beforeDate: 'Before: ',
    afterDate: 'After: ',
  };

  const CustomAlert = () => (
    <Modal
      transparent={true}
      visible={toggleAlert}
      animationType="fade"
      onRequestClose={() => setToggleAlert(false)}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#333', borderRadius: 10, width: '70%', padding: 20 }}>
          <Text style={{ color: 'white', letterSpacing: 0.5 }}>{alertText}</Text>
          <View style={{ width: '100%' }}>
            <View style={{ width: '100%', height: 1, backgroundColor: '#666', marginVertical: 10 }} />
            <TouchableOpacity onPress={() => setToggleAlert(false)}>
              <Text style={{ color: 'white', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const TimeFilter = () => {
    const [tempBefore, setTempBefore] = useState(filters.beforeDate);
    const [tempAfter, setTempAfter] = useState(filters.afterDate);
    const [localOpenBefore, setLocalOpenBefore] = useState(false);
    const [localOpenAfter, setLocalOpenAfter] = useState(false);

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.text}>Results before or after certain date.</Text>
          <TouchableOpacity
            onPress={() => {
              setAlertText("This filter allows you to find images that were published or indexed before or after a specific date.");
              setToggleAlert(true);
            }}
            style={{ marginRight: 10 }}
          >
            <MaterialCommunityIcons name="help" size={18} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.inputContainer, { width: '44%' }]}>
            <View style={[styles.textInput, { justifyContent: 'center' }]}>
              <Text style={{ color: tempBefore ? '#EDEADE' : '#FFFFFF90' }}>
                {tempBefore == null ? 'Before' : formatDate(tempBefore)}
              </Text>
            </View>
            <TouchableOpacity style={styles.clearIcon} onPress={() => setLocalOpenBefore(true)}>
              <MaterialCommunityIcons name="calendar-month" size={24} color="white" />
            </TouchableOpacity>
            <DatePicker
              modal
              open={localOpenBefore}
              date={tempBefore || new Date()}
              mode="date"
              maximumDate={new Date()}
              onConfirm={(selectedDate) => {
                setLocalOpenBefore(false);
                setTempBefore(selectedDate);
              }}
              onCancel={() => setLocalOpenBefore(false)}
            />
          </View>
          <View style={[styles.inputContainer, { width: '44%', marginLeft: '2%' }]}>
            <View style={[styles.textInput, { justifyContent: 'center' }]}>
              <Text style={{ color: tempAfter ? '#EDEADE' : '#FFFFFF90' }}>
                {tempAfter == null ? 'After' : formatDate(tempAfter)}
              </Text>
            </View>
            <TouchableOpacity style={styles.clearIcon} onPress={() => setLocalOpenAfter(true)}>
              <MaterialCommunityIcons name="calendar-month" size={24} color="white" />
            </TouchableOpacity>
            <DatePicker
              modal
              open={localOpenAfter}
              date={tempAfter || new Date()}
              mode="date"
              maximumDate={new Date()}
              onConfirm={(selectedDate) => {
                setLocalOpenAfter(false);
                setTempAfter(selectedDate);
              }}
              onCancel={() => setLocalOpenAfter(false)}
            />
          </View>
          {(((tempBefore !== null && tempBefore !== filters.beforeDate) ||
            (tempAfter !== null && tempAfter !== filters.afterDate))) && (
              <TouchableOpacity
                style={[styles.checkIcon, { marginLeft: 'auto' }]}
                onPress={() => {
                  if (tempBefore) updateParameter("beforeDate", tempBefore);
                  if (tempAfter) updateParameter("afterDate", tempAfter);
                }}
              >
                <MaterialCommunityIcons name="check" size={24} color="black" />
              </TouchableOpacity>
            )}
        </View>
      </View>
    );
  };

  const containerKeys = ['website', 'domain', 'removeWebsite', 'removeDomain'];
  const activeContainer = useMemo(() => {
    return containerKeys.find(key => filters[key] !== null) || null;
  }, [filters]);

  return (
    <View>
      <CustomAlert />

      <View style={{ alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
        {Object.entries(filters).map(([key, value]) => {
          if (!value) return null;
          let displayValue = value;
          if (key === 'beforeDate' || key === 'afterDate') {
            displayValue = formatDate(value);
          }
          if (key === 'language') {
            const found = languageData.find(item => item.code === value);
            if (found) {
              displayValue = found.key;
            }
          }
          if (key === 'country') {
            const found = countryData.find(item => item.code === value);
            if (found) {
              displayValue = found.key;
            }
          }
          const prefix = tagPrefixes[key] || '';
          let fullText = prefix + displayValue;
          if (typeof fullText === 'string' && fullText.length > 20 && key === 'keyword') {
            fullText = fullText.substring(0, 20) + '..';
          }
          return (
            <TouchableOpacity
              key={key}
              style={{ flexDirection: 'row', padding: 5, paddingHorizontal: 15, borderRadius: 30, borderWidth: 1, borderColor: 'white', alignItems: 'center', margin: 5 }}
              onPress={() => updateParameter(key, null)}
            >
              <Feather name='x' size={18} color={'white'} />
              <Text style={{ marginLeft: 5, fontSize: 12, color: 'white' }}>{fullText}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Google Image Search filters</Text>
          <Image source={require('../assets/icons/google.png')} style={{ height: 24, width: 24, marginLeft: 10 }} />
        </View>
        <TouchableOpacity onPress={clearFilters} style={{ marginLeft: 'auto' }}>
          <Text style={{ color: '#FFFFFF90', fontSize: 16, fontWeight: 'bold' }}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={{ justifyContent: 'space-between', marginVertical: 5 }}>
        <DropDownItem
          text={"Try to get webpages that are in certain language"}
          placeholder={'Danish'}
          icon="language-outline"
          value={filters.language}
          isFocus={isFocus}
          data={languageData}
          setValue={(val) => updateParameter('language', val)}
          setIsFocus={setIsFocus}
          onSubmit={(value) => updateParameter('language', value)}
          customAlert={() => {
            setAlertText("This filter allows you to find images from webpages written in a specific language. For example, choosing Danish returns results from pages in Danish.");
            setToggleAlert(true);
          }}
        />
        <DropDownItem
          text={"Try to get webpages from certain country"}
          icon="earth-outline"
          placeholder={'Georgia'}
          value={filters.country}
          isFocus={isFocus}
          data={countryData}
          setIsFocus={setIsFocus}
          setValue={(val) => updateParameter('country', val)}
          onSubmit={(value) => updateParameter('country', value)}
          customAlert={() => {
            setAlertText("Use this filter to find images from webpages associated with a specific country or region. For example, choosing Georgia returns results from Georgia.");
            setToggleAlert(true);
          }}
        />
        <ContainerItem
          text="Search for a keyword or a sentence."
          placeholder={"Cat"}
          value={filters.keyword}
          onChangeText={(val) => updateContainerValue('keyword', val)}
          onSubmit={(value) => updateContainerValue('keyword', value)}
          customAlert={() => {
            setAlertText("Use this filter to search for specific keywords or phrases within Google Images. For example, searching for 'cat' returns webpages with the word 'cat'.");
            setToggleAlert(true);
          }}
          editable={true}
        />
        <TimeFilter />
        <Text style={{ color: 'white', fontSize: 15, fontWeight: '500', marginTop: 10 }}>Only one parameter can be picked from below.</Text>
        <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 5 }}>
          Due to Google Image Search restrictions, only one parameter at a time can be applied from the parameters below.
          <Text style={{ fontWeight: '700' }}> Values are case insensitive</Text>
        </Text>
        <ContainerItem
          text="Find results from specific website."
          placeholder={"Facebook.com"}
          value={filters.website}
          onChangeText={(val) => updateContainerValue('website', val)}
          onSubmit={(value) => updateContainerValue('website', value)}
          customAlert={() => {
            setAlertText("This filter restricts your search results to images from a particular website. For example, using 'facebook.com' shows only images from Facebook.");
            setToggleAlert(true);
          }}
          editable={activeContainer === null || activeContainer === 'website'}
        />
        <ContainerItem
          text="Remove specific website from the results."
          placeholder={"Instagram.com"}
          value={filters.removeWebsite}
          onChangeText={(val) => updateContainerValue('removeWebsite', val)}
          onSubmit={(value) => updateContainerValue('removeWebsite', value)}
          customAlert={() => {
            setAlertText("This filter excludes images from a particular website. For example, using 'instagram.com' will remove results from Instagram.");
            setToggleAlert(true);
          }}
          editable={activeContainer === null || activeContainer === 'removeWebsite'}
        />
        <ContainerItem
          text="Get results only from specific domain extension."
          placeholder={"com"}
          value={filters.domain}
          onChangeText={(val) => updateContainerValue('domain', val)}
          onSubmit={(value) => updateContainerValue('domain', value)}
          customAlert={() => {
            setAlertText("This filter finds images from websites with a specific domain extension, such as .com, .org, or .edu.");
            setToggleAlert(true);
          }}
          editable={activeContainer === null || activeContainer === 'domain'}
        />
        <ContainerItem
          text="Remove a specific domain extension from results."
          placeholder={"org"}
          value={filters.removeDomain}
          onChangeText={(val) => updateContainerValue('removeDomain', val)}
          onSubmit={(value) => updateContainerValue('removeDomain', value)}
          customAlert={() => {
            setAlertText("This filter excludes images from websites with a specific domain extension, like .org.");
            setToggleAlert(true);
          }}
          editable={activeContainer === null || activeContainer === 'removeDomain'}
        />
      </View>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 14,
    flexShrink: 1,
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
    elevation: 5,
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
    width: '100%',
    padding: 15,
    backgroundColor: '#444',
    borderRadius: 20,
    elevation: 8,
    overflow: 'hidden',
    marginVertical: 5,
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
  },
});
