import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Agro-Edu BiBoo | AGRO EDU BOX",
    template: "%s | Agro-Edu BiBoo",
  },
  description: "Platform pembelajaran agrikultur & IoT ceria untuk anak dan remaja bersama BiBoo.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#BFE6F7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="min-h-dvh bg-[#F3F9EC] text-[#2F3B1F] font-body antialiased selection:bg-[#CDEBB0] selection:text-[#2F3B1F] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
