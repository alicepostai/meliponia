import { supabase } from './supabase';
import { AuthError, Session, User } from '@/types/supabase';
import { AlertService } from './AlertService';

interface AuthResponse {
  data: { session: Session | null; user: User | null } | null;
  error: AuthError | null;
}

interface UserResponse {
  data: { user: User | null } | null;
  error: AuthError | null;
}

interface SignInCredentials {
  email: string;
  password: string;
}

const handleAuthError = (error: unknown, context: string): { data: null; error: AuthError } => {
  const authError =
    error instanceof AuthError
      ? error
      : new AuthError(error instanceof Error ? error.message : 'Unknown authentication error');

  console.error(`Error during ${context}:`, authError);
  AlertService.showError(authError.message);

  return { data: null, error: authError };
};
export const authService = {
  signIn: async ({ email, password }: SignInCredentials): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Erro no signIn do Supabase:', error.message);
        return { data: null, error };
      }

      console.log('Login bem-sucedido, sessão estabelecida.');
      return { data, error: null };
    } catch (e) {
      console.error('Erro inesperado no signIn:', e);
      const error = new AuthError('Um erro inesperado ocorreu durante o login.');
      AlertService.showError('Erro Inesperado' + error.message);
      return { data: null, error };
    }
  },
  signUp: async ({ email, password }: SignInCredentials): Promise<AuthResponse> => {
    try {
      console.log('AuthService: Iniciando processo de cadastro para:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'meliponia://auth/confirm',
        },
      });

      console.log('AuthService: Resultado do signUp:', {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        hasError: !!error,
        errorMessage: error?.message,
        userData: data?.user ? { id: data.user.id, email: data.user.email } : null,
      });

      if (error) {
        console.log('AuthService: Erro detectado:', error.message);

        const existingUserErrors = [
          'user already registered',
          'email already exists',
          'email already taken',
          'duplicate',
          'already been registered',
          'email rate limit exceeded',
          'rate limit exceeded',
          'too many requests',
          'signup disabled',
        ];

        const errorMessage = error.message.toLowerCase();
        const isExistingUser = existingUserErrors.some(errorText =>
          errorMessage.includes(errorText),
        );

        if (isExistingUser) {
          console.log('AuthService: Detectado que usuário já existe via erro');
          throw new Error('User already registered');
        }

        throw error;
      }

      if (data?.user) {
        const userCreatedAt = new Date(data.user.created_at);
        const now = new Date();
        const timeDiffSeconds = (now.getTime() - userCreatedAt.getTime()) / 1000;

        console.log('AuthService: Análise do usuário:', {
          userCreatedAt: userCreatedAt.toISOString(),
          currentTime: now.toISOString(),
          timeDiffSeconds,
          isNewUser: timeDiffSeconds < 10,
        });

        if (timeDiffSeconds > 10) {
          console.log('AuthService: Usuário já existia - detectado via timestamp');
          throw new Error('User already registered');
        }
      }

      if (data && !data.user) {
        console.log('AuthService: SignUp retornou dados mas sem usuário - email já existente');
        throw new Error('User already registered');
      }

      console.log('AuthService: Cadastro bem-sucedido - usuário novo criado');
      return { data: { session: data.session, user: data.user }, error: null };
    } catch (error) {
      console.log('AuthService: Erro capturado no signUp:', error);
      return handleAuthError(error, 'Cadastro');
    }
  },
  requestPasswordRecovery: async (
    email: string,
  ): Promise<{ data: object; error: AuthError | null }> => {
    try {
      console.log('AuthService: Iniciando recuperação de senha para:', email);

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'meliponia://reset-password',
      });

      if (error) {
        console.error('AuthService: Erro na recuperação de senha:', error.message);
        throw error;
      }

      console.log('AuthService: Email de recuperação enviado com sucesso');
      return { data: data || {}, error: null };
    } catch (error) {
      console.error('AuthService: Erro capturado na recuperação de senha:', error);
      const { error: authError } = handleAuthError(error, 'Recuperação de Senha');
      return { data: {}, error: authError };
    }
  },
  signOut: async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: handleAuthError(error, 'Logout').error };
    }
  },
  getCurrentUser: async (): Promise<UserResponse> => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { data: { user }, error };
  },
  getCurrentSession: async (): Promise<AuthResponse> => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { data: { session, user }, error };
  },
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    const { data: listener } = supabase.auth.onAuthStateChange(callback);
    return listener?.subscription;
  },
  updateUserPassword: async (newPassword: string): Promise<UserResponse> => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleAuthError(error, 'Alteração de Senha');
    }
  },
  resendConfirmation: async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: 'meliponia://auth/confirm',
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: handleAuthError(error, 'Reenvio de Confirmação').error };
    }
  },
};
