import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";
import HowItWorks from "@/components/landing/HowItWorks";
import CampaignTypes from "@/components/landing/CampaignTypes";
import Faq from "@/components/landing/Faq";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";
import Reveal from "@/components/landing/Reveal";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div className="relative z-10 -mt-10 sm:-mt-12">
          <StatsBar />
        </div>
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <CampaignTypes />
        </Reveal>
        <Reveal>
          <Faq />
        </Reveal>
        <Reveal>
          <CtaBanner />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
