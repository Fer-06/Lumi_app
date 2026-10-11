import type { Metadata, Viewport } from "next";
import { Quicksand, Fredoka } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeStyleInjector } from "@/components/theme/ThemeStyleInjector";
import { Mascot } from "@/components/mascot/Mascot";

const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-sans" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Lumi — Tu espacio para estudiar, organizarte y sentirte mejor",
  description: "Productividad universitaria y bienestar personal en un solo lugar.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#8F6AF0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${quicksand.variable} ${fredoka.variable} font-sans`}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
          <ThemeStyleInjector />
          <Mascot />
        </AuthProvider>
      </body>
    </html>
  );
}
