
import { useState } from "react";
import { BlogPost } from "@/types/blog";
import { TranslationFormData } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Check, Edit, Loader2, Save } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { translateBlogContent } from "@/services/translationService";
import { toast } from "sonner";

interface TranslationPanelProps {
  post: BlogPost | null;
  editingTranslation: boolean;
  translationData: TranslationFormData;
  currentTab: string;
  onTabChange: (value: string) => void;
  onTranslationEdit: () => void;
  onTranslationChange: (lang: "fr" | "es", field: "title" | "excerpt" | "content", value: string) => void;
  onTranslationContentChange: (content: string) => void;
  onSaveTranslations: () => void; // New prop for saving translations
}

const TranslationPanel = ({
  post,
  editingTranslation,
  translationData,
  currentTab,
  onTabChange,
  onTranslationEdit,
  onTranslationChange,
  onTranslationContentChange,
  onSaveTranslations,
}: TranslationPanelProps) => {
  const [isTranslating, setIsTranslating] = useState<{ [key: string]: boolean }>({
    fr: false,
    es: false
  });

  if (!post) return null;
  
  const handleAutoTranslate = async (language: 'fr' | 'es') => {
    if (!post) return;
    
    try {
      // Set translating state for the specific language
      setIsTranslating(prev => ({ ...prev, [language]: true }));
      
      // Call translation service
      const translated = await translateBlogContent(
        post.content,
        post.title,
        post.excerpt,
        language
      );

      console.log(`Translation results for ${language}:`, translated);
      
      // Update translation data with results
      onTranslationChange(language, "title", translated.title);
      onTranslationChange(language, "excerpt", translated.excerpt);
      onTranslationChange(language, "content", translated.content);
      
      toast.success(`Content translated to ${language === 'fr' ? 'French' : 'Spanish'} successfully`);
    } catch (error) {
      console.error(`Error auto-translating to ${language}:`, error);
      toast.error(`Failed to translate to ${language === 'fr' ? 'French' : 'Spanish'}`);
    } finally {
      setIsTranslating(prev => ({ ...prev, [language]: false }));
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium flex items-center">
          <Globe className="mr-2 h-5 w-5 text-gray-500" />
          Translation Preview
        </h2>
        <div className="flex space-x-2">
          {editingTranslation && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSaveTranslations}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Save Translations
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onTranslationEdit}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            {editingTranslation ? "Done Editing" : "Edit Translations"}
          </Button>
        </div>
      </div>
      <Tabs
        defaultValue="en"
        value={currentTab}
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="en" className="flex items-center">
            🇺🇸 English
            <Check className="ml-1 h-3 w-3 text-green-500" />
          </TabsTrigger>
          <TabsTrigger value="fr" className="flex items-center">
            🇫🇷 French
            {post.translations?.fr ? (
              <Check className="ml-1 h-3 w-3 text-green-500" />
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="es" className="flex items-center">
            🇨🇴 Spanish
            {post.translations?.es ? (
              <Check className="ml-1 h-3 w-3 text-green-500" />
            ) : null}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="p-4 border rounded-md mt-2">
          <h3 className="font-medium">English (Original)</h3>
          <p className="text-sm text-gray-500">This is the original content you created</p>
        </TabsContent>
        
        <TabsContent value="fr" className="p-4 border rounded-md mt-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">French Translation</h3>
            {editingTranslation && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAutoTranslate('fr')}
                disabled={isTranslating.fr}
              >
                {isTranslating.fr ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Translating...
                  </>
                ) : (
                  'Auto-translate'
                )}
              </Button>
            )}
          </div>
          {editingTranslation ? (
            <div className="space-y-4 mt-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (French)
                </label>
                <input
                  type="text"
                  value={translationData.fr.title}
                  onChange={(e) => onTranslationChange("fr", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt (French)
                </label>
                <textarea
                  value={translationData.fr.excerpt}
                  onChange={(e) => onTranslationChange("fr", "excerpt", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (French)
                </label>
                <RichTextEditor 
                  value={translationData.fr.content}
                  onChange={(content) => onTranslationChange("fr", "content", content)}
                  placeholder="Write your French content here..."
                />
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                {post.translations?.fr 
                  ? "Content has been translated to French"
                  : "Content will be automatically translated when you save"}
              </p>
              {post.translations?.fr && (
                <div className="mt-3">
                  <p><strong>Title:</strong> {post.translations.fr.title}</p>
                  <p><strong>Excerpt:</strong> {post.translations.fr.excerpt}</p>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="es" className="p-4 border rounded-md mt-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Spanish Translation</h3>
            {editingTranslation && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAutoTranslate('es')}
                disabled={isTranslating.es}
              >
                {isTranslating.es ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Translating...
                  </>
                ) : (
                  'Auto-translate'
                )}
              </Button>
            )}
          </div>
          {editingTranslation ? (
            <div className="space-y-4 mt-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Spanish)
                </label>
                <input
                  type="text"
                  value={translationData.es.title}
                  onChange={(e) => onTranslationChange("es", "title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt (Spanish)
                </label>
                <textarea
                  value={translationData.es.excerpt}
                  onChange={(e) => onTranslationChange("es", "excerpt", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (Spanish)
                </label>
                <RichTextEditor 
                  value={translationData.es.content}
                  onChange={(content) => onTranslationChange("es", "content", content)}
                  placeholder="Write your Spanish content here..."
                />
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                {post.translations?.es 
                  ? "Content has been translated to Spanish"
                  : "Content will be automatically translated when you save"}
              </p>
              {post.translations?.es && (
                <div className="mt-3">
                  <p><strong>Title:</strong> {post.translations.es.title}</p>
                  <p><strong>Excerpt:</strong> {post.translations.es.excerpt}</p>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
      <p className="text-sm text-gray-500 mt-3">
        <Globe className="inline-block mr-1 h-4 w-4" />
        {editingTranslation 
          ? "You're manually editing translations. Use the Auto-translate button to automatically translate content."
          : "Content is translated to French and Spanish when you save the post."}
      </p>
    </div>
  );
};

export default TranslationPanel;
