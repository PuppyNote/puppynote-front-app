import * as Location from 'expo-location';
import { bridgeError } from '../BridgeException';
import { GetLocationPayload, LocationData } from '../BridgeProtocol';
import { BridgeHandler } from './types';

const ACCURACY_MAP: Record<NonNullable<GetLocationPayload['accuracy']>, Location.Accuracy> = {
  low: Location.Accuracy.Low,
  balanced: Location.Accuracy.Balanced,
  high: Location.Accuracy.High,
};

export const getLocation: BridgeHandler<GetLocationPayload | null, LocationData> = async (
  payload,
) => {
  const accuracyKey = payload?.accuracy ?? 'balanced';
  const accuracy = ACCURACY_MAP[accuracyKey];
  if (!accuracy) {
    throw bridgeError.invalidPayload(
      `accuracy는 low/balanced/high 중 하나여야 합니다. (받은 값: ${accuracyKey})`,
    );
  }

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw bridgeError.permissionDenied('위치 권한이 거부되었습니다.');
  }

  const position = await Location.getCurrentPositionAsync({ accuracy });

  const result: LocationData = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy ?? null,
    timestamp: position.timestamp,
  };

  if (payload?.reverseGeocode) {
    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude: result.latitude,
        longitude: result.longitude,
      });
      result.address = place
        ? [place.region, place.city, place.district, place.street, place.name]
            .filter(Boolean)
            .join(' ')
        : null;
    } catch {
      // 좌표는 확보했으므로 주소 변환 실패는 전체 실패로 만들지 않습니다.
      result.address = null;
    }
  }

  return result;
};
