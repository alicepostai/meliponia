import React, { useState, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleProp, ViewStyle } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { useDatePickerInputStyles } from './styles';
import { metrics } from '@/theme/metrics';
import { formatDate } from '@/utils/helpers';
interface DatePickerInputProps {
  label?: string;
  date: Date | null;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  error?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}
const DatePickerInput = memo(
  ({
    label,
    date,
    onDateChange,
    placeholder = 'Selecione a data',
    containerStyle,
    inputContainerStyle,
    error,
    minimumDate,
    maximumDate,
  }: DatePickerInputProps) => {
    const { colors: themeColors } = useTheme();
    const styles = useDatePickerInputStyles();
    const [showPicker, setShowPicker] = useState(false);
    const handleDateChangeInternal = useCallback(
      (event: DateTimePickerEvent, selectedDate?: Date) => {
        const isIOS = Platform.OS === 'ios';
        setShowPicker(isIOS);
        if (event.type === 'dismissed' && !isIOS) {
          setShowPicker(false);
          return;
        }
        if (selectedDate) {
          const now = new Date();
          const isToday =
            selectedDate.getDate() === now.getDate() &&
            selectedDate.getMonth() === now.getMonth() &&
            selectedDate.getFullYear() === now.getFullYear();

          let finalDate: Date;
          if (isToday) {
            finalDate = now;
          } else {
            finalDate = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              now.getHours(),
              now.getMinutes(),
              now.getSeconds(),
              now.getMilliseconds(),
            );
          }
          onDateChange(finalDate);
        }
        if (!isIOS) {
          setShowPicker(false);
        }
      },
      [onDateChange],
    );
    const openPicker = useCallback(() => {
      setShowPicker(true);
    }, []);
    const displayValue = date ? formatDate(date) : '';
    const iconColor = error ? themeColors.error : themeColors.textSecondary;
    return (
      <View style={[styles.fieldContainer, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TouchableOpacity
          style={[styles.inputContainer, error && styles.errorBorder, inputContainerStyle]}
          onPress={openPicker}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="calendar-outline"
            size={metrics.iconSizeMedium}
            color={iconColor}
            style={styles.icon}
          />
          <Text
            style={[styles.textInput, !displayValue && styles.placeholderText]}
            numberOfLines={1}
          >
            {displayValue || placeholder}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChangeInternal}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )}
      </View>
    );
  },
);

DatePickerInput.displayName = 'DatePickerInput';

export default DatePickerInput;
