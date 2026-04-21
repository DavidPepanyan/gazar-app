export const API_BASE_URL = "https://gazar.am/api";

export const API_ENDPOINTS = {
  USER_ME: `${API_BASE_URL}/user/me`,
  HOME_MAIN_SLIDER: (lan: string) =>
    `${API_BASE_URL}/home/main-slider?lan=${encodeURIComponent(lan)}`,
} as const;
