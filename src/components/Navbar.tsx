
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gradient">IND Distribution</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link to="/#platforms" className="text-sm text-gray-300 hover:text-white transition-colors">Platforms</Link>
            <Link to="/#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link>
            <Link to="/#contact" className="text-sm text-gray-300 hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" className="text-gray-400 hover:text-white text-sm">Admin</Button>
            </Link>
            <Link to="/auth?mode=login">
              <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5">Login</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="btn-primary">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-white p-2 focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-white py-2 hover:text-brand-purple" onClick={toggleMenu}>Home</Link>
              <Link to="/#features" className="text-white py-2 hover:text-brand-purple" onClick={toggleMenu}>Features</Link>
              <Link to="/#platforms" className="text-white py-2 hover:text-brand-purple" onClick={toggleMenu}>Platforms</Link>
              <Link to="/#pricing" className="text-white py-2 hover:text-brand-purple" onClick={toggleMenu}>Pricing</Link>
              <Link to="/#contact" className="text-white py-2 hover:text-brand-purple" onClick={toggleMenu}>Contact</Link>
              <Link to="/admin" className="text-gray-400 py-2 hover:text-brand-purple" onClick={toggleMenu}>Admin</Link>
              <div className="pt-4 flex flex-col space-y-3">
                <Link to="/auth?mode=login" className="w-full">
                  <Button variant="outline" className="w-full border-white/10">Login</Button>
                </Link>
                <Link to="/auth?mode=signup" className="w-full">
                  <Button className="btn-primary w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
