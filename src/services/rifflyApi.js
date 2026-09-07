const API_URL =
  "https://script.google.com/macros/s/AKfycbwgCJmnv9tgiYpxqtTC2cVY-K7TiS4_MtChv6ohP2hO2xDeRzpSezkcbeP0202ZLaKZ6Q/exec";

const SESSION_KEY = "riffly_user";

const SESSION_EVENT = "riffly:session-expired";

const AUTH_INVALID_CODES = [
  "AUTH_SESSION_EXPIRED",
  "AUTH_UNAUTHORIZED",
  "AUTH_DISABLED",
];

function getStoredUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return getStoredUser()?.token || "";
}

function createApiError(result) {
  const error = new Error(result.error || "Erro na operação.");

  error.code = result.code || "UNKNOWN_ERROR";

  return error;
}

function handleApiError(result, invalidateSession) {
  const error = createApiError(result);

  if (invalidateSession && AUTH_INVALID_CODES.includes(error.code)) {
    window.dispatchEvent(
      new CustomEvent(SESSION_EVENT, {
        detail: {
          code: error.code,
        },
      }),
    );
  }

  throw error;
}

async function postRequest(payload, includeToken = true) {
  const finalPayload = {
    ...payload,
  };

  if (includeToken) {
    finalPayload.token = getAuthToken();
  }

  const response = await fetch(API_URL, {
    method: "POST",

    body: JSON.stringify(finalPayload),
  });

  const result = await response.json();

  if (!result.success) {
    handleApiError(result, includeToken);
  }

  return result.data;
}

export async function loginUser(email) {
  return postRequest(
    {
      action: "login",

      data: {
        email,
      },
    },
    false,
  );
}

export async function logoutUser() {
  return postRequest({
    action: "logout",
  });
}

export async function getSongs() {
  const token = getAuthToken();

  const response = await fetch(
    `${API_URL}?action=listSongs&token=${encodeURIComponent(token)}`,
  );

  const result = await response.json();

  if (!result.success) {
    handleApiError(result, true);
  }

  return result.data;
}

export async function createSong(data) {
  return postRequest({
    action: "createSong",
    data,
  });
}

export async function updateSong(id, data) {
  return postRequest({
    action: "updateSong",
    id,
    data,
  });
}

export async function deleteSong(id) {
  return postRequest({
    action: "deleteSong",
    id,
  });
}
