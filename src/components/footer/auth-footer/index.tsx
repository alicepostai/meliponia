import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useAuthFooterStyles } from './styles';
interface AuthFooterProps {
  text: string;
  actionText: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  actionTextStyle?: StyleProp<TextStyle>;
}
const AuthFooter = memo(
  ({ text, actionText, onPress, containerStyle, textStyle, actionTextStyle }: AuthFooterProps) => {
    const styles = useAuthFooterStyles();
    return (
      <View style={[styles.footerContainer, containerStyle]}>
        <Text style={[styles.footerText, textStyle]}>{text} </Text>
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Text style={[styles.footerActionText, actionTextStyle]}>{actionText}</Text>
        </TouchableOpacity>
      </View>
    );
  },
);
export default AuthFooter;
