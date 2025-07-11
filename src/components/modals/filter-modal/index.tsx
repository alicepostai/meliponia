import React, { memo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';
import { useFilterModalStyles } from './styles';
type FilterOption = 'Todas' | 'Ativas' | 'Vendidas' | 'Doadas' | 'Perdidas';
interface FilterOptionItemProps {
  option: { label: string; value: FilterOption };
  isSelected: boolean;
  onSelect: (filter: FilterOption) => void;
}
const FilterOptionItem = memo(({ option, isSelected, onSelect }: FilterOptionItemProps) => {
  const { colors } = useTheme();
  const styles = useFilterModalStyles();
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
});
interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectFilter: (filter: FilterOption) => void;
  selectedFilter: FilterOption;
}
const defaultFilterOptions: { label: string; value: FilterOption }[] = [
  { label: 'Todas', value: 'Todas' },
  { label: 'Ativas', value: 'Ativas' },
  { label: 'Vendidas', value: 'Vendidas' },
  { label: 'Doadas', value: 'Doadas' },
  { label: 'Perdidas', value: 'Perdidas' },
];
const FilterModal = memo(
  ({ isVisible, onClose, onSelectFilter, selectedFilter }: FilterModalProps) => {
    const styles = useFilterModalStyles();
    const handleSelect = useCallback(
      (filter: FilterOption) => {
        onSelectFilter(filter);
        onClose();
      },
      [onSelectFilter, onClose],
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
          <Text style={styles.modalTitle}>Filtrar por Status:</Text>
          {defaultFilterOptions.map(option => (
            <FilterOptionItem
              key={option.value}
              option={option}
              isSelected={selectedFilter === option.value}
              onSelect={handleSelect}
            />
          ))}
        </View>
      </Modal>
    );
  },
);
export default FilterModal;
