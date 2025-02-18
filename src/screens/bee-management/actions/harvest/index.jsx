import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Switch} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import {supabase} from '../../../../services/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../utils/Colors';
import ActionHeader from '../../../../components/header/actions-header';
import styles from './styles';

const HiveHarvest = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {hiveId} = route.params;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleGoBack = () => {
    navigation.goBack();
  };

  const saveHarvest = async values => {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const {data, error: harvestError} = await supabase
        .from('hive_harvest')
        .insert([
          {
            user_id: user.id,
            hive_id: hiveId,
            dt_harvest: selectedDate.toISOString(),
            qt_honey: values.honey ? parseFloat(values.honeyQuantity) : 0,
            qt_pollen: values.pollen ? parseFloat(values.pollenQuantity) : 0,
            qt_propolis: values.propolis
              ? parseFloat(values.propolisQuantity)
              : 0,
            observation: values.observation,
          },
        ])
        .select();

      if (harvestError) {
        throw harvestError;
      }

      const {error: actionError} = await supabase.from('hive_action').insert([
        {
          user_id: user.id,
          hive_id: hiveId,
          action_type: 'Colheita',
          action_date: selectedDate.toISOString(),
          observation: values.observation,
          action_id: data[0].id,
        },
      ]);

      if (actionError) {
        throw actionError;
      }

      console.log('Colheita registrada com sucesso!');
      alert('Colheita registrada com sucesso!');
      handleGoBack();
    } catch (error) {
      console.error('Erro ao salvar a colheita:', error.message || error);
      alert('Erro ao salvar os dados.');
    }
  };

  return (
    <Formik
      initialValues={{
        honey: false,
        pollen: false,
        propolis: false,
        honeyQuantity: '',
        pollenQuantity: '',
        propolisQuantity: '',
        observation: '',
      }}
      onSubmit={values => {
        console.log(values);
        saveHarvest(values);
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
            title="Colheita"
            subtitle="Selecione o que foi colhido"
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
              value={values.honey}
              onValueChange={value => setFieldValue('honey', value)}
              trackColor={{false: colors.gray, true: colors.honey}}
              thumbColor={values.honey ? colors.white : colors.white}
            />
            <Text style={styles.checkboxLabel}>Mel</Text>
          </View>
          {values.honey && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Quantidade de Mel (gramas)"
                placeholderTextColor={colors.secondary}
                onChangeText={handleChange('honeyQuantity')}
                onBlur={handleBlur('honeyQuantity')}
                value={values.honeyQuantity}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.checkboxContainer}>
            <Switch
              value={values.pollen}
              onValueChange={value => setFieldValue('pollen', value)}
              trackColor={{false: colors.gray, true: colors.honey}}
              thumbColor={values.pollen ? colors.white : colors.white}
            />
            <Text style={styles.checkboxLabel}>Pólen</Text>
          </View>
          {values.pollen && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Quantidade de Pólen (gramas)"
                placeholderTextColor={colors.secondary}
                onChangeText={handleChange('pollenQuantity')}
                onBlur={handleBlur('pollenQuantity')}
                value={values.pollenQuantity}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.checkboxContainer}>
            <Switch
              value={values.propolis}
              onValueChange={value => setFieldValue('propolis', value)}
              trackColor={{false: colors.gray, true: colors.honey}}
              thumbColor={values.propolis ? colors.white : colors.white}
            />
            <Text style={styles.checkboxLabel}>Própolis</Text>
          </View>
          {values.propolis && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Quantidade de Própolis (gramas)"
                placeholderTextColor={colors.secondary}
                onChangeText={handleChange('propolisQuantity')}
                onBlur={handleBlur('propolisQuantity')}
                value={values.propolisQuantity}
                keyboardType="numeric"
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
            onPress={() => handleSubmit()}>
            <Text style={styles.signUpText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default HiveHarvest;
