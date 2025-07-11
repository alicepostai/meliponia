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
import { User, Session } from '@/types/supabase';
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

        const { data, error } = await authService.getCurrentSession();
        if (error) throw error;

        console.log('AuthContext - Sessão inicial carregada:', {
          hasSession: !!data?.session,
          hasUser: !!data?.session?.user,
        });

        setSession(data?.session ?? null);
        setUser(data?.session?.user ?? null);
      } catch (err) {
        console.error('Auth Context: Erro ao buscar sessão inicial:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSession();

    if (typeof window !== 'undefined') {
      const authListener = authService.onAuthStateChange((event, currentSession) => {
        console.log('AuthContext - Mudança de estado de auth:', {
          event,
          hasSession: !!currentSession,
          hasUser: !!currentSession?.user,
        });

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      });

      return () => {
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
