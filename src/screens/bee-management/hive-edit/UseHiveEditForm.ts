import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { FormikProps, FormikHelpers } from 'formik';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { hiveService, UpdateHiveData } from '@/services/HiveService';
import { beeSpeciesList, brazilianStates, boxTypes, hiveOrigins } from '@/constants';
import { BeeSpecies, State, BoxType, HiveOrigin } from '@/types/ConstantsTypes';
export interface HiveEditFormValues {
  species: BeeSpecies | null;
  state: State | null;
  boxType: BoxType | null;
  hiveOrigin: HiveOrigin | null;
  acquisitionDate: Date | null;
  code: string;
  description: string;
  purchaseValue: string;
  latitude: number | null;
  longitude: number | null;
}
export const useHiveEditForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ hiveId?: string }>();
  const hiveId = params.hiveId;

  const [initialValues, setInitialValues] = useState<HiveEditFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocationPickerVisible, setIsLocationPickerVisible] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const formikRef = useRef<FormikProps<HiveEditFormValues>>(null);
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
    } catch {
      Alert.alert('Erro de Localização', 'Não foi possível obter a localização atual.');
    } finally {
      setIsGettingLocation(false);
    }
  }, []);
  useEffect(() => {
    if (!hiveId) {
      setError('ID da colmeia não fornecido.');
      setLoading(false);
      Alert.alert('Erro', 'ID da colmeia não encontrado.', [{ text: 'OK', onPress: handleGoBack }]);
      return;
    }
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await hiveService.fetchHiveById(hiveId);
        if (data) {
          const safeLatitude =
            data.latitude !== undefined && data.latitude !== null ? data.latitude : null;
          const safeLongitude =
            data.longitude !== undefined && data.longitude !== null ? data.longitude : null;

          const formValues: HiveEditFormValues = {
            species: beeSpeciesList.find(s => s.id === data.bee_species_id) || null,
            state:
              brazilianStates.find((s: { name: string }) => s.name === data.origin_state_loc) ||
              null,
            boxType: boxTypes.find(b => b.name === data.box_type) || null,
            hiveOrigin: hiveOrigins.find(h => h.name === data.hive_origin) || null,
            acquisitionDate: data.acquisition_date ? new Date(data.acquisition_date) : null,
            code: data.hive_code || '',
            description: data.description || '',
            purchaseValue: data.purchase_value
              ? data.purchase_value.toString().replace('.', ',')
              : '',
            latitude: safeLatitude,
            longitude: safeLongitude,
          };

          setInitialValues(formValues);
        } else {
          setError(fetchError?.message || 'Falha ao carregar dados da colmeia.');
          Alert.alert('Erro', 'Não foi possível carregar os dados.', [
            { text: 'OK', onPress: handleGoBack },
          ]);
        }
      } catch (error: any) {
        setError(error.message || 'Erro inesperado ao carregar dados da colmeia.');
        Alert.alert('Erro', 'Erro inesperado ao carregar dados.', [
          { text: 'OK', onPress: handleGoBack },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [hiveId, handleGoBack]);
  const openLocationPicker = useCallback(() => setIsLocationPickerVisible(true), []);
  const closeLocationPicker = useCallback(() => setIsLocationPickerVisible(false), []);
  const handleLocationSelected = useCallback(
    (location: { latitude: number; longitude: number }) => {
      console.log('HiveEditForm: Received location from modal:', location);
      const formik = formikRef.current;
      if (formik) {
        formik.setFieldValue('latitude', location.latitude);
        formik.setFieldValue('longitude', location.longitude);
        formik.setFieldTouched('latitude', true);
        formik.setFieldTouched('longitude', true);
        console.log(
          'HiveEditForm: Set form values - latitude:',
          location.latitude,
          'longitude:',
          location.longitude,
        );
        console.log('HiveEditForm: Current form values after update:', formik.values);
      }
      closeLocationPicker();
    },
    [closeLocationPicker],
  );
  const handleUpdateHive = useCallback(
    async (values: HiveEditFormValues, formikActions: FormikHelpers<HiveEditFormValues>) => {
      if (
        !hiveId ||
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
          : undefined;
      const updateData: UpdateHiveData = {
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
      const { data, error } = await hiveService.updateHive(hiveId, updateData);
      setIsSubmitting(false);
      formikActions.setSubmitting(false);
      if (data) {
        handleGoBack();
      } else if (error?.code === 'OFFLINE') {
        handleGoBack();
      }
    },
    [hiveId, handleGoBack],
  );
  return {
    loading,
    error,
    isSubmitting,
    initialValues,
    formikRef,
    isLocationPickerVisible,
    isGettingLocation,
    handleGoBack,
    handleUpdateHive,
    getCurrentLocation,
    openLocationPicker,
    closeLocationPicker,
    handleLocationSelected,
  };
};
