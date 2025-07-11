import React, { memo, useRef } from 'react';
import { View, Text } from 'react-native';
import { Formik, FormikProps } from 'formik';
import { Stack } from 'expo-router';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import DatePickerInput from '@/components/forms/date-picker-input';
import SwitchInput from '@/components/forms/switch-input';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import FormErrorText from '@/components/ui/form-error-text';
import { useHiveHarvestScreenStyles } from './styles';
import { useHiveHarvestForm, HiveHarvestFormValues } from './UseHiveHarvestForm';
import { ActionValidationSchemas } from '@/utils/validations';
const HarvestSchema = ActionValidationSchemas.harvest;
const HarvestItem = memo(
  ({
    formik,
    name,
    label,
    iconName,
    placeholder,
    isLast = false,
  }: {
    formik: FormikProps<HiveHarvestFormValues>;
    name: 'Honey' | 'Pollen' | 'Propolis';
    label: string;
    iconName: string;
    placeholder: string;
    isLast?: boolean;
  }) => {
    const styles = useHiveHarvestScreenStyles();
    const { values, setFieldValue, handleChange, handleBlur, touched, errors } = formik;
    const switchField = `harvest${name}` as keyof HiveHarvestFormValues;
    const quantityField = `${name.toLowerCase()}Quantity` as keyof HiveHarvestFormValues;
    return (
      <View style={[styles.fieldWrapper, isLast && styles.lastFieldWrapper]}>
        <SwitchInput
          label={`${label}`}
          value={values[switchField] as boolean}
          onValueChange={value => {
            setFieldValue(switchField, value);
            if (!value) setFieldValue(quantityField, '');
          }}
        />
        {values[switchField] && (
          <View style={styles.conditionalInputContainer}>
            <InputField
              iconName={iconName}
              placeholder={placeholder}
              value={values[quantityField] as string}
              onChangeText={handleChange(quantityField)}
              onBlur={handleBlur(quantityField)}
              keyboardType="numeric"
              error={!!(touched[quantityField] && errors[quantityField])}
            />
            <FormErrorText
              error={errors[quantityField] as string}
              touched={touched[quantityField]}
            />
          </View>
        )}
      </View>
    );
  },
);
const HiveHarvestScreen = memo(() => {
  const styles = useHiveHarvestScreenStyles();
  const { isSubmitting, handleSaveHarvest } = useHiveHarvestForm();
  const formikRef = useRef<FormikProps<HiveHarvestFormValues>>(null);
  return (
    <ScreenWrapper scrollable>
      <Stack.Screen options={{ title: 'Registrar Colheita' }} />
      <Formik<HiveHarvestFormValues>
        innerRef={formikRef}
        initialValues={{
          actionDate: new Date(),
          harvestHoney: false,
          honeyQuantity: '',
          harvestPollen: false,
          pollenQuantity: '',
          harvestPropolis: false,
          propolisQuantity: '',
          observation: '',
        }}
        validationSchema={HarvestSchema}
        onSubmit={handleSaveHarvest}
      >
        {formik => (
          <View style={styles.formContainer}>
            <View style={styles.formSection}>
              <View style={styles.fieldsGroupContainer}>
                <View style={[styles.fieldWrapper, styles.lastFieldWrapper]}>
                  <DatePickerInput
                    label="Data da Colheita"
                    date={formik.values.actionDate}
                    onDateChange={date => formik.setFieldValue('actionDate', date)}
                    error={!!(formik.touched.actionDate && formik.errors.actionDate)}
                    maximumDate={new Date()}
                  />
                  <FormErrorText
                    error={formik.errors.actionDate}
                    touched={formik.touched.actionDate}
                  />
                </View>
              </View>
            </View>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Itens Colhidos</Text>
              <View style={styles.fieldsGroupContainer}>
                <HarvestItem
                  formik={formik}
                  name="Honey"
                  label="Mel"
                  iconName="beehive-outline"
                  placeholder="Quantidade em gramas"
                />
                <HarvestItem
                  formik={formik}
                  name="Pollen"
                  label="Pólen"
                  iconName="flower-pollen"
                  placeholder="Quantidade em gramas"
                />
                <HarvestItem
                  formik={formik}
                  name="Propolis"
                  label="Própolis"
                  iconName="medical-bag"
                  placeholder="Quantidade em gramas"
                  isLast
                />
              </View>
              {formik.submitCount > 0 && !formik.isValid && typeof formik.errors === 'string' && (
                <Text style={styles.errorSummary}>{formik.errors}</Text>
              )}
            </View>
            <View style={styles.formSection}>
              <View style={styles.fieldsGroupContainer}>
                <View style={[styles.fieldWrapper, styles.lastFieldWrapper]}>
                  <InputField
                    label="Observações"
                    iconName="note-text-outline"
                    placeholder="Detalhes adicionais (Opcional)"
                    value={formik.values.observation}
                    onChangeText={formik.handleChange('observation')}
                    onBlur={formik.handleBlur('observation')}
                    multiline
                    numberOfLines={3}
                    inputStyle={styles.textArea}
                    error={!!(formik.touched.observation && formik.errors.observation)}
                  />
                  <FormErrorText
                    error={formik.errors.observation}
                    touched={formik.touched.observation}
                  />
                </View>
              </View>
            </View>
            <MainButton
              title="Salvar Colheita"
              onPress={() => formik.handleSubmit()}
              loading={isSubmitting || formik.isSubmitting}
              disabled={isSubmitting || formik.isSubmitting}
              style={styles.submitButton}
            />
          </View>
        )}
      </Formik>
    </ScreenWrapper>
  );
});
export default HiveHarvestScreen;
