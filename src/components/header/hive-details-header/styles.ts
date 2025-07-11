import { useMemo } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';
export const useHiveDetailHeaderStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        imageContainer: {
          position: 'relative',
          height: 220,
          backgroundColor: colors.lightGray,
        },
        image: {
          width: '100%',
          height: '100%',
        },
        imagePlaceholder: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        placeholderText: {
          marginTop: metrics.sm,
          color: colors.secondary,
        },
        optionsMenuButtonOverImage: {
          position: 'absolute',
          top: metrics.sm + (StatusBar.currentHeight || 0),
          right: metrics.sm,
          padding: metrics.sm,
          borderRadius: metrics.borderRadiusRound,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        cameraButton: {
          position: 'absolute',
          bottom: metrics.md,
          right: metrics.md,
          backgroundColor: colors.honey,
          borderRadius: metrics.borderRadiusRound,
          width: 50,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: colors.white,
          shadowColor: colors.honey,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        },
        iconShadow: {
          textShadowColor: 'rgba(0, 0, 0, 0.5)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
      }),
    [colors],
  );
};
