import React, { memo, ReactElement } from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { RadioButton, TouchableRipple } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';
import { useRadioButtonGroupStyles } from './styles';

interface RadioOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}

interface RadioButtonGroupProps<T = string | number> {
  options: RadioOption<T>[];
  selectedValue: T | null | undefined;
  onValueChange: (value: T) => void;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  optionContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  optionLabelStyle?: StyleProp<TextStyle>;
}

function RadioButtonGroupComponent<T extends string | number>({
  options,
  selectedValue,
  onValueChange,
  label,
  containerStyle,
  optionContainerStyle,
  labelStyle,
  optionLabelStyle,
}: RadioButtonGroupProps<T>) {
  const { colors: themeColors } = useTheme();
  const styles = useRadioButtonGroupStyles();

  return (
    <View style={[styles.groupContainer, containerStyle]}>
      {label && <Text style={[styles.groupLabel, labelStyle]}>{label}</Text>}
      {options.map(option => (
        <TouchableRipple
          key={option.value.toString()}
          onPress={() => !option.disabled && onValueChange(option.value)}
          disabled={option.disabled}
          style={[styles.optionContainer, optionContainerStyle]}
          rippleColor={themeColors.secondary + '33'}
        >
          <View style={styles.innerOptionContainer}>
            <RadioButton.Android
              value={option.value.toString()}
              status={selectedValue === option.value ? 'checked' : 'unchecked'}
              onPress={() => !option.disabled && onValueChange(option.value)}
              color={themeColors.secondary}
              uncheckedColor={themeColors.secondary}
              disabled={option.disabled}
            />
            <Text
              style={[
                styles.optionLabel,
                optionLabelStyle,
                option.disabled && styles.disabledLabel,
              ]}
            >
              {option.label}
            </Text>
          </View>
        </TouchableRipple>
      ))}
    </View>
  );
}

export default memo(RadioButtonGroupComponent) as <T extends string | number>(
  props: RadioButtonGroupProps<T>,
) => ReactElement;
