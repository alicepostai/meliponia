import React, { memo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import ComboBox from './index';
import { BeeSpecies } from '@/types/ConstantsTypes';
import { useImageListItemStyles } from './styles';
interface ImageListItemProps {
  item: BeeSpecies;
  onPress: () => void;
}
const ImageListItem = memo(({ item, onPress }: ImageListItemProps) => {
  const styles = useImageListItemStyles();
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer} activeOpacity={0.7}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.textContainer}>
        <Text style={styles.itemText} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemSubText} numberOfLines={1}>
          {item.scientificName}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
ImageListItem.displayName = 'ImageListItem';
interface ImageComboBoxProps {
  list: BeeSpecies[];
  placeholder?: string;
  iconName?: string;
  onSelect: (item: BeeSpecies | null) => void;
  selectedValue: BeeSpecies | null;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  error?: boolean;
}
const ImageComboBox = memo(
  ({
    list = [],
    placeholder,
    iconName,
    onSelect,
    selectedValue,
    label,
    containerStyle,
    error,
  }: ImageComboBoxProps) => {
    const renderImageListItem = useCallback(
      (item: BeeSpecies, onPress: () => void) => <ImageListItem item={item} onPress={onPress} />,
      [],
    );
    return (
      <ComboBox<BeeSpecies>
        list={list}
        placeholder={placeholder}
        iconName={iconName}
        renderListItem={renderImageListItem}
        keyExtractor={item => item.id.toString()}
        onSelect={onSelect}
        selectedValue={selectedValue}
        showSearchBar={true}
        searchField={item => `${item.name} ${item.scientificName}`}
        label={label}
        containerStyle={containerStyle}
        error={error}
      />
    );
  },
);
ImageComboBox.displayName = 'ImageComboBox';
export default ImageComboBox;
