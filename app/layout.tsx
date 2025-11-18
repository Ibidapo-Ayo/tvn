import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth-provider";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import { useLangStore } from "next-localize";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Visionary Nation - Church Management System",
  description:
    "We roar, we soar - Comprehensive church database and member management system",
  generator: "THA Software and Innovations Department",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useLangStore.getState().addLocale("en", en);
  useLangStore.getState().addLocale("fr", fr);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
