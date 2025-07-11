import React, { memo } from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { useFormErrorTextStyles } from './styles';
import { FormikErrors, FormikTouched } from 'formik';
interface FormErrorTextProps {
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[];
  style?: StyleProp<TextStyle>;
}
const FormErrorText = memo(({ error, touched, style }: FormErrorTextProps) => {
  const styles = useFormErrorTextStyles();
  if (!touched || !error || typeof error !== 'string') {
    return null;
  }
  return <Text style={[styles.errorText, style]}>{error}</Text>;
});
export default FormErrorText;
