import React, { memo } from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Picker, PickerProps } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { usePickerInputStyles } from './styles';
import { metrics } from '@/theme/metrics';
interface PickerItem {
  label: string;
  value: string | number;
  enabled?: boolean;
}
interface PickerInputProps extends Omit<PickerProps, 'selectedValue' | 'onValueChange' | 'style'> {
  label?: string;
  items: PickerItem[];
  selectedValue: string | number | undefined | null;
  onValueChange: (value: string | number, itemIndex: number) => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  pickerStyle?: StyleProp<ViewStyle>;
  pickerItemStyle?: StyleProp<TextStyle>;
  error?: boolean;
  iconName?: string;
}
const PickerInput = memo(
  ({
    label,
    items,
    selectedValue,
    onValueChange,
    placeholder = 'Selecione...',
    containerStyle,
    labelStyle,
    pickerStyle,
    pickerItemStyle,
    error,
    iconName,
    ...pickerProps
  }: PickerInputProps) => {
    const { colors } = useTheme();
    const styles = usePickerInputStyles();
    return (
      <View style={containerStyle}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <View style={[styles.inputContainer, error && styles.errorBorder, pickerStyle]}>
          {iconName && (
            <MaterialCommunityIcons
              name={iconName}
              size={metrics.iconSizeMedium}
              color={error ? colors.error : colors.secondary}
              style={styles.icon}
            />
          )}
          <Picker
            selectedValue={selectedValue === null ? undefined : selectedValue}
            onValueChange={onValueChange}
            style={styles.picker}
            dropdownIconColor={colors.secondary}
            {...pickerProps}
          >
            <Picker.Item
              label={placeholder}
              value={undefined}
              enabled={false}
              style={styles.placeholderItem}
            />
            {items.map(item => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
                style={[styles.pickerItem, pickerItemStyle]}
                enabled={item.enabled !== false}
              />
            ))}
          </Picker>
        </View>
      </View>
    );
  },
);
export default PickerInput;
