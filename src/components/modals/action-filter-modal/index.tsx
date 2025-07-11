import React, { useState, memo, useCallback, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Checkbox } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';
import { useActionFilterModalStyles } from './styles';
import { ActionTypeFilter } from '@/hooks/UseActionHistory';
import MainButton from '@/components/buttons/main-button';
interface ActionFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ActionTypeFilter[]) => void;
  currentFilters: ActionTypeFilter[];
}
const actionOptions: { label: string; value: ActionTypeFilter }[] = [
  { label: 'Revisão', value: 'Revisão' },
  { label: 'Alimentação', value: 'Alimentação' },
  { label: 'Colheita', value: 'Colheita' },
  { label: 'Manejo', value: 'Manejo' },
  { label: 'Transferência de Caixa', value: 'Transferência de Caixa' },
  { label: 'Divisão de Enxame', value: 'Divisão de Enxame' },
  { label: 'Divisão Origem', value: 'Divisão Origem' },
];
interface FilterOptionProps {
  option: { label: string; value: ActionTypeFilter };
  isChecked: boolean;
  onToggle: (filter: ActionTypeFilter) => void;
}
const FilterOption = memo(({ option, isChecked, onToggle }: FilterOptionProps) => {
  const { colors: themeColors } = useTheme();
  const styles = useActionFilterModalStyles();
  return (
    <Pressable
      style={styles.modalOption}
      onPress={() => onToggle(option.value)}
      android_ripple={{ color: themeColors.border, borderless: false }}
    >
      <Checkbox.Android
        status={isChecked ? 'checked' : 'unchecked'}
        onPress={() => onToggle(option.value)}
        color={themeColors.honey}
      />
      <Text style={styles.modalOptionText}>{option.label}</Text>
    </Pressable>
  );
});
const ActionFilterModal = memo(
  ({ isVisible, onClose, onApplyFilters, currentFilters }: ActionFilterModalProps) => {
    const styles = useActionFilterModalStyles();
    const [selectedFilters, setSelectedFilters] = useState<ActionTypeFilter[]>(currentFilters);
    useEffect(() => {
      if (isVisible) {
        setSelectedFilters(currentFilters);
      }
    }, [isVisible, currentFilters]);
    const handleToggleFilter = useCallback((filter: ActionTypeFilter) => {
      setSelectedFilters(prev =>
        prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter],
      );
    }, []);
    const handleApply = useCallback(() => {
      onApplyFilters(selectedFilters);
      onClose();
    }, [onApplyFilters, selectedFilters, onClose]);
    const handleClear = useCallback(() => {
      setSelectedFilters([]);
    }, []);
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
          <Text style={styles.modalTitle}>Filtrar por Tipo de Ação:</Text>
          <ScrollView>
            {actionOptions.map(option => (
              <FilterOption
                key={option.value}
                option={option}
                isChecked={selectedFilters.includes(option.value)}
                onToggle={handleToggleFilter}
              />
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>
            <MainButton title="Aplicar Filtros" onPress={handleApply} style={styles.applyButton} />
          </View>
        </View>
      </Modal>
    );
  },
);
export default ActionFilterModal;
