import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { useAuthHeaderStyles } from './styles';
interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  logo?: ImageSourcePropType;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  logoStyle?: StyleProp<ImageStyle>;
}
const AuthHeader = memo(
  ({
    title,
    subtitle,
    logo,
    containerStyle,
    titleStyle,
    subtitleStyle,
    logoStyle,
  }: AuthHeaderProps) => {
    const styles = useAuthHeaderStyles();
    return (
      <View style={[styles.headerContainer, containerStyle]}>
        {logo && <Image source={logo} style={[styles.logo, logoStyle]} resizeMode="contain" />}
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
      </View>
    );
  },
);
export default AuthHeader;
