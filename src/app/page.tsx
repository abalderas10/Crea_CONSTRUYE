import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Proof } from "@/components/landing/Proof";
import { Problema } from "@/components/landing/Problema";
import { Solucion } from "@/components/landing/Solucion";
import { ComoFunciona } from "@/components/landing/ComoFunciona";
import { Herramientas } from "@/components/landing/Herramientas";
import { CasoEstudio } from "@/components/landing/CasoEstudio";
import { Comparativa } from "@/components/landing/Comparativa";
import { Usuarios } from "@/components/landing/Usuarios";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { CtaFinal } from "@/components/landing/CtaFinal";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Proof />
        <Problema />
        <Solucion />
        <ComoFunciona />
        <Herramientas />
        <CasoEstudio />
        <Comparativa />
        <Usuarios />
        <Pricing />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
