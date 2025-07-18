import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';

interface OptionItem {
  label: string;
  icon?: string;
  onPress: () => void;
  isDestructive?: boolean;
}

interface FastOptionsMenuProps {
  isVisible: boolean;
  onDismiss: () => void;
  options: OptionItem[];
  anchorPosition?: { x: number; y: number };
  topOffset?: number;
}

const MenuItem = memo(({ option, onPress }: { option: OptionItem; onPress: () => void }) => {
  const { colors } = useTheme();

  const styles = useMemo(
    () => ({
      menuItem: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        paddingHorizontal: metrics.md,
        paddingVertical: metrics.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      menuIcon: {
        marginRight: metrics.sm,
        width: 20,
      },
      menuText: {
        fontSize: fontSizes.md,
        fontFamily: fonts.Regular,
        flex: 1,
        color: option.isDestructive ? colors.error : colors.text,
      },
    }),
    [colors, option.isDestructive],
  );

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      {option.icon && (
        <MaterialCommunityIcons
          name={option.icon}
          size={20}
          color={option.isDestructive ? colors.error : colors.text}
          style={styles.menuIcon}
        />
      )}
      <Text style={styles.menuText}>{option.label}</Text>
    </TouchableOpacity>
  );
});

MenuItem.displayName = 'MenuItem';

const FastOptionsMenu = memo(
  ({ isVisible, onDismiss, options, anchorPosition, topOffset }: FastOptionsMenuProps) => {
    const { colors } = useTheme();

    const styles = useMemo(
      () =>
        StyleSheet.create({
          backdrop: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
          },
          menuContainer: {
            backgroundColor: colors.cardBackground,
            borderRadius: metrics.borderRadiusMedium,
            paddingVertical: metrics.xs,
            minWidth: 200,
            maxWidth: 250,
            elevation: 8,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            zIndex: 1001,
            borderWidth: 1,
            borderColor: colors.border,
          },
        }),
      [colors],
    );

    const handleItemPress = useCallback(
      (itemOnPress: () => void) => {
        itemOnPress();
        onDismiss();
      },
      [onDismiss],
    );

    if (!isVisible) {
      console.log('FastOptionsMenu: isVisible is false, not rendering');
      return null;
    }

    console.log('FastOptionsMenu: Rendering menu with options:', options.length);

    const topPosition = anchorPosition?.y ?? topOffset ?? 90;

    const menuStyle = {
      ...styles.menuContainer,
      position: 'absolute' as const,
      top: topPosition,
      right: 16,
      zIndex: 1001,
    };

    return (
      <>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss} />
        <View style={menuStyle}>
          {options.map((option, index) => (
            <MenuItem
              key={`${option.label}-${index}`}
              option={option}
              onPress={() => handleItemPress(option.onPress)}
            />
          ))}
        </View>
      </>
    );
  },
);

FastOptionsMenu.displayName = 'FastOptionsMenu';

export default FastOptionsMenu;
