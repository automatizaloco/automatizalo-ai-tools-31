
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇨🇴" },
  ];
  
  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 px-2">
          <span className="text-lg">{currentLanguage?.flag}</span>
          <Globe className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1">
        <div className="flex flex-col space-y-1">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? "secondary" : "ghost"}
              size="sm"
              className="justify-start gap-2"
              onClick={() => setLanguage(lang.code as "en" | "fr" | "es")}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
