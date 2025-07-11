import React, { memo } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import ActionHeader from '@/components/header/action-header';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import FormErrorText from '@/components/ui/form-error-text';
import { CommonValidations } from '@/utils/validations';
import { useChangePasswordScreenStyles } from './styles';
import { useChangePasswordForm, ChangePasswordFormValues } from './UseChangePasswordForm';
const ChangePasswordSchema = Yup.object().shape({
  newPassword: CommonValidations.password(),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'As senhas não correspondem')
    .required('Confirmação de senha é obrigatória'),
});
const ChangePasswordScreen = memo(() => {
  const styles = useChangePasswordScreenStyles();
  const {
    isSubmitting,
    secureNewEntry,
    secureConfirmEntry,
    confirmPasswordInputRef,
    toggleSecureNewEntry,
    toggleSecureConfirmEntry,
    handleChangePassword,
  } = useChangePasswordForm();
  return (
    <ScreenWrapper scrollable>
      <Stack.Screen options={{ title: 'Alterar Senha' }} />
      <View style={styles.headerContainer}>
        <ActionHeader
          iconName="lock-reset"
          title="Alterar Senha"
          subtitle="Defina sua nova senha de acesso"
          containerStyle={styles.actionHeader}
        />
      </View>
      <Formik<ChangePasswordFormValues>
        initialValues={{ newPassword: '', confirmNewPassword: '' }}
        validationSchema={ChangePasswordSchema}
        onSubmit={handleChangePassword}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting: formikSubmitting,
        }) => (
          <View style={styles.formContainer}>
            <InputField
              iconName="lock-outline"
              placeholder="Nova senha segura (mín. 8 caracteres)"
              value={values.newPassword}
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              secureTextEntry={secureNewEntry}
              toggleSecureEntry={toggleSecureNewEntry}
              error={!!(touched.newPassword && errors.newPassword)}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            />
            <FormErrorText error={errors.newPassword} touched={!!touched.newPassword} />
            <InputField
              ref={confirmPasswordInputRef}
              iconName="lock-check-outline"
              placeholder="Confirme sua nova senha"
              value={values.confirmNewPassword}
              onChangeText={handleChange('confirmNewPassword')}
              onBlur={handleBlur('confirmNewPassword')}
              secureTextEntry={secureConfirmEntry}
              toggleSecureEntry={toggleSecureConfirmEntry}
              error={!!(touched.confirmNewPassword && errors.confirmNewPassword)}
              returnKeyType="done"
              onSubmitEditing={() => handleSubmit()}
            />
            <FormErrorText
              error={errors.confirmNewPassword}
              touched={!!touched.confirmNewPassword}
            />
            <MainButton
              title="Salvar Nova Senha"
              onPress={() => handleSubmit()}
              loading={isSubmitting || formikSubmitting}
              disabled={isSubmitting || formikSubmitting}
              style={styles.submitButton}
            />
          </View>
        )}
      </Formik>
    </ScreenWrapper>
  );
});

ChangePasswordScreen.displayName = 'ChangePasswordScreen';
export default ChangePasswordScreen;
