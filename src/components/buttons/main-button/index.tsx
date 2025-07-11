import React, { memo, forwardRef } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useMainButtonStyles } from './styles';

interface MainButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const MainButton = memo(
  forwardRef<React.ElementRef<typeof TouchableOpacity>, MainButtonProps>(
    ({ title, onPress, loading = false, disabled = false, style, textStyle }, ref) => {
      const { colors: themeColors } = useTheme();
      const styles = useMainButtonStyles();
      const isDisabled = disabled || loading;

      return (
        <TouchableOpacity
          ref={ref}
          style={[styles.button, isDisabled && styles.disabledButton, style]}
          onPress={onPress}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color={themeColors.white} />
          ) : (
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          )}
        </TouchableOpacity>
      );
    },
  ),
);

MainButton.displayName = 'MainButton';

export default MainButton;
