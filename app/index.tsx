import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { onboardingStatus, isLoading: onboardingLoading } = useOnboarding();
  const { colors } = useTheme();

  if (authLoading || onboardingLoading) {
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
    return <Redirect href="/(auth)/login" />;
  }

  if (!onboardingStatus.hasSeenOnboarding && !onboardingStatus.hasSeenTutorial) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(app)/(tabs)" />;
}
