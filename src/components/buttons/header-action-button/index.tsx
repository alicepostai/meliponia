import React, { memo } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';
import { useHeaderActionButtonStyles } from './styles';
interface HeaderActionButtonProps {
  iconName: string;
  accessibilityLabel: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
  disabled?: boolean;
}
const HeaderActionButton = memo(
  ({
    iconName,
    accessibilityLabel,
    onPress,
    style,
    iconSize = metrics.iconSizeMedium,
    iconColor,
    disabled = false,
  }: HeaderActionButtonProps) => {
    const { colors: themeColors } = useTheme();
    const styles = useHeaderActionButtonStyles();
    const finalIconColor = disabled
      ? themeColors.disabledText
      : iconColor || themeColors.headerText;

    const handlePress = () => {
      console.log(`HeaderActionButton pressed: ${accessibilityLabel}`);
      if (onPress) {
        onPress();
      } else {
        console.warn('HeaderActionButton: onPress function is undefined');
      }
    };

    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          style,
          disabled && styles.disabledButton,
          pressed && !disabled && { opacity: 0.7 },
        ]}
        accessibilityLabel={accessibilityLabel}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        disabled={disabled}
      >
        <MaterialCommunityIcons name={iconName} size={iconSize} color={finalIconColor} />
      </Pressable>
    );
  },
);

HeaderActionButton.displayName = 'HeaderActionButton';

export default HeaderActionButton;
