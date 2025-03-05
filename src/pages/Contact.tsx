
import { useState } from "react";
import { Phone, Mail, MapPin, Globe, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to a server
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    // Show success message to user
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our AI solutions? Need help automating your business processes? 
              We're here to help you transform your ideas into reality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-gray-200 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-200 p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <p className="text-gray-600">contact@automatizalo.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-200 p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Location</h3>
                    <p className="text-gray-600">123 AI Boulevard, Tech District<br />San Francisco, CA 94105</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-200 p-3 rounded-full mr-4">
                    <Globe className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Website</h3>
                    <p className="text-gray-600">www.automatizalo.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Connect with us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://wa.me/15551234567" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button variant="outline" className="border-gray-300 bg-white hover:bg-gray-100">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <Button type="submit" className="w-full py-3 bg-gray-900 hover:bg-gray-800">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
