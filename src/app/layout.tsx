import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import localFont from "next/font/local";

import "./globals.css";

const myFont = localFont({
  src: [
    {
      path: "../assets/fonts/CerebriSansPro-Regular.ttf",
      weight: "400",
    },
    {
      path: "../assets/fonts/CerebriSansPro-Medium.ttf",
      weight: "500",
    },
    {
      path: "../assets/fonts/CerebriSansPro-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../assets/fonts/CerebriSansPro-Bold.ttf",
      weight: "700",
    },
    {
      path: "../assets/fonts/CerebriSansPro-ExtraBold.ttf",
      weight: "900",
    },
  ],
  display: "swap",
  variable: "--font-CerebriSans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Smart Locking Group",
    default: "Smart Locking Group",
  },
  description: "Smart Locking Group",
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale ?? "en"} className={myFont.className}>
      <body>
        <NextTopLoader color="#54CA70" crawl={true} showSpinner={false} height={6} />
        {children}
      </body>
    </html>
  );
}
