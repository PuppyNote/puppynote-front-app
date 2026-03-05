import { useState } from 'react';

export interface AlertConfig {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: 'success' | 'error' | 'info';
}

export const useAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showAlert = (config: Omit<AlertConfig, 'visible'>) => {
    setAlertConfig({
      ...config,
      visible: true,
    });
  };

  const showSimpleAlert = (title: string, message: string, onConfirm?: () => void) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        hideAlert();
      },
    });
  };

  const showConfirmAlert = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void,
    confirmText: string = '확인',
    cancelText: string = '취소'
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        onConfirm();
        hideAlert();
      },
      onCancel: () => {
        if (onCancel) onCancel();
        hideAlert();
      },
      type: 'info'
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  return {
    alertConfig,
    showAlert,
    showSimpleAlert,
    showConfirmAlert,
    hideAlert,
  };
};
