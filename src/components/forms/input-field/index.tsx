import React, { forwardRef, memo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { useInputFieldStyles } from './styles';
import { metrics } from '@/theme/metrics';
interface InputFieldProps
  extends Omit<TextInputProps, 'onChangeText' | 'value' | 'style' | 'placeholderTextColor'> {
  iconName?: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  iconColorProp?: string;
  toggleSecureEntry?: () => void;
  secureTextEntry?: boolean;
  error?: boolean;
  placeholder?: string;
}
const InputField = forwardRef<TextInput, InputFieldProps>(
  (
    {
      iconName,
      label,
      value,
      onChangeText,
      placeholder,
      secureTextEntry,
      toggleSecureEntry,
      containerStyle,
      inputContainerStyle,
      inputStyle,
      iconSize = metrics.iconSizeMedium,
      iconColorProp,
      error,
      multiline,
      ...rest
    },
    ref,
  ) => {
    const { colors: themeColors } = useTheme();
    const styles = useInputFieldStyles();

    const defaultIconColor = error ? themeColors.error : iconColorProp || themeColors.textSecondary;
    const secureEntryIconName = secureTextEntry ? 'eye-off-outline' : 'eye-outline';
    const multilineStyles = multiline
      ? {
          container: { alignItems: 'flex-start' as const },
          icon: { marginTop: metrics.md + 1 },
          input: { textAlignVertical: 'top' as const },
        }
      : { container: {}, icon: {}, input: {} };
    return (
      <View style={[styles.fieldContainer, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styles.inputContainer,
            error && styles.errorBorder,
            multilineStyles.container,
            inputContainerStyle,
          ]}
        >
          {iconName && (
            <MaterialCommunityIcons
              name={iconName}
              size={iconSize}
              color={defaultIconColor}
              style={[styles.icon, multilineStyles.icon]}
            />
          )}
          <TextInput
            ref={ref}
            style={[styles.textInput, multilineStyles.input, inputStyle]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={themeColors.secondary}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            {...rest}
          />
          {toggleSecureEntry && (
            <TouchableOpacity onPress={toggleSecureEntry} style={styles.toggleButton}>
              <MaterialCommunityIcons
                name={secureEntryIconName}
                size={metrics.iconSizeSmall}
                color={themeColors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);
InputField.displayName = 'InputField';
export default memo(InputField);
