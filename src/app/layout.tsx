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
    default: "creaConstruye — Plataforma para crear, diseñar y construir en bienes raíces",
    template: "%s · creaConstruye",
  },
  description:
    "Construye lo que creas. Plataforma con IA para crear, diseñar y construir en bienes raíces: proformas, costos, ROI y riesgos, un laboratorio de herramientas y comunidad. Con datos reales de México.",
  keywords: [
    "proforma inmobiliaria",
    "desarrollo inmobiliario México",
    "plataforma de construcción",
    "diseño y arquitectura",
    "análisis de factibilidad",
    "ROI inmobiliario",
    "estudio de mercado inmobiliario",
    "inteligencia artificial inmobiliaria",
  ],
  openGraph: {
    title: "creaConstruye — Construye lo que creas",
    description:
      "Plataforma con IA para crear, diseñar y construir en bienes raíces. De la idea a la obra, con datos reales de México.",
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
