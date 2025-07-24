import { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useHiveList } from '@/hooks/UseHiveList';

export const useHiveListScreen = () => {
  const router = useRouter();
  const hiveListLogic = useHiveList();
  const navigateToHiveDetails = useCallback(
    (hiveId: string) => {
      router.push(`/hive/${hiveId}`);
    },
    [router],
  );
  const navigateToHiveRegistration = useCallback(() => {
    router.push('/(app)/hive/hive-registration');
  }, [router]);
  const navigateToHiveDivision = useCallback(() => {
    router.push('/(app)/actions/division');
  }, [router]);
  const fabOptions = useMemo(
    () => [
      {
        label: 'Divisão de Colmeia',
        icon: 'call-split',
        onPress: navigateToHiveDivision,
      },
      {
        label: 'Criar Colmeia',
        icon: 'beehive-outline',
        onPress: navigateToHiveRegistration,
      },
    ],
    [navigateToHiveDivision, navigateToHiveRegistration],
  );
  return {
    ...hiveListLogic,
    navigateToHiveDetails,
    navigateToHiveRegistration,
    fabOptions,
  };
};
