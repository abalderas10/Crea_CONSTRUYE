import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://creaconstruye.com"),
  title: {
    default: "creaConstruye — Proforma Inmobiliaria con IA para México",
    template: "%s · creaConstruye",
  },
  description:
    "La proforma inmobiliaria que trabaja mientras tú duermes. Análisis de mercado, costos, ROI y riesgos — en horas, no semanas. Con datos reales de México.",
  keywords: [
    "proforma inmobiliaria",
    "desarrollo inmobiliario México",
    "análisis de factibilidad",
    "ROI inmobiliario",
    "estudio de mercado inmobiliario",
    "inteligencia artificial inmobiliaria",
  ],
  openGraph: {
    title: "creaConstruye — Proforma Inmobiliaria con IA para México",
    description:
      "Análisis de mercado, costos, ROI y riesgos — en horas, no semanas. Con datos reales de México.",
    locale: "es_MX",
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
      lang="es-MX"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-ink">
        {children}
      </body>
    </html>
  );
}
