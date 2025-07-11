import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useProfileScreenStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        userInfoContainer: {
          alignItems: 'center',
          paddingVertical: metrics['2xl'],
          marginBottom: metrics.lg,
          backgroundColor: colors.honeySubtle,
          marginHorizontal: metrics.sm,
          borderRadius: metrics.borderRadiusLarge,
          borderWidth: 1,
          borderColor: colors.honey + '20',
          shadowColor: colors.honey,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        },
        avatarContainer: {
          position: 'relative',
          marginBottom: metrics.md,
        },
        avatarPlaceholder: {
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: colors.lightGray,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        avatarImage: {
          width: '100%',
          height: '100%',
        },
        editAvatarButton: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: colors.honey,
          padding: metrics.sm - 2,
          borderRadius: metrics.borderRadiusRound,
          borderWidth: 2,
          borderColor: colors.cardBackground,
          elevation: 3,
        },
        nameContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: metrics.sm,
          paddingHorizontal: metrics.lg,
          minHeight: 40,
        },
        nameText: {
          fontSize: fontSizes.xl,
          fontFamily: fonts.SemiBold,
          color: colors.text,
          marginRight: metrics.sm,
          textAlign: 'center',
        },
        emailText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.secondary,
          marginTop: metrics.xs,
          textAlign: 'center',
        },
        editNameButton: {
          padding: metrics.xs,
        },
        nameInput: {
          fontSize: fontSizes.xl,
          fontFamily: fonts.SemiBold,
          color: colors.text,
          paddingVertical: metrics.sm,
          paddingHorizontal: metrics.sm,
          borderColor: colors.secondary,
          borderWidth: 1,
          borderRadius: metrics.borderRadiusSmall,
          textAlign: 'center',
          minWidth: 200,
        },
        saveNameButton: {
          backgroundColor: colors.honey,
          padding: metrics.sm,
          borderRadius: metrics.borderRadiusRound,
          marginLeft: metrics.sm,
        },
        sectionSpacing: {
          marginTop: metrics.lg,
          marginHorizontal: metrics.lg,
          marginBottom: metrics.xl,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        lastUpdateText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Regular,
          color: colors.secondary,
          marginTop: metrics.xs / 2,
          textAlign: 'center',
        },
        statsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: metrics.lg,
          backgroundColor: colors.cardBackground,
          borderRadius: metrics.borderRadiusMedium,
          marginHorizontal: metrics.lg,
        },
        statItem: {
          alignItems: 'center',
        },
        statNumber: {
          fontSize: fontSizes['2xl'],
          fontFamily: fonts.Bold,
          color: colors.honey,
          marginBottom: metrics.xs / 2,
        },
        statLabel: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Regular,
          color: colors.secondary,
          textAlign: 'center',
        },
      }),
    [colors],
  );
};
export const useActionRowStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        actionRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: metrics.md,
          paddingHorizontal: metrics.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.cardBackground,
        },
        actionRowFirst: {
          borderTopLeftRadius: metrics.borderRadiusMedium,
          borderTopRightRadius: metrics.borderRadiusMedium,
        },
        actionRowLast: {
          borderBottomWidth: 0,
          borderBottomLeftRadius: metrics.borderRadiusMedium,
          borderBottomRightRadius: metrics.borderRadiusMedium,
        },
        actionIcon: {
          marginRight: metrics.md,
          width: 24,
          textAlign: 'center',
        },
        actionText: {
          flex: 1,
          fontSize: fontSizes.lg,
          fontFamily: fonts.Regular,
          color: colors.text,
        },
        destructiveText: {
          color: colors.error,
          fontFamily: fonts.Medium,
        },
      }),
    [colors],
  );
};
