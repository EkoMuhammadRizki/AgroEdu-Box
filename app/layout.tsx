import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "AGRO EDU BOX",
    template: "%s | AGRO EDU BOX",
  },
  description: "Platform pembelajaran agrikultur berbasis IoT untuk siswa dan guru.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="min-h-dvh bg-bg font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
