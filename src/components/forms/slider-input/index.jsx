import React from 'react';
import {View, Text} from 'react-native';
import Slider from '@react-native-community/slider';
import styles from './styles';

const SliderInput = ({
  label,
  value,
  onValueChange,
  minValue,
  maxValue,
  step,
}) => {
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>
        {label}: {value}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={minValue}
        maximumValue={maxValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={styles.minimumTrackTintColor}
        maximumTrackTintColor={styles.maximumTrackTintColor}
        thumbTintColor={styles.thumbTintColor}
      />
    </View>
  );
};

export default SliderInput;
