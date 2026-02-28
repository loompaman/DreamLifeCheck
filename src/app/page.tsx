import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TransformDemo from "@/components/TransformDemo";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#03030a] min-h-screen">
      <Navbar />
      <Hero />
      <TransformDemo />
      <HowItWorks />
      <CTASection />
      <Footer />
    </main>
  );
}
