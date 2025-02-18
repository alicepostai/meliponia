import React from 'react';
import {View, Text} from 'react-native';
import {RadioButton} from 'react-native-paper';
import styles from './styles';

const RadioButtonGroup = ({options, selectedValue, onValueChange}) => {
  return (
    <View>
      {options.map(option => (
        <View key={option.value} style={styles.radioButtonContainer}>
          <RadioButton
            value={option.value}
            status={selectedValue === option.value ? 'checked' : 'unchecked'}
            onPress={() => onValueChange(option.value)}
            color={styles.radioButtonColor}
            uncheckedColor={styles.radioButtonUncheckedColor}
          />
          <Text style={styles.radioButtonLabel}>{option.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default RadioButtonGroup;
