import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "pulsefit_session";

interface FirebaseTokenPayload {
  user_id?: string;
  sub?: string;
  email?: string;
  name?: string;
  exp?: number;
}

export interface SessionUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded =
    padding === 0 ? normalized : normalized + "=".repeat(4 - padding);

  return Buffer.from(padded, "base64").toString("utf8");
}

function decodeFirebaseToken(idToken: string): FirebaseTokenPayload | null {
  const parts = idToken.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as FirebaseTokenPayload;
  } catch (error) {
    console.error("Failed to decode Firebase session token:", error);
    return null;
  }
}

export async function verifySessionToken(
  idToken: string
): Promise<SessionUser | null> {
  if (!idToken) {
    return null;
  }

  const payload = decodeFirebaseToken(idToken);
  const expiresAt = payload?.exp ?? 0;
  const uid = payload?.user_id ?? payload?.sub ?? null;

  if (!payload || !uid || expiresAt * 1000 <= Date.now()) {
    return null;
  }

  return {
    uid,
    email: payload.email ?? null,
    displayName: payload.name ?? null,
  };
}

export async function getServerSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}
