import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import ComboBox from '.';

const TextComboBox = ({list, placeholder, iconName, onSelect, value}) => {
  const renderItem = item => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <ComboBox
      list={list}
      placeholder={placeholder}
      iconName={iconName}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      onSelect={onSelect}
      value={value}
      showSearchBar={false}
    />
  );
};

export default TextComboBox;
