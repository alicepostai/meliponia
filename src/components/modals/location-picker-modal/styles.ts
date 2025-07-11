import { useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
const { height } = Dimensions.get('window');
export const useLocationPickerModalStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        modalContainer: {
          justifyContent: 'flex-end',
          margin: 0,
        },
        contentContainer: {
          backgroundColor: colors.background,
          borderTopLeftRadius: metrics.borderRadiusLarge,
          borderTopRightRadius: metrics.borderRadiusLarge,
          padding: metrics.lg,
          height: height * 0.8,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 10,
        },
        headerContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: metrics.md,
        },
        modalTitle: {
          fontSize: fontSizes.xl,
          fontFamily: fonts.SemiBold,
          color: colors.text,
        },
        closeButton: {
          padding: metrics.sm,
        },
        mapContainer: {
          flex: 1,
          borderRadius: metrics.borderRadiusMedium,
          overflow: 'hidden',
          marginBottom: metrics.lg,
        },
        map: {
          ...StyleSheet.absoluteFillObject,
        },
        instructionsText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: metrics.md,
        },
        currentLocationButton: {
          position: 'absolute',
          top: metrics.md,
          right: metrics.md,
          backgroundColor: colors.cardBackground,
          padding: metrics.sm,
          borderRadius: metrics.borderRadiusRound,
          elevation: 3,
        },
        loadingOverlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: metrics.borderRadiusMedium,
        },
      }),
    [colors],
  );
};
