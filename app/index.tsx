import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { onboardingStatus, isLoading: onboardingLoading } = useOnboarding();
  const { colors } = useTheme();

  console.log('Index - Estado atual:', {
    user: !!user,
    userEmail: user?.email,
    authLoading,
    onboardingLoading,
    hasSeenOnboarding: onboardingStatus.hasSeenOnboarding,
    hasSeenTutorial: onboardingStatus.hasSeenTutorial,
  });

  if (authLoading || onboardingLoading) {
    console.log('Index - Mostrando loading...');
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.honey} />
      </View>
    );
  }

  if (!user) {
    console.log('Index - Redirecionando para login (usuário não logado)');
    return <Redirect href="/(auth)/login" />;
  }

  if (!onboardingStatus.hasSeenOnboarding && !onboardingStatus.hasSeenTutorial) {
    console.log('Index - Redirecionando para onboarding (usuário novo)');
    return <Redirect href="/(onboarding)" />;
  }

  console.log('Index - Redirecionando para app principal (usuário logado e já viu onboarding)');
  return <Redirect href="/(app)/(tabs)" />;
}
