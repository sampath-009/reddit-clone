import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import CustomCursor from "@/components/CustomCursor";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reddit Clone",
  description: "A modern Reddit clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: '#f97316',
            },
          }}
        >
          <CustomCursor />
          {children}
          <Toaster position="top-right" richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
