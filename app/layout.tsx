import { AuthSessionSync } from "components/auth/auth-session-sync";
import { CartProvider } from "components/cart/cart-context";
import { CookieConsentProvider } from "components/cookie-consent";
import InvestButton from "components/InvestButton";
import { WelcomeCommerce } from "components/welcome-commerce";
import { getCart } from "lib/commerce";
import { baseUrl } from "lib/utils";
import { Geist } from "next/font/google";
// @ts-ignore - nextjs-toploader types may not resolve correctly
import { Analytics } from "@vercel/analytics/next";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import "./globals.css";

const { SITE_NAME } = process.env;

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

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
    <html lang="en" className={geist.variable}>
      <body className="bg-[#f5f5f5] text-neutral-900 antialiased selection:bg-neutral-200">
        <NextTopLoader
          color="#111"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="cubic-bezier(0.16, 1, 0.3, 1)"
          speed={200}
          shadow="0 0 15px rgba(17, 17, 17, 0.5), 0 0 8px rgba(17, 17, 17, 0.3)"
          zIndex={1600}
          showAtBottom={false}
        />
        <CookieConsentProvider>
          <AuthSessionSync />
          <CartProvider cartPromise={cart}>
            <main>
              {children}
              <WelcomeCommerce />
            </main>
          </CartProvider>
        </CookieConsentProvider>
        <InvestButton />
      </body>
      <Analytics />
    </html>
  );
}
