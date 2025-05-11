
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Platforms from "@/components/Platforms";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState } from "react";
import { toast } from "sonner";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      <Navbar />
      
      <main>
        {/* Hero Section with Authentication CTA */}
        <section className="pt-24 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-6">
              Music Distribution Made Simple
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-3xl">
              Distribute your music to over 250+ platforms worldwide. Take control of your music career with our artist-friendly platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {user ? (
                <Button asChild size="lg" className="px-8 py-6 text-lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="px-8 py-6 text-lg">
                    <Link to="/auth?mode=signup">Create Account</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                    <Link to="/auth?mode=login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
        
        <Hero />
        <Features />
        <Pricing />
        <Platforms />
        <ContactForm />
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
