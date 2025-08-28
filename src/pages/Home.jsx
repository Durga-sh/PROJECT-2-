import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "../components/HowItWorks";
import FeaturedChefs from "../components/FeaturedChefs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <HowItWorks />
      <FeaturedChefs />
    </div>
  );
};

export default Index;