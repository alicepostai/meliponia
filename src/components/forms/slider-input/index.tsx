import React, { memo, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { useSliderInputStyles } from './styles';

interface SliderInputProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  formatValueLabel?: (value: number) => string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  sliderStyleProp?: StyleProp<ViewStyle>;
}

const SliderInput = memo(
  ({
    label,
    value,
    onValueChange,
    minValue = 0,
    maxValue = 1,
    step = 1,
    formatValueLabel,
    containerStyle,
    labelStyle,
    sliderStyleProp,
  }: SliderInputProps) => {
    const { colors: themeColors } = useTheme();
    const styles = useSliderInputStyles();

    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    const handleValueChangeForDisplay = useCallback((newValue: number) => {
      setDisplayValue(newValue);
    }, []);

    const handleSlidingComplete = useCallback(
      (finalValue: number) => {
        onValueChange(finalValue);
      },
      [onValueChange],
    );

    const formattedDisplayValue = formatValueLabel
      ? formatValueLabel(displayValue)
      : displayValue.toString();

    return (
      <View style={[styles.fieldContainer, containerStyle]}>
        <View style={styles.labelContainer}>
          <Text style={[styles.sliderLabel, labelStyle]}>{label}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{formattedDisplayValue}</Text>
          </View>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={[styles.slider, sliderStyleProp]}
            minimumValue={minValue}
            maximumValue={maxValue}
            step={step}
            value={value}
            onValueChange={handleValueChangeForDisplay}
            onSlidingComplete={handleSlidingComplete}
            minimumTrackTintColor={themeColors.honey}
            maximumTrackTintColor={themeColors.lightGray}
            thumbTintColor={themeColors.honey}
          />
        </View>
      </View>
    );
  },
);

SliderInput.displayName = 'SliderInput';

export default SliderInput;
