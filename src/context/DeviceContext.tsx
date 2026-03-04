import React, { createContext, useContext, useState, useEffect } from 'react';
import { deviceService } from '../services/auth/DeviceService';

interface DeviceState {
  deviceId: string;
  fcmToken: string | null;
  isInitialized: boolean;
}

const DeviceContext = createContext<DeviceState | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [device, setDevice] = useState<DeviceState>({
    deviceId: '',
    fcmToken: null,
    isInitialized: false,
  });

  useEffect(() => {
    const initDevice = async () => {
      try {
        const [deviceId, fcmToken] = await Promise.all([
          deviceService.getDeviceId(),
          deviceService.getFcmToken()
        ]);
        
        setDevice({
          deviceId,
          fcmToken,
          isInitialized: true,
        });
        
        console.log('Device Context Initialized:', { deviceId, fcmToken });
      } catch (error) {
        console.error('Failed to initialize device context:', error);
      }
    };

    initDevice();
  }, []);

  return (
    <DeviceContext.Provider value={device}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
}
