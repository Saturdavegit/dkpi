import { Inter } from "next/font/google";
import "./globals.css";
import CookieConsentBanner from "@/components/CookieConsent";
import { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import Providers from "@/components/Providers";
import { HeaderProvider } from '@/context/HeaderContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DKPI Lite",
  description: "DKPI Lite - Votre plateforme de gestion de commandes",
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
          <HeaderProvider>
            <div className="relative min-h-screen">
              {children}
            </div>
            <CookieConsentBanner />
          </HeaderProvider>
        </Providers>
      </body>
    </html>
  );
}
