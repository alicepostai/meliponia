import React, { memo, useCallback, ReactElement } from 'react';
import { Text, TouchableOpacity, StyleProp, ViewStyle, FlatListProps } from 'react-native';
import ComboBox from './index';
import { ComboBoxItem } from '@/types/DataTypes';
import { useTextListItemStyles } from './styles';
interface TextListItemProps<T extends ComboBoxItem> {
  item: T;
  onPress: () => void;
  displayProperty: keyof T;
}
function TextListItemComponent<T extends ComboBoxItem>({
  item,
  onPress,
  displayProperty,
}: TextListItemProps<T>) {
  const styles = useTextListItemStyles();
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer} activeOpacity={0.7}>
      <Text style={styles.itemText} numberOfLines={1}>
        {String(item[displayProperty] ?? '')}
      </Text>
    </TouchableOpacity>
  );
}
const TextListItem = memo(TextListItemComponent) as <T extends ComboBoxItem>(
  props: TextListItemProps<T>,
) => ReactElement;
interface TextComboBoxProps<T extends ComboBoxItem> {
  list: T[];
  placeholder?: string;
  iconName?: string;
  onSelect: (item: T | null) => void;
  selectedValue: T | null;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  error?: boolean;
  searchField?: keyof T | ((item: T) => string);
  keyExtractor?: (item: T) => string;
  showSearchBar?: boolean;
  displayProperty?: keyof T;
  ListEmptyComponent?: FlatListProps<T>['ListEmptyComponent'];
}
function TextComboBoxComponent<T extends ComboBoxItem>({
  list = [],
  placeholder,
  iconName,
  onSelect,
  selectedValue,
  label,
  containerStyle,
  error,
  searchField = 'name',
  keyExtractor = item => String(item.id),
  showSearchBar = false,
  displayProperty = 'name',
  ListEmptyComponent,
}: TextComboBoxProps<T>) {
  const renderTextListItem = useCallback(
    (item: T, onPress: () => void) => (
      <TextListItem item={item} onPress={onPress} displayProperty={displayProperty} />
    ),
    [displayProperty],
  );
  return (
    <ComboBox<T>
      list={list}
      placeholder={placeholder}
      iconName={iconName}
      renderListItem={renderTextListItem}
      keyExtractor={keyExtractor}
      onSelect={onSelect}
      selectedValue={
        selectedValue
          ? {
              ...selectedValue,
              name: String(selectedValue[displayProperty] ?? ''),
            }
          : null
      }
      showSearchBar={showSearchBar}
      searchField={searchField}
      label={label}
      containerStyle={containerStyle}
      error={error}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}
export default memo(TextComboBoxComponent) as <T extends ComboBoxItem>(
  props: TextComboBoxProps<T>,
) => ReactElement;
