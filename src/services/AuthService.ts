import { supabase } from './supabase';
import { AuthError, Session, User } from '@/types/supabase';
import { AlertService } from './AlertService';
import { logger } from '@/utils/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

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

  logger.error(`AuthService.${context}: Authentication error:`, authError);
  AlertService.showError(authError.message);

  return { data: null, error: authError };
};
export const authService = {
  signIn: async ({ email, password }: SignInCredentials): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        logger.error('AuthService.signIn: Supabase authentication failed:', error.message);
        return { data: null, error };
      }

      logger.info('AuthService.signIn: Login successful, session established');
      return { data, error: null };
    } catch (e) {
      logger.error('AuthService.signIn: Unexpected error occurred:', e);
      const error = new AuthError('AuthService.signIn: An unexpected error occurred during login');
      AlertService.showError('Unexpected Error: ' + error.message);
      return { data: null, error };
    }
  },
  signUp: async ({ email, password }: SignInCredentials): Promise<AuthResponse> => {
    try {
      logger.info('AuthService.signUp: Starting signup process for:', email);

      if (password.length < 8) {
        throw new Error('AuthService.signUp: Password must be at least 8 characters');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'meliponia://auth/confirm',
        },
      });

      logger.debug('AuthService.signUp: Signup result:', {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        hasError: !!error,
        errorMessage: error?.message,
        userData: data?.user ? { id: data.user.id } : null,
      });

      if (error) {
        logger.debug('AuthService.signUp: Error detected:', error.message);
        
        throw new Error('AuthService.signUp: Could not complete registration - please try again or login if you already have an account');
      }

      if (!data?.user) {
        throw new Error('AuthService.signUp: Could not complete registration - please try again');
      }

      logger.info('AuthService.signUp: Registration successful - new user created');
      return { data: { session: data.session, user: data.user }, error: null };
    } catch (error) {
      logger.error('AuthService.signUp: Error caught during signup:', error);
      return handleAuthError(error, 'signUp');
    }
  },
  requestPasswordRecovery: async (
    email: string,
  ): Promise<{ data: object; error: AuthError | null }> => {
    try {
      logger.info('AuthService.requestPasswordRecovery: Starting password recovery for:', email);

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'meliponia://reset-password',
      });

      if (error) {
        logger.error('AuthService.requestPasswordRecovery: Password recovery failed:', error.message);
        throw error;
      }

      logger.info('AuthService.requestPasswordRecovery: Recovery email sent successfully');
      return { data: data || {}, error: null };
    } catch (error) {
      logger.error('AuthService.requestPasswordRecovery: Error caught during password recovery:', error);
      const { error: authError } = handleAuthError(error, 'requestPasswordRecovery');
      return { data: {}, error: authError };
    }
  },
  signOut: async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      await AsyncStorage.removeItem('cached_session');
      if (error) throw error;
      return { error: null };
    } catch (error) {
      await AsyncStorage.removeItem('cached_session');
      return { error: handleAuthError(error, 'signOut').error };
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
    try {
      const netState = await NetInfo.fetch().catch(() => ({ isConnected: false, isInternetReachable: false }));
      
      if (!netState.isConnected || !netState.isInternetReachable) {
        const cached = await AsyncStorage.getItem('cached_session');
        if (cached) {
          const session = JSON.parse(cached);
          return { data: { session, user: session.user }, error: null };
        }
        return { data: { session: null, user: null }, error: null };
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (session) {
        await AsyncStorage.setItem('cached_session', JSON.stringify(session));
      }
      
      return { data: { session, user }, error };
    } catch (error) {
      const cached = await AsyncStorage.getItem('cached_session');
      if (cached) {
        const session = JSON.parse(cached);
        return { data: { session, user: session.user }, error: null };
      }
      return { data: { session: null, user: null }, error: error as AuthError };
    }
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
      return handleAuthError(error, 'updateUserPassword');
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
      return { error: handleAuthError(error, 'resendConfirmation').error };
    }
  },
};
