import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { logger } from '@/utils/logger';

const ONBOARDING_KEY = '@meliponia_onboarding_completed';
const TUTORIAL_SEEN_KEY = '@meliponia_tutorial_seen';

export interface OnboardingStatus {
  hasSeenOnboarding: boolean;
  hasSeenTutorial: boolean;
}

const isAsyncStorageAvailable = () => {
  try {
    return typeof AsyncStorage !== 'undefined' && Platform.OS !== 'web';
  } catch {
    return false;
  }
};

const getTutorialKey = (tutorialId: string) => `@meliponia_tutorial_${tutorialId}_seen`;

export const onboardingService = {
  async hasSeenOnboarding(): Promise<boolean> {
    try {
      if (!isAsyncStorageAvailable()) return false;
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (error) {
      logger.error('Erro ao verificar onboarding:', error);
      return false;
    }
  },

  async markOnboardingComplete(): Promise<void> {
    try {
      if (!isAsyncStorageAvailable()) return;
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      logger.error('Erro ao marcar onboarding como concluído:', error);
    }
  },

  async hasSeenTutorial(): Promise<boolean> {
    try {
      if (!isAsyncStorageAvailable()) return false;
      const value = await AsyncStorage.getItem(TUTORIAL_SEEN_KEY);
      return value === 'true';
    } catch (error) {
      logger.error('Erro ao verificar tutorial:', error);
      return false;
    }
  },

  async markTutorialSeen(): Promise<void> {
    try {
      if (!isAsyncStorageAvailable()) return;
      await AsyncStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
    } catch (error) {
      logger.error('Erro ao marcar tutorial como visto:', error);
    }
  },

  async hasSeenSpecificTutorial(tutorialId: string): Promise<boolean> {
    try {
      if (!isAsyncStorageAvailable()) return false;
      const value = await AsyncStorage.getItem(getTutorialKey(tutorialId));
      return value === 'true';
    } catch (error) {
      logger.error(`Erro ao verificar tutorial ${tutorialId}:`, error);
      return false;
    }
  },

  async markSpecificTutorialSeen(tutorialId: string): Promise<void> {
    try {
      if (!isAsyncStorageAvailable()) return;
      await AsyncStorage.setItem(getTutorialKey(tutorialId), 'true');
    } catch (error) {
      logger.error(`Erro ao marcar tutorial ${tutorialId} como visto:`, error);
    }
  },

  async resetSpecificTutorial(tutorialId: string): Promise<void> {
    try {
      if (!isAsyncStorageAvailable()) return;
      await AsyncStorage.removeItem(getTutorialKey(tutorialId));
    } catch (error) {
      logger.error(`Erro ao resetar tutorial ${tutorialId}:`, error);
    }
  },

  async resetTutorial(): Promise<void> {
    try {
      if (!isAsyncStorageAvailable()) return;
      await AsyncStorage.removeItem(TUTORIAL_SEEN_KEY);
    } catch (error) {
      logger.error('Erro ao resetar tutorial:', error);
    }
  },

  async resetOnboarding(): Promise<void> {
    try {
      if (!isAsyncStorageAvailable()) return;
      await AsyncStorage.multiRemove([ONBOARDING_KEY, TUTORIAL_SEEN_KEY]);
    } catch (error) {
      logger.error('Erro ao resetar onboarding:', error);
    }
  },

  async getStatus(): Promise<OnboardingStatus> {
    try {
      if (!isAsyncStorageAvailable()) {
        return {
          hasSeenOnboarding: false,
          hasSeenTutorial: false,
        };
      }

      const [hasSeenOnboarding, hasSeenTutorial] = await Promise.all([
        this.hasSeenOnboarding(),
        this.hasSeenTutorial(),
      ]);

      return {
        hasSeenOnboarding,
        hasSeenTutorial,
      };
    } catch (error) {
      logger.error('Erro ao obter status do onboarding:', error);
      return {
        hasSeenOnboarding: false,
        hasSeenTutorial: false,
      };
    }
  },
};
