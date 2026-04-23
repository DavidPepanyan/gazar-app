import { API_ENDPOINTS } from "../constants/api";

interface ApiMessageResponse {
  message?: string;
}

export interface UserProfile {
  name?: string;
  lastName?: string;
  phone?: string;
  companyName?: string | null;
  companyTin?: string | null;
  image?: string;
}

export interface UpdateUserDetailsPayload {
  name: string;
  lastName: string;
  phone: string;
  companyName?: string | null;
  companyTin?: string | null;
}

const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const extractApiMessage = async (
  response: Response,
  fallbackMessage: string,
): Promise<string> => {
  try {
    const data = (await response.json()) as ApiMessageResponse;
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {
    // Use fallback when response body is not JSON.
  }

  return fallbackMessage;
};

export const fetchCurrentUserProfile = async (
  token: string,
): Promise<UserProfile | null> => {
  const response = await fetch(API_ENDPOINTS.USER_ME, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as UserProfile;
};

export const updateCurrentUserProfile = async (
  token: string,
  payload: UpdateUserDetailsPayload,
): Promise<void> => {
  const response = await fetch(API_ENDPOINTS.USER_ME, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await extractApiMessage(
      response,
      "Could not save your details. Please try again.",
    );
    throw new Error(message);
  }
};
