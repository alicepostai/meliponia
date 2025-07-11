import React, { memo, useRef } from 'react';
import { View, Text } from 'react-native';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Stack } from 'expo-router';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import DatePickerInput from '@/components/forms/date-picker-input';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import FormErrorText from '@/components/ui/form-error-text';
import { useHiveMaintenanceScreenStyles } from './styles';
import { useHiveMaintenanceForm, HiveMaintenanceFormValues } from './UseHiveMaintenanceForm';
import { getEndOfToday } from '@/utils/helpers';
const MaintenanceSchema = Yup.object().shape({
  actionDate: Yup.date()
    .nullable()
    .required('Data é obrigatória')
    .max(getEndOfToday(), 'Data não pode ser futura'),
  action: Yup.string().required('A ação realizada é obrigatória').trim(),
  observation: Yup.string().trim().nullable(),
});
const HiveMaintenanceScreen = memo(() => {
  const styles = useHiveMaintenanceScreenStyles();
  const { isSubmitting, handleSaveMaintenance } = useHiveMaintenanceForm();
  const formikRef = useRef<FormikProps<HiveMaintenanceFormValues>>(null);
  return (
    <ScreenWrapper scrollable>
      <Stack.Screen options={{ title: 'Registrar Manutenção' }} />
      <Formik<HiveMaintenanceFormValues>
        innerRef={formikRef}
        initialValues={{ actionDate: new Date(), action: '', observation: '' }}
        validationSchema={MaintenanceSchema}
        onSubmit={handleSaveMaintenance}
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
              <Text style={styles.sectionTitle}>Dados do Manejo</Text>
              <View style={styles.fieldsGroupContainer}>
                <View style={styles.fieldWrapper}>
                  <DatePickerInput
                    label="Data do Manejo"
                    date={values.actionDate}
                    onDateChange={date => setFieldValue('actionDate', date)}
                    error={!!(touched.actionDate && errors.actionDate)}
                    maximumDate={new Date()}
                  />
                  <FormErrorText error={errors.actionDate} touched={touched.actionDate} />
                </View>
                <View style={[styles.fieldWrapper, styles.lastFieldWrapper]}>
                  <InputField
                    label="Ação Realizada"
                    iconName="wrench-outline"
                    placeholder="Ex: Limpeza"
                    value={values.action}
                    onChangeText={handleChange('action')}
                    onBlur={handleBlur('action')}
                    error={!!(touched.action && errors.action)}
                    autoCapitalize="sentences"
                  />
                  <FormErrorText error={errors.action} touched={touched.action} />
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
              title="Salvar Manejo"
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
export default HiveMaintenanceScreen;
