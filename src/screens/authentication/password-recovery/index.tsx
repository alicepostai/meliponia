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
import { usePasswordRecoveryScreenStyles } from './styles';
import { usePasswordRecoveryForm, RecoveryFormValues } from './UsePasswordRecoveryForm';
const RecoverySchema = Yup.object().shape({
  email: Yup.string().email('Insira um e-mail válido').required('E-mail é obrigatório'),
});
const PasswordRecoveryScreen = memo(() => {
  const styles = usePasswordRecoveryScreenStyles();
  const { isSubmitting, goToLogin, handlePasswordRecovery } = usePasswordRecoveryForm();
  return (
    <ScreenWrapper noPadding>
      <View style={styles.container}>
        <ActionHeader
          iconName="lock-alert-outline"
          title="Recuperar Senha"
          subtitle="Insira seu e-mail abaixo."
          containerStyle={styles.header}
        />
        <Formik<RecoveryFormValues>
          initialValues={{ email: '' }}
          validationSchema={RecoverySchema}
          onSubmit={handlePasswordRecovery}
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
                placeholder="Insira seu e-mail cadastrado"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={() => handleSubmit()}
                error={!!(touched.email && errors.email)}
              />
              <FormErrorText
                error={errors.email}
                touched={!!touched.email}
                style={styles.errorText}
              />
              <MainButton
                title={'Enviar e-mail de recuperação'}
                onPress={() => handleSubmit()}
                loading={isSubmitting || formikSubmitting}
                disabled={isSubmitting || formikSubmitting}
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>
        <AuthFooter
          text="Lembrou da senha?"
          actionText="Faça login"
          onPress={goToLogin}
          containerStyle={styles.footer}
        />
      </View>
    </ScreenWrapper>
  );
});
export default PasswordRecoveryScreen;
