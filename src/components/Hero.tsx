
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-hero-pattern">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-radial from-brand-purple/10 to-transparent"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-purple/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-blue/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Distribute Your Music</span> <br />
            To The World's Top Platforms
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Get your music on 250+ streaming platforms including Spotify, Apple Music, JioSaavn, 
            YouTube Music, Instagram, and more - all while keeping 100% of your rights.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-14">
            <Link to="/auth?mode=signup">
              <Button className="btn-primary text-base h-12 px-10">Get Started</Button>
            </Link>
            <Link to="/#pricing">
              <Button variant="outline" className="text-base h-12 px-10 border-white/10 hover:bg-white/5">
                View Pricing
              </Button>
            </Link>
          </div>
          
          {/* Platform logos */}
          <div className="mt-16">
            <p className="text-sm text-gray-400 mb-6">DISTRIBUTE YOUR MUSIC TO ALL MAJOR PLATFORMS</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-24 h-8 bg-white/10 rounded-md flex items-center justify-center">Spotify</div>
              <div className="w-24 h-8 bg-white/10 rounded-md flex items-center justify-center">Apple Music</div>
              <div className="w-24 h-8 bg-white/10 rounded-md flex items-center justify-center">JioSaavn</div>
              <div className="w-24 h-8 bg-white/10 rounded-md flex items-center justify-center">YouTube Music</div>
              <div className="w-24 h-8 bg-white/10 rounded-md flex items-center justify-center">Instagram</div>
              <div className="w-24 h-8 bg-white/10 rounded-md flex items-center justify-center">Facebook</div>
            </div>
            <p className="mt-4 text-sm text-gray-400">And 250+ more platforms worldwide</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
