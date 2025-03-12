
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  getNewsletterTemplates, 
  createNewsletterTemplate, 
  updateNewsletterTemplate,
  deleteNewsletterTemplate,
  getNewsletterContentByTemplateId,
  addNewsletterContent,
  updateNewsletterContent,
  deleteNewsletterContent,
  sendNewsletter,
  getNewsletterHistory,
  NewsletterTemplate,
  NewsletterContent,
  NewsletterHistory,
  NewsletterFrequency
} from "@/services/newsletterService";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { toast } from "sonner";

const NewsletterManager = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([]);
  const [history, setHistory] = useState<NewsletterHistory[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<NewsletterTemplate | null>(null);
  const [templateContents, setTemplateContents] = useState<NewsletterContent[]>([]);
  const [newTemplate, setNewTemplate] = useState<NewsletterTemplate>({
    name: "",
    subject: "",
    header_text: "",
    footer_text: ""
  });
  const [newContent, setNewContent] = useState<Omit<NewsletterContent, 'template_id'>>({
    title: "",
    content: "",
    position: 0
  });
  const [sendOptions, setSendOptions] = useState({
    frequency: "weekly" as NewsletterFrequency,
    templateId: "",
    customSubject: "",
    customContent: "",
    testMode: true,
    testEmail: ""
  });
  const [loading, setLoading] = useState({
    templates: false,
    history: false,
    sendNewsletter: false
  });

  // Fetch templates on load
  useEffect(() => {
    fetchTemplates();
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  // Fetch template content when a template is selected
  useEffect(() => {
    if (selectedTemplate?.id) {
      fetchTemplateContent(selectedTemplate.id);
    } else {
      setTemplateContents([]);
    }
  }, [selectedTemplate]);

  const fetchTemplates = async () => {
    setLoading(prev => ({ ...prev, templates: true }));
    try {
      const templates = await getNewsletterTemplates();
      setTemplates(templates);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      toast.error("Failed to load newsletter templates");
    } finally {
      setLoading(prev => ({ ...prev, templates: false }));
    }
  };

  const fetchHistory = async () => {
    setLoading(prev => ({ ...prev, history: true }));
    try {
      const historyItems = await getNewsletterHistory();
      setHistory(historyItems);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      toast.error("Failed to load newsletter history");
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

  const fetchTemplateContent = async (templateId: string) => {
    try {
      const content = await getNewsletterContentByTemplateId(templateId);
      setTemplateContents(content);
    } catch (error) {
      console.error(`Failed to fetch content for template ${templateId}:`, error);
      toast.error("Failed to load template content");
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTemplate.name || !newTemplate.subject) {
      toast.error("Template name and subject are required");
      return;
    }
    
    try {
      const created = await createNewsletterTemplate(newTemplate);
      if (created) {
        setNewTemplate({
          name: "",
          subject: "",
          header_text: "",
          footer_text: ""
        });
        fetchTemplates();
      }
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate?.id) return;
    
    try {
      await updateNewsletterTemplate(selectedTemplate.id, selectedTemplate);
      fetchTemplates();
    } catch (error) {
      console.error("Failed to update template:", error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    
    try {
      await deleteNewsletterTemplate(id);
      fetchTemplates();
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate?.id || !newContent.title || !newContent.content) {
      toast.error("Template ID, title, and content are required");
      return;
    }
    
    try {
      await addNewsletterContent({
        ...newContent,
        template_id: selectedTemplate.id,
        position: templateContents.length
      });
      setNewContent({
        title: "",
        content: "",
        position: 0
      });
      fetchTemplateContent(selectedTemplate.id);
    } catch (error) {
      console.error("Failed to add content:", error);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content block?")) return;
    
    try {
      await deleteNewsletterContent(id);
      if (selectedTemplate?.id) {
        fetchTemplateContent(selectedTemplate.id);
      }
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sendOptions.testMode && !sendOptions.testEmail) {
      toast.error("Test email is required when in test mode");
      return;
    }
    
    setLoading(prev => ({ ...prev, sendNewsletter: true }));
    try {
      await sendNewsletter(sendOptions.frequency, {
        templateId: sendOptions.templateId || undefined,
        customSubject: sendOptions.customSubject || undefined,
        customContent: sendOptions.customContent || undefined,
        testMode: sendOptions.testMode,
        testEmail: sendOptions.testEmail
      });
      
      if (!sendOptions.testMode) {
        fetchHistory();
      }
    } catch (error) {
      console.error("Failed to send newsletter:", error);
    } finally {
      setLoading(prev => ({ ...prev, sendNewsletter: false }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Newsletter Manager</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template List */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Templates</h3>
              
              {loading.templates ? (
                <p>Loading templates...</p>
              ) : templates.length === 0 ? (
                <p>No templates created yet</p>
              ) : (
                <div className="space-y-3">
                  {templates.map(template => (
                    <div 
                      key={template.id} 
                      className={`p-3 border rounded-md cursor-pointer flex justify-between items-center ${
                        selectedTemplate?.id === template.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-500">{template.subject}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.id!);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Create/Edit Template */}
            <div className="border rounded-lg p-4">
              {selectedTemplate ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">Edit Template</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input 
                        value={selectedTemplate.name}
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <Input 
                        value={selectedTemplate.subject}
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Header Text</label>
                      <Textarea 
                        value={selectedTemplate.header_text || ''}
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, header_text: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Footer Text</label>
                      <Textarea 
                        value={selectedTemplate.footer_text || ''}
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, footer_text: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button onClick={() => setSelectedTemplate(null)}>Cancel</Button>
                      <Button onClick={handleUpdateTemplate}>Update Template</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-4">Create New Template</h3>
                  <form onSubmit={handleCreateTemplate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input 
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        placeholder="Weekly Newsletter"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <Input 
                        value={newTemplate.subject}
                        onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                        placeholder="Your Weekly Update from Automatizalo"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Header Text</label>
                      <Textarea 
                        value={newTemplate.header_text || ''}
                        onChange={(e) => setNewTemplate({...newTemplate, header_text: e.target.value})}
                        placeholder="Welcome to this week's newsletter!"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Footer Text</label>
                      <Textarea 
                        value={newTemplate.footer_text || ''}
                        onChange={(e) => setNewTemplate({...newTemplate, footer_text: e.target.value})}
                        placeholder="Thank you for subscribing to our newsletter!"
                        rows={3}
                      />
                    </div>
                    <Button type="submit">Create Template</Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Selection */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Select Template</h3>
              
              {loading.templates ? (
                <p>Loading templates...</p>
              ) : templates.length === 0 ? (
                <p>No templates created yet. Create a template first.</p>
              ) : (
                <div className="space-y-3">
                  {templates.map(template => (
                    <div 
                      key={template.id} 
                      className={`p-3 border rounded-md cursor-pointer ${
                        selectedTemplate?.id === template.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-500">{template.subject}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Template Content */}
            <div className="border rounded-lg p-4">
              {!selectedTemplate ? (
                <p>Select a template to manage its content</p>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Content for "{selectedTemplate.name}"
                  </h3>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Current Content Blocks</h4>
                    {templateContents.length === 0 ? (
                      <p className="text-sm text-gray-500">No content blocks added yet</p>
                    ) : (
                      <div className="space-y-3">
                        {templateContents.map(content => (
                          <div key={content.id} className="border rounded-md p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">{content.title}</h5>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteContent(content.id!)}
                              >
                                Delete
                              </Button>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: content.content }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Add New Content Block</h4>
                    <form onSubmit={handleAddContent} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input 
                          value={newContent.title}
                          onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                          placeholder="Content Block Title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <RichTextEditor
                          value={newContent.content}
                          onChange={(value) => setNewContent({...newContent, content: value})}
                          placeholder="Write your content here..."
                        />
                      </div>
                      <Button type="submit">Add Content Block</Button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Send Tab */}
        <TabsContent value="send" className="space-y-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Send Newsletter</h3>
            
            <form onSubmit={handleSendNewsletter} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={sendOptions.frequency}
                    onChange={(e) => setSendOptions({
                      ...sendOptions,
                      frequency: e.target.value as NewsletterFrequency
                    })}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Template (Optional)</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={sendOptions.templateId}
                    onChange={(e) => setSendOptions({
                      ...sendOptions,
                      templateId: e.target.value
                    })}
                  >
                    <option value="">Choose a template</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Custom Subject (Optional)
                </label>
                <Input 
                  value={sendOptions.customSubject}
                  onChange={(e) => setSendOptions({
                    ...sendOptions,
                    customSubject: e.target.value
                  })}
                  placeholder="Override template subject"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Custom Content (Optional)
                </label>
                <RichTextEditor
                  value={sendOptions.customContent}
                  onChange={(value) => setSendOptions({
                    ...sendOptions,
                    customContent: value
                  })}
                  placeholder="Add custom content to the newsletter..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="test-mode"
                  checked={sendOptions.testMode}
                  onChange={(e) => setSendOptions({
                    ...sendOptions,
                    testMode: e.target.checked
                  })}
                  className="h-4 w-4"
                />
                <label htmlFor="test-mode" className="text-sm font-medium">
                  Test Mode (Send to single email)
                </label>
              </div>
              
              {sendOptions.testMode && (
                <div>
                  <label className="block text-sm font-medium mb-1">Test Email</label>
                  <Input 
                    type="email"
                    value={sendOptions.testEmail}
                    onChange={(e) => setSendOptions({
                      ...sendOptions,
                      testEmail: e.target.value
                    })}
                    placeholder="email@example.com"
                    required
                  />
                </div>
              )}
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading.sendNewsletter}
                  className="w-full"
                >
                  {loading.sendNewsletter 
                    ? 'Sending...' 
                    : `${sendOptions.testMode ? 'Send Test' : 'Send'} ${sendOptions.frequency} Newsletter`}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Newsletter History</h3>
            
            {loading.history ? (
              <p>Loading history...</p>
            ) : history.length === 0 ? (
              <p>No newsletters have been sent yet</p>
            ) : (
              <div className="space-y-4">
                {history.map(item => (
                  <div key={item.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{item.subject}</h4>
                      <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                        {item.frequency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Sent on {new Date(item.sent_at).toLocaleString()} to {item.recipient_count} recipients
                    </p>
                    <div className="mt-4">
                      <details>
                        <summary className="cursor-pointer text-sm font-medium">
                          View Content
                        </summary>
                        <div className="mt-2 p-3 border rounded bg-gray-50">
                          <div dangerouslySetInnerHTML={{ __html: item.content }} />
                        </div>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterManager;
