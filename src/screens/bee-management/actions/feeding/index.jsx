import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import {supabase} from '../../../../services/supabase';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../utils/Colors';
import ActionHeader from '../../../../components/header/actions-header';
import DatePickerInput from '../../../../components/forms/date-picker-input';
import RadioButtonGroup from '../../../../components/forms/radio-button-group';
import styles from './styles';

const HiveFeeding = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {hiveId} = route.params;

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleGoBack = () => navigation.goBack();

  const saveFeeding = async values => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const foodType =
        values.foodType === 'Outros' ? values.otherFoodType : values.foodType;

      const {data, error: feedingError} = await supabase
        .from('hive_feeding')
        .insert([
          {
            hive_id: hiveId,
            dt_feeding: selectedDate.toISOString(),
            food_type: foodType,
            observation: values.observation,
          },
        ])
        .select();

      if (feedingError) throw feedingError;

      const {error: actionError} = await supabase.from('hive_action').insert([
        {
          user_id: user.id,
          hive_id: hiveId,
          action_type: 'Alimentação',
          action_date: selectedDate.toISOString(),
          observation: values.observation,
          action_id: data[0].id,
        },
      ]);

      if (actionError) throw actionError;

      alert('Alimentação registrada com sucesso!');
      handleGoBack();
    } catch (error) {
      alert('Erro ao salvar os dados.');
    }
  };

  const foodOptions = [
    {label: 'Mel', value: 'Mel'},
    {label: 'Xarope', value: 'Xarope'},
    {label: 'Bombom de pólen', value: 'Bombom de pólen'},
    {label: 'Outros', value: 'Outros'},
  ];

  return (
    <Formik
      initialValues={{
        foodType: '',
        otherFoodType: '',
        observation: '',
      }}
      onSubmit={saveFeeding}>
      {({handleChange, handleBlur, handleSubmit, setFieldValue, values}) => (
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
            iconName="bee-flower"
            iconSize={40}
            iconColor={colors.honey}
            title="Alimentação"
            subtitle="Selecione o tipo de alimento fornecido"
            titleStyle={{fontSize: 30}}
            subtitleStyle={{color: '#555'}}
          />

          <DatePickerInput
            date={selectedDate}
            onDateChange={setSelectedDate}
            placeholder="Selecione a data"
          />

          <RadioButtonGroup
            options={foodOptions}
            selectedValue={values.foodType}
            onValueChange={value => setFieldValue('foodType', value)}
          />

          {values.foodType === 'Outros' && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Especifique o tipo de alimento"
                placeholderTextColor={colors.secondary}
                onChangeText={handleChange('otherFoodType')}
                onBlur={handleBlur('otherFoodType')}
                value={values.otherFoodType}
              />
            </View>
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
            onPress={handleSubmit}>
            <Text style={styles.signUpText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default HiveFeeding;
