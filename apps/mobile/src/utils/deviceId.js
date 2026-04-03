import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const DEVICE_ID_KEY = 'simplyfoodfacts_device_id';

let cachedDeviceId = null;

export async function getDeviceId() {
  if (cachedDeviceId) return cachedDeviceId;

  try {
    const stored = await SecureStore.getItemAsync(DEVICE_ID_KEY, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    if (stored) {
      cachedDeviceId = stored;
      return stored;
    }

    const newId = Crypto.randomUUID();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, newId, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    });
    cachedDeviceId = newId;
    return newId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    if (!cachedDeviceId) {
      cachedDeviceId = Crypto.randomUUID();
    }
    return cachedDeviceId;
  }
}

export async function getDeviceHeaders() {
  const deviceId = await getDeviceId();
  return { 'x-device-id': deviceId };
}

export async function appendDeviceId(url) {
  const deviceId = await getDeviceId();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}deviceId=${deviceId}`;
}
