import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { FormikProps, FormikHelpers } from 'formik';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { hiveService } from '@/services/HiveService';
import { CreateHiveData } from '@/services/types';
import { HiveOrigin } from '@/types/ConstantsTypes';
export interface HiveRegistrationFormValues {
  species: any | null;
  state: any | null;
  boxType: any | null;
  hiveOrigin: HiveOrigin | null;
  acquisitionDate: Date | null;
  code: string;
  description: string;
  purchaseValue: string;
  latitude: number | null;
  longitude: number | null;
}
export const useHiveRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLocationPickerVisible, setIsLocationPickerVisible] = useState(false);
  const formikRef = useRef<FormikProps<HiveRegistrationFormValues>>(null);
  const router = useRouter();
  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/(tabs)');
  }, [router]);
  const getCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Permissão para acessar a localização foi negada.');
      setIsGettingLocation(false);
      return;
    }
    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      formikRef.current?.setFieldValue('latitude', location.coords.latitude);
      formikRef.current?.setFieldValue('longitude', location.coords.longitude);
    } catch (error) {
      Alert.alert('Erro de Localização', 'Não foi possível obter a localização atual.');
    } finally {
      setIsGettingLocation(false);
    }
  }, []);
  const openLocationPicker = useCallback(() => setIsLocationPickerVisible(true), []);
  const closeLocationPicker = useCallback(() => setIsLocationPickerVisible(false), []);
  const handleLocationSelected = useCallback(
    (location: { latitude: number; longitude: number }) => {
      console.log('HiveRegistrationForm: Received location from modal:', location);
      const formik = formikRef.current;
      if (formik) {
        formik.setFieldValue('latitude', location.latitude);
        formik.setFieldValue('longitude', location.longitude);
        formik.setFieldTouched('latitude', true);
        formik.setFieldTouched('longitude', true);
        console.log(
          'HiveRegistrationForm: Set form values - latitude:',
          location.latitude,
          'longitude:',
          location.longitude,
        );
        console.log('HiveRegistrationForm: Current form values after update:', formik.values);
      }
      closeLocationPicker();
    },
    [closeLocationPicker],
  );
  const handleSaveHive = useCallback(
    async (
      values: HiveRegistrationFormValues,
      formikActions: FormikHelpers<HiveRegistrationFormValues>,
    ) => {
      if (
        !values.species ||
        !values.state ||
        !values.boxType ||
        !values.hiveOrigin ||
        !values.acquisitionDate ||
        !values.code
      ) {
        Alert.alert('Erro de Validação', 'Preencha todos os campos obrigatórios.');
        return;
      }
      setIsSubmitting(true);
      formikActions.setSubmitting(true);
      const purchaseValueNumber =
        values.hiveOrigin.name === 'Compra' && values.purchaseValue
          ? parseFloat(values.purchaseValue.replace(',', '.'))
          : null;
      const hiveData: CreateHiveData = {
        bee_species_id: values.species.id,
        bee_species_scientific_name: values.species.scientificName,
        origin_state_loc: values.state.name,
        box_type: values.boxType.name,
        hive_origin: values.hiveOrigin.name,
        acquisition_date: values.acquisitionDate.toISOString(),
        hive_code: values.code,
        description: values.description || null,
        purchase_value: isNaN(purchaseValueNumber!) ? null : purchaseValueNumber,
        latitude: values.latitude,
        longitude: values.longitude,
      };
      const result = await hiveService.createHive(hiveData);
      setIsSubmitting(false);
      formikActions.setSubmitting(false);
      if (result.data) {
        handleGoBack();
      }
    },
    [handleGoBack],
  );
  return {
    isSubmitting,
    isGettingLocation,
    isLocationPickerVisible,
    formikRef,
    handleSaveHive,
    getCurrentLocation,
    openLocationPicker,
    closeLocationPicker,
    handleLocationSelected,
  };
};
