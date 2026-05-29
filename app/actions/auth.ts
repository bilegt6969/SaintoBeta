"use server";

import {
  clearAuthSessionCookie,
  setAuthSessionCookie,
} from "lib/auth/server";

export async function establishAuthSession(
  idToken: string,
): Promise<{ success: boolean }> {
  const ok = await setAuthSessionCookie(idToken);
  return { success: ok };
}

export async function signOutSession(): Promise<void> {
  await clearAuthSessionCookie();
}
