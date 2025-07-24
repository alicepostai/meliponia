import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Alert, View, Text, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/AuthService';
import { useAuth } from '@/contexts/AuthContext';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import InputField from '@/components/forms/input-field';
import MainButton from '@/components/buttons/main-button';
import ActionHeader from '@/components/header/action-header';
import FormErrorText from '@/components/ui/form-error-text';
import { CommonValidations } from '@/utils/validations';
import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet } from 'react-native';
import { metrics } from '@/theme/metrics';
import { logger } from '@/utils/logger';
import { AlertService } from '@/services/AlertService';

const ResetPasswordSchema = Yup.object().shape({
  password: CommonValidations.password(),
  confirmPassword: CommonValidations.confirmPassword(),
});

interface ResetFormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { session } = useAuth();
  const { token_verified, error } = useLocalSearchParams<{
    token_verified?: string;
    error?: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);

      if (error) {
        logger.debug('Erro recebido na URL:', error);

        switch (error) {
          case 'token_expired':
            setErrorMessage(
              'Este link de recuperação expirou. Solicite um novo link de recuperação.',
            );
            break;
          case 'no_session':
            setErrorMessage('Token válido, mas não foi possível criar a sessão. Tente novamente.');
            break;
          case 'unexpected_error':
            setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
            break;
          case 'exchange_failed':
            setErrorMessage('Erro ao processar o link de recuperação. Solicite um novo link.');
            break;
          case 'all_methods_failed':
            setErrorMessage(
              'Não foi possível processar este link. Solicite um novo link de recuperação.',
            );
            break;
          default:
            setErrorMessage('Este link de recuperação é inválido ou expirou.');
        }

        setIsValidSession(false);
        setIsLoading(false);
        return;
      }

      if (token_verified === 'true') {
        logger.debug('Token verificado com sucesso');
        setIsValidSession(true);
        setIsLoading(false);
        return;
      }

      try {
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          logger.error('Erro ao verificar sessão:', sessionError);
          setIsValidSession(false);
        } else if (currentSession) {
          logger.debug('Sessão ativa encontrada');
          setIsValidSession(true);
        } else {
          logger.debug('Nenhuma sessão ativa encontrada');
          setIsValidSession(false);
        }
      } catch (error) {
        logger.error('Erro ao verificar sessão:', error);
        setIsValidSession(false);
      }

      setIsLoading(false);
    };

    checkSession();
  }, [token_verified, error, session]);

  const handleResetPassword = async (values: ResetFormValues) => {
    if (!isValidSession) {
      AlertService.showAuthError();
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authService.updateUserPassword(values.password);

      if (!error) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          router.replace('/(app)/(tabs)');
        }, 3000);
      }
    } catch (error) {
      logger.error('Erro ao alterar senha:', error);
      AlertService.showError('Não foi possível alterar a senha. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSecureEntry = () => setSecureEntry(prev => !prev);

  if (isLoading) {
    return (
      <ScreenWrapper style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Verificando link de recuperação...
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!isValidSession) {
    return (
      <ScreenWrapper style={styles.container}>
        <ActionHeader
          iconName="lock-alert-outline"
          title="Link Inválido"
          subtitle={errorMessage || 'Este link de recuperação é inválido ou expirou.'}
        />
        <View style={styles.centerContent}>
          <MainButton
            title="Solicitar Novo Link"
            onPress={() => router.replace('/(auth)/password-recovery')}
            style={styles.button}
          />
          <MainButton
            title="Voltar ao Login"
            onPress={() => router.replace('/(auth)/login')}
            style={styles.button}
          />
        </View>
      </ScreenWrapper>
    );
  }

  if (showSuccessMessage) {
    return (
      <ScreenWrapper scrollable scrollViewProps={{ contentContainerStyle: styles.scrollContent }}>
        <ActionHeader
          iconName="check-circle-outline"
          title="Senha Alterada!"
          subtitle="Sua senha foi alterada com sucesso. Você já está logado."
        />
        <View style={[styles.successContainer, { backgroundColor: colors.cardBackground }]}>
          <View
            style={[
              styles.successIconContainer,
              { backgroundColor: colors.success || colors.honey },
            ]}
          >
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={[styles.successText, { color: colors.success || colors.honey }]}>
            Senha alterada com sucesso!
          </Text>
          <Text style={[styles.successSubtext, { color: colors.text }]}>
            Redirecionando para o aplicativo...
          </Text>
          <ActivityIndicator size="small" color={colors.honey} style={styles.successLoader} />
          <MainButton
            title="Ir para o Aplicativo"
            onPress={() => router.replace('/(app)/(tabs)')}
            style={styles.successButton}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable scrollViewProps={{ contentContainerStyle: styles.scrollContent }}>
      <ActionHeader
        iconName="lock-reset"
        title="Nova Senha"
        subtitle="Digite sua nova senha abaixo."
      />

      <Formik<ResetFormValues>
        initialValues={{ password: '', confirmPassword: '' }}
        validationSchema={ResetPasswordSchema}
        onSubmit={handleResetPassword}
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
          <View style={[styles.formContainer, { backgroundColor: colors.cardBackground }]}>
            <InputField
              iconName="lock-outline"
              placeholder="Digite sua nova senha"
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
              placeholder="Confirme sua nova senha"
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
              title="Alterar Senha"
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: metrics.lg,
    paddingVertical: metrics.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.lg,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    borderRadius: metrics.borderRadiusMedium,
    padding: metrics.lg,
    marginBottom: metrics.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButton: {
    marginTop: metrics.lg,
  },
  button: {
    marginBottom: metrics.md,
    width: '100%',
  },
  successContainer: {
    width: '100%',
    borderRadius: metrics.borderRadiusMedium,
    padding: metrics.xl,
    marginTop: metrics.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.lg,
    opacity: 0.9,
  },
  successIcon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: metrics.md,
  },
  successSubtext: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: metrics.lg,
  },
  successLoader: {
    marginTop: metrics.sm,
  },
  successButton: {
    marginTop: metrics.lg,
    width: '100%',
  },
});
