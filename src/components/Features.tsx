
import { Check, Music, BarChart4, Heart, Shield, Mail } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <div className="glass-card card-hover p-6 md:p-8">
    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-lg mb-4">
      <Icon size={24} className="text-brand-purple" />
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: Music,
      title: "Worldwide Distribution",
      description: "Distribute your music to 250+ streaming platforms globally including Spotify, Apple Music, JioSaavn, and more."
    },
    {
      icon: BarChart4,
      title: "Detailed Analytics",
      description: "Track your music performance with detailed analytics and royalty reports from all platforms."
    },
    {
      icon: Check,
      title: "Content ID",
      description: "Protect your content with YouTube Content ID and earn from any use of your music."
    },
    {
      icon: Heart,
      title: "Artist Channels",
      description: "Get official artist channels on YouTube to build your brand and grow your audience."
    },
    {
      icon: Shield,
      title: "Copyright Protection",
      description: "Comprehensive copyright protection for your music across all platforms."
    },
    {
      icon: Mail,
      title: "24/7 Support",
      description: "Get help anytime with our dedicated customer support team ready to assist you."
    }
  ];

  return (
    <section id="features" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need To <span className="text-gradient">Succeed</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            IND Distribution provides all the tools and services you need to distribute your music
            successfully and build your career as an independent artist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
