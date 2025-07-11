import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { ErrorModal } from '../error-modal';
import { SuccessModal } from '../success-modal';

interface ModalData {
  title: string;
  message: string;
  actionText: string;
  onAction?: () => void;
}

export interface AlertProviderRef {
  showError: (data: ModalData) => void;
  showSuccess: (data: ModalData) => void;
}

export const AlertProvider = forwardRef<AlertProviderRef>((_, ref) => {
  const [errorData, setErrorData] = useState<ModalData | null>(null);
  const [successData, setSuccessData] = useState<ModalData | null>(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useImperativeHandle(ref, () => ({
    showError: (data: ModalData) => {
      setErrorData(data);
      setShowError(true);
    },
    showSuccess: (data: ModalData) => {
      setSuccessData(data);
      setShowSuccess(true);
    },
  }));

  const hideError = () => {
    setShowError(false);
    setErrorData(null);
  };

  const hideSuccess = () => {
    setShowSuccess(false);
    setSuccessData(null);
  };

  const handleErrorAction = () => {
    if (errorData?.onAction) {
      errorData.onAction();
    }
    hideError();
  };

  const handleSuccessAction = () => {
    if (successData?.onAction) {
      successData.onAction();
    }
    hideSuccess();
  };

  return (
    <>
      <ErrorModal
        visible={showError}
        title={errorData?.title}
        message={errorData?.message || ''}
        actionText={errorData?.actionText}
        onDismiss={hideError}
        onAction={handleErrorAction}
      />
      <SuccessModal
        visible={showSuccess}
        title={successData?.title}
        message={successData?.message || ''}
        actionText={successData?.actionText}
        onDismiss={hideSuccess}
        onAction={handleSuccessAction}
      />
    </>
  );
});

AlertProvider.displayName = 'AlertProvider';
