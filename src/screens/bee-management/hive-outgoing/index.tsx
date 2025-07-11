import React, { memo, useRef } from 'react';
import { View } from 'react-native';
import { Formik, FormikProps } from 'formik';
import { Stack } from 'expo-router';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import DatePickerInput from '@/components/forms/date-picker-input';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import PickerInput from '@/components/forms/picker-input';
import FormErrorText from '@/components/ui/form-error-text';
import { useHiveOutgoingScreenStyles } from './styles';
import { useHiveOutgoingForm, HiveOutgoingFormValues, OutgoingType } from './UseHiveOutgoingForm';
import { ActionValidationSchemas } from '@/utils/validations';
const outgoingOptions = [
  { label: 'Doação', value: 'Doação' as OutgoingType },
  { label: 'Venda', value: 'Venda' as OutgoingType },
  { label: 'Perda', value: 'Perda' as OutgoingType },
];
const OutgoingSchema = ActionValidationSchemas.outgoing;
const HiveOutgoingScreen = memo(() => {
  const styles = useHiveOutgoingScreenStyles();
  const { isSubmitting, handleSaveTransaction } = useHiveOutgoingForm();
  const formikRef = useRef<FormikProps<HiveOutgoingFormValues>>(null);
  return (
    <ScreenWrapper scrollable>
      <Stack.Screen options={{ title: 'Registrar Saída de Enxame' }} />
      <Formik<HiveOutgoingFormValues>
        innerRef={formikRef}
        initialValues={{
          outgoingType: null,
          transactionDate: new Date(),
          reason: '',
          observation: '',
          donatedOrSoldTo: '',
          contact: '',
          amount: '',
        }}
        validationSchema={OutgoingSchema}
        onSubmit={handleSaveTransaction}
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
            <PickerInput
              items={outgoingOptions}
              selectedValue={values.outgoingType}
              onValueChange={itemValue =>
                setFieldValue('outgoingType', itemValue as OutgoingType | null)
              }
              placeholder="Tipo de Saída"
              error={!!(touched.outgoingType && errors.outgoingType)}
              iconName="exit-to-app"
            />
            <FormErrorText error={errors.outgoingType} touched={!!touched.outgoingType} />
            <DatePickerInput
              date={values.transactionDate}
              onDateChange={date => setFieldValue('transactionDate', date)}
              placeholder="Data da Saída"
              error={!!(touched.transactionDate && errors.transactionDate)}
              maximumDate={new Date()}
            />
            <FormErrorText error={errors.transactionDate} touched={!!touched.transactionDate} />
            {values.outgoingType === 'Doação' && (
              <>
                <InputField
                  iconName="account-heart-outline"
                  placeholder="Doado Para"
                  value={values.donatedOrSoldTo}
                  onChangeText={handleChange('donatedOrSoldTo')}
                  onBlur={handleBlur('donatedOrSoldTo')}
                  error={!!(touched.donatedOrSoldTo && errors.donatedOrSoldTo)}
                />
                <FormErrorText error={errors.donatedOrSoldTo} touched={!!touched.donatedOrSoldTo} />
                <InputField
                  iconName="phone-outline"
                  placeholder="Contato (Opcional)"
                  value={values.contact}
                  onChangeText={handleChange('contact')}
                  onBlur={handleBlur('contact')}
                  error={!!(touched.contact && errors.contact)}
                />
                <FormErrorText error={errors.contact} touched={!!touched.contact} />
              </>
            )}
            {values.outgoingType === 'Venda' && (
              <>
                <InputField
                  iconName="account-cash-outline"
                  placeholder="Vendido Para"
                  value={values.donatedOrSoldTo}
                  onChangeText={handleChange('donatedOrSoldTo')}
                  onBlur={handleBlur('donatedOrSoldTo')}
                  error={!!(touched.donatedOrSoldTo && errors.donatedOrSoldTo)}
                />
                <FormErrorText error={errors.donatedOrSoldTo} touched={!!touched.donatedOrSoldTo} />
                <InputField
                  iconName="currency-usd"
                  placeholder="Valor da Venda (R$)"
                  value={values.amount}
                  onChangeText={handleChange('amount')}
                  onBlur={handleBlur('amount')}
                  keyboardType="numeric"
                  error={!!(touched.amount && errors.amount)}
                />
                <FormErrorText error={errors.amount} touched={!!touched.amount} />
                <InputField
                  iconName="phone-outline"
                  placeholder="Contato Comprador (Opcional)"
                  value={values.contact}
                  onChangeText={handleChange('contact')}
                  onBlur={handleBlur('contact')}
                  error={!!(touched.contact && errors.contact)}
                />
                <FormErrorText error={errors.contact} touched={!!touched.contact} />
              </>
            )}
            {values.outgoingType === 'Perda' && (
              <>
                <InputField
                  iconName="comment-question-outline"
                  placeholder="Motivo da Perda"
                  value={values.reason}
                  onChangeText={handleChange('reason')}
                  onBlur={handleBlur('reason')}
                  multiline
                  inputStyle={styles.textAreaSmall}
                  error={!!(touched.reason && errors.reason)}
                />
                <FormErrorText error={errors.reason} touched={!!touched.reason} />
              </>
            )}
            <InputField
              iconName="note-text-outline"
              placeholder="Observações (Opcional)"
              value={values.observation}
              onChangeText={handleChange('observation')}
              onBlur={handleBlur('observation')}
              multiline
              numberOfLines={3}
              inputStyle={styles.textArea}
              error={!!(touched.observation && errors.observation)}
            />
            <FormErrorText error={errors.observation} touched={!!touched.observation} />
            <MainButton
              title="Registrar Saída"
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
HiveOutgoingScreen.displayName = 'HiveOutgoingScreen';
export default HiveOutgoingScreen;
