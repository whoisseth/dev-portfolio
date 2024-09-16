import "@/app/globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

import { Archivo } from "next/font/google";
import { Libre_Franklin } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import Warning from "@/components/warning";
import { FooterComponent } from "@/components/footer";
import { TailwindIndicator } from "@/components/tailwind-indicator";

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
          "flex min-h-svh flex-col bg-background antialiased",
          archivo.variable + " " + libre_franklin.variable,
        )}
      >
        <Providers>
          <NextTopLoader showSpinner={false} />
          <Warning />
          <main className="flex flex-grow flex-col">{children}</main>
          <FooterComponent />
        </Providers>
        {/* <TailwindIndicator /> */}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
