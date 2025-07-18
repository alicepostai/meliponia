import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { useCameraPermissions } from 'expo-camera';

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
      console.error('Error checking location permission:', error);
      return null;
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(permission);
      return permission;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return null;
    }
  }, []);

  const requestAllPermissions = useCallback(async () => {
    setLoading(true);

    try {
      console.log('Requesting all permissions...');

      // Solicitar permissão da câmera
      if (!cameraPermission?.granted) {
        console.log('Requesting camera permission...');
        await requestCameraPermission();
      }

      // Solicitar permissão de localização
      if (!locationPermission?.granted) {
        console.log('Requesting location permission...');
        await requestLocationPermission();
      }

      console.log('All permissions requested');
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert(
        'Erro de Permissões',
        'Não foi possível solicitar as permissões necessárias. Por favor, verifique as configurações do dispositivo.',
        [{ text: 'OK' }],
      );
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
      // Verificar permissão de localização
      await checkLocationPermission();
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setLoading(false);
    }
  }, [checkLocationPermission]);

  // Verificar permissões na inicialização
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
