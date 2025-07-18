import React, { memo } from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
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
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.button, style, disabled && styles.disabledButton]}
        accessibilityLabel={accessibilityLabel}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        disabled={disabled}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <MaterialCommunityIcons name={iconName} size={iconSize} color={finalIconColor} />
      </TouchableOpacity>
    );
  },
);

HeaderActionButton.displayName = 'HeaderActionButton';

export default HeaderActionButton;
