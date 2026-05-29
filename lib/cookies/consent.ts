export const CONSENT_COOKIE = "sainto-cookie-consent";

export type CookieConsentValue = "accepted" | "rejected";

export function parseConsentCookie(
  cookieHeader: string | undefined,
): CookieConsentValue | null {
  if (!cookieHeader) return null;

  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]+)`),
  );
  const value = match?.[1];

  if (value === "accepted" || value === "rejected") {
    return value;
  }

  return null;
}

export function getClientConsent(): CookieConsentValue | null {
  if (typeof document === "undefined") return null;
  return parseConsentCookie(document.cookie);
}

export function setClientConsent(value: CookieConsentValue): void {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";

  document.cookie = [
    `${CONSENT_COOKIE}=${value}`,
    "max-age=31536000",
    "path=/",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function hasAnalyticsConsent(
  consent: CookieConsentValue | null,
): boolean {
  return consent === "accepted";
}
