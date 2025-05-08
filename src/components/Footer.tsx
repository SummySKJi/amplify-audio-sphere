
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/50 border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient">IND Distribution</h3>
            <p className="text-gray-400 mb-4">
              The leading music distribution service in India, helping independent artists distribute 
              their music worldwide while keeping 100% of their rights.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-brand-purple transition-colors">Home</Link></li>
              <li><Link to="/#features" className="text-gray-400 hover:text-brand-purple transition-colors">Features</Link></li>
              <li><Link to="/#platforms" className="text-gray-400 hover:text-brand-purple transition-colors">Platforms</Link></li>
              <li><Link to="/#pricing" className="text-gray-400 hover:text-brand-purple transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-gray-400 hover:text-brand-purple transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-brand-purple transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="text-gray-400 hover:text-brand-purple transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="text-gray-400">Email: musicdistributionindia.in@gmail.com</li>
              <li className="text-gray-400">Phone: 01169652811</li>
              <li className="text-gray-400">WhatsApp: +91 7742789827</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 mt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} IND Distribution. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
