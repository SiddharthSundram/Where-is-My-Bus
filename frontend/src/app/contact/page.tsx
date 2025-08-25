"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { IndiaMap } from "@/components/india-map";
import { CSSShuttleBackground } from "@/components/shuttle-background";
import { 
  EnhancedScrollAnimation, 
  ScrollSlideIn, 
  ScrollFadeIn, 
  ScrollScaleIn, 
  ScrollRotateIn, 
  ScrollBounceIn,
  StaggeredAnimation,
  Hover3D,
  GlowEffect,
  ParallaxContainer
} from "@/components/enhanced-scroll-animation";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPaperPlane,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaCheckCircle
} from "react-icons/fa";

export default function ContactPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email Us",
      value: "support@whereismybus.com",
      description: "For general inquiries and support"
    },
    {
      icon: FaPhone,
      title: "Call Us",
      value: "+91 1800-123-4567",
      description: "Monday to Saturday, 9 AM to 6 PM"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      value: "Kolkata, West Bengal, India",
      description: "Our headquarters location"
    },
    {
      icon: FaClock,
      title: "Business Hours",
      value: "9:00 AM - 6:00 PM",
      description: "Monday through Saturday"
    }
  ];

  const faqs = [
    {
      question: "How do I track my bus in real-time?",
      answer: "Simply enter your bus number or route in our app, and you'll see real-time location updates on the map."
    },
    {
      question: "Is the app available for both iOS and Android?",
      answer: "Yes, our app is available for both iOS and Android devices. You can download it from the respective app stores."
    },
    {
      question: "How accurate are the arrival time predictions?",
      answer: "Our AI-powered predictions are 95% accurate, taking into account traffic, weather, and historical data."
    },
    {
      question: "Can I book tickets through the app?",
      answer: "Yes, you can purchase digital tickets instantly through our app with multiple payment options."
    },
    {
      question: "What cities do you currently serve?",
      answer: "We currently serve 50+ major cities across India, including Mumbai, Delhi, Bangalore, Chennai, and more."
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" }
  ];

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ParallaxContainer speed={0.3} className="relative py-20 px-4 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20">
        {/* Shuttle Background Animation */}
        <CSSShuttleBackground />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <ScrollBounceIn delay={200}>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 text-center">
                Contact Us
              </h1>
              <p className="text-xl text-muted-foreground font-normal leading-relaxed text-center">
                Get in touch with us for any questions or support
              </p>
            </div>
          </ScrollBounceIn>
        </div>
      </ParallaxContainer>

      {/* Contact Info Section */}
      <ScrollFadeIn className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <StaggeredAnimation staggerDelay={100} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <ScrollScaleIn key={index} delay={200 + index * 100}>
                <Hover3D>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 card-enhanced">
                    <CardContent className="pt-6">
                      <info.icon className="w-12 h-12 mx-auto mb-4 text-primary animate-professional-float" />
                      <h3 className="text-lg font-bold mb-2 text-enhanced">{info.title}</h3>
                      <p className="text-primary font-medium mb-1 text-enhanced">{info.value}</p>
                      <p className="text-muted-foreground text-sm text-enhanced">{info.description}</p>
                    </CardContent>
                  </Card>
                </Hover3D>
              </ScrollScaleIn>
            ))}
          </StaggeredAnimation>
        </div>
      </ScrollFadeIn>

      {/* Contact Form Section */}
      <ScrollSlideIn direction="up" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollSlideIn direction="left">
              <div>
                <Card className="card-enhanced">
                  <CardHeader>
                    <div className="text-center mb-4">
                      <CardTitle className="text-2xl mb-2 text-center">Send us a Message</CardTitle>
                      <CardDescription className="text-center">
                        Fill out the form below and we'll get back to you as soon as possible
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-professional-float" />
                        <h3 className="text-xl font-bold mb-2 text-enhanced">Message Sent Successfully!</h3>
                        <p className="text-muted-foreground mb-4 text-enhanced">
                          Thank you for contacting us. We'll get back to you within 24 hours.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} className="btn-enhanced">
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name" className="text-enhanced">Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Your full name"
                              className="focus-enhanced"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-enhanced">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="your@email.com"
                              className="focus-enhanced"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="subject" className="text-enhanced">Subject *</Label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="How can we help you?"
                            className="focus-enhanced"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message" className="text-enhanced">Message *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell us more about your inquiry..."
                            rows={5}
                            className="focus-enhanced"
                          />
                        </div>
                        <Button type="submit" className="w-full btn-enhanced" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <FaPaperPlane className="mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollSlideIn>

            {/* FAQ Section */}
            <ScrollSlideIn direction="right">
              <div>
                <Card className="card-enhanced">
                  <CardHeader>
                    <div className="text-center mb-4">
                      <CardTitle className="text-2xl mb-2 text-center">Frequently Asked Questions</CardTitle>
                      <CardDescription className="text-center">
                        Quick answers to common questions about our service
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <StaggeredAnimation staggerDelay={100} className="space-y-6">
                      {faqs.map((faq, index) => (
                        <ScrollScaleIn key={index} delay={200 + index * 100}>
                          <div className="border-b border-border pb-4 last:border-0 transform-3d-full">
                            <h3 className="font-semibold mb-2 text-enhanced">{faq.question}</h3>
                            <p className="text-muted-foreground text-sm text-enhanced">{faq.answer}</p>
                          </div>
                        </ScrollScaleIn>
                      ))}
                    </StaggeredAnimation>
                  </CardContent>
                </Card>
              </div>
            </ScrollSlideIn>
          </div>
        </div>
      </ScrollSlideIn>

      {/* Social Media Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 text-center">
              Connect With Us
            </h2>
            <p className="text-xl text-muted-foreground font-normal text-center">
              Follow us on social media for updates, tips, and community discussions
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 text-center">
                Find Us
              </h2>
              <p className="text-xl text-muted-foreground font-normal text-center">
                Our headquarters in Kolkata and service coverage across India
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100">
                <div className="h-96 lg:h-[500px]">
                  <IndiaMap />
                </div>
              </div>
            </div>
            
            {/* Location Info */}
            <div className="space-y-6">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span>Headquarters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Kolkata Office</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Where is My Bus HQ<br />
                      Salt Lake City, Sector V<br />
                      Kolkata, West Bengal 700091<br />
                      India
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <FaPhone className="text-primary" />
                      <span>+91 1800-123-4567</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaEnvelope className="text-primary" />
                      <span>hq@whereismybus.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-green-600">Service Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-green-600">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Saturday</span>
                    <span className="text-green-600">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                  <div className="pt-2 border-t">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      24/7 Support Available
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-blue-600">Getting Here</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-sm">Nearest Metro</p>
                        <p className="text-muted-foreground text-xs">Salt Lake Sector V Station (300m)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-sm">Bus Stop</p>
                        <p className="text-muted-foreground text-xs">Sector V Bus Stand (150m)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-sm">Parking</p>
                        <p className="text-muted-foreground text-xs">Available on premises</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}