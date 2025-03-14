
import { MessageCircle, Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/context/LanguageContext";
import { useContactInfo } from "@/stores/contactInfoStore";
import { toast } from "sonner";
import { useEffect } from "react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  showCalendarConfirmation?: boolean;
}

const WhatsAppButton = ({
  phoneNumber: propPhoneNumber,
  message = "Hello, I would like more information",
  showCalendarConfirmation = false
}: WhatsAppButtonProps) => {
  const { t } = useLanguage();
  const { contactInfo, fetchContactInfo } = useContactInfo();
  
  // Fetch contact info when component mounts
  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);
  
  // Use the phone number from props if provided, otherwise use the one from contactInfo
  // Prioritize whatsapp number if available
  const phoneNumber = propPhoneNumber || contactInfo.whatsapp || contactInfo.phone;
  
  const handleClick = () => {
    // Clean the phone number - remove any non-digit characters
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);

    // If calendar confirmation is requested, show success toast first
    if (showCalendarConfirmation) {
      toast.success(t("contact.calendar.confirmation") || "Meeting scheduled successfully! A calendar invitation has been sent to your email and WhatsApp.", {
        duration: 5000,
        icon: <Calendar className="text-green-500" />
      });
      
      // Slight delay to allow toast to appear before WhatsApp opens
      setTimeout(() => {
        window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
      }, 1000);
    } else {
      window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
    }
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
