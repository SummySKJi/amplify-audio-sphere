
import { Phone } from 'lucide-react';

const WhatsAppButton = () => {
  const whatsappNumber = "+917742789827";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300"
      aria-label="Contact us on WhatsApp"
    >
      <Phone className="w-6 h-6 text-white" />
      <span className="sr-only">WhatsApp Support</span>
    </a>
  );
};

export default WhatsAppButton;
