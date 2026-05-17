import { Poppins, Geist } from "next/font/google";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SocketProvider } from "@/providers/SocketProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "EarnUnity - Join & Earn Together",
  description:
    "A community-driven platform to earn money by completing simple tasks.",
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
