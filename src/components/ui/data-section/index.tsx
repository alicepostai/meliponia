import React, { ReactNode, memo } from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useDataSectionStyles } from './styles';
interface DataSectionProps {
  title: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}
const DataSection = memo(({ title, children, style, titleStyle }: DataSectionProps) => {
  const styles = useDataSectionStyles();
  return (
    <View style={[styles.section, style]}>
      <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
});
export default DataSection;
