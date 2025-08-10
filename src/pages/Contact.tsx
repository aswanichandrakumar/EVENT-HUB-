import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Users,
  Headphones
} from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // EmailJS configuration
    const SERVICE_ID = 'service_fw5xma6';
    const TEMPLATE_ID = 'template_o3r0nzb'; 
    const PUBLIC_KEY = 'BjLi7dZxZfDWkUO9-';
    
    const templateParams = {
      from_name: formData.fullName,
      from_email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      to_name: 'EventHub Support',
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('EmailJS error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@eventhub.com',
      availability: '24/7 Response'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with our team',
      contact: '+1 (555) 123-4567',
      availability: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with us instantly',
      contact: 'Available on website',
      availability: 'Mon-Fri, 9AM-9PM EST'
    }
  ];

  const supportAreas = [
    {
      icon: Users,
      title: 'Event Management',
      description: 'Help with organizing and managing your events'
    },
    {
      icon: Headphones,
      title: 'Technical Support',
      description: 'Assistance with platform features and troubleshooting'
    },
    {
      icon: MapPin,
      title: 'Partnership Inquiries',
      description: 'Explore collaboration opportunities with EventHub'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 animated-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Contact Us
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            We're Here to{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Help You
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions, need assistance, or want to partner with us for your next event? 
            Fill out the form below and our team will respond promptly.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the method that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {contactMethods.map((method, index) => (
              <div key={index} className="glass-card p-6 text-center hover:shadow-glow transition-all duration-300">
                <div className="bg-gradient-primary p-3 rounded-lg w-fit mx-auto mb-4">
                  <method.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {method.title}
                </h3>
                <p className="text-muted-foreground mb-3">
                  {method.description}
                </p>
                <p className="text-primary font-medium mb-1">
                  {method.contact}
                </p>
                <p className="text-sm text-muted-foreground">
                  {method.availability}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Support Areas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="mt-1 glass-card border-white/10"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-foreground">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 glass-card border-white/10"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 glass-card border-white/10"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-foreground">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-1 glass-card border-white/10"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-foreground">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="mt-1 glass-card border-white/10 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button type="submit" variant="gradient" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Support Areas */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  How Can We Help?
                </h2>
                
                <div className="space-y-6">
                  {supportAreas.map((area, index) => (
                    <div key={index} className="glass-card p-6 hover:shadow-glow transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-primary p-2 rounded-lg">
                          <area.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {area.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {area.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 text-primary mr-2" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Support Hours
                  </h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday:</span>
                    <span className="text-foreground">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday:</span>
                    <span className="text-foreground">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday:</span>
                    <span className="text-foreground">Closed</span>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email Support:</span>
                      <span className="text-primary">24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Need Quick Answers?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Check out our frequently asked questions for instant help
          </p>
          <Button variant="outline" size="lg">
            View FAQ
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Contact;