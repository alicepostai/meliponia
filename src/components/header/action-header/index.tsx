import React, { memo } from 'react';
import { Text, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { useActionHeaderStyles } from './styles';
import { metrics } from '@/theme/metrics';
interface ActionHeaderProps {
  iconName: string;
  title: string;
  subtitle?: string;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}
const ActionHeader = memo(
  ({
    iconName,
    title,
    subtitle,
    iconSize = metrics.iconSizeLarge,
    iconColor,
    containerStyle,
    titleStyle,
    subtitleStyle,
  }: ActionHeaderProps) => {
    const { colors: themeColors } = useTheme();
    const styles = useActionHeaderStyles();
    const finalIconColor = iconColor || themeColors.honey;
    return (
      <View style={[styles.headerContainer, containerStyle]}>
        <MaterialCommunityIcons
          name={iconName}
          size={iconSize}
          color={finalIconColor}
          style={styles.icon}
        />
        <Text style={[styles.titleText, titleStyle]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitleText, subtitleStyle]}>{subtitle}</Text>}
      </View>
    );
  },
);
ActionHeader.displayName = 'ActionHeader';

export default ActionHeader;
