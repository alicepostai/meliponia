import React, { memo, useRef } from 'react';
import { View } from 'react-native';
import { Formik, FormikProps } from 'formik';
import { Stack } from 'expo-router';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import DatePickerInput from '@/components/forms/date-picker-input';
import RadioButtonGroup from '@/components/forms/radio-button-group';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import FormErrorText from '@/components/ui/form-error-text';
import { useHiveFeedingScreenStyles } from './styles';
import { useHiveFeedingForm, HiveFeedingFormValues } from './UseHiveFeedingForm';
import { ActionValidationSchemas } from '@/utils/validations';
const foodOptions = [
  { label: 'Mel', value: 'Mel' },
  { label: 'Xarope', value: 'Xarope' },
  { label: 'Bombom de Pólen', value: 'Bombom de Pólen' },
  { label: 'Outro', value: 'Outro' },
];
const FeedingSchema = ActionValidationSchemas.feeding;
const HiveFeedingScreen = memo(() => {
  const styles = useHiveFeedingScreenStyles();
  const { isSubmitting, handleSaveFeeding } = useHiveFeedingForm();
  const formikRef = useRef<FormikProps<HiveFeedingFormValues>>(null);
  return (
    <ScreenWrapper scrollable>
      <Formik<HiveFeedingFormValues>
        innerRef={formikRef}
        initialValues={{ actionDate: new Date(), foodType: '', otherFoodType: '', observation: '' }}
        validationSchema={FeedingSchema}
        onSubmit={handleSaveFeeding}
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
              label="Data da Alimentação"
              date={values.actionDate}
              onDateChange={date => setFieldValue('actionDate', date)}
              error={!!(touched.actionDate && errors.actionDate)}
              maximumDate={new Date()}
            />
            <FormErrorText error={errors.actionDate} touched={touched.actionDate} />
            <RadioButtonGroup<string>
              label="Tipo de Alimento Fornecido"
              options={foodOptions}
              selectedValue={values.foodType}
              onValueChange={value => {
                setFieldValue('foodType', value);
                if (value !== 'Outro') setFieldValue('otherFoodType', '');
              }}
            />
            <FormErrorText error={errors.foodType} touched={touched.foodType} />
            {values.foodType === 'Outro' && (
              <>
                <InputField
                  label="Especifique o Alimento"
                  iconName="food-outline"
                  placeholder="Nome do alimento"
                  value={values.otherFoodType}
                  onChangeText={handleChange('otherFoodType')}
                  onBlur={handleBlur('otherFoodType')}
                  error={!!(touched.otherFoodType && errors.otherFoodType)}
                />
                <FormErrorText error={errors.otherFoodType} touched={touched.otherFoodType} />
              </>
            )}
            <InputField
              label="Observações"
              iconName="note-text-outline"
              placeholder="Detalhes adicionais (Opcional)"
              value={values.observation}
              onChangeText={handleChange('observation')}
              onBlur={handleBlur('observation')}
              multiline
              numberOfLines={3}
              inputStyle={styles.textArea}
              error={!!(touched.observation && errors.observation)}
            />
            <FormErrorText error={errors.observation} touched={touched.observation} />
            <MainButton
              title="Salvar Alimentação"
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
export default HiveFeedingScreen;
