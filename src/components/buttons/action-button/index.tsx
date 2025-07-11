import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { createCommonStyles } from '@/theme/commonStyles';
interface ActionButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: any;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  style,
}) => {
  const { colors } = useTheme();
  const commonStyles = createCommonStyles(colors);
  const buttonStyle =
    variant === 'primary' ? commonStyles.primaryButton : commonStyles.secondaryButton;
  const textStyle =
    variant === 'primary' ? commonStyles.primaryButtonText : commonStyles.secondaryButtonText;
  return (
    <TouchableOpacity
      style={[buttonStyle, (disabled || isLoading) && { opacity: 0.6 }, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
