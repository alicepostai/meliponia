import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useHiveListItemStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexDirection: 'row',
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          marginBottom: metrics.lg,
          padding: metrics.md,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
          alignItems: 'center',
        },
        pendingCard: {
          opacity: 0.6,
        },
        image: {
          width: 60,
          height: 60,
          borderRadius: metrics.borderRadiusSmall,
          backgroundColor: colors.lightGray,
          marginRight: metrics.md,
        },
        infoContainer: {
          flex: 1,
          justifyContent: 'center',
        },
        infoHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        },
        name: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Regular,
          color: colors.text,
          flexShrink: 1,
          marginRight: metrics.sm,
        },
        code: {
          fontFamily: fonts.SemiBold,
        },
        statusIcon: {},
        scientificName: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Light,
          color: colors.textSecondary,
          marginBottom: 2,
        },
        details: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
        },
      }),
    [colors],
  );
};
