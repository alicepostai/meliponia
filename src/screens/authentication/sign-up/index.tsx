import React, { memo } from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import AuthFooter from '@/components/footer/auth-footer';
import ActionHeader from '@/components/header/action-header';
import FormErrorText from '@/components/ui/form-error-text';
import { CommonValidations } from '@/utils/validations';
import { useSignupScreenStyles } from './styles';
import { useSignupForm, SignupFormValues } from './UseSignUpForm';
const SignupSchema = Yup.object().shape({
  email: CommonValidations.email(),
  password: CommonValidations.password(),
  confirmPassword: CommonValidations.confirmPassword(),
});
const SignupScreen = memo(() => {
  const styles = useSignupScreenStyles();
  const { isSubmitting, secureEntry, handleLogin, toggleSecureEntry, handleSignup } =
    useSignupForm();
  return (
    <ScreenWrapper scrollable scrollViewProps={{ contentContainerStyle: styles.scrollContent }}>
      <ActionHeader
        iconName="account-plus-outline"
        title="Criar Conta"
        subtitle="Preencha os dados abaixo para se cadastrar."
        containerStyle={styles.header}
      />
      <Formik<SignupFormValues>
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSignup}
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
              iconName="email-outline"
              placeholder="Insira seu e-mail"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!(touched.email && errors.email)}
              returnKeyType="next"
            />
            <FormErrorText error={errors.email} touched={!!touched.email} />
            <InputField
              iconName="lock-outline"
              placeholder="Crie uma senha segura (mín. 8 caracteres)"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry={secureEntry}
              toggleSecureEntry={toggleSecureEntry}
              error={!!(touched.password && errors.password)}
              returnKeyType="next"
            />
            <FormErrorText error={errors.password} touched={!!touched.password} />
            <InputField
              iconName="lock-check-outline"
              placeholder="Confirme sua senha"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              secureTextEntry={secureEntry}
              toggleSecureEntry={toggleSecureEntry}
              error={!!(touched.confirmPassword && errors.confirmPassword)}
              returnKeyType="done"
              onSubmitEditing={() => handleSubmit()}
            />
            <FormErrorText error={errors.confirmPassword} touched={!!touched.confirmPassword} />
            <MainButton
              title="Cadastrar"
              onPress={() => handleSubmit()}
              loading={isSubmitting || formikSubmitting}
              disabled={isSubmitting || formikSubmitting}
              style={styles.submitButton}
            />
          </View>
        )}
      </Formik>
      <AuthFooter
        text="Já possui uma conta?"
        actionText="Faça login"
        onPress={handleLogin}
        containerStyle={styles.footer}
      />
    </ScreenWrapper>
  );
});

SignupScreen.displayName = 'SignupScreen';
export default SignupScreen;
