import React from 'react';
import {View, Text, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {RadioButton} from 'react-native-paper';
import {colors} from '../../utils/Colors';
import styles from './styles';

const FilterModal = ({isVisible, onClose, onSelectFilter, selectedFilter}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="fadeIn"
      backdropOpacity={0.5}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Filtrar por:</Text>

        <Pressable
          style={styles.modalOption}
          onPress={() => {
            onSelectFilter('Todas');
            onClose();
          }}>
          <RadioButton
            value="Todas"
            status={selectedFilter === 'Todas' ? 'checked' : 'unchecked'}
            onPress={() => {
              onSelectFilter('Todas');
              onClose();
            }}
            color={colors.primary}
          />
          <Text style={styles.modalOptionText}>Todas</Text>
        </Pressable>

        <Pressable
          style={styles.modalOption}
          onPress={() => {
            onSelectFilter('Ativas');
            onClose();
          }}>
          <RadioButton
            value="Ativas"
            status={selectedFilter === 'Ativas' ? 'checked' : 'unchecked'}
            onPress={() => {
              onSelectFilter('Ativas');
              onClose();
            }}
            color={colors.primary}
          />
          <Text style={styles.modalOptionText}>Ativas</Text>
        </Pressable>

        <Pressable
          style={styles.modalOption}
          onPress={() => {
            onSelectFilter('Vendidas');
            onClose();
          }}>
          <RadioButton
            value="Vendidas"
            status={selectedFilter === 'Vendidas' ? 'checked' : 'unchecked'}
            onPress={() => {
              onSelectFilter('Vendidas');
              onClose();
            }}
            color={colors.primary}
          />
          <Text style={styles.modalOptionText}>Vendidas</Text>
        </Pressable>

        <Pressable
          style={styles.modalOption}
          onPress={() => {
            onSelectFilter('Doadas');
            onClose();
          }}>
          <RadioButton
            value="Doadas"
            status={selectedFilter === 'Doadas' ? 'checked' : 'unchecked'}
            onPress={() => {
              onSelectFilter('Doadas');
              onClose();
            }}
            color={colors.primary}
          />
          <Text style={styles.modalOptionText}>Doadas</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default FilterModal;
