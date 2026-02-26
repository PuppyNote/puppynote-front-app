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

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  return {
    alertConfig,
    showAlert,
    showSimpleAlert,
    hideAlert,
  };
};
