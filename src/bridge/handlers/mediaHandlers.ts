import * as ImagePicker from 'expo-image-picker';
import { bridgeError } from '../BridgeException';
import { PickImageData, PickImagePayload, PickedImage } from '../BridgeProtocol';
import { BridgeHandler } from './types';

const DEFAULT_MAX = 10;
const DEFAULT_QUALITY = 0.8;

/**
 * base64 문자열은 postMessage로 통째로 넘어가므로 장당 상한을 둡니다.
 * (약 6MB의 base64 -> 원본 약 4.5MB. 이보다 크면 WebView 메시지가 끊길 수 있습니다.)
 */
const MAX_BASE64_LENGTH = 6 * 1024 * 1024;

function toPickedImage(
  asset: ImagePicker.ImagePickerAsset,
  returnAs: 'base64' | 'uri',
): PickedImage {
  const mimeType = asset.mimeType ?? 'image/jpeg';
  const image: PickedImage = {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    fileName: asset.fileName ?? asset.uri.split('/').pop() ?? 'image.jpg',
    mimeType,
    fileSize: asset.fileSize ?? null,
  };

  if (returnAs === 'base64') {
    if (!asset.base64) {
      throw bridgeError.internal('이미지를 base64로 변환하지 못했습니다.');
    }
    if (asset.base64.length > MAX_BASE64_LENGTH) {
      throw bridgeError.invalidPayload(
        '이미지 용량이 너무 큽니다. quality를 낮추거나 returnAs를 uri로 요청하세요.',
      );
    }
    image.dataUrl = `data:${mimeType};base64,${asset.base64}`;
  }

  return image;
}

export const pickImage: BridgeHandler<PickImagePayload | null, PickImageData> = async (
  payload,
) => {
  const returnAs = payload?.returnAs ?? 'base64';
  if (returnAs !== 'base64' && returnAs !== 'uri') {
    throw bridgeError.invalidPayload('returnAs는 base64 또는 uri여야 합니다.');
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw bridgeError.permissionDenied('사진 접근 권한이 거부되었습니다.');
  }

  const multiple = payload?.multiple === true;
  const max = Math.max(1, Math.min(payload?.max ?? DEFAULT_MAX, 20));
  const quality = payload?.quality ?? DEFAULT_QUALITY;

  const options: ImagePicker.ImagePickerOptions = multiple
    ? {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: max,
        orderedSelection: true,
        quality,
        base64: returnAs === 'base64',
      }
    : {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: payload?.allowsEditing ?? true,
        aspect: payload?.aspect ?? [1, 1],
        quality,
        base64: returnAs === 'base64',
      };

  const result = await ImagePicker.launchImageLibraryAsync(options);

  if (result.canceled) {
    throw bridgeError.userCancelled('이미지 선택을 취소했습니다.');
  }

  return {
    images: result.assets.slice(0, multiple ? max : 1).map((a) => toPickedImage(a, returnAs)),
  };
};
