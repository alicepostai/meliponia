import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';
import { useTheme } from '@/contexts/ThemeContext';
import { useMapScreenStyles } from './styles';
import { useMapScreen } from './UseMapScreen';
import { getBeeNameById, getBeeImageUrlById } from '@/utils/helpers';
import UnifiedMapComponent, { BeeMarker } from '@/components/maps/UnifiedMapComponent';

const MapContent = memo(() => {
  const styles = useMapScreenStyles();
  const { hives, initialRegion, mapRef, navigateToHiveDetail } = useMapScreen();

  return (
    <UnifiedMapComponent
      ref={mapRef}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation
    >
      {hives.map(hive => (
        <BeeMarker
          key={hive.id}
          id={hive.id}
          coordinate={{ latitude: hive.latitude!, longitude: hive.longitude! }}
          title={`#${hive.hive_code || 'S/C'}`}
          description={getBeeNameById(hive.bee_species_id)}
          imageUrl={getBeeImageUrlById(hive.bee_species_id)}
          onPress={() => navigateToHiveDetail(hive.id)}
        />
      ))}
    </UnifiedMapComponent>
  );
});
MapContent.displayName = 'MapContent';

const FeedbackState = memo(
  ({
    status,
    onGrantPermission,
  }: {
    status: 'loading' | 'permission_denied';
    onGrantPermission: () => void;
  }) => {
    const styles = useMapScreenStyles();
    const { colors } = useTheme();
    if (status === 'loading') {
      return (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color={colors.honey} />
          <Text style={styles.feedbackText}>Carregando mapa...</Text>
        </View>
      );
    }
    return (
      <View style={styles.feedbackContainer}>
        <MaterialCommunityIcons name="map-marker-off-outline" size={60} color={colors.secondary} />
        <Text style={[styles.feedbackText, { marginTop: 16 }]}>
          A permissão de localização é necessária para exibir o mapa.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={onGrantPermission}>
          <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  },
);
FeedbackState.displayName = 'FeedbackState';

const MapScreen = memo(() => {
  const styles = useMapScreenStyles();
  const { colors } = useTheme();
  const { loading, permissionStatus, centerOnUserLocationPress, requestLocationPermission } =
    useMapScreen();
  const showMap = permissionStatus === Location.PermissionStatus.GRANTED;

  return (
    <View style={styles.container}>
      {loading && !showMap && <FeedbackState status="loading" onGrantPermission={() => {}} />}
      {!loading && !showMap && (
        <FeedbackState
          status="permission_denied"
          onGrantPermission={() => requestLocationPermission(true)}
        />
      )}
      {showMap && <MapContent />}
      {showMap && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.cardBackground }]}
          onPress={centerOnUserLocationPress}
        >
          <MaterialCommunityIcons name="crosshairs-gps" size={28} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
});
MapScreen.displayName = 'MapScreen';

export default MapScreen;
