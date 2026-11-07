import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Both faces are self-hosted variable fonts, latin subset.
 * Serving them ourselves keeps the build off Google's rate limiter and saves
 * parents on a phone a round trip to a third-party domain.
 */
const outfit = localFont({
  src: "./fonts/outfit.woff2",
  variable: "--font-outfit",
  display: "swap",
  weight: "100 900",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const dmSans = localFont({
  src: "./fonts/dm-sans.woff2",
  variable: "--font-dm-sans",
  display: "swap",
  weight: "100 1000",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "FirstSteps — preschools near you, checked",
  description:
    "Fourteen preschools near Sector 47, Gurugram, checked for Montessori training, safety and daycare hours. Every fact shows where it came from.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FirstSteps",
  },
};

export const viewport: Viewport = {
  themeColor: "#F3F2EE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(outfit.variable, dmSans.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-paper text-ink antialiased">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
