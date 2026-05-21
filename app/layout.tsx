import { Poppins, Geist } from "next/font/google";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { Metadata } from "next";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "EarnUnity - Micro-Earning & Task-Based Community Platform",
    template: "%s | EarnUnity",
  },
  description:
    "Join EarnUnity, the ultimate community-based micro-earning platform. Complete simple digital tasks, claim rewards, and secure verified fast payouts instantly.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
  keywords: [
    "micro earning",
    "earn money online",
    "EarnUnity",
    "micro tasks",
    "freelance tasks",
    "bKash earningapp",
    "Nagad earning",
  ],
  authors: [{ name: "EarnUnity Team" }],
  openGraph: {
    title: "EarnUnity - Micro-Earning Platform",
    description:
      "Start your journey to financial freedom by completing simple daily tasks.",
    url: "https://earnunity.com",
    siteName: "EarnUnity",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(poppins.className, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <SocketProvider>
            {children}
            <Toaster position="top-center" richColors />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
