import { HeroSection } from "@/components/landing/HeroSection";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <main className="bg-[#020617] min-h-screen">
      <HeroSection />
      <LandingFeatures />
      <LandingFooter />
    </main>
  );
}
