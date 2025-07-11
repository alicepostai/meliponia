import React, { useState, useRef, useMemo, useCallback, ReactElement, memo } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
  FlatListProps,
  Text,
  LayoutChangeEvent,
} from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { useComboBoxStyles } from './styles';
import { ComboBoxItem } from '@/types/DataTypes';
import { metrics } from '@/theme/metrics';
interface ComboBoxProps<T extends ComboBoxItem>
  extends Omit<FlatListProps<T>, 'renderItem' | 'data'> {
  list: T[];
  placeholder?: string;
  iconName?: string;
  renderListItem: (item: T, onPress: () => void) => ReactElement | null;
  onSelect: (item: T | null) => void;
  selectedValue: T | null;
  showSearchBar?: boolean;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  searchPlaceholder?: string;
  error?: boolean;
  keyExtractor?: (item: T) => string;
  searchField?: keyof T | ((item: T) => string);
  ListEmptyComponent?: FlatListProps<T>['ListEmptyComponent'];
}
function ComboBoxComponent<T extends ComboBoxItem>({
  list,
  placeholder = 'Selecione...',
  iconName,
  renderListItem,
  onSelect,
  selectedValue,
  showSearchBar = false,
  label,
  containerStyle,
  inputContainerStyle,
  inputTextStyle,
  modalStyle,
  searchPlaceholder = 'Pesquisar...',
  error,
  keyExtractor = item => String(item.id),
  searchField = 'name',
  ListEmptyComponent,
  ...flatListProps
}: ComboBoxProps<T>) {
  const { colors: themeColors } = useTheme();
  const styles = useComboBoxStyles();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalContentHeight, setModalContentHeight] = useState(0);
  const flatListRef = useRef<FlatList<T>>(null);
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const handleSelectItem = useCallback(
    (item: T) => {
      onSelect(item);
      handleCloseModal();
    },
    [onSelect],
  );
  const getSearchableValue = useCallback(
    (item: T): string => {
      if (typeof searchField === 'function') {
        return searchField(item).toLowerCase();
      }
      const value = item[searchField];
      return String(value ?? '').toLowerCase();
    },
    [searchField],
  );
  const filteredList = useMemo(() => {
    if (!list || !Array.isArray(list)) {
      return [];
    }
    const sorted = [...list].sort((a, b) =>
      getSearchableValue(a).localeCompare(getSearchableValue(b)),
    );
    if (!searchTerm.trim() || !showSearchBar) {
      return sorted;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return sorted.filter(item => getSearchableValue(item).includes(lowerSearchTerm));
  }, [list, searchTerm, showSearchBar, getSearchableValue]);
  const calculateContentHeight = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    const maxModalHeight = Dimensions.get('window').height * 0.7;
    setModalContentHeight(Math.min(height, maxModalHeight));
  }, []);
  const renderItemCallback = useCallback(
    ({ item }: { item: T }) => {
      return renderListItem(item, () => handleSelectItem(item));
    },
    [renderListItem, handleSelectItem],
  );
  const displayValue = selectedValue ? selectedValue.name : '';
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        onPress={handleOpenModal}
        style={[styles.inputContainer, error && styles.errorBorder, inputContainerStyle]}
        activeOpacity={0.7}
      >
        {iconName && (
          <MaterialCommunityIcons
            name={iconName}
            size={metrics.iconSizeMedium}
            color={error ? themeColors.error : themeColors.secondary}
            style={styles.inputIcon}
          />
        )}
        <Text
          style={[styles.textInput, !displayValue && styles.placeholderText, inputTextStyle]}
          numberOfLines={1}
        >
          {displayValue || placeholder}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={metrics.iconSizeMedium}
          color={themeColors.secondary}
        />
      </TouchableOpacity>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={handleCloseModal}
        onBackButtonPress={handleCloseModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={[
          styles.modal,
          modalContentHeight > 0 && {
            height: modalContentHeight + (showSearchBar ? 60 : 20),
          },
        ]}
        useNativeDriverForBackdrop
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <View style={[styles.modalContainer, modalStyle]} onLayout={calculateContentHeight}>
          {showSearchBar && (
            <View style={styles.searchBarContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={metrics.iconSizeMedium}
                color={themeColors.secondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchBar}
                placeholder={searchPlaceholder}
                placeholderTextColor={themeColors.secondary}
                value={searchTerm}
                onChangeText={setSearchTerm}
                autoCapitalize="none"
                returnKeyType="search"
              />
            </View>
          )}
          <FlatList
            ref={flatListRef}
            data={filteredList}
            renderItem={renderItemCallback}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              ListEmptyComponent ||
              (() => (
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>Nenhum item encontrado.</Text>
                </View>
              ))
            }
            {...flatListProps}
          />
        </View>
      </Modal>
    </View>
  );
}
export default memo(ComboBoxComponent) as <T extends ComboBoxItem>(
  props: ComboBoxProps<T>,
) => ReactElement;
