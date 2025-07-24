import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Stack } from 'expo-router';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import ImageComboBox from '@/components/forms/combo-box/ImageComboBox';
import TextComboBox from '@/components/forms/combo-box/TextComboBox';
import DatePickerInput from '@/components/forms/date-picker-input';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import FormErrorText from '@/components/ui/form-error-text';
import UnifiedLocationSelector from '@/components/forms/unified-location-selector';
import LocationPickerModal from '@/components/modals/location-picker-modal';
import { beeSpeciesList, brazilianStates, boxTypes, hiveOrigins } from '@/constants';
import { State, BoxType, HiveOrigin } from '@/types/ConstantsTypes';
import { useHiveRegistrationScreenStyles } from './styles';
import { useHiveRegistrationForm, HiveRegistrationFormValues } from './UseHiveRegistrationForm';
import { getEndOfToday } from '@/utils/helpers';

const RegistrationSchema = Yup.object().shape({
  species: Yup.object().nullable().required('Espécie é obrigatória'),
  state: Yup.object().nullable().required('Estado de origem é obrigatório'),
  boxType: Yup.object().nullable().required('Modelo de caixa é obrigatório'),
  hiveOrigin: Yup.object().nullable().required('Forma de aquisição é obrigatória'),
  acquisitionDate: Yup.date()
    .nullable()
    .required('Data de aquisição é obrigatória')
    .max(getEndOfToday(), 'Data não pode ser futura'),
  code: Yup.string().trim().required('Código é obrigatório'),
  purchaseValue: Yup.string().when('hiveOrigin', {
    is: (origin: HiveOrigin | null) => origin?.name === 'Compra',
    then: schema =>
      schema.required('Valor é obrigatório').matches(/^[0-9]+([,.][0-9]{1,2})?$/, 'Valor inválido'),
    otherwise: schema => schema.nullable(),
  }),
});

