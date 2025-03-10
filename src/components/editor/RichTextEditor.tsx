
import { useState, useRef, useEffect } from "react";
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link as LinkIcon, Image, 
  Smile, Type, Code, Quote, Heading1, Heading2, Heading3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const COLORS = [
  "#000000", "#5E5E5E", "#1A1F2C", "#7E69AB", "#9b87f5", "#D946EF",
  "#F97316", "#EF4444", "#F59E0B", "#10B981", "#0EA5E9", "#8B5CF6"
];

const FONT_SIZES = [
  "12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px", "48px", "60px"
];

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [showHTML, setShowHTML] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value: string = "") => {
    // Restore selection if we have one saved
    if (selectionRange) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(selectionRange);
    }
    
    document.execCommand(command, false, value);
    
    // Update the value after making changes
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyUp = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSelectionRange(selection.getRangeAt(0).cloneRange());
    }
  };

  const insertImage = (url: string, alt: string = "") => {
    if (!url) return;
    execCommand('insertHTML', `<img src="${url}" alt="${alt}" class="w-full max-w-2xl h-auto rounded-lg my-4" />`);
  };

  const insertLink = (url: string, text: string) => {
    if (!url) return;
    execCommand('insertHTML', `<a href="${url}" target="_blank" class="text-primary hover:underline">${text || url}</a>`);
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <Tabs defaultValue="editor" className="w-full">
        <div className="bg-gray-50 border-b border-gray-200 p-1 flex items-center justify-between">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="editor">Visual Editor</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="editor" className="p-0">
          <div className="bg-gray-50 border-b border-gray-200 p-1 flex flex-wrap gap-1">
            {/* Headings */}
            <div className="flex items-center">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('formatBlock', '<h1>')}
                className="h-8 w-8 p-1"
                title="Heading 1"
              >
                <Heading1 size={16} />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('formatBlock', '<h2>')}
                className="h-8 w-8 p-1"
                title="Heading 2"
              >
                <Heading2 size={16} />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('formatBlock', '<h3>')}
                className="h-8 w-8 p-1"
                title="Heading 3"
              >
                <Heading3 size={16} />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('formatBlock', '<p>')}
                className="h-8 w-8 p-1"
                title="Paragraph"
              >
                <Type size={16} />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-8 mx-1" />
            
            {/* Text formatting */}
            <div className="flex items-center">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('bold')}
                className="h-8 w-8 p-1"
                title="Bold"
              >
                <Bold size={16} />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('italic')}
                className="h-8 w-8 p-1"
                title="Italic"
              >
                <Italic size={16} />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('underline')}
                className="h-8 w-8 p-1"
                title="Underline"
              >
                <Underline size={16} />
              </Button>

              {/* Color picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 p-1"
                    title="Text Color"
                    onClick={saveSelection}
                  >
                    <div className="w-4 h-4 rounded-full bg-black border border-gray-300" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => execCommand('foreColor', color)}
                        className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Font size picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 p-1 text-xs"
                    title="Font Size"
                    onClick={saveSelection}
                  >
                    Font Size
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2">
                  <div className="flex flex-col gap-1">
                    {FONT_SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => execCommand('fontSize', size)}
                        className="text-left px-2 py-1 hover:bg-gray-100 rounded"
                        style={{ fontSize: size }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <Separator orientation="vertical" className="h-8 mx-1" />
            
            {/* Alignment */}
            <div className="flex items-center">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('justifyLeft')}
                className="h-8 w-8 p-1"
                title="Align Left"
              >
                <AlignLeft size={16} />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('justifyCenter')}
                className="h-8 w-8 p-1"
                title="Align Center"
              >
                <AlignCenter size={16} />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('justifyRight')}
                className="h-8 w-8 p-1"
                title="Align Right"
              >
                <AlignRight size={16} />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('justifyFull')}
                className="h-8 w-8 p-1"
                title="Justify"
              >
                <AlignJustify size={16} />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-8 mx-1" />
            
            {/* Lists */}
            <div className="flex items-center">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('insertUnorderedList')}
                className="h-8 w-8 p-1"
                title="Bullet List"
              >
                <List size={16} />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('insertOrderedList')}
                className="h-8 w-8 p-1"
                title="Numbered List"
              >
                <ListOrdered size={16} />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-8 mx-1" />
            
            {/* Insert */}
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-1"
                    title="Insert Link"
                    onClick={saveSelection}
                  >
                    <LinkIcon size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Insert Link</h3>
                    <div className="space-y-2">
                      <Input 
                        id="link-url" 
                        placeholder="https://example.com" 
                        className="col-span-3" 
                      />
                      <Input 
                        id="link-text" 
                        placeholder="Link text (optional)" 
                        className="col-span-3" 
                      />
                      <Button 
                        onClick={() => {
                          const url = (document.getElementById('link-url') as HTMLInputElement).value;
                          const text = (document.getElementById('link-text') as HTMLInputElement).value;
                          insertLink(url, text);
                        }}
                        className="w-full"
                      >
                        Insert Link
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-1"
                    title="Insert Image"
                    onClick={saveSelection}
                  >
                    <Image size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Insert Image</h3>
                    <div className="space-y-2">
                      <Input 
                        id="image-url" 
                        placeholder="https://example.com/image.jpg" 
                        className="col-span-3" 
                      />
                      <Input 
                        id="image-alt" 
                        placeholder="Alt text (optional)" 
                        className="col-span-3" 
                      />
                      <Button 
                        onClick={() => {
                          const url = (document.getElementById('image-url') as HTMLInputElement).value;
                          const alt = (document.getElementById('image-alt') as HTMLInputElement).value;
                          insertImage(url, alt);
                        }}
                        className="w-full"
                      >
                        Insert Image
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('insertText', '😊')}
                className="h-8 w-8 p-1"
                title="Insert Emoji"
              >
                <Smile size={16} />
              </Button>
              
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('formatBlock', '<pre>')}
                className="h-8 w-8 p-1"
                title="Code Block"
              >
                <Code size={16} />
              </Button>
              
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => execCommand('formatBlock', '<blockquote>')}
                className="h-8 w-8 p-1"
                title="Quote"
              >
                <Quote size={16} />
              </Button>
            </div>
          </div>
          
          <div
            ref={editorRef}
            className="min-h-[300px] p-4 focus:outline-none editor-placeholder"
            contentEditable
            suppressContentEditableWarning
            onKeyUp={handleKeyUp}
            onBlur={handleKeyUp}
            dangerouslySetInnerHTML={{ __html: value }}
            data-placeholder={placeholder || "Write your content here..."}
          />
        </TabsContent>
        
        <TabsContent value="html" className="p-0">
          <textarea
            className="w-full min-h-[300px] p-4 font-mono text-sm focus:outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Write your content here..."}
            rows={15}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
