import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import {supabase} from '../../../services/supabase';
import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import {species} from '../../../constants/lists/BeeSpeciesList';
import {boxType} from '../../../constants/lists/BoxType';
import {hiveOrigin} from '../../../constants/lists/HiveOrigin';
import {states} from '../../../constants/lists/States';
import {colors} from '../../../utils/Colors';
import ImageComboBox from '../../../components/combo-box/ImageComboBox';
import TextComboBox from '../../../components/combo-box/TextComboBox.jsx';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';
import ActionHeader from '../../../components/header/actions-header';

const HiveRegistration = () => {
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [purchaseValue, setPurchaseValue] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const saveHive = async values => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const {data, error} = await supabase.from('hive').insert([
        {
          user_id: user.id,
          bee_species_id: values.species.id,
          origin_state_loc: values.state.name,
          box_type: values.boxType.name,
          hive_origin: values.hiveOrigin.name,
          acquisition_date: selectedDate ? selectedDate.toISOString() : null,
          hive_code: values.code,
          description: values.description,
          bee_species_scientific_name: values.species.scientificName,
          purchase_value:
            values.hiveOrigin.name === 'Compra'
              ? parseFloat(purchaseValue)
              : null,
        },
      ]);

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        throw error;
      }

      console.log('Dados salvos:', data);
      alert('Enxame cadastrado com sucesso!');
      handleGoBack();
    } catch (error) {
      console.error('Erro ao salvar no Supabase:', error.message || error);
      alert('Erro ao salvar os dados.');
    }
  };

  const SignUpSchema = Yup.object().shape({
    species: Yup.object().required('Espécie é obrigatória'),
    state: Yup.object().required('Estado de origem é obrigatório'),
    boxType: Yup.object().required('Modelo de caixa é obrigatório'),
    hiveOrigin: Yup.object().required('Forma de aquisição é obrigatória'),
    code: Yup.string().required('O código do enxame é obrigatório'),
  });

  return (
    <Formik
      initialValues={{
        species: '',
        state: '',
        boxType: '',
        hiveOrigin: '',
        code: '',
        description: '',
      }}
      validationSchema={SignUpSchema}
      onSubmit={values => {
        if (!selectedDate) {
          alert('Data de aquisição é obrigatória');
          return;
        }
        saveHive(values);
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButtonWrapper}
            onPress={handleGoBack}>
            <MaterialCommunityIcons
              name="arrow-left"
              color={colors.primary}
              size={25}
            />
          </TouchableOpacity>

          <ActionHeader
            iconName="beehive-outline"
            iconSize={40}
            iconColor={colors.honey}
            title="Cadastrar um enxame"
            subtitle="Preencha os detalhes abaixo para cadastrar um novo enxame"
            titleStyle={{fontSize: 30}}
            subtitleStyle={{color: '#555'}}
          />

          <ImageComboBox
            list={species}
            placeholder="Selecione a espécie"
            iconName="bee"
            value={values.species}
            onSelect={item => setFieldValue('species', item)}
          />
          {errors.species && touched.species && (
            <Text style={styles.errorText}>{errors.species}</Text>
          )}

          <TextComboBox
            list={states}
            placeholder="Selecione o estado de origem"
            iconName="map-marker-outline"
            value={values.state}
            onSelect={item => setFieldValue('state', item)}
          />
          {errors.state && touched.state && (
            <Text style={styles.errorText}>{errors.state}</Text>
          )}

          <TextComboBox
            list={boxType}
            placeholder="Selecione o modelo de caixa"
            iconName="cube"
            value={values.boxType}
            onSelect={item => setFieldValue('boxType', item)}
          />
          {errors.boxType && touched.boxType && (
            <Text style={styles.errorText}>{errors.boxType}</Text>
          )}

          <TextComboBox
            list={hiveOrigin}
            placeholder="Selecione a forma de aquisição"
            iconName="beehive-outline"
            value={values.hiveOrigin}
            onSelect={item => setFieldValue('hiveOrigin', item)}
          />
          {errors.hiveOrigin && touched.hiveOrigin && (
            <Text style={styles.errorText}>{errors.hiveOrigin}</Text>
          )}

          {values.hiveOrigin.name === 'Compra' && (
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={25}
                color={colors.secondary}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Preço de compra"
                placeholderTextColor={colors.secondary}
                onChangeText={setPurchaseValue}
                value={purchaseValue}
                keyboardType="numeric"
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={25}
              color={colors.secondary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Data de aquisição"
              placeholderTextColor={colors.secondary}
              value={selectedDate ? selectedDate.toLocaleDateString() : ''}
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                }
              }}
            />
          )}
          {!selectedDate && touched.acquisition_date && (
            <Text style={styles.errorText}>
              Data de aquisição é obrigatória
            </Text>
          )}

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="barcode"
              size={25}
              color={colors.secondary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Código do enxame"
              placeholderTextColor={colors.secondary}
              onChangeText={handleChange('code')}
              onBlur={handleBlur('code')}
              value={values.code}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={25}
              color={colors.secondary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Descrição (opcional)"
              placeholderTextColor={colors.secondary}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
            />
          </View>

          <TouchableOpacity
            style={styles.signUpButtonWrapper}
            onPress={() => handleSubmit()}>
            <Text style={styles.signUpText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default HiveRegistration;
