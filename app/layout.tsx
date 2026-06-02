import { AuthSessionSync } from "components/auth/auth-session-sync";
import { CartProvider } from "components/cart/cart-context";
import { CookieConsentProvider } from "components/cookie-consent";
import { WelcomeCommerce } from "components/welcome-commerce";
import { GeistSans } from "geist/font/sans";
import { getCart } from "lib/commerce";
import { baseUrl } from "lib/utils";
import { ReactNode } from "react";
import "./globals.css";

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cart = getCart();

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-white text-neutral-900 antialiased selection:bg-neutral-200">
        <CookieConsentProvider>
          <AuthSessionSync />
          <CartProvider cartPromise={cart}>
            <main>
              {children}
              <WelcomeCommerce />
            </main>
          </CartProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
