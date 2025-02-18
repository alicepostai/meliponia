import React from 'react';
import {View, Text, Switch} from 'react-native';
import styles from './styles';

const SwitchInput = ({label, value, onValueChange}) => {
  return (
    <View style={styles.switchContainer}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: styles.trackColorFalse,
          true: styles.trackColorTrue,
        }}
        thumbColor={styles.thumbColor}
      />
      <Text style={styles.switchLabel}>{label}</Text>
    </View>
  );
};

export default SwitchInput;
