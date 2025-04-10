
import { MessageCircle, Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

interface WhatsAppButtonProps {
  message?: string;
  showCalendarConfirmation?: boolean;
}

const WhatsAppButton = ({
  message = "Hello, I would like more information",
  showCalendarConfirmation = false
}: WhatsAppButtonProps) => {
  const { t } = useLanguage();
  
  // Always use this WhatsApp number
  const whatsappNumber = "+57 3192963363";
  
  const handleClick = () => {
    // Clean the phone number - remove any non-digit characters
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
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