const HiveRegistrationScreen = memo(() => {
  const styles = useHiveRegistrationScreenStyles();
  const {
    isSubmitting,
    isGettingLocation,
    isLocationPickerVisible,
    formikRef,
    handleSaveHive,
    getCurrentLocation,
    openLocationPicker,
    closeLocationPicker,
    handleLocationSelected,
  } = useHiveRegistrationForm();

  return (
    <>
      <ScreenWrapper scrollable>
        <Stack.Screen options={{ title: 'Cadastrar Colmeia' }} />
        <Formik<HiveRegistrationFormValues>
          innerRef={formikRef}
          initialValues={{
            species: null,
            state: null,
            boxType: null,
            hiveOrigin: null,
            acquisitionDate: new Date(),
            code: '',
            description: '',
            purchaseValue: '',
            latitude: null,
            longitude: null,
          }}
          validationSchema={RegistrationSchema}
          onSubmit={handleSaveHive}
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
                <Text style={styles.sectionTitle}>Dados da Colmeia</Text>
                <View style={styles.fieldsGroupContainer}>
                  <View style={styles.fieldWrapper}>
                    <ImageComboBox
                      label="Espécie"
                      list={beeSpeciesList}
                      placeholder="Selecione a espécie"
                      iconName="bee"
                      selectedValue={values.species}
                      onSelect={item => setFieldValue('species', item)}
                      error={!!(touched.species && errors.species)}
                    />
                    <FormErrorText error={errors.species} touched={!!touched.species} />
                  </View>
                  <View style={styles.fieldWrapper}>
                    <TextComboBox<State>
                      label="Estado de Origem"
                      list={brazilianStates}
                      placeholder="Selecione o estado"
                      iconName="map-marker-outline"
                      selectedValue={values.state}
                      onSelect={item => setFieldValue('state', item)}
                      error={!!(touched.state && errors.state)}
                      showSearchBar
                    />
                    <FormErrorText error={errors.state} touched={!!touched.state} />
                  </View>
                  <View style={styles.fieldWrapper}>
                    <TextComboBox<BoxType>
                      label="Modelo da Caixa"
                      list={boxTypes}
                      placeholder="Selecione o modelo"
                      iconName="cube-outline"
                      selectedValue={values.boxType}
                      onSelect={item => setFieldValue('boxType', item)}
                      error={!!(touched.boxType && errors.boxType)}
                    />
                    <FormErrorText error={errors.boxType} touched={!!touched.boxType} />
                  </View>
                  <View style={styles.fieldWrapper}>
                    <TextComboBox<HiveOrigin>
                      label="Forma de Aquisição"
                      list={hiveOrigins}
                      placeholder="Selecione a forma"
                      iconName="source-branch"
                      selectedValue={values.hiveOrigin}
                      onSelect={item => {
                        setFieldValue('hiveOrigin', item);
                        if (item?.name !== 'Compra') setFieldValue('purchaseValue', '');
                      }}
                      error={!!(touched.hiveOrigin && errors.hiveOrigin)}
                    />
                    <FormErrorText error={errors.hiveOrigin} touched={!!touched.hiveOrigin} />
                  </View>
                  {values.hiveOrigin?.name === 'Compra' && (
                    <View style={styles.fieldWrapper}>
                      <InputField
                        label="Valor da Compra (R$)"
                        iconName="currency-usd"
                        placeholder="Ex: 150,00"
                        value={values.purchaseValue}
                        onChangeText={handleChange('purchaseValue')}
                        onBlur={handleBlur('purchaseValue')}
                        keyboardType="numeric"
                        error={!!(touched.purchaseValue && errors.purchaseValue)}
                      />
                      <FormErrorText
                        error={errors.purchaseValue}
                        touched={!!touched.purchaseValue}
                      />
                    </View>
                  )}
                  <View style={[styles.fieldWrapper, styles.lastFieldWrapper]}>
                    <DatePickerInput
                      label="Data de Aquisição"
                      date={values.acquisitionDate}
                      onDateChange={date => setFieldValue('acquisitionDate', date)}
                      error={!!(touched.acquisitionDate && errors.acquisitionDate)}
                      maximumDate={new Date()}
                    />
                    <FormErrorText
                      error={errors.acquisitionDate}
                      touched={!!touched.acquisitionDate}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Identificação</Text>
                <View style={styles.fieldsGroupContainer}>
                  <View style={[styles.fieldWrapper, styles.lastFieldWrapper]}>
                    <InputField
                      label="Código Identificador"
                      iconName="barcode-scan"
                      placeholder="Ex: CX-001"
                      value={values.code}
                      onChangeText={handleChange('code')}
                      onBlur={handleBlur('code')}
                      error={!!(touched.code && errors.code)}
                      autoCapitalize="characters"
                    />
                    <FormErrorText error={errors.code} touched={!!touched.code} />
                  </View>
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Localização (Opcional)</Text>
                <View style={styles.fieldsGroupContainer}>
                  <View style={[styles.fieldWrapper, styles.lastFieldWrapper]}>
                    <UnifiedLocationSelector
                      latitude={values.latitude}
                      longitude={values.longitude}
                      isGettingLocation={isGettingLocation}
                      onGetCurrentLocation={getCurrentLocation}
                      onOpenLocationPicker={openLocationPicker}
                      label="Localização da Colmeia"
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
                      value={values.description}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      multiline
                      numberOfLines={3}
                      inputStyle={styles.textArea}
                      error={!!(touched.description && errors.description)}
                    />
                    <FormErrorText error={errors.description} touched={!!touched.description} />
                  </View>
                </View>
              </View>
              <MainButton
                title="Cadastrar Colmeia"
                onPress={() => handleSubmit()}
                loading={isSubmitting || formikSubmitting || isGettingLocation}
                disabled={isSubmitting || formikSubmitting || isGettingLocation}
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

HiveRegistrationScreen.displayName = 'HiveRegistrationScreen';

export default HiveRegistrationScreen;
