import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';

interface LocationSelectorProps {
  latitude: number | null;
  longitude: number | null;
  isGettingLocation: boolean;
  onGetCurrentLocation: () => void;
  onOpenLocationPicker: () => void;
}

const LocationSelector = memo<LocationSelectorProps>(
  ({ latitude, longitude, isGettingLocation, onGetCurrentLocation, onOpenLocationPicker }) => {
    const { colors } = useTheme();

    const styles = useMemo(
      () =>
        StyleSheet.create({
          inputLabel: {
            fontSize: fontSizes.md,
            fontFamily: fonts.Medium,
            color: colors.text,
            marginBottom: metrics.sm,
          },
          locationContainer: {
            flexDirection: 'row',
            gap: metrics.sm,
            marginBottom: metrics.sm,
          },
          locationButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.secondary,
            borderRadius: metrics.borderRadiusSmall,
            paddingVertical: metrics.sm,
            paddingHorizontal: metrics.md,
            gap: metrics.xs,
          },
          locationButtonText: {
            fontSize: fontSizes.sm,
            fontFamily: fonts.Medium,
            color: colors.secondary,
          },
          mapPickerButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.secondary,
            borderRadius: metrics.borderRadiusSmall,
            paddingVertical: metrics.sm,
            paddingHorizontal: metrics.md,
            gap: metrics.xs,
          },
          mapPickerButtonText: {
            fontSize: fontSizes.sm,
            fontFamily: fonts.Medium,
            color: colors.background,
          },
          coordinatesText: {
            fontSize: fontSizes.sm,
            fontFamily: fonts.Regular,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: metrics.xs,
          },
        }),
      [colors],
    );

    return (
      <View>
        <Text style={styles.inputLabel}>Localização</Text>
        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={onGetCurrentLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <ActivityIndicator color={colors.secondary} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="crosshairs-gps" size={20} color={colors.secondary} />
                <Text style={styles.locationButtonText}>
                  {isGettingLocation ? 'Obtendo...' : 'Usar Localização Atual'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapPickerButton} onPress={onOpenLocationPicker}>
            <MaterialCommunityIcons
              name="map-marker-plus-outline"
              size={20}
              color={colors.background}
            />
            <Text style={styles.mapPickerButtonText}>
              {typeof latitude === 'number' ? 'Alterar Local no Mapa' : 'Selecionar Local no Mapa'}
            </Text>
          </TouchableOpacity>
        </View>
        {typeof latitude === 'number' && typeof longitude === 'number' && (
          <Text style={styles.coordinatesText}>
            Lat: {latitude.toFixed(5)}, Lon: {longitude.toFixed(5)}
          </Text>
        )}
      </View>
    );
  },
);

LocationSelector.displayName = 'LocationSelector';
export default LocationSelector;
