import React from 'react';
import ComboBox from '.';
import { View, Text, Image } from 'react-native';
import styles from './styles';

const ImageComboBox = ({ list, placeholder, iconName, onSelect, value }) => {
  const renderItem = item => (
    <View style={styles.item}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemSubText}>{item.scientificName}</Text>
      </View>
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
      showSearchBar={true} // Habilita a barra de pesquisa
    />
  );
};

export default ImageComboBox;
