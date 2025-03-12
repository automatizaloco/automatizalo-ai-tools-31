
import { MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/context/LanguageContext";
import { useContactInfo } from "@/stores/contactInfoStore";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

const WhatsAppButton = ({
  phoneNumber: propPhoneNumber,
  message = "Hello, I would like more information"
}: WhatsAppButtonProps) => {
  const { t } = useLanguage();
  const { contactInfo } = useContactInfo();
  
  // Use the phone number from props if provided, otherwise use the one from contactInfo
  const phoneNumber = propPhoneNumber || contactInfo.phone;
  
  const handleClick = () => {
    // Clean the phone number - remove any non-digit characters
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label={t("contact.whatsapp")}
          >
            <MessageCircle size={24} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("contact.whatsapp")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WhatsAppButton;
