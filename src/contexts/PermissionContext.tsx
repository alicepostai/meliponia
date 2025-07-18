import React, { createContext, useContext, useState, useCallback } from 'react';
import { usePermissions, PermissionStatus } from '@/hooks/UsePermissions';
import PermissionRequestModal from '@/components/modals/permission-request-modal';

interface PermissionContextType {
  status: PermissionStatus;
  requestAllPermissions: () => Promise<void>;
  requestCameraPermission: () => Promise<any>;
  requestLocationPermission: () => Promise<any>;
  showPermissionModal: () => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissionContext = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }
  return context;
};

interface PermissionProviderProps {
  children: React.ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const permissions = usePermissions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasShownInitialModal, setHasShownInitialModal] = useState(false);

  const showPermissionModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleModalComplete = useCallback(() => {
    setIsModalVisible(false);
    setHasShownInitialModal(true);
  }, []);

  React.useEffect(() => {
    if (!hasShownInitialModal && !permissions.status.loading) {
      if (!permissions.status.allGranted) {
        setIsModalVisible(true);
      } else {
        setHasShownInitialModal(true);
      }
    }
  }, [hasShownInitialModal, permissions.status.loading, permissions.status.allGranted]);

  const value: PermissionContextType = {
    status: permissions.status,
    requestAllPermissions: permissions.requestAllPermissions,
    requestCameraPermission: permissions.requestCameraPermission,
    requestLocationPermission: permissions.requestLocationPermission,
    showPermissionModal,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
      <PermissionRequestModal isVisible={isModalVisible} onComplete={handleModalComplete} />
    </PermissionContext.Provider>
  );
};
