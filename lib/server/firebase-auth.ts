import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "pulsefit_session";

interface FirebaseLookupResponse {
  users?: Array<{
    localId: string;
    email?: string;
    displayName?: string;
  }>;
}

export interface SessionUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

function getFirebaseApiKey() {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
}

export async function verifySessionToken(
  idToken: string
): Promise<SessionUser | null> {
  const apiKey = getFirebaseApiKey();

  if (!apiKey || !idToken) {
    return null;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ idToken }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as FirebaseLookupResponse;
    const currentUser = data.users?.[0];

    if (!currentUser?.localId) {
      return null;
    }

    return {
      uid: currentUser.localId,
      email: currentUser.email ?? null,
      displayName: currentUser.displayName ?? null,
    };
  } catch (error) {
    console.error("Failed to verify Firebase session token:", error);
    return null;
  }
}

export async function getServerSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}
