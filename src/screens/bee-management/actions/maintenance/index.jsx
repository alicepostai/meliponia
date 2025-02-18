import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import {supabase} from '../../../../services/supabase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import {colors} from '../../../../utils/Colors';
import ActionHeader from '../../../../components/header/actions-header';
import styles from './styles';

const HiveMaintenance = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {hiveId} = route.params;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  };

  const saveMaintenance = async values => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const {data, error} = await supabase
        .from('hive_maintenance')
        .insert([
          {
            hive_id: hiveId,
            dt_maintenance: currentDate.toISOString(),
            action: values.action,
            observation: values.observation,
          },
        ])
        .select();

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        throw error;
      }

      const {error: actionError} = await supabase.from('hive_action').insert([
        {
          user_id: user.id,
          hive_id: hiveId,
          action_type: 'Manejo',
          action_date: currentDate.toISOString(),
          observation: values.observation,
          action_id: data[0].id,
        },
      ]);

      if (actionError) {
        throw actionError;
      }

      console.log('Manutenção salva:', data);
      alert('Manutenção registrada com sucesso!');
      handleGoBack();
    } catch (error) {
      console.error('Erro ao salvar no Supabase:', error.message || error);
      alert('Erro ao salvar os dados.');
    }
  };

  const MaintenanceSchema = Yup.object().shape({
    action: Yup.string().required('A ação é obrigatória'),
  });

  return (
    <Formik
      initialValues={{
        action: '',
        observation: '',
      }}
      validationSchema={MaintenanceSchema}
      onSubmit={values => {
        console.log(values);
        saveMaintenance(values);
      }}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
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
            iconName="beekeeper"
            iconSize={40}
            iconColor={colors.honey}
            title="Manejo"
            subtitle="Informe quais cuidados foram realizados"
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
              placeholder="Data"
              placeholderTextColor={colors.secondary}
              value={currentDate.toLocaleDateString()}
              editable={false}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={currentDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="tools"
              size={25}
              color={colors.secondary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Ação (ex: Limpeza)"
              placeholderTextColor={colors.secondary}
              onChangeText={handleChange('action')}
              onBlur={handleBlur('action')}
              value={values.action}
            />
          </View>
          {errors.action && touched.action && (
            <Text style={styles.errorText}>{errors.action}</Text>
          )}

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

export default HiveMaintenance;
