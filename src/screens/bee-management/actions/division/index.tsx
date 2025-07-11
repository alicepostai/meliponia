import React, { memo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Stack } from 'expo-router';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import DatePickerInput from '@/components/forms/date-picker-input';
import TextComboBox from '@/components/forms/combo-box/TextComboBox';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import FormErrorText from '@/components/ui/form-error-text';
import UnifiedLocationSelector from '@/components/forms/unified-location-selector';
import LocationPickerModal from '@/components/modals/location-picker-modal';
import { boxTypes } from '@/constants';
import { BoxType } from '@/types/ConstantsTypes';
import { DbHive } from '@/types/supabase';
import { getBeeNameById, getEndOfToday } from '@/utils/helpers';
import { useHiveDivisionScreenStyles } from './styles';
import { useHiveDivisionForm, HiveDivisionFormValues } from './UseHiveDivisionForm';

const DivisionSchema = Yup.object().shape({
  actionDate: Yup.date()
    .nullable()
    .required('Data é obrigatória')
    .max(getEndOfToday(), 'Data não pode ser futura'),
  motherHive1: Yup.object().nullable().required('Pelo menos uma matriz é obrigatória'),
  newHiveCode: Yup.string().trim().required('Código do novo enxame é obrigatório'),
  newHiveBoxType: Yup.object().nullable().required('Tipo de caixa é obrigatório'),
});

type SelectableHive = DbHive & { name: string };

const MotherHiveSelector = memo(
  ({
    index,
    values,
    setFieldValue,
    allActiveHives,
    formikProps,
  }: {
    index: 1 | 2 | 3;
    values: HiveDivisionFormValues;
    setFieldValue: (field: string, value: any) => void;
    allActiveHives: DbHive[];
    formikProps: any;
  }) => {
    const styles = useHiveDivisionScreenStyles();
    const fieldName = `motherHive${index}` as keyof HiveDivisionFormValues;
    const selectedValue = values[fieldName] as DbHive | null;
    const isVisible =
      index === 1 || (index === 2 && values.motherHive1) || (index === 3 && values.motherHive2);
    if (!isVisible) return null;
    const selectedMotherIds = [values.motherHive1, values.motherHive2, values.motherHive3]
      .filter(h => h)
      .map(h => h!.id);
    const availableHives =
      index === 1 || !values.motherHive1
        ? allActiveHives
        : allActiveHives.filter(h => h.bee_species_id === values.motherHive1?.bee_species_id);
    const listForComboBox = availableHives
      .filter(h => !selectedMotherIds.includes(h.id) || h.id === selectedValue?.id)
      .map(h => ({ ...h, name: `${h.hive_code || 'S/C'} - ${getBeeNameById(h.bee_species_id)}` }));
    const valueForComboBox: SelectableHive | null = selectedValue
      ? {
          ...selectedValue,
          name: `${selectedValue.hive_code || 'S/C'} - ${getBeeNameById(
            selectedValue.bee_species_id,
          )}`,
        }
      : null;
    return (
      <View
        style={[
          styles.fieldWrapper,
          index === 3 || (index === 2 && !values.motherHive2) ? styles.lastFieldWrapper : null,
        ]}
      >
        <TextComboBox<SelectableHive>
          label={`Matriz ${index}${index === 1 ? ' *' : ' (Opcional)'}`}
          list={listForComboBox}
          placeholder="Selecione a colmeia matriz"
          iconName="beehive-outline"
          selectedValue={valueForComboBox}
          onSelect={item => {
            setFieldValue(fieldName, item);
            if (index === 1) {
              setFieldValue('motherHive2', null);
              setFieldValue('motherHive3', null);
            }
          }}
          searchField={item => `${item.hive_code} ${item.bee_species_scientific_name}`}
          error={!!(formikProps.touched[fieldName] && formikProps.errors[fieldName])}
          showSearchBar
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>
                Nenhum enxame ativo desta espécie disponível.
              </Text>
            </View>
          )}
        />
        <FormErrorText
          error={formikProps.errors[fieldName] as string}
          touched={formikProps.touched[fieldName]}
        />
      </View>
    );
  },
);
MotherHiveSelector.displayName = 'MotherHiveSelector';

