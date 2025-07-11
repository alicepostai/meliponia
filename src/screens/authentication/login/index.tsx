import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import AuthFooter from '@/components/footer/auth-footer';
import AuthHeader from '@/components/header/auth-header';
import FormErrorText from '@/components/ui/form-error-text';
import { CommonValidations } from '@/utils/validations';
import { useLoginScreenStyles } from './styles';
import { useLoginForm, LoginFormValues } from './UseLoginForm';
const LoginSchema = Yup.object().shape({
  email: CommonValidations.email(),
  password: Yup.string().min(1, 'Senha é obrigatória').required('Senha é obrigatória'),
});
const LoginScreen = memo(() => {
  const styles = useLoginScreenStyles();
  const {
    isSubmitting,
    secureEntry,
    passwordInputRef,
    handleSignup,
    handleForgotPassword,
    toggleSecureEntry,
    handleLogin,
  } = useLoginForm();
  return (
    <ScreenWrapper scrollable scrollViewProps={{ contentContainerStyle: styles.scrollContent }}>
      <AuthHeader
        title="Boas vindas ao Meliponia!"
        logo={require('../../../../assets/images/homeImage.png')}
        containerStyle={styles.header}
      />
      <Formik<LoginFormValues>
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
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
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
            <FormErrorText error={errors.email} touched={!!touched.email} />
            <InputField
              ref={passwordInputRef}
              iconName="lock-outline"
              placeholder="Insira sua senha"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry={secureEntry}
              toggleSecureEntry={toggleSecureEntry}
              error={!!(touched.password && errors.password)}
              returnKeyType="done"
              onSubmitEditing={() => handleSubmit()}
            />
            <FormErrorText error={errors.password} touched={!!touched.password} />
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
            <MainButton
              title="Login"
              onPress={() => handleSubmit()}
              loading={isSubmitting || formikSubmitting}
              disabled={isSubmitting || formikSubmitting}
              style={styles.loginButton}
            />
          </View>
        )}
      </Formik>
      <AuthFooter
        text="Não possui uma conta?"
        actionText="Cadastre-se"
        onPress={handleSignup}
        containerStyle={styles.footer}
      />
    </ScreenWrapper>
  );
});

LoginScreen.displayName = 'LoginScreen';
export default LoginScreen;
