import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onboardingService, OnboardingStatus } from '@/services/OnboardingService';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

interface OnboardingContextType {
  onboardingStatus: OnboardingStatus;
  isLoading: boolean;
  markOnboardingComplete: () => Promise<void>;
  markTutorialSeen: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>({
    hasSeenOnboarding: false,
    hasSeenTutorial: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshStatus = async () => {
    try {
      setIsLoading(true);
      if (typeof window === 'undefined') {
        setOnboardingStatus({
          hasSeenOnboarding: false,
          hasSeenTutorial: false,
        });
        setIsLoading(false);
        return;
      }

      const status = await onboardingService.getStatus();
      logger.debug('OnboardingContext - Status carregado:', status);
      setOnboardingStatus(status);
    } catch (error) {
      logger.error('Erro ao carregar status do onboarding:', error);
      setOnboardingStatus({
        hasSeenOnboarding: false,
        hasSeenTutorial: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markOnboardingComplete = async () => {
    await onboardingService.markOnboardingComplete();
    setOnboardingStatus(prev => ({ ...prev, hasSeenOnboarding: true }));
  };

  const markTutorialSeen = async () => {
    await onboardingService.markTutorialSeen();
    setOnboardingStatus(prev => ({ ...prev, hasSeenTutorial: true }));
  };

  const resetOnboarding = async () => {
    await onboardingService.resetOnboarding();
    setOnboardingStatus({
      hasSeenOnboarding: false,
      hasSeenTutorial: false,
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      refreshStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const value: OnboardingContextType = {
    onboardingStatus,
    isLoading,
    markOnboardingComplete,
    markTutorialSeen,
    resetOnboarding,
    refreshStatus,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
