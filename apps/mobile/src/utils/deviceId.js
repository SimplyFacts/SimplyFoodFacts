import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const DEVICE_ID_KEY = "simplyfoodfacts_device_id";

let cachedDeviceId = null;

export async function getDeviceId() {
  if (cachedDeviceId) return cachedDeviceId;

  try {
    const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (stored) {
      cachedDeviceId = stored;
      return stored;
    }

    const newId = Crypto.randomUUID();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    cachedDeviceId = newId;
    return newId;
  } catch (error) {
    console.error("Error getting device ID:", error);
    if (!cachedDeviceId) {
      cachedDeviceId = Crypto.randomUUID();
    }
    return cachedDeviceId;
  }
}

export async function getDeviceHeaders() {
  const deviceId = await getDeviceId();
  return { "x-device-id": deviceId };
}

export async function appendDeviceId(url) {
  const deviceId = await getDeviceId();
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}deviceId=${deviceId}`;
}
