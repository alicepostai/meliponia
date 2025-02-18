import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Switch} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import {supabase} from '../../../../services/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import {colors} from '../../../../utils/Colors';
import ActionHeader from '../../../../components/header/actions-header';
import styles from './styles';

const HiveInspection = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {hiveId} = route.params;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getReserveLevel = value => {
    if (value === 1) return 'Ruim';
    if (value === 2) return 'Médio';
    if (value === 3) return 'Bom';
    if (value === 4) return 'Ótimo';
    return 'Médio';
  };

  const saveInspection = async values => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const honeyReserveLevel = getReserveLevel(values.honeyReserve);
      const pollenReserveLevel = getReserveLevel(values.pollenReserve);

      const {data, error: inspectionError} = await supabase
        .from('hive_inspection')
        .insert([
          {
            user_id: user.id,
            hive_id: hiveId,
            dt_inspection: selectedDate.toISOString(),
            queen_located: values.queenLocated,
            queen_laying: values.queenLaying,
            pests_or_diseases: values.pestsOrDiseases,
            honey_reserve: honeyReserveLevel,
            pollen_reserve: pollenReserveLevel,
            observation: values.observation,
          },
        ])
        .select();

      if (inspectionError) {
        throw inspectionError;
      }

      const {error: actionError} = await supabase.from('hive_action').insert([
        {
          user_id: user.id,
          hive_id: hiveId,
          action_type: 'Revisão',
          action_date: selectedDate.toISOString(),
          observation: values.observation,
          action_id: data[0].id,
        },
      ]);

      if (actionError) {
        throw actionError;
      }

      console.log('Revisão registrada com sucesso!');
      alert('Revisão registrada com sucesso!');
      handleGoBack();
    } catch (error) {
      console.error('Erro ao salvar a revisão:', error.message || error);
      alert('Erro ao salvar os dados.');
    }
  };

  return (
    <Formik
      initialValues={{
        queenLocated: false,
        queenLaying: false,
        pestsOrDiseases: false,
        honeyReserve: 2,
        pollenReserve: 2,
        observation: '',
      }}
      onSubmit={values => {
        console.log(values);
        saveInspection(values);
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
            iconName="check-circle-outline"
            iconSize={40}
            iconColor={colors.honey}
            title="Revisão"
            subtitle="Registre a revisão da colmeia"
            titleStyle={{fontSize: 30}}
            subtitleStyle={{color: '#555'}}
          />

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
              placeholder="Selecione a data"
              placeholderTextColor={colors.secondary}
              value={selectedDate.toLocaleDateString()}
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
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

          <View style={styles.checkboxContainer}>
            <Switch
              value={values.queenLocated}
              onValueChange={value => setFieldValue('queenLocated', value)}
              trackColor={{false: colors.gray, true: colors.honey}}
              thumbColor={values.queenLocated ? colors.white : colors.white}
            />
            <Text style={styles.checkboxLabel}>Rainha encontrada</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <Switch
              value={values.queenLaying}
              onValueChange={value => setFieldValue('queenLaying', value)}
              trackColor={{false: colors.gray, true: colors.honey}}
              thumbColor={values.queenLaying ? colors.white : colors.white}
            />
            <Text style={styles.checkboxLabel}>Postura</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <Switch
              value={values.pestsOrDiseases}
              onValueChange={value => setFieldValue('pestsOrDiseases', value)}
              trackColor={{false: colors.gray, true: colors.honey}}
              thumbColor={values.pestsOrDiseases ? colors.white : colors.white}
            />
            <Text style={styles.checkboxLabel}>Pestes ou doenças</Text>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Reserva de Mel: {getReserveLevel(values.honeyReserve)}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={4}
              step={1}
              value={values.honeyReserve}
              onValueChange={value => setFieldValue('honeyReserve', value)}
              minimumTrackTintColor={colors.honey}
              maximumTrackTintColor={colors.gray}
              thumbTintColor={colors.honey}
            />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Reserva de Pólen: {getReserveLevel(values.pollenReserve)}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={4}
              step={1}
              value={values.pollenReserve}
              onValueChange={value => setFieldValue('pollenReserve', value)}
              minimumTrackTintColor={colors.honey}
              maximumTrackTintColor={colors.gray}
              thumbTintColor={colors.honey}
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
              placeholder="Observações (opcional)"
              placeholderTextColor={colors.secondary}
              onChangeText={handleChange('observation')}
              onBlur={handleBlur('observation')}
              value={values.observation}
              multiline
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

export default HiveInspection;
