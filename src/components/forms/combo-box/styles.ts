import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
export const useComboBoxStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        label: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Medium,
          color: colors.text,
          marginBottom: metrics.sm,
          marginLeft: metrics.xs,
        },
        inputContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: metrics.borderWidth,
          borderColor: colors.border,
          borderRadius: metrics.borderRadiusMedium,
          backgroundColor: colors.cardBackground,
          height: metrics.inputHeight,
          paddingHorizontal: metrics.md,
        },
        errorBorder: {
          borderColor: colors.error,
        },
        inputIcon: {
          marginRight: metrics.md,
        },
        textInput: {
          flex: 1,
          fontFamily: fonts.Regular,
          fontSize: fontSizes.lg,
          color: colors.text,
          marginRight: metrics.sm,
        },
        placeholderText: {
          color: colors.textSecondary,
        },
        modal: {
          justifyContent: 'flex-end',
          margin: 0,
        },
        modalContainer: {
          backgroundColor: colors.cardBackground,
          borderTopLeftRadius: metrics.borderRadiusLarge,
          borderTopRightRadius: metrics.borderRadiusLarge,
          paddingTop: metrics.lg,
          paddingBottom: metrics.xl,
          maxHeight: '70%',
        },
        searchBarContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: metrics.borderWidth,
          borderColor: colors.border,
          borderRadius: metrics.borderRadiusMedium,
          marginHorizontal: metrics.lg,
          marginBottom: metrics.md,
          paddingHorizontal: metrics.md,
        },
        searchIcon: {
          marginRight: metrics.sm,
        },
        searchBar: {
          flex: 1,
          height: 40,
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.text,
          paddingVertical: metrics.sm,
        },
        emptyListContainer: {
          padding: metrics.xl,
          alignItems: 'center',
        },
        emptyListText: {
          fontSize: fontSizes.md,
          fontFamily: fonts.Regular,
          color: colors.textSecondary,
          textAlign: 'center',
        },
      }),
    [colors],
  );
};
export const useImageListItemStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        itemContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: metrics.sm,
          paddingHorizontal: metrics.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        itemImage: {
          width: 40,
          height: 40,
          borderRadius: 20,
          marginRight: metrics.md,
          backgroundColor: colors.lightGray,
        },
        textContainer: {
          flex: 1,
          justifyContent: 'center',
        },
        itemText: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Regular,
          color: colors.text,
          marginBottom: 2,
        },
        itemSubText: {
          fontSize: fontSizes.sm,
          fontFamily: fonts.Light,
          color: colors.textSecondary,
        },
      }),
    [colors],
  );
};
export const useTextListItemStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        itemContainer: {
          paddingVertical: metrics.md,
          paddingHorizontal: metrics.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        itemText: {
          fontSize: fontSizes.lg,
          fontFamily: fonts.Regular,
          color: colors.text,
        },
      }),
    [colors],
  );
};
