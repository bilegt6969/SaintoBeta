import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const isProduction = process.env.NODE_ENV === "production";

export const AUTH_SESSION_COOKIE = "__session";
export const GUEST_ID_COOKIE = "guestId";
export const PENDING_TX_CODE_COOKIE = "pendingTxCode";
export const STUDIO_ACCESS_COOKIE = "studio-access";

export function secureCookieOptions(
  overrides: Partial<ResponseCookie> = {},
): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    ...overrides,
  };
}
