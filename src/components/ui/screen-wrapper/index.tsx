import React, { ReactNode, memo } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleProp,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import { useScreenWrapperStyles } from './styles';
interface ScreenWrapperProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  safeAreaStyle?: StyleProp<ViewStyle>;
  scrollViewProps?: ScrollViewProps;
  noPadding?: boolean;
}
const ScreenWrapper = memo(
  ({
    children,
    scrollable = false,
    style,
    safeAreaStyle,
    scrollViewProps,
    noPadding = false,
  }: ScreenWrapperProps) => {
    const styles = useScreenWrapperStyles();
    const content = scrollable ? (
      <ScrollView
        style={[styles.container, !noPadding && styles.withPadding, style]}
        contentContainerStyle={[
          styles.scrollContentContainer,
          scrollViewProps?.contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    ) : (
      <View style={[styles.container, !noPadding && styles.withPadding, style]}>{children}</View>
    );
    return <SafeAreaView style={[styles.safeArea, safeAreaStyle]}>{content}</SafeAreaView>;
  },
);
export default ScreenWrapper;
