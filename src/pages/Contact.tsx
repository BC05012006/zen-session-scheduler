
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, MessageSquare, MapPin } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="zen-container">
          <h1 className="text-3xl font-bold mb-8 gradient-text">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="BASIL CHRIST"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="727823tuec022@skct.edu.in"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        rows={5}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-meditation-purple hover:bg-meditation-dark-purple"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <div className="zen-card flex">
                <div className="mr-4 text-meditation-purple">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-muted-foreground mt-1">
                    <a href="mailto:727823tuec022@skct.edu.in" className="hover:text-meditation-purple">
                      727823tuec022@skct.edu.in
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="zen-card flex">
                <div className="mr-4 text-meditation-purple">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-muted-foreground mt-1">
                    Available Monday to Friday, 9am to 5pm PST
                  </p>
                </div>
              </div>
              
              <div className="zen-card flex">
                <div className="mr-4 text-meditation-purple">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Visit Us</h3>
                  <p className="text-muted-foreground mt-1">
                    123 Meditation Street<br />
                    Mindful City, MC 98765<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium">How do I get started?</h4>
                    <p className="text-muted-foreground">
                      Create an account, then visit your dashboard to schedule your first session.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Is there a mobile app?</h4>
                    <p className="text-muted-foreground">
                      We're working on mobile apps for iOS and Android. Stay tuned!
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Can I use ZenMind for free?</h4>
                    <p className="text-muted-foreground">
                      Yes, ZenMind offers a free tier with essential features for your meditation practice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
