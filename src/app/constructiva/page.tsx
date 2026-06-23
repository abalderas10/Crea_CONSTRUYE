import { Nav } from "@/components/constructiva/Nav";
import { Hero } from "@/components/constructiva/Hero";
import { Servicios } from "@/components/constructiva/Servicios";
import { LeadForm } from "@/components/constructiva/LeadForm";
import { Footer } from "@/components/constructiva/Footer";

export default function ConstructivaPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Servicios />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
