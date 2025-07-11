import React, { memo, useRef } from 'react';
import { View } from 'react-native';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import DatePickerInput from '@/components/forms/date-picker-input';
import SwitchInput from '@/components/forms/switch-input';
import SliderInput from '@/components/forms/slider-input';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import FormErrorText from '@/components/ui/form-error-text';
import { getEndOfToday, getReserveLevelText } from '@/utils/helpers';
import { useHiveInspectionScreenStyles } from './styles';
import { useHiveInspectionForm, HiveInspectionFormValues } from './UseHiveInspectionForm';
const InspectionSchema = Yup.object().shape({
  actionDate: Yup.date()
    .nullable()
    .required('Data é obrigatória')
    .max(getEndOfToday(), 'Data não pode ser futura'),
  queenLocated: Yup.boolean().required('Este campo é obrigatório.'),
  queenLaying: Yup.boolean().required('Este campo é obrigatório.'),
  pestsOrDiseases: Yup.boolean().required('Este campo é obrigatório.'),
  honeyReserve: Yup.number().min(1).max(4).required('Reserva de mel é obrigatória.'),
  pollenReserve: Yup.number().min(1).max(4).required('Reserva de pólen é obrigatória.'),
  observation: Yup.string().trim().nullable(),
});
const HiveInspectionScreen = memo(() => {
  const styles = useHiveInspectionScreenStyles();
  const { isSubmitting, handleSaveInspection } = useHiveInspectionForm();
  const formikRef = useRef<FormikProps<HiveInspectionFormValues>>(null);
  return (
    <ScreenWrapper scrollable>
      <Formik<HiveInspectionFormValues>
        innerRef={formikRef}
        initialValues={{
          actionDate: new Date(),
          queenLocated: false,
          queenLaying: false,
          pestsOrDiseases: false,
          honeyReserve: 2,
          pollenReserve: 2,
          observation: '',
        }}
        validationSchema={InspectionSchema}
        onSubmit={handleSaveInspection}
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
            <DatePickerInput
              label="Data da Revisão"
              date={values.actionDate}
              onDateChange={date => setFieldValue('actionDate', date)}
              error={!!(touched.actionDate && errors.actionDate)}
              maximumDate={new Date()}
            />
            <FormErrorText error={errors.actionDate} touched={touched.actionDate} />
            <SwitchInput
              label="Rainha Localizada"
              value={values.queenLocated}
              onValueChange={value => setFieldValue('queenLocated', value)}
            />
            <SwitchInput
              label="Postura da Rainha Observada"
              value={values.queenLaying}
              onValueChange={value => setFieldValue('queenLaying', value)}
            />
            <SwitchInput
              label="Pragas ou Doenças Encontradas"
              value={values.pestsOrDiseases}
              onValueChange={value => setFieldValue('pestsOrDiseases', value)}
            />
            <SliderInput
              label="Reserva de Mel"
              value={values.honeyReserve}
              onValueChange={value => setFieldValue('honeyReserve', value)}
              minValue={1}
              maxValue={4}
              step={1}
              formatValueLabel={getReserveLevelText}
            />
            <SliderInput
              label="Reserva de Pólen"
              value={values.pollenReserve}
              onValueChange={value => setFieldValue('pollenReserve', value)}
              minValue={1}
              maxValue={4}
              step={1}
              formatValueLabel={getReserveLevelText}
            />
            <InputField
              label="Observações Gerais"
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
            <MainButton
              title="Salvar Revisão"
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
export default HiveInspectionScreen;
