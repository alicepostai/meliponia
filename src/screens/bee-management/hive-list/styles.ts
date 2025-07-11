import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useHiveListScreenStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        searchFilterContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: metrics.lg,
          paddingTop: metrics.lg,
          paddingBottom: metrics.sm,
        },
        searchInputContainer: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          height: 44,
          paddingHorizontal: metrics.md,
          borderWidth: 1,
          borderColor: colors.border,
          marginRight: metrics.sm,
        },
        searchIcon: { marginRight: metrics.sm },
        searchInput: {
          flex: 1,
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.text,
          paddingVertical: 0,
        },
        clearButton: { padding: metrics.xs },
        actionButton: {
          padding: metrics.sm,
          position: 'relative',
          marginLeft: metrics.xs,
        },
        filterBadge: {
          position: 'absolute',
          top: metrics.xs,
          right: metrics.xs,
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.honey,
        },
        listContent: {
          paddingHorizontal: metrics.lg,
          paddingTop: metrics.sm,
          paddingBottom: 100,
          flexGrow: 1,
        },
      }),
    [colors],
  );
};
export const useFeedbackStateStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: metrics.xl,
        },
        icon: {
          marginBottom: metrics.lg,
        },
        title: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Medium,
          color: colors.secondary,
          textAlign: 'center',
          marginTop: metrics.lg,
        },
        subtext: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.secondary,
          textAlign: 'center',
          marginTop: metrics.sm,
        },
        button: {
          marginTop: metrics.xl,
          backgroundColor: colors.honey,
          paddingVertical: metrics.md,
          paddingHorizontal: metrics.xl,
          borderRadius: metrics.borderRadiusPill,
        },
        buttonText: {
          color: colors.white,
          fontFamily: fonts.SemiBold,
          fontSize: fontSizes.md,
        },
        errorText: {
          color: colors.error,
        },
      }),
    [colors],
  );
};
