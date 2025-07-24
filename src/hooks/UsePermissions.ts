import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { useCameraPermissions } from 'expo-camera';
import { logger } from '@/utils/logger';
import { AlertService } from '@/services/AlertService';

export interface PermissionStatus {
  camera: boolean;
  location: boolean;
  allGranted: boolean;
  loading: boolean;
}

export const usePermissions = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] =
    useState<Location.LocationPermissionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLocationPermission = useCallback(async () => {
    try {
      const permission = await Location.getForegroundPermissionsAsync();
      setLocationPermission(permission);
      return permission;
    } catch (error) {
      logger.error('Error checking location permission:', error);
      return null;
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(permission);
      return permission;
    } catch (error) {
      logger.error('Error requesting location permission:', error);
      return null;
    }
  }, []);

  const requestAllPermissions = useCallback(async () => {
    setLoading(true);

    try {
      logger.debug('Requesting all permissions...');

      if (!cameraPermission?.granted) {
        logger.debug('Requesting camera permission...');
        await requestCameraPermission();
      }

      if (!locationPermission?.granted) {
        logger.debug('Requesting location permission...');
        await requestLocationPermission();
      }

      logger.debug('All permissions requested');
    } catch (error) {
      logger.error('Error requesting permissions:', error);
      AlertService.showPermissionError();
    } finally {
      setLoading(false);
    }
  }, [
    cameraPermission?.granted,
    locationPermission?.granted,
    requestCameraPermission,
    requestLocationPermission,
  ]);

  const checkAllPermissions = useCallback(async () => {
    setLoading(true);

    try {
      await checkLocationPermission();
    } catch (error) {
      logger.error('Error checking permissions:', error);
    } finally {
      setLoading(false);
    }
  }, [checkLocationPermission]);

  useEffect(() => {
    checkAllPermissions();
  }, [checkAllPermissions]);

  const status: PermissionStatus = {
    camera: cameraPermission?.granted || false,
    location: locationPermission?.granted || false,
    allGranted: (cameraPermission?.granted || false) && (locationPermission?.granted || false),
    loading,
  };

  return {
    status,
    requestAllPermissions,
    requestCameraPermission,
    requestLocationPermission,
    checkAllPermissions,
  };
};
