import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";

const ContentManager = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("home");

  const [homeContent, setHomeContent] = useState({
    heroImage: "/path/to/hero-image.jpg",
    heroTitle: "Stop wasting time on repetitive tasks",
    heroDescription: "Automatízalo brings cutting-edge AI and automation tools to help you work smarter, grow faster, and stay ahead of the future.",
    aboutImage: "/path/to/about-image.jpg",
    aboutTitle: "We're Building the Future of AI Automation",
    aboutDescription: "At Automatízalo, we're a team of young, passionate AI specialists and automation experts. We connect, fine-tune, and optimize automation tools like Make.com, N8N, AI chatbots, and custom workflows to help businesses and individuals become more efficient, scalable, and future-ready."
  });

  const [solutionsContent, setSolutionsContent] = useState({
    headerImage: "/path/to/solutions-header.jpg",
    title: "Our Solutions",
    subtitle: "Transforming businesses through AI and automation",
    solution1Image: "/path/to/solution1.jpg",
    solution1Title: "AI Chatbots",
    solution1Description: "Create smart, conversational chatbots that understand customer needs.",
    solution2Image: "/path/to/solution2.jpg",
    solution2Title: "Workflow Automation",
    solution2Description: "Connect all your tools and automate repetitive tasks across your business."
  });

  const [contactContent, setContactContent] = useState({
    phone: "+1 (555) 123-4567",
    email: "contact@automatizalo.co",
    address: "123 AI Boulevard, Tech District, San Francisco, CA 94105",
    website: "https://automatizalo.co"
  });

  const [footerContent, setFooterContent] = useState({
    description: "We help businesses leverage automation technologies to grow and scale efficiently.",
    company: "Company",
    about: "About Us",
    blog: "Blog",
    contact: "Contact",
    solutions: "Solutions",
    chatbots: "Chatbots",
    leadGeneration: "Lead Generation",
    socialMedia: "Social Media",
    aiAgents: "AI Agents",
    contactUs: "Contact Us",
    phone: "+1 (555) 123-4567",
    email: "contact@automatizalo.co",
    address: "123 AI Boulevard, Tech District, San Francisco, CA 94105",
    website: "https://automatizalo.co",
    allRightsReserved: "All rights reserved."
  });

  useEffect(() => {
    try {
      const savedHomeContent = localStorage.getItem('homeContent');
      const savedSolutionsContent = localStorage.getItem('solutionsContent');
      const savedContactContent = localStorage.getItem('contactContent');
      const savedFooterContent = localStorage.getItem('footerContent');
      
      if (savedHomeContent) {
        setHomeContent(JSON.parse(savedHomeContent));
      }
      
      if (savedSolutionsContent) {
        setSolutionsContent(JSON.parse(savedSolutionsContent));
      }
      
      if (savedContactContent) {
        setContactContent(JSON.parse(savedContactContent));
      }

      if (savedFooterContent) {
        setFooterContent(JSON.parse(savedFooterContent));
      }
    } catch (error) {
      console.error("Error loading saved content:", error);
    }
  }, []);

  const handleHomeContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHomeContent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSolutionsContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSolutionsContent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleContactContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactContent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFooterContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFooterContent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        if (section === "home") {
          setHomeContent(prev => ({
            ...prev,
            [field]: reader.result as string
          }));
        } else if (section === "solutions") {
          setSolutionsContent(prev => ({
            ...prev,
            [field]: reader.result as string
          }));
        } else if (section === "contact") {
          setContactContent(prev => ({
            ...prev,
            [field]: reader.result as string
          }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSaveContent = (section: string) => {
    try {
      if (section === "home") {
        localStorage.setItem('homeContent', JSON.stringify(homeContent));
      } else if (section === "solutions") {
        localStorage.setItem('solutionsContent', JSON.stringify(solutionsContent));
      } else if (section === "contact") {
        localStorage.setItem('contactContent', JSON.stringify(contactContent));
      } else if (section === "footer") {
        localStorage.setItem('footerContent', JSON.stringify(footerContent));
      }
      
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} content updated successfully!`);
    } catch (error) {
      console.error(`Error saving ${section} content:`, error);
      toast.error(`Failed to save ${section} content. Please try again.`);
    }
  };

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.error("Please login to access the content manager");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold">Content Manager</h1>
            <p className="text-gray-600 mt-2">Edit website content and images</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="home">Home Page</TabsTrigger>
              <TabsTrigger value="solutions">Solutions Page</TabsTrigger>
              <TabsTrigger value="contact">Contact Page</TabsTrigger>
              <TabsTrigger value="footer">Footer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="home">
              <Card>
                <CardHeader>
                  <CardTitle>Home Page Content</CardTitle>
                  <CardDescription>Update the content for your home page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="heroImage">Hero Image</Label>
                      <div className="flex mt-1 items-center gap-4">
                        {homeContent.heroImage && (
                          <div className="w-32 h-24 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={homeContent.heroImage} 
                              alt="Hero" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <Input
                          id="heroImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "home", "heroImage")}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="heroTitle">Hero Title</Label>
                      <Input
                        id="heroTitle"
                        name="heroTitle"
                        value={homeContent.heroTitle}
                        onChange={handleHomeContentChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="heroDescription">Hero Description</Label>
                      <Textarea
                        id="heroDescription"
                        name="heroDescription"
                        value={homeContent.heroDescription}
                        rows={3}
                        onChange={handleHomeContentChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="aboutImage">About Section Image</Label>
                      <div className="flex mt-1 items-center gap-4">
                        {homeContent.aboutImage && (
                          <div className="w-32 h-24 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={homeContent.aboutImage} 
                              alt="About" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <Input
                          id="aboutImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "home", "aboutImage")}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="aboutTitle">About Section Title</Label>
                      <Input
                        id="aboutTitle"
                        name="aboutTitle"
                        value={homeContent.aboutTitle}
                        onChange={handleHomeContentChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="aboutDescription">About Section Description</Label>
                      <Textarea
                        id="aboutDescription"
                        name="aboutDescription"
                        value={homeContent.aboutDescription}
                        rows={4}
                        onChange={handleHomeContentChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveContent("home")} className="ml-auto">
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="solutions">
              <Card>
                <CardHeader>
                  <CardTitle>Solutions Page Content</CardTitle>
                  <CardDescription>Update the content for your solutions page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="headerImage">Header Image</Label>
                      <div className="flex mt-1 items-center gap-4">
                        {solutionsContent.headerImage && (
                          <div className="w-32 h-24 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={solutionsContent.headerImage} 
                              alt="Solutions Header" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <Input
                          id="headerImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "solutions", "headerImage")}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="title">Page Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={solutionsContent.title}
                        onChange={handleSolutionsContentChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subtitle">Page Subtitle</Label>
                      <Input
                        id="subtitle"
                        name="subtitle"
                        value={solutionsContent.subtitle}
                        onChange={handleSolutionsContentChange}
                      />
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-3">Solution 1</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="solution1Image">Image</Label>
                          <div className="flex mt-1 items-center gap-4">
                            {solutionsContent.solution1Image && (
                              <div className="w-32 h-24 bg-gray-100 rounded-md overflow-hidden">
                                <img 
                                  src={solutionsContent.solution1Image} 
                                  alt="Solution 1" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <Input
                              id="solution1Image"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, "solutions", "solution1Image")}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="solution1Title">Title</Label>
                          <Input
                            id="solution1Title"
                            name="solution1Title"
                            value={solutionsContent.solution1Title}
                            onChange={handleSolutionsContentChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="solution1Description">Description</Label>
                          <Textarea
                            id="solution1Description"
                            name="solution1Description"
                            value={solutionsContent.solution1Description}
                            rows={3}
                            onChange={handleSolutionsContentChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-3">Solution 2</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="solution2Image">Image</Label>
                          <div className="flex mt-1 items-center gap-4">
                            {solutionsContent.solution2Image && (
                              <div className="w-32 h-24 bg-gray-100 rounded-md overflow-hidden">
                                <img 
                                  src={solutionsContent.solution2Image} 
                                  alt="Solution 2" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <Input
                              id="solution2Image"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, "solutions", "solution2Image")}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="solution2Title">Title</Label>
                          <Input
                            id="solution2Title"
                            name="solution2Title"
                            value={solutionsContent.solution2Title}
                            onChange={handleSolutionsContentChange}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="solution2Description">Description</Label>
                          <Textarea
                            id="solution2Description"
                            name="solution2Description"
                            value={solutionsContent.solution2Description}
                            rows={3}
                            onChange={handleSolutionsContentChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveContent("solutions")} className="ml-auto">
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Page Content</CardTitle>
                  <CardDescription>Update your contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={contactContent.phone}
                        onChange={handleContactContentChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        value={contactContent.email}
                        onChange={handleContactContentChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Office Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={contactContent.address}
                        rows={2}
                        onChange={handleContactContentChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        value={contactContent.website}
                        onChange={handleContactContentChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveContent("contact")} className="ml-auto">
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="footer">
              <Card>
                <CardHeader>
                  <CardTitle>Footer Content</CardTitle>
                  <CardDescription>Update the content that appears in the footer across all pages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Footer Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={footerContent.description}
                        rows={3}
                        onChange={handleFooterContentChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Company Section Title</Label>
                        <Input
                          id="company"
                          name="company"
                          value={footerContent.company}
                          onChange={handleFooterContentChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="solutions">Solutions Section Title</Label>
                        <Input
                          id="solutions"
                          name="solutions"
                          value={footerContent.solutions}
                          onChange={handleFooterContentChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="about">About Link Text</Label>
                        <Input
                          id="about"
                          name="about"
                          value={footerContent.about}
                          onChange={handleFooterContentChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="blog">Blog Link Text</Label>
                        <Input
                          id="blog"
                          name="blog"
                          value={footerContent.blog}
                          onChange={handleFooterContentChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contact">Contact Link Text</Label>
                        <Input
                          id="contact"
                          name="contact"
                          value={footerContent.contact}
                          onChange={handleFooterContentChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="chatbots">Chatbots Link Text</Label>
                        <Input
                          id="chatbots"
                          name="chatbots"
                          value={footerContent.chatbots}
                          onChange={handleFooterContentChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="leadGeneration">Lead Generation Link Text</Label>
                        <Input
                          id="leadGeneration"
                          name="leadGeneration"
                          value={footerContent.leadGeneration}
                          onChange={handleFooterContentChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="socialMedia">Social Media Link Text</Label>
                        <Input
                          id="socialMedia"
                          name="socialMedia"
                          value={footerContent.socialMedia}
                          onChange={handleFooterContentChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="aiAgents">AI Agents Link Text</Label>
                        <Input
                          id="aiAgents"
                          name="aiAgents"
                          value={footerContent.aiAgents}
                          onChange={handleFooterContentChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="contactUs">Contact Us Section Title</Label>
                      <Input
                        id="contactUs"
                        name="contactUs"
                        value={footerContent.contactUs}
                        onChange={handleFooterContentChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={footerContent.phone}
                          onChange={handleFooterContentChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          value={footerContent.email}
                          onChange={handleFooterContentChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={footerContent.address}
                        rows={2}
                        onChange={handleFooterContentChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="website">Website URL</Label>
                      <Input
                        id="website"
                        name="website"
                        value={footerContent.website}
                        onChange={handleFooterContentChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="allRightsReserved">Copyright Text</Label>
                      <Input
                        id="allRightsReserved"
                        name="allRightsReserved"
                        value={footerContent.allRightsReserved}
                        onChange={handleFooterContentChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveContent("footer")} className="ml-auto">
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentManager;
