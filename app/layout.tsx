import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Font disimpan di app/fonts (lisensi OFL), bukan diunduh dari Google:
// next/font/google gagal di Turbopack, dan website tetap jalan bila Google diblokir.
const baloo = localFont({
  src: [
    { path: "./fonts/baloo-2-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/baloo-2-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/baloo-2-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-heading",
  display: "swap",
});

const nunito = localFont({
  src: [
    { path: "./fonts/nunito-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/nunito-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/nunito-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/nunito-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Agro-Edu Box",
    template: "%s | Agro-Edu Box",
  },
  description: "Platform pembelajaran agrikultur & IoT ceria untuk anak dan remaja bersama Situnas.",
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
