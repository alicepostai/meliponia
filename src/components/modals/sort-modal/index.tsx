import React, { memo, useCallback, ReactElement } from 'react';
import { View, Text, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';
import { useSortModalStyles } from './styles';
import { SortDirection } from '@/hooks/UseHiveList';
export interface SortOptionItem<T extends string> {
  label: string;
  value: T;
}
interface SortOptionItemProps<T extends string> {
  option: SortOptionItem<T>;
  isSelected: boolean;
  onSelect: (value: T) => void;
}
function SortOptionItemComponent<T extends string>({
  option,
  isSelected,
  onSelect,
}: SortOptionItemProps<T>) {
  const { colors } = useTheme();
  const styles = useSortModalStyles();
  return (
    <Pressable
      style={styles.modalOption}
      onPress={() => onSelect(option.value)}
      android_ripple={{ color: colors.border, borderless: false }}
    >
      <RadioButton.Android
        value={option.value}
        status={isSelected ? 'checked' : 'unchecked'}
        onPress={() => onSelect(option.value)}
        color={colors.honey}
        uncheckedColor={colors.secondary}
      />
      <Text style={styles.modalOptionText}>{option.label}</Text>
    </Pressable>
  );
}
const SortOptionItem = memo(SortOptionItemComponent) as <T extends string>(
  props: SortOptionItemProps<T>,
) => ReactElement;
interface SortModalProps<T extends string> {
  isVisible: boolean;
  onClose: () => void;
  onSelectSort: (option: T, direction: SortDirection) => void;
  currentSortOption: T;
  currentSortDirection: SortDirection;
  options: SortOptionItem<T>[];
  title?: string;
}
function SortModalComponent<T extends string>({
  isVisible,
  onClose,
  onSelectSort,
  currentSortOption,
  currentSortDirection,
  options,
  title = 'Ordenar Por:',
}: SortModalProps<T>) {
  const styles = useSortModalStyles();
  const handleSelect = useCallback(
    (option: T) => {
      const newDirection =
        currentSortOption === option ? (currentSortDirection === 'desc' ? 'asc' : 'desc') : 'desc';
      onSelectSort(option, newDirection);
      onClose();
    },
    [currentSortOption, currentSortDirection, onSelectSort, onClose],
  );
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropOpacity={0.4}
      style={styles.modal}
      useNativeDriverForBackdrop
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        {options.map(option => (
          <SortOptionItem<T>
            key={option.value}
            option={option}
            isSelected={currentSortOption === option.value}
            onSelect={handleSelect}
          />
        ))}
      </View>
    </Modal>
  );
}
export default memo(SortModalComponent) as <T extends string>(
  props: SortModalProps<T>,
) => ReactElement;
