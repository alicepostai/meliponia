import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
export const useLoadingOverlayStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        modalBackground: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        activityIndicatorWrapper: {
          backgroundColor: colors.cardBackground,
          height: 120,
          width: 120,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        },
        loadingText: {
          marginTop: 10,
          color: colors.text,
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          textAlign: 'center',
        },
      }),
    [colors],
  );
};
