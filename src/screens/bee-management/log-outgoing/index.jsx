import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import {supabase} from '../../../services/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../utils/Colors';
import ActionHeader from '../../../components/header/actions-header';
import styles from './styles';

const HiveOutgoing = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {hiveId} = route.params;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [outgoingType, setOutgoingType] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const saveTransaction = async values => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      let hiveStatus;
      switch (outgoingType) {
        case 'Doação':
          hiveStatus = 'Doado';
          break;
        case 'Venda':
          hiveStatus = 'Vendido';
          break;
        case 'Perda':
          hiveStatus = 'Perdido';
          break;
        default:
          throw new Error('Tipo de saída inválido');
      }

      const {data, error: transactionError} = await supabase
        .from('hive_transaction')
        .insert([
          {
            user_id: user.id,
            hive_id: hiveId,
            transaction_type: outgoingType,
            transaction_date: selectedDate.toISOString(),
            value: outgoingType === 'Venda' ? parseFloat(values.amount) : null,
            observation: values.observation,
            reason: values.reason,
            donated_or_sold_to: values.donatedTo || values.soldTo || null,
            new_owner_contact: values.contact || null,
          },
        ])
        .select();

      if (transactionError) {
        throw transactionError;
      }

      const {error: hiveError} = await supabase
        .from('hive')
        .update({status: hiveStatus})
        .eq('id', hiveId);

      if (hiveError) {
        throw hiveError;
      }

      console.log(
        'Transação registrada e status da colmeia atualizado com sucesso!',
      );
      alert('Transação registrada e status da colmeia atualizado com sucesso!');
      handleGoBack();
    } catch (error) {
      console.error(
        'Erro ao salvar a transação ou atualizar o status da colmeia:',
        error.message || error,
      );
      alert('Erro ao salvar os dados.');
    }
  };

  return (
    <Formik
      initialValues={{
        reason: '',
        observation: '',
        donatedTo: '',
        contact: '',
        soldTo: '',
        amount: '',
      }}
      onSubmit={values => {
        console.log(values);
        saveTransaction(values);
      }}>
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
            iconName="logout"
            iconSize={40}
            iconColor={colors.honey}
            title="Saída de Enxame"
            subtitle="Registre a saída do enxame"
            titleStyle={{fontSize: 30}}
            subtitleStyle={{color: '#555'}}
          />

          <View style={styles.inputContainer}>
            <Picker
              selectedValue={outgoingType}
              onValueChange={itemValue => setOutgoingType(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Selecione o tipo de saída" value="" />
              <Picker.Item label="Doação" value="Doação" />
              <Picker.Item label="Venda" value="Venda" />
              <Picker.Item label="Perda" value="Perda" />
            </Picker>
          </View>

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

          {outgoingType === 'Doação' && (
            <>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={25}
                  color={colors.secondary}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Doado para"
                  placeholderTextColor={colors.secondary}
                  onChangeText={handleChange('donatedTo')}
                  onBlur={handleBlur('donatedTo')}
                  value={values.donatedTo}
                />
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={25}
                  color={colors.secondary}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Contato"
                  placeholderTextColor={colors.secondary}
                  onChangeText={handleChange('contact')}
                  onBlur={handleBlur('contact')}
                  value={values.contact}
                  keyboardType="phone-pad"
                />
              </View>
            </>
          )}

          {outgoingType === 'Venda' && (
            <>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={25}
                  color={colors.secondary}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Vendido para"
                  placeholderTextColor={colors.secondary}
                  onChangeText={handleChange('soldTo')}
                  onBlur={handleBlur('soldTo')}
                  value={values.soldTo}
                />
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={25}
                  color={colors.secondary}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Contato"
                  placeholderTextColor={colors.secondary}
                  onChangeText={handleChange('contact')}
                  onBlur={handleBlur('contact')}
                  value={values.contact}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={25}
                  color={colors.secondary}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Valor (R$)"
                  placeholderTextColor={colors.secondary}
                  onChangeText={handleChange('amount')}
                  onBlur={handleBlur('amount')}
                  value={values.amount}
                  keyboardType="numeric"
                />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="comment-outline"
              size={25}
              color={colors.secondary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Motivo"
              placeholderTextColor={colors.secondary}
              onChangeText={handleChange('reason')}
              onBlur={handleBlur('reason')}
              value={values.reason}
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
              placeholder="Observação (opcional)"
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

export default HiveOutgoing;
