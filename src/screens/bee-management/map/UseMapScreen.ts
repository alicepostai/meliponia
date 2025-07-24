import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Linking, AppState } from 'react-native';
import * as Location from 'expo-location';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { hiveService } from '@/services/HiveService';
import { DbHive } from '@/types/supabase';
import { UnifiedMapComponentRef } from '@/components/maps/UnifiedMapComponent';
import { logger } from '@/utils/logger';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const BRAZIL_INITIAL_REGION: Region = {
  latitude: -14.235004,
  longitude: -51.92528,
  latitudeDelta: 40,
  longitudeDelta: 40,
};

export const useMapScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const mapRef = useRef<UnifiedMapComponentRef>(null);
  const [hives, setHives] = useState<DbHive[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region>(BRAZIL_INITIAL_REGION);
  const [mapReady, setMapReady] = useState(false);
  const requestLocationPermission = useCallback(async (showAlerts = true): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);
    if (status !== Location.PermissionStatus.GRANTED && showAlerts) {
      Alert.alert(
        'Permissão Necessária',
        'Acesse as configurações para permitir o uso da localização.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
        ],
      );
    }
    return status === Location.PermissionStatus.GRANTED;
  }, []);
  const centerMapOn = useCallback(
    (coords: { latitude: number; longitude: number }, zoom = true) => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(coords);
      }
    },
    [],
  );
  const getUserLocation = useCallback(async () => {
    const hasPermission = await requestLocationPermission(false);
    if (!hasPermission) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const userCoords = location.coords;
      const newRegion = {
        ...userCoords,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setUserLocation(userCoords);
      setInitialRegion(newRegion);

      if (mapReady) {
        centerMapOn(userCoords);
      }

      logger.info('🗺️ User location obtained:', userCoords);
    } catch (error) {
      logger.error('Error getting user location:', error);
    } finally {
      setLoading(false);
    }
  }, [requestLocationPermission, mapReady, centerMapOn]);
  const fetchHives = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await hiveService.fetchHivesByUserId(user.id, 'Ativas');
    if (data) {
      logger.info('🐝 Total de colmeias encontradas:', data.length);
      logger.info(
        '🐝 Colmeias com coordenadas:',
        data.filter(h => h.latitude != null && h.longitude != null).length,
      );

      const hivesWithCoords = data.filter(
        (h): h is DbHive & { latitude: number; longitude: number } =>
          h.latitude != null && h.longitude != null,
      );

      logger.info('🐝 Colmeias filtradas para o mapa:', hivesWithCoords);

      setHives(hivesWithCoords);
      if (!userLocation && hivesWithCoords.length > 0 && mapReady) {
        const firstHive = hivesWithCoords[0];
        centerMapOn({ latitude: firstHive.latitude, longitude: firstHive.longitude }, false);
      }
    }
    setLoading(false);
  }, [user?.id, userLocation, mapReady, centerMapOn]);
  useFocusEffect(
    useCallback(() => {
      const initializeMap = async () => {
        logger.debug('🗺️ Initializing map screen');
        const hasPermission = await requestLocationPermission(false);
        logger.debug('🗺️ Permission status:', hasPermission ? 'granted' : 'denied');
        if (hasPermission) {
          logger.debug('🗺️ Getting user location...');
          getUserLocation();
        } else {
          logger.debug('🗺️ No location permission, using default region');
        }
        fetchHives();
      };
      initializeMap();
    }, [requestLocationPermission, getUserLocation, fetchHives]),
  );
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (nextAppState === 'active') {
        const { status } = await Location.getForegroundPermissionsAsync();
        setPermissionStatus(status);
      }
    });
    return () => subscription.remove();
  }, []);
  const navigateToHiveDetail = useCallback(
    (hiveId: string) => router.push(`/hive/${hiveId}`),
    [router],
  );
  const centerOnUserLocationPress = useCallback(() => {
    if (userLocation) centerMapOn(userLocation);
    else getUserLocation();
  }, [userLocation, centerMapOn, getUserLocation]);

  useEffect(() => {
    if (mapReady && userLocation) {
      logger.debug('🗺️ Map ready and user location available, centering map');
      centerMapOn(userLocation);
    }
  }, [mapReady, userLocation, centerMapOn]);

  useEffect(() => {
    if (permissionStatus === Location.PermissionStatus.GRANTED && !userLocation) {
      logger.debug('🗺️ Permission granted, getting user location');
      getUserLocation();
    }
  }, [permissionStatus, userLocation, getUserLocation]);

  return {
    hives,
    loading,
    userLocation,
    permissionStatus,
    initialRegion,
    mapReady,
    mapRef,
    setMapReady,
    navigateToHiveDetail,
    centerOnUserLocationPress,
    requestLocationPermission,
  };
};
