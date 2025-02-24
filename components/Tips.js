import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { slider } from '../data/slider';
import SliderItem from './SliderItem';
import Pagination from './Pagination';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';

const Tips = () => {
  const [paginationIndex, setPaginationIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    }
  });

  const onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems[0].index !== undefined && viewableItems[0].index !== null) {
      setPaginationIndex(viewableItems[0].index);
    }
  }

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  }

  const viewabilityConfigCallbackPairs = useRef([{viewabilityConfig, onViewableItemsChanged}]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={slider}
        horizontal
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        pagingEnabled
        decelerationRate={'normal'}
        onScroll={onScrollHandler}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({ item, index }) => <SliderItem item={item} index={index} scrollX={scrollX} />}
      />
      <Pagination items={slider} scrollX={scrollX} paginationIndex={paginationIndex} />
    </View>
  );
};

export default Tips;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  }
});
