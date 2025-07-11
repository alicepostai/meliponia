import React, { memo } from 'react';
import {
  View,
  Text,
  Switch,
  SwitchProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useSwitchInputStyles } from './styles';
interface SwitchInputProps
  extends Omit<SwitchProps, 'value' | 'onValueChange' | 'style' | 'trackColor' | 'thumbColor'> {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  switchStyleProp?: StyleProp<ViewStyle>;
  disabled?: boolean;
}
const SwitchInput = memo(
  ({
    label,
    value,
    onValueChange,
    containerStyle,
    labelStyle,
    switchStyleProp,
    disabled = false,
    ...rest
  }: SwitchInputProps) => {
    const { colors: themeColors, isDarkMode } = useTheme();
    const styles = useSwitchInputStyles();
    return (
      <View
        style={[styles.fieldContainer, containerStyle, disabled && styles.disabledContainerOpacity]}
      >
        <Text style={[styles.switchLabel, labelStyle, disabled && styles.disabledLabelColor]}>
          {label}
        </Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: isDarkMode ? themeColors.darkGray : themeColors.gray,
            true: themeColors.secondary,
          }}
          thumbColor={
            Platform.OS === 'android'
              ? value
                ? themeColors.secondary
                : themeColors.lightGray
              : themeColors.white
          }
          ios_backgroundColor={isDarkMode ? themeColors.darkGray : themeColors.gray}
          style={[styles.switchStyle, switchStyleProp]}
          disabled={disabled}
          {...rest}
        />
      </View>
    );
  },
);

SwitchInput.displayName = 'SwitchInput';

export default SwitchInput;
