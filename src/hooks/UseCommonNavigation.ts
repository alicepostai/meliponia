import { useCallback } from 'react';
import { useRouter } from 'expo-router';

export const useCommonNavigation = () => {
  const router = useRouter();
  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/(tabs)');
    }
  }, [router]);
  const navigateToTabs = useCallback(() => {
    router.replace('/(app)/(tabs)');
  }, [router]);
  const navigateToLogin = useCallback(() => {
    router.push('/(auth)/login');
  }, [router]);
  const navigateToHive = useCallback(
    (hiveId: string) => {
      router.push(`/hive/${hiveId}`);
    },
    [router],
  );
  const navigateToHiveEdit = useCallback(
    (hiveId: string) => {
      router.push(`/hive/edit/${hiveId}`);
    },
    [router],
  );
  const navigateToHiveRegistration = useCallback(() => {
    router.push('/(app)/hive/hive-registration');
  }, [router]);
  const navigateToChangePassword = useCallback(() => {
    router.push('/(app)/settings/change-password');
  }, [router]);
  const navigateToActionScreen = useCallback(
    (screenPath: string, hiveId?: string) => {
      if (hiveId) {
        router.push({ pathname: screenPath as any, params: { hiveId } });
      } else {
        router.push(screenPath as any);
      }
    },
    [router],
  );
  const navigateToTransferQR = useCallback(
    (hiveId: string) => {
      router.push(`/hive/transfer-qr/${hiveId}`);
    },
    [router],
  );
  return {
    handleGoBack,
    navigateToTabs,
    navigateToLogin,
    navigateToHive,
    navigateToHiveEdit,
    navigateToHiveRegistration,
    navigateToChangePassword,
    navigateToActionScreen,
    navigateToTransferQR,
  };
};