const HiveDivisionScreen = memo(() => {
  const styles = useHiveDivisionScreenStyles();
  const {
    isSubmitting,
    loadingHives,
    allActiveHives,
    formikRef,
    handleSaveDivision,
    isGettingLocation,
    isLocationPickerVisible,
    getCurrentLocation,
    openLocationPicker,
    closeLocationPicker,
    handleLocationSelected,
  } = useHiveDivisionForm();

  return (
    <>
      <ScreenWrapper scrollable>
        <Stack.Screen options={{ title: 'Divisão de Enxame' }} />
        <Formik<HiveDivisionFormValues>
          innerRef={formikRef}
          initialValues={{
            actionDate: new Date(),
            motherHive1: null,
            motherHive2: null,
            motherHive3: null,
            newHiveCode: '',
            newHiveBoxType: null,
            observation: '',
            latitude: null,
            longitude: null,
          }}
          validationSchema={DivisionSchema}
          onSubmit={handleSaveDivision}
        >
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, ...formikProps }) => (
            <View style={styles.formContainer}>
              <View style={styles.formSection}>
                <View style={styles.fieldsGroupContainer}>
                  <View style={styles.fieldWrapper}>
                    <DatePickerInput
                      label="Data da Divisão"
                      date={values.actionDate}
                      onDateChange={date => setFieldValue('actionDate', date)}
                      error={!!(formikProps.touched.actionDate && formikProps.errors.actionDate)}
                      maximumDate={new Date()}
                    />
                    <FormErrorText
                      error={formikProps.errors.actionDate}
                      touched={formikProps.touched.actionDate}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Colmeias Matrizes</Text>
                <View style={styles.fieldsGroupContainer}>
                  {loadingHives ? (
                    <ActivityIndicator style={{ marginVertical: 20 }} />
                  ) : (
                    <>
                      <MotherHiveSelector
                        index={1}
                        values={values}
                        setFieldValue={setFieldValue}
                        allActiveHives={allActiveHives}
                        formikProps={formikProps}
                      />
                      <MotherHiveSelector
                        index={2}
                        values={values}
                        setFieldValue={setFieldValue}
                        allActiveHives={allActiveHives}
                        formikProps={formikProps}
                      />
                      <MotherHiveSelector
                        index={3}
                        values={values}
                        setFieldValue={setFieldValue}
                        allActiveHives={allActiveHives}
                        formikProps={formikProps}
                      />
                    </>
                  )}
                </View>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Dados do Novo Enxame</Text>
                <View style={styles.fieldsGroupContainer}>
                  <View style={styles.fieldWrapper}>
                    <InputField
                      label="Código do Novo Enxame"
                      iconName="barcode-scan"
                      placeholder="Ex: CX-010"
                      value={values.newHiveCode}
                      onChangeText={handleChange('newHiveCode')}
                      onBlur={handleBlur('newHiveCode')}
                      error={!!(formikProps.touched.newHiveCode && formikProps.errors.newHiveCode)}
                      autoCapitalize="characters"
                    />
                    <FormErrorText
                      error={formikProps.errors.newHiveCode}
                      touched={formikProps.touched.newHiveCode}
                    />
                  </View>
                  <View style={styles.fieldWrapper}>
                    <TextComboBox<BoxType>
                      label="Tipo da Nova Caixa"
                      list={boxTypes}
                      placeholder="Selecione o modelo"
                      iconName="cube-outline"
                      selectedValue={values.newHiveBoxType}
                      onSelect={item => setFieldValue('newHiveBoxType', item)}
                      error={
                        !!(formikProps.touched.newHiveBoxType && formikProps.errors.newHiveBoxType)
                      }
                    />
                    <FormErrorText
                      error={formikProps.errors.newHiveBoxType}
                      touched={formikProps.touched.newHiveBoxType}
                    />
                  </View>
                  <View style={[styles.fieldWrapper, styles.lastFieldWrapper]}>
                    <UnifiedLocationSelector
                      latitude={values.latitude}
                      longitude={values.longitude}
                      isGettingLocation={isGettingLocation}
                      onGetCurrentLocation={getCurrentLocation}
                      onOpenLocationPicker={openLocationPicker}
                      label="Localização da Nova Colmeia"
                    />
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
                      numberOfLines={3}
                      inputStyle={styles.textArea}
                      error={!!(formikProps.touched.observation && formikProps.errors.observation)}
                    />
                    <FormErrorText
                      error={formikProps.errors.observation}
                      touched={formikProps.touched.observation}
                    />
                  </View>
                </View>
              </View>
              <MainButton
                title="Criar Novo Enxame"
                onPress={() => handleSubmit()}
                loading={isSubmitting || formikProps.isSubmitting}
                disabled={isSubmitting || formikProps.isSubmitting}
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>
      </ScreenWrapper>

      <LocationPickerModal
        isVisible={isLocationPickerVisible}
        onClose={closeLocationPicker}
        onLocationSelect={handleLocationSelected}
        initialCoordinates={
          formikRef.current?.values.latitude && formikRef.current?.values.longitude
            ? {
                latitude: formikRef.current.values.latitude,
                longitude: formikRef.current.values.longitude,
              }
            : null
        }
      />
    </>
  );
});

HiveDivisionScreen.displayName = 'HiveDivisionScreen';
export default HiveDivisionScreen;
