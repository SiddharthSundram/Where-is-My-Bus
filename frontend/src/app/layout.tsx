import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LoadingProvider } from "@/components/loading-provider";
import { WithPageTransition } from "@/components/with-page-transition";
import GlideScrollScript from "@/lib/glidescroll";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Where is My Bus - Live Bus Tracking Experience",
  description: "Experience the future of public transportation with real-time 3D tracking and AI-powered insights across Indian cities",
  keywords: ["bus tracking", "real-time", "public transport", "India", "AI", "3D tracking"],
  authors: [{ name: "Where is My Bus Team" }],
  openGraph: {
    title: "Where is My Bus - Live Bus Tracking Experience",
    description: "Experience the future of public transportation with real-time 3D tracking and AI-powered insights across Indian cities",
    url: "https://whereismybus.com",
    siteName: "Where is My Bus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Where is My Bus - Live Bus Tracking Experience",
    description: "Experience the future of public transportation with real-time 3D tracking and AI-powered insights across Indian cities",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <LoadingProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <WithPageTransition>
                    {children}
                  </WithPageTransition>
                </main>
                <Footer />
              </div>
              <Toaster />
            </LoadingProvider>
          </SessionProvider>
          <GlideScrollScript />
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
