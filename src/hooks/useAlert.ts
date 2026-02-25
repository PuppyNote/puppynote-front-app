import { useState } from 'react';

export interface AlertConfig {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export const useAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showAlert = (
    title: string, 
    message: string, 
    onConfirm = () => setAlertConfig(prev => ({ ...prev, visible: false }))
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      onConfirm,
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  return {
    alertConfig,
    showAlert,
    hideAlert,
  };
};
