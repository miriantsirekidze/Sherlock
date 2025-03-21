import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import store$ from '../state';

import DefaultEngine from './DefaultEngine';

const FilterSearch = ({ isUrl }) => {
  const [isAnime, setIsAnime] = useState(store$.anime.get());
  const [isImageCheck, setIsImageCheck] = useState(store$.imageCheck.get());
  const [isLocation, setIsLocation] = useState(store$.location.get())
  const [isPimeyes, setIsPimeyes] = useState(store$.pimeyes.get())
  const [fullPicarta, setFullPicarta] = useState(store$.fullPicarta.get())
  const [fullPimeyes, setFullPimeyes] = useState(store$.fullPimeyes.get())

  useEffect(() => {
    store$.anime.set(isAnime);
    if (isAnime && isImageCheck || isAnime && isLocation || isAnime && isPimeyes) {
      setIsImageCheck(false);
      setIsLocation(false)
      setIsPimeyes(false)
      store$.imageCheck.set(false);
      store$.location.set(false);
      store$.pimeyes.set(false);
    }
  }, [isAnime]);

  useEffect(() => {
    store$.imageCheck.set(isImageCheck);
    if (isImageCheck && isAnime || isImageCheck && isLocation) {
      setIsAnime(false);
      setIsLocation(false)
      store$.anime.set(false);
      store$.location.set(false);
    }
  }, [isImageCheck]);

  useEffect(() => {
    store$.location.set(isLocation);
    if (isLocation && isAnime || isLocation && isImageCheck || isLocation && isPimeyes) {
      setIsAnime(false);
      setIsImageCheck(false)
      setIsPimeyes(false)
      store$.anime.set(false);
      store$.imageCheck.set(false)
      store$.pimeyes.set(false)
    }
  }, [isLocation]);

  useEffect(() => {
    store$.pimeyes.set(isPimeyes);
    if (isPimeyes && isAnime || isPimeyes && isLocation) {
      setIsAnime(false);
      setIsLocation(false)
      store$.anime.set(false);
      store$.location.set(false)
    }
  }, [isPimeyes]);

  useEffect(() => {
    store$.fullPicarta.set(fullPicarta)
    store$.fullPimeyes.set(fullPimeyes)
  }, [fullPicarta, fullPimeyes])

  const Separator = () => {
    return (
      <View style={{ marginVertical: 8, borderBottomColor: 'white', borderBottomWidth: 1 }} />
    )
  }

  return (
    <View>
      <View style={styles.individualContainer}>
        <View style={styles.alignContainer}>
          <TouchableOpacity onPress={() => setIsImageCheck(!isImageCheck)} style={styles.alignContainer}>
            <View style={styles.checkStyle}>
              {isImageCheck ? (<MaterialIcons name="check" size={20} color="white" />) : null}
            </View>
            <Text style={styles.titleText}>
              Image Modification Check
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: '#ccc', marginTop: 1 }}>See whether an image was generated by AI or was edited by image altering software.</Text>
      </View>
      <View style={styles.individualContainer}>
        <View style={styles.alignContainer}>
          <TouchableOpacity onPress={() => setIsAnime(!isAnime)} style={styles.alignContainer} >
            <View style={styles.checkStyle}>
              {isAnime ? (<MaterialIcons name="check" size={20} color="white"/>) : null}
            </View>
            <Text style={styles.titleText}>
              Anime Search
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: '#ccc', marginTop: 1 }}>Find potential anime title, season, episode and time from a single frame.</Text>
      </View>
      <View style={styles.individualContainer}>
        <View style={styles.alignContainer}>
          <TouchableOpacity onPress={() => setIsLocation(!isLocation)} style={styles.alignContainer}>
            <View style={styles.checkStyle}>
              {isLocation ? (<MaterialIcons name="check" size={20} color="white"/>) : null}
            </View>
            <Text style={styles.titleText}>
              Find Location
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: '#ccc', marginTop: 1 }}>Get longitude and latitude of where the image was taken.</Text>
      </View>
      {isUrl == null ?
        <>
          <View style={styles.individualContainer}>
            <View style={styles.alignContainer}>
              <TouchableOpacity onPress={() => setIsPimeyes(!isPimeyes)} style={styles.alignContainer} >
                <View style={styles.checkStyle}>
                  {isPimeyes ? (<MaterialIcons name="check" size={20} color="white"/>) : null}
                </View>
                <Text style={styles.titleText}>
                  Face Search
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: '#ccc', marginTop: 1 }}>Find images of a person from given image. Doesn't work with anime and location search.</Text>
          </View>
        </>
        : null}
      <Separator />
      <View>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginVertical: 5 }}>Injection Settings</Text>
        <View style={{ marginVertical: 5 }}>
          <TouchableOpacity onPress={() => setFullPimeyes(!fullPimeyes)} style={styles.alignContainer} >
            <View style={styles.checkStyle}>
              {fullPimeyes ? (<MaterialIcons name="check" size={20} color="white"/>) : null}
            </View>
            <Text style={styles.titleText}>
              PimEyes Full Injection
            </Text>
          </TouchableOpacity>
          <Text style={{ color: '#ccc', marginTop: 1 }}>PimEyes injection will go all the way to the results. If checked off injection will stop at uploading images window, could be better for result optimization.</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <TouchableOpacity onPress={() => setFullPicarta(!fullPicarta)} style={styles.alignContainer} >
            <View style={styles.checkStyle}>
              {fullPicarta ? (<MaterialIcons name="check" size={20} color="white"/>) : null}
            </View>
            <Text style={styles.titleText}>
              Picarta Full Injection
            </Text>
          </TouchableOpacity>
          <Text style={{ color: '#ccc', marginTop: 1 }}>Picarta injection will go all the way to the results. If checked off injection will stop at screen of two buttons, could be better for result optimization.</Text>
        </View>
      </View>
      <Separator/>
      <DefaultEngine/>
    </View>
  );
};

export default FilterSearch;

const styles = StyleSheet.create({
  individualContainer: {
    marginVertical: 5
  },
  alignContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1
  },
  titleText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
    marginLeft: 10
  },
  checkStyle: {
    width: 28, 
    height: 28,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    
  }
})
