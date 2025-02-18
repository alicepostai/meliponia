import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import {supabase} from '../../../../services/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextComboBox from '../../../../components/combo-box/TextComboBox.jsx';
import {boxType} from '../../../../constants/lists/BoxType';
import {colors} from '../../../../utils/Colors';
import ActionHeader from '../../../../components/header/actions-header';
import styles from './styles';

const HiveTransfer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {hiveId} = route.params;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleGoBack = () => {
    navigation.goBack();
  };

  const saveTransfer = async values => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const {error: hiveError} = await supabase
        .from('hive')
        .update({box_type: values.boxType.name})
        .eq('id', hiveId);

      if (hiveError) {
        throw hiveError;
      }

      const {error: actionError} = await supabase.from('hive_action').insert([
        {
          user_id: user.id,
          hive_id: hiveId,
          action_type: 'Transferência',
          action_date: selectedDate.toISOString(),
          observation: values.observation,
        },
      ]);

      if (actionError) {
        throw actionError;
      }

      console.log('Transferência registrada com sucesso!');
      alert('Transferência registrada com sucesso!');
      handleGoBack();
    } catch (error) {
      console.error('Erro ao salvar a transferência:', error.message || error);
      alert('Erro ao salvar os dados.');
    }
  };

  return (
    <Formik
      initialValues={{
        boxType: null,
        observation: '',
      }}
      onSubmit={values => {
        console.log(values);
        saveTransfer(values);
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
            iconName="transfer"
            iconSize={40}
            iconColor={colors.honey}
            title="Transferir colméia"
            subtitle="Escolha para onde deseja transferir a colméia"
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

          <TextComboBox
            list={boxType}
            placeholder="Selecione o modelo de caixa"
            iconName="cube"
            onSelect={item => setFieldValue('boxType', item)}
            value={values.boxType}
          />

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

export default HiveTransfer;
