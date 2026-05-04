export const getUniqueDeviceId = (): string => {
  if (typeof window === "undefined") return "";

  const navigatorInfo = window.navigator;
  const screenInfo = window.screen;

  // Combining browser and screen properties to create a unique string
  const rawId = `${navigatorInfo.userAgent}-${screenInfo.width}x${screenInfo.height}-${navigatorInfo.language}`;

  // Basic Base64 encoding to make it look like a hash
  return btoa(rawId).substring(0, 32);
};
