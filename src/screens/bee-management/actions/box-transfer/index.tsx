import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Stack } from 'expo-router';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import DatePickerInput from '@/components/forms/date-picker-input';
import TextComboBox from '@/components/forms/combo-box/TextComboBox';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import FormErrorText from '@/components/ui/form-error-text';
import { boxTypes } from '@/constants';
import { BoxType } from '@/types/ConstantsTypes';
import { getEndOfToday } from '@/utils/helpers';
import { useHiveBoxTransferScreenStyles } from './styles';
import { useHiveBoxTransferForm } from './UseHiveBoxTransferForm';
export interface HiveBoxTransferFormValues {
  actionDate: Date | null;
  boxType: BoxType | null;
  observation: string;
}
const TransferSchema = Yup.object().shape({
  actionDate: Yup.date()
    .nullable()
    .required('Data é obrigatória')
    .max(getEndOfToday(), 'Data não pode ser futura'),
  boxType: Yup.object().nullable().required('Modelo de caixa de destino é obrigatório'),
  observation: Yup.string().trim().nullable(),
});
const BoxTransferScreen = memo(() => {
  const styles = useHiveBoxTransferScreenStyles();
  const { isSubmitting, formikRef, handleSaveTransfer } = useHiveBoxTransferForm();
  return (
    <ScreenWrapper scrollable>
      <Stack.Screen options={{ title: 'Transferência de Caixa' }} />
      <Formik<HiveBoxTransferFormValues>
        innerRef={formikRef}
        initialValues={{
          actionDate: new Date(),
          boxType: null,
          observation: '',
        }}
        validationSchema={TransferSchema}
        onSubmit={handleSaveTransfer}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
          isSubmitting: formikSubmitting,
        }) => (
          <View style={styles.formContainer}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Dados da Transferência</Text>
              <View style={styles.fieldsGroupContainer}>
                <View style={styles.fieldWrapper}>
                  <DatePickerInput
                    label="Data da Transferência"
                    date={values.actionDate}
                    onDateChange={date => setFieldValue('actionDate', date)}
                    error={!!(touched.actionDate && errors.actionDate)}
                    maximumDate={new Date()}
                  />
                  <FormErrorText error={errors.actionDate} touched={touched.actionDate} />
                </View>
                <View style={[styles.fieldWrapper, styles.lastFieldWrapper]}>
                  <TextComboBox<BoxType>
                    label="Caixa de Destino"
                    list={boxTypes}
                    placeholder="Selecione o modelo"
                    iconName="cube-outline"
                    selectedValue={values.boxType}
                    onSelect={item => setFieldValue('boxType', item)}
                    error={!!(touched.boxType && errors.boxType)}
                  />
                  <FormErrorText error={errors.boxType} touched={touched.boxType} />
                </View>
              </View>
            </View>
            <View style={styles.formSection}>
              <View style={styles.fieldsGroupContainer}>
                <View style={[styles.fieldWrapper, styles.lastFieldWrapper]}>
                  <InputField
                    label="Observações"
                    iconName="note-text-outline"
                    placeholder="Detalhes adicionais (Opcional)"
                    value={values.observation}
                    onChangeText={handleChange('observation')}
                    onBlur={handleBlur('observation')}
                    multiline
                    numberOfLines={4}
                    inputStyle={styles.textArea}
                    error={!!(touched.observation && errors.observation)}
                  />
                  <FormErrorText error={errors.observation} touched={touched.observation} />
                </View>
              </View>
            </View>
            <MainButton
              title="Salvar Transferência"
              onPress={() => handleSubmit()}
              loading={isSubmitting || formikSubmitting}
              disabled={isSubmitting || formikSubmitting}
              style={styles.submitButton}
            />
          </View>
        )}
      </Formik>
    </ScreenWrapper>
  );
});
export default BoxTransferScreen;
