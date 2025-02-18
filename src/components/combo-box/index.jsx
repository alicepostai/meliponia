import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../utils/Colors';
import styles from './styles';

const ComboBox = ({ list, placeholder, iconName, renderItem, keyExtractor, onSelect, value, showSearchBar }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [contentHeight, setContentHeight] = useState(0); // Estado para armazenar a altura do conteúdo
  const flatListRef = useRef(null); // Referência para o FlatList

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleSelectItem = (item) => {
    onSelect(item);
    setIsModalVisible(false);
  };

  // Ordena a lista alfabeticamente pelo campo 'name'
  const sortedList = list.sort((a, b) => a.name.localeCompare(b.name));

  // Filtra a lista com base no termo de pesquisa
  const filteredList = sortedList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcula a altura do conteúdo
  const calculateContentHeight = (event) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  // Define a altura máxima do modal (80% da tela)
  const maxModalHeight = Dimensions.get('window').height * 0.8;

  return (
    <View>
      <TouchableOpacity onPress={handleOpenModal} style={styles.inputContainer}>
        <MaterialCommunityIcons name={iconName} size={25} color={colors.secondary} />
        <TextInput
          style={styles.textInput}
          editable={false}
          placeholder={placeholder}
          placeholderTextColor={colors.secondary}
          value={value ? value.name : ''}
        />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={() => setIsModalVisible(false)}
        animationIn="pulse"
        animationOut="slideOutDown"
        style={[styles.modal, { height: Math.min(contentHeight, maxModalHeight) }]} // Ajusta a altura do modal
      >
        <View style={styles.modalContainer} onLayout={calculateContentHeight}>

          {showSearchBar && (
            <TextInput
              style={styles.searchBar}
              placeholder="Pesquisar..."
              placeholderTextColor={colors.secondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          )}

          <FlatList
            ref={flatListRef}
            data={filteredList}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectItem(item)}>
                {renderItem(item)}
              </TouchableOpacity>
            )}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ComboBox;
