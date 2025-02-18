import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const DatePickerInput = ({date, onDateChange, placeholder}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowDatePicker(true)}>
        <MaterialCommunityIcons
          name="calendar-outline"
          size={25}
          color={styles.iconColor}
        />
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={styles.placeholderColor}
          value={date.toLocaleDateString()}
          editable={false}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default DatePickerInput;
