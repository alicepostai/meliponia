import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export const useThemeSwitchStyles = () => {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: 56,
          height: 28,
          borderRadius: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 2,
          position: 'relative',
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
        },
        thumb: {
          position: 'absolute',
          width: 24,
          height: 24,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 3,
          zIndex: 2,
        },
        iconContainer: {
          width: 20,
          height: 20,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        },
        sunIcon: {
          marginLeft: 2,
        },
        moonIcon: {
          marginRight: 2,
        },
      }),
    [colors],
  );
};
