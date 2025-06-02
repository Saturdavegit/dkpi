import { Inter } from "next/font/google";
import "./globals.css";
import CookieConsentBanner from "@/components/CookieConsent";
import CartButton from "@/components/CartButton";
import { Metadata } from 'next';
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DKPILite",
  description: "DKPILite - Votre solution de gestion de DKP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen">
            <CartButton />
            {children}
          </div>
        </Providers>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
