import "@/app/globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

import { Archivo } from "next/font/google";
import { Libre_Franklin } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});
const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});

export const metadata: Metadata = {
  title: "Portly Dev Portfolio Builder",
  icons: [
    { rel: "icon", type: "image/png", sizes: "48x48", url: "/favicon.ico" },
  ],
  keywords: "Portfolio",
  description:
    "Portly is Dev Portfolio Builder: A simple, customizable tool to create and showcase professional developer portfolios with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "relative min-h-screen bg-background antialiased",
          archivo.variable + " " + libre_franklin.variable,
        )}
      >
        <Providers>
          <NextTopLoader />
          <p className="absolute left-0 top-0 z-10 w-full bg-yellow-100 p-1.5 text-center text-xs font-semibold text-yellow-800">
            ⚠️ In development. Data may be deleted. Full access soon.
          </p>
          <div className="">
            {/* <div className="container mx-auto w-full py-12"> */}
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
