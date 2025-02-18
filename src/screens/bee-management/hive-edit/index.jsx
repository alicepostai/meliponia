import {useNavigation, useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import {supabase} from '../../../services/supabase';
import React, {useEffect, useState} from 'react';
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

const HiveEdit = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {hiveId} = route.params;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [initialValues, setInitialValues] = useState({
    species: '',
    state: '',
    boxType: '',
    hiveOrigin: '',
    code: '',
    description: '',
  });

  useEffect(() => {
    const fetchHiveData = async () => {
      try {
        const {data, error} = await supabase
          .from('hive')
          .select('*')
          .eq('id', hiveId)
          .single();

        if (error) throw error;

        setInitialValues({
          species: species.find(s => s.id === data.bee_species_id),
          state: states.find(s => s.name === data.origin_state_loc),
          boxType: boxType.find(b => b.name === data.box_type),
          hiveOrigin: hiveOrigin.find(h => h.name === data.hive_origin),
          code: data.hive_code,
          description: data.description,
        });
        setSelectedDate(new Date(data.acquisition_date));
      } catch (error) {
        console.error('Erro ao buscar dados da colmeia:', error);
      }
    };

    fetchHiveData();
  }, [hiveId]);

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

      const {data, error} = await supabase
        .from('hive')
        .update({
          bee_species_id: values.species.id,
          origin_state_loc: values.state.name,
          box_type: values.boxType.name,
          hive_origin: values.hiveOrigin.name,
          acquisition_date: selectedDate ? selectedDate.toISOString() : null,
          hive_code: values.code,
          description: values.description,
          bee_species_scientific_name: values.species.scientificName,
        })
        .eq('id', hiveId);

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        throw error;
      }

      console.log('Dados atualizados:', data);
      alert('Enxame atualizado com sucesso!');
      handleGoBack();
    } catch (error) {
      console.error('Erro ao salvar no Supabase:', error.message || error);
      alert('Erro ao salvar os dados.');
    }
  };

  const SignUpSchema = Yup.object().shape({
    //add validaçoes
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpSchema}
      onSubmit={values => {
        console.log(
          values.species.id,
          values.state.name,
          values.boxType.name,
          values.hiveOrigin.name,
          values.code,
          values.description,
          values.species.scientificName,
        );
        saveHive(values);
      }}
      enableReinitialize>
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
            title="Editar Enxame"
            subtitle="Preencha os detalhes abaixo para editar o enxame"
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
            onSelect={item => {
              setFieldValue('hiveOrigin', item);
              if (item.name !== 'Compra') {
                setFieldValue('price', '0');
              }
            }}
          />
          {errors.hiveOrigin && touched.hiveOrigin && (
            <Text style={styles.errorText}>{errors.hiveOrigin}</Text>
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

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="barcode"
              size={25}
              color={colors.secondary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Código do enxame (opcional)"
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
            <Text style={styles.signUpText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default HiveEdit;
