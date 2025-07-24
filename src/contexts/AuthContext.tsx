import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { authService } from '@/services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { User, Session } from '@/types/supabase';
import { logger } from '@/utils/logger';
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchInitialSession = async () => {
      try {
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        const netState = await NetInfo.fetch().catch(() => ({ isConnected: false, isInternetReachable: false }));
        
        if (!netState.isConnected || !netState.isInternetReachable) {
          const cachedSession = await AsyncStorage.getItem('cached_session');
          if (cachedSession) {
            const session = JSON.parse(cachedSession);
            setSession(session);
            setUser(session.user);
            logger.debug('AuthContext - Sessão offline carregada do cache');
          }
          setLoading(false);
          return;
        }

        const { data, error } = await authService.getCurrentSession();
        if (error) throw error;

        logger.debug('AuthContext - Sessão online carregada:', {
          hasSession: !!data?.session,
          hasUser: !!data?.session?.user,
        });

        setSession(data?.session ?? null);
        setUser(data?.session?.user ?? null);
        
        if (data?.session) {
          await AsyncStorage.setItem('cached_session', JSON.stringify(data.session));
        }
      } catch (err) {
        logger.error('Auth Context: Erro ao buscar sessão inicial:', err);
        const cachedSession = await AsyncStorage.getItem('cached_session');
        if (cachedSession) {
          const session = JSON.parse(cachedSession);
          setSession(session);
          setUser(session.user);
          logger.debug('AuthContext - Fallback para sessão cached após erro');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSession();

    const timeoutId = setTimeout(() => {
      if (loading) {
        logger.warn('AuthContext - Timeout na inicialização, forçando saída do loading');
        setLoading(false);
      }
    }, 10000);

    if (typeof window !== 'undefined') {
      const authListener = authService.onAuthStateChange((event, currentSession) => {
        logger.debug('AuthContext - Mudança de estado de auth:', {
          event,
          hasSession: !!currentSession,
          hasUser: !!currentSession?.user,
        });

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      });

      return () => {
        clearTimeout(timeoutId);
        authListener?.unsubscribe();
      };
    }
  }, []);
  const logout = useCallback(async () => {
    await authService.signOut();
  }, []);
  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      logout,
    }),
    [user, session, loading, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
