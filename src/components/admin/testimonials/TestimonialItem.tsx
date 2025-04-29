
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Globe, Languages, Loader2, Save, Trash2 } from "lucide-react";
import { Testimonial, TestimonialTranslation } from "@/services/testimonialService";
import { useIsMobile } from "@/hooks/use-mobile";

interface TestimonialItemProps {
  testimonial: Testimonial;
  translations: TestimonialTranslation[];
  onTestimonialChange: (id: string, field: keyof Testimonial, value: string) => void;
  onTranslationChange: (testimonialId: string, language: string, text: string) => void;
  onSaveTranslation: (testimonialId: string, language: string) => void;
  onDeleteTestimonial: (id: string) => void;
  editedTranslations: {[key: string]: {[lang: string]: string}};
  isDeleting: boolean;
  isTranslationUpdating: boolean;
}

const TestimonialItem: React.FC<TestimonialItemProps> = ({
  testimonial,
  translations,
  onTestimonialChange,
  onTranslationChange,
  onSaveTranslation,
  onDeleteTestimonial,
  editedTranslations,
  isDeleting,
  isTranslationUpdating
}) => {
  const isMobile = useIsMobile();
  
  // Get translations for a specific testimonial
  const getTranslationsForTestimonial = (): TestimonialTranslation[] => {
    return translations.filter(t => 
      t && typeof t === 'object' && 
      'testimonial_id' in t && t.testimonial_id === testimonial.id
    );
  };

  // Get edited translation text or use the original
  const getTranslationText = (language: string): string => {
    if (
      editedTranslations[testimonial.id] && 
      editedTranslations[testimonial.id][language] !== undefined
    ) {
      return editedTranslations[testimonial.id][language];
    }
    
    const translation = getTranslationsForTestimonial().find(
      t => t && typeof t === 'object' && 'language' in t && t.language === language
    );
    
    return translation && 'text' in translation ? translation.text : '';
  };

  if (isMobile) {
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{testimonial.name}</h3>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDeleteTestimonial(testimonial.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger>Testimonial Details</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`name-${testimonial.id}`}>Client Name</Label>
                  <Input
                    id={`name-${testimonial.id}`}
                    value={testimonial.name}
                    onChange={(e) => onTestimonialChange(testimonial.id, 'name', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`company-${testimonial.id}`}>Company (Optional)</Label>
                  <Input
                    id={`company-${testimonial.id}`}
                    value={testimonial.company || ""}
                    onChange={(e) => onTestimonialChange(testimonial.id, 'company', e.target.value)}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor={`text-${testimonial.id}`}>Testimonial Text</Label>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span>EN</span>
                    </Badge>
                  </div>
                  <Textarea
                    id={`text-${testimonial.id}`}
                    value={testimonial.text}
                    onChange={(e) => onTestimonialChange(testimonial.id, 'text', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="translations">
            <AccordionTrigger className="flex items-center gap-1">
              <Languages className="h-4 w-4 mr-1" />
              Translations
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="fr">
                <TabsList className="mb-2 w-full grid grid-cols-2">
                  <TabsTrigger value="fr">French</TabsTrigger>
                  <TabsTrigger value="es">Spanish</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fr">
                  {getTranslationsForTestimonial().find(t => t.language === 'fr') ? (
                    <div>
                      <Textarea
                        value={getTranslationText('fr')}
                        onChange={(e) => onTranslationChange(testimonial.id, 'fr', e.target.value)}
                        rows={3}
                        className="mb-2"
                      />
                      <Button 
                        size="sm"
                        onClick={() => onSaveTranslation(testimonial.id, 'fr')}
                        disabled={isTranslationUpdating}
                        className="flex items-center gap-1 w-full"
                      >
                        {isTranslationUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save French Translation
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No French translation available</p>
                  )}
                </TabsContent>
                
                <TabsContent value="es">
                  {getTranslationsForTestimonial().find(t => t.language === 'es') ? (
                    <div>
                      <Textarea
                        value={getTranslationText('es')}
                        onChange={(e) => onTranslationChange(testimonial.id, 'es', e.target.value)}
                        rows={3}
                        className="mb-2"
                      />
                      <Button 
                        size="sm"
                        onClick={() => onSaveTranslation(testimonial.id, 'es')}
                        disabled={isTranslationUpdating}
                        className="flex items-center gap-1 w-full"
                      >
                        {isTranslationUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save Spanish Translation
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No Spanish translation available</p>
                  )}
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-full">
          <div>
            <Label htmlFor={`name-${testimonial.id}`}>Client Name</Label>
            <Input
              id={`name-${testimonial.id}`}
              value={testimonial.name}
              onChange={(e) => onTestimonialChange(testimonial.id, 'name', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor={`company-${testimonial.id}`}>Company (Optional)</Label>
            <Input
              id={`company-${testimonial.id}`}
              value={testimonial.company || ""}
              onChange={(e) => onTestimonialChange(testimonial.id, 'company', e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor={`text-${testimonial.id}`}>Testimonial Text</Label>
              <Badge variant="outline" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>EN</span>
              </Badge>
            </div>
            <Textarea
              id={`text-${testimonial.id}`}
              value={testimonial.text}
              onChange={(e) => onTestimonialChange(testimonial.id, 'text', e.target.value)}
              rows={3}
            />
          </div>
          
          {/* Translations section */}
          <div className="mt-4">
            <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
              <Languages className="h-4 w-4" />
              Translations
            </h4>
            
            <Tabs defaultValue="fr">
              <TabsList className="mb-2">
                <TabsTrigger value="fr">French</TabsTrigger>
                <TabsTrigger value="es">Spanish</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fr">
                {getTranslationsForTestimonial().find(t => t.language === 'fr') ? (
                  <div>
                    <Textarea
                      value={getTranslationText('fr')}
                      onChange={(e) => onTranslationChange(testimonial.id, 'fr', e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
                    <Button 
                      size="sm"
                      onClick={() => onSaveTranslation(testimonial.id, 'fr')}
                      disabled={isTranslationUpdating}
                      className="flex items-center gap-1"
                    >
                      {isTranslationUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save French Translation
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No French translation available</p>
                )}
              </TabsContent>
              
              <TabsContent value="es">
                {getTranslationsForTestimonial().find(t => t.language === 'es') ? (
                  <div>
                    <Textarea
                      value={getTranslationText('es')}
                      onChange={(e) => onTranslationChange(testimonial.id, 'es', e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
                    <Button 
                      size="sm"
                      onClick={() => onSaveTranslation(testimonial.id, 'es')}
                      disabled={isTranslationUpdating}
                      className="flex items-center gap-1"
                    >
                      {isTranslationUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Spanish Translation
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No Spanish translation available</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <Button
          variant="destructive"
          size="icon"
          className="ml-4"
          onClick={() => onDeleteTestimonial(testimonial.id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TestimonialItem;
