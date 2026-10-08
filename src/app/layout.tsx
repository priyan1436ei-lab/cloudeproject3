import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "DocuMind AI | Cloud-Native AI Document Analyzer",
  description: "Upload documents to secure cloud storage and let AI summarize, analyze, search, and answer questions. B.Tech Cloud Computing & AI Mini Project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-indigo-500/20 selection:text-indigo-400">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
