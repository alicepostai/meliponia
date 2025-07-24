import { useState, useCallback, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { onboardingService } from '@/services/OnboardingService';
import { logger } from '@/utils/logger';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  position: 'top' | 'bottom' | 'center';
}

interface UseTutorialOptions {
  tutorialKey: string;
  steps: TutorialStep[];
  autoStart?: boolean;
  delay?: number;
}

export const useTutorial = (options: UseTutorialOptions) => {
  const { tutorialKey, steps, autoStart = true, delay = 1000 } = options;
  const { onboardingStatus } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldStart, setShouldStart] = useState(false);
  const [hasSeenThisTutorial, setHasSeenThisTutorial] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadTutorialStatus = async () => {
      const hasSeen = await onboardingService.hasSeenSpecificTutorial(tutorialKey);
      setHasSeenThisTutorial(hasSeen);
    };

    loadTutorialStatus();
  }, [tutorialKey]);

  useEffect(() => {
    logger.debug(`UseTutorial [${tutorialKey}] - Status:`, {
      autoStart,
      isFocused,
      hasSeenOnboarding: onboardingStatus.hasSeenOnboarding,
      hasSeenTutorial: onboardingStatus.hasSeenTutorial,
      hasSeenThisTutorial,
      shouldShowTutorial: onboardingStatus.hasSeenOnboarding && !hasSeenThisTutorial,
    });

    const shouldShow =
      autoStart && isFocused && onboardingStatus.hasSeenOnboarding && !hasSeenThisTutorial;

    if (shouldShow) {
      logger.debug(`UseTutorial [${tutorialKey}] - Iniciando timer para tutorial`);
      const timer = setTimeout(() => {
        logger.debug(`UseTutorial [${tutorialKey}] - Timer ativado, iniciando tutorial`);
        setShouldStart(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [autoStart, isFocused, tutorialKey, onboardingStatus, hasSeenThisTutorial, delay]);

  useEffect(() => {
    if (shouldStart && isFocused) {
      logger.debug(`UseTutorial [${tutorialKey}] - shouldStart true, exibindo tutorial`);
      setIsVisible(true);
      setShouldStart(false);
    }
  }, [shouldStart, isFocused, tutorialKey]);

  useEffect(() => {
    if (!isFocused && isVisible) {
      logger.debug(`UseTutorial [${tutorialKey}] - Tela perdeu foco, escondendo tutorial`);
      setIsVisible(false);
    }
  }, [isFocused, isVisible, tutorialKey]);

  const startTutorial = useCallback(() => {
    setIsVisible(true);
  }, []);

  const completeTutorial = useCallback(async () => {
    logger.info(`UseTutorial [${tutorialKey}] - Completando tutorial`);
    setIsVisible(false);
    await onboardingService.markSpecificTutorialSeen(tutorialKey);
    setHasSeenThisTutorial(true);
  }, [tutorialKey]);

  const skipTutorial = useCallback(async () => {
    logger.info(`UseTutorial [${tutorialKey}] - Pulando tutorial`);
    setIsVisible(false);
    await onboardingService.markSpecificTutorialSeen(tutorialKey);
    setHasSeenThisTutorial(true);
  }, [tutorialKey]);

  return {
    isVisible,
    steps,
    startTutorial,
    completeTutorial,
    skipTutorial,
    shouldShowTutorial: !onboardingStatus.hasSeenTutorial,
  };
};
