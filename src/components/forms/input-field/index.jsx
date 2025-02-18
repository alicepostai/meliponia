import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const InputField = ({
  iconName,
  placeholder,
  placeholderTextColor,
  secureTextEntry,
  value,
  onChangeText,
  onBlur,
  keyboardType,
  toggleSecureEntry,
}) => {
  return (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons
        name={iconName}
        size={30}
        color={styles.iconColor}
      />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
      />
      {toggleSecureEntry && (
        <TouchableOpacity onPress={toggleSecureEntry}>
          <MaterialCommunityIcons
            name={'eye-outline'}
            size={20}
            color={styles.iconColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputField;
