import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { FormikProps, FormikHelpers } from 'formik';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';
import { actionService } from '@/services/ActionService';
import { hiveService } from '@/services/HiveService';
import { BoxType } from '@/types/ConstantsTypes';
import { DbHive } from '@/types/supabase';
import { logger } from '@/utils/logger';
export interface HiveDivisionFormValues {
  actionDate: Date | null;
  motherHive1: DbHive | null;
  motherHive2: DbHive | null;
  motherHive3: DbHive | null;
  newHiveCode: string;
  newHiveBoxType: BoxType | null;
  observation: string;
  latitude: number | null;
  longitude: number | null;
}
export const useHiveDivisionForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ hiveId?: string }>();
  const comingFromHiveId = params.hiveId;
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allActiveHives, setAllActiveHives] = useState<DbHive[]>([]);
  const [loadingHives, setLoadingHives] = useState(true);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLocationPickerVisible, setIsLocationPickerVisible] = useState(false);
  const formikRef = useRef<FormikProps<HiveDivisionFormValues>>(null);
  const fetchHives = useCallback(async () => {
    if (!user?.id) return;
    setLoadingHives(true);
    const { data } = await hiveService.fetchActiveHivesForSelection(user.id);
    if (data) setAllActiveHives(data);
    setLoadingHives(false);
  }, [user?.id]);
  useEffect(() => {
    fetchHives();
  }, [fetchHives]);
  useEffect(() => {
    if (comingFromHiveId && allActiveHives.length > 0 && formikRef.current) {
      const initialHive = allActiveHives.find(h => h.id === comingFromHiveId);
      if (initialHive) formikRef.current.setFieldValue('motherHive1', initialHive);
    }
  }, [comingFromHiveId, allActiveHives]);
  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/(tabs)');
  }, [router]);
  const handleSaveDivision = useCallback(
    async (
      values: HiveDivisionFormValues,
      formikActions: FormikHelpers<HiveDivisionFormValues>,
    ) => {
      setIsSubmitting(true);
      formikActions.setSubmitting(true);
      const motherHives = [values.motherHive1, values.motherHive2, values.motherHive3].filter(
        (h): h is DbHive => h !== null,
      );
      if (motherHives.length === 0) {
        Alert.alert('Erro', 'Selecione pelo menos uma colmeia matriz.');
        setIsSubmitting(false);
        formikActions.setSubmitting(false);
        return;
      }
      const result = await actionService.createHiveFromDivision(values, motherHives);
      setIsSubmitting(false);
      formikActions.setSubmitting(false);
      if (result.success) handleGoBack();
    },
    [handleGoBack],
  );

  const getCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Permissão de localização é necessária.');
        setIsGettingLocation(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      formikRef.current?.setFieldValue('latitude', location.coords.latitude);
      formikRef.current?.setFieldValue('longitude', location.coords.longitude);
    } catch (error) {
      logger.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização atual.');
    } finally {
      setIsGettingLocation(false);
    }
  }, []);

  const openLocationPicker = useCallback(() => {
    setIsLocationPickerVisible(true);
  }, []);

  const closeLocationPicker = useCallback(() => {
    setIsLocationPickerVisible(false);
  }, []);

  const handleLocationSelected = useCallback(
    (location: { latitude: number; longitude: number }) => {
      logger.debug('HiveDivisionForm: Received location from modal:', location);
      const formik = formikRef.current;
      if (formik) {
        formik.setFieldValue('latitude', location.latitude);
        formik.setFieldValue('longitude', location.longitude);
        formik.setFieldTouched('latitude', true);
        formik.setFieldTouched('longitude', true);
        logger.debug(
          'HiveDivisionForm: Set form values - latitude:',
          location.latitude,
          'longitude:',
          location.longitude,
        );
        logger.debug('HiveDivisionForm: Current form values after update:', formik.values);
      }
      closeLocationPicker();
    },
    [closeLocationPicker],
  );

  return {
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
  };
};
