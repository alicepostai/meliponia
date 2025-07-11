import React, { ReactNode, memo } from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useDataRowStyles } from './styles';
interface DataRowProps {
  label: string;
  value: ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}
const DataRow = memo(({ label, value, style, labelStyle, valueStyle }: DataRowProps) => {
  const styles = useDataRowStyles();
  return (
    <View style={[styles.dataRow, style]}>
      <Text style={[styles.label, labelStyle]}>{label}:</Text>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Text style={[styles.value, valueStyle]}>{value}</Text>
      ) : (
        value
      )}
    </View>
  );
});
export default DataRow;
