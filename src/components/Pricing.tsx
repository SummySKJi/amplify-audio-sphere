
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  isPopular = false 
}: { 
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}) => (
  <div className={`glass-card p-6 md:p-8 relative ${isPopular ? 'border-brand-purple/40 shadow-lg shadow-brand-purple/10' : ''}`}>
    {isPopular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-purple text-white py-1 px-4 rounded-full text-sm font-medium">
        Most Popular
      </div>
    )}
    
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <div className="mb-4">
      <span className="text-3xl font-bold">₹{price}</span>
    </div>
    <p className="text-gray-400 mb-6">{description}</p>
    
    <ul className="mb-8 space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Check size={18} className="text-brand-purple mt-0.5 mr-2 shrink-0" />
          <span className="text-gray-300 text-sm">{feature}</span>
        </li>
      ))}
    </ul>
    
    <Link to="/auth?mode=signup" className="w-full block">
      <Button 
        className={`w-full ${isPopular ? 'btn-primary' : 'bg-secondary hover:bg-secondary/80'}`}
      >
        Get Started
      </Button>
    </Link>
  </div>
);

const Pricing = () => {
  const pricingPlans = [
    {
      title: "Single Release",
      price: "499",
      description: "Perfect for releasing individual tracks",
      features: [
        "1 Single Release",
        "All 250+ Platforms",
        "Unlimited Streams",
        "YouTube Content ID",
        "Basic Analytics",
        "Email Support"
      ]
    },
    {
      title: "Annual Subscription",
      price: "2999",
      description: "Best value for active artists",
      features: [
        "Unlimited Single Releases for 1 Year",
        "All 250+ Platforms",
        "Unlimited Streams",
        "YouTube Content ID",
        "Advanced Analytics",
        "Priority Support",
        "Instagram & Facebook Monetization"
      ],
      isPopular: true
    },
    {
      title: "Album Package",
      price: "1499",
      description: "Ideal for releasing full albums",
      features: [
        "Up to 10 Tracks in One Album",
        "All 250+ Platforms",
        "Unlimited Streams", 
        "YouTube Content ID",
        "Detailed Analytics",
        "Priority Email Support",
        "Instagram & Facebook Monetization"
      ]
    }
  ];

  return (
    <section id="pricing" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, <span className="text-gradient">Transparent</span> Pricing
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            No hidden fees. No royalty cuts. You keep 100% of your rights and royalties.
            Choose the plan that works best for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
