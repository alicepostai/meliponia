import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { createCommonStyles } from '@/theme/commonStyles';
interface FormSectionProps {
  title?: string;
  children: ReactNode;
  style?: any;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children, style }) => {
  const { colors } = useTheme();
  const commonStyles = createCommonStyles(colors);
  return (
    <View style={[commonStyles.formContainer, style]}>
      {title && <Text style={commonStyles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );
};
