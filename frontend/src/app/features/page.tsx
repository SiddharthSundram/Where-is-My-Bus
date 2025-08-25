"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FaRoute, 
  FaBrain, 
  FaBell, 
  FaTicketAlt, 
  FaMapMarkerAlt, 
  FaClock,
  FaShieldAlt,
  FaBolt,
  FaUsers,
  FaChartLine,
  FaMobileAlt,
  FaSearch,
  FaArrowRight,
  FaPlay,
  FaStar,
  FaBus,
  FaCity,
  FaGlobeAsia
} from "react-icons/fa";

export default function FeaturesPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const coreFeatures = [
    {
      icon: FaRoute,
      title: "Live Tracking",
      description: "Real-time bus positions with intelligent route optimization",
      details: "Experience real-time bus tracking with advanced AI-powered route optimization and accurate ETA predictions.",
      gradient: "gradient-primary-luxe",
      benefits: ["Real-time updates", "Route optimization", "Accurate positioning", "Smooth animations"]
    },
    {
      icon: FaBrain,
      title: "AI Predictions",
      description: "Machine learning algorithms with 95% accuracy",
      details: "Our AI analyzes traffic patterns, weather, and historical data for highly accurate arrival predictions.",
      gradient: "gradient-ocean-violet",
      benefits: ["95% accuracy", "Traffic analysis", "Weather integration", "Continuous learning"]
    },
    {
      icon: FaBell,
      title: "Smart Notifications",
      description: "Real-time alerts for arrivals, delays, and changes",
      details: "Customize your notification preferences and never miss your bus with intelligent alert systems.",
      gradient: "gradient-primary-luxe",
      benefits: ["Real-time alerts", "Customizable preferences", "Route changes", "Delay notifications"]
    },
    {
      icon: FaTicketAlt,
      title: "Digital Tickets",
      description: "Instant mobile ticketing with secure payments",
      details: "Skip the queue and buy tickets directly from your phone with enterprise-grade security.",
      gradient: "gradient-amber-edge",
      benefits: ["Digital tickets", "Secure payments", "Multiple options", "Instant confirmation"]
    }
  ];

  const advancedFeatures = [
    {
      icon: FaMapMarkerAlt,
      title: "Interactive Maps",
      description: "Explore bus routes with our intelligent mapping system",
      details: "Navigate through cities with our interactive maps. Find stops, plan routes, and see real-time bus locations.",
      gradient: "gradient-ocean-violet",
      benefits: ["Interactive maps", "Route planning", "Stop finder", "Real-time overlay"]
    },
    {
      icon: FaClock,
      title: "Real-time Updates",
      description: "Live updates on bus positions and arrival times",
      details: "Stay informed with live updates on bus movements, traffic conditions, and accurate ETA calculations.",
      gradient: "gradient-primary-luxe",
      benefits: ["Live positions", "Traffic data", "ETA calculations", "Status updates"]
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payments",
      description: "Multiple payment options with enterprise-grade encryption",
      details: "Your transactions are protected with industry-standard encryption and security protocols.",
      gradient: "gradient-amber-edge",
      benefits: ["End-to-end encryption", "Multiple options", "Secure protocols", "Fraud protection"]
    },
    {
      icon: FaBolt,
      title: "Instant Confirmation",
      description: "Get your tickets instantly after purchase",
      details: "Receive your tickets immediately after successful payment. No more waiting for confirmations.",
      gradient: "gradient-primary-luxe",
      benefits: ["Instant delivery", "No waiting", "Digital storage", "Easy access"]
    }
  ];

  const additionalFeatures = [
    {
      icon: FaUsers,
      title: "User Profiles",
      description: "Personalized experience with user profiles and preferences",
      details: "Create your profile, save preferences, and enjoy a personalized experience tailored to your needs.",
      gradient: "gradient-primary-luxe",
      benefits: ["Personal profiles", "Preference saving", "Travel history", "Quick access"]
    },
    {
      icon: FaChartLine,
      title: "Analytics Dashboard",
      description: "Detailed analytics and insights for your travel patterns",
      details: "Track your travel patterns, view statistics, and get insights into your commuting habits.",
      gradient: "gradient-ocean-violet",
      benefits: ["Travel patterns", "Statistics", "Insights", "Commuting analysis"]
    },
    {
      icon: FaMobileAlt,
      title: "Mobile App",
      description: "Full-featured mobile app for on-the-go access",
      details: "Access all features on your mobile device with our dedicated app available for iOS and Android.",
      gradient: "gradient-amber-edge",
      benefits: ["Cross-platform", "Offline access", "Push notifications", "Mobile optimized"]
    },
    {
      icon: FaSearch,
      title: "Smart Search",
      description: "Intelligent search with autocomplete and suggestions",
      details: "Find buses, routes, and stops quickly with our intelligent search system that learns from your preferences.",
      gradient: "gradient-primary-luxe",
      benefits: ["Autocomplete", "Smart suggestions", "Quick results", "Preference learning"]
    }
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Daily Commuter",
      content: "The AI predictions are incredibly accurate. I never have to wait at the bus stop anymore!",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Student",
      content: "The 3D tracking feature is amazing. I can see exactly where my bus is in real-time.",
      rating: 5
    },
    {
      name: "Amit Kumar",
      role: "Business Professional",
      content: "The instant ticket booking has saved me so much time. Highly recommended!",
      rating: 5
    }
  ];

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="gradient-calm-horizon absolute inset-0 z-0"></div>
      <div className="hero-overlay"></div>
      
      {/* Hero Section */}
      <ParallaxContainer speed={0.3} className="relative py-20 px-4">
        {/* Shuttle Background Animation */}
        <CSSShuttleBackground />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <ScrollBounceIn delay={200}>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-gradient-luxe mb-4 text-center">
                Features
              </h1>
              <p className="text-xl text-muted-foreground font-normal leading-relaxed text-center">
                Smart transportation solutions for modern cities
              </p>
            </div>
          </ScrollBounceIn>
          
          <StaggeredAnimation staggerDelay={150} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Hover3D>
              <Button size="lg" asChild className="btn-premium text-white font-semibold px-8 py-4 text-lg btn-enhanced">
                <Link href="/find">
                  <FaSearch className="mr-2" />
                  Try Now
                </Link>
              </Button>
            </Hover3D>
            <Hover3D>
              <Button variant="outline" size="lg" asChild className="transform hover:scale-105 transition-all duration-300 border-2 border-border hover:border-primary/50 bg-surface/5 hover:bg-surface/10 text-foreground px-8 py-4 text-lg btn-enhanced">
                <Link href="/">
                  <FaArrowRight className="mr-2" />
                  Back to Home
                </Link>
              </Button>
            </Hover3D>
          </StaggeredAnimation>
        </div>
      </ParallaxContainer>

      {/* Features Tabs */}
      <ScrollFadeIn className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-surface z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollRotateIn direction="left" className="mb-16">
            <Tabs defaultValue="core" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-surface p-1 rounded-xl border-2 border-border/50 shadow-lg">
                <TabsTrigger value="core" className="data-[state=active]:btn-premium data-[state=active]:text-white transition-all duration-300 btn-enhanced font-semibold py-3 text-base">
                  Core Features
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:btn-premium data-[state=active]:text-white transition-all duration-300 btn-enhanced font-semibold py-3 text-base">
                  Advanced Features
                </TabsTrigger>
                <TabsTrigger value="additional" className="data-[state=active]:btn-premium data-[state=active]:text-white transition-all duration-300 btn-enhanced font-semibold py-3 text-base">
                  Additional Features
                </TabsTrigger>
              </TabsList>
            
            <TabsContent value="core" className="mt-12">
              <StaggeredAnimation staggerDelay={120} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {coreFeatures.map((feature, index) => (
                  <ScrollScaleIn key={index} delay={200 + index * 120}>
                    <Hover3D>
                      <Card className="h-full group-hover:shadow-2xl transition-all duration-500 border-border hover:border-primary/30 transform hover:-translate-y-2 bg-surface card-enhanced">
                        <CardHeader className="text-center">
                          <div className={`w-24 h-24 rounded-2xl ${feature.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg transform-3d-full`}>
                            <feature.icon className="text-5xl text-white drop-shadow-lg" />
                          </div>
                          <CardTitle className="text-xl font-bold text-gradient-primary text-enhanced">
                            {feature.title}
                          </CardTitle>
                          <CardDescription className="text-center leading-relaxed text-enhanced">
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4 leading-relaxed text-enhanced">
                            {feature.details}
                          </p>
                          <div className="space-y-2 mb-4">
                            <h4 className="font-semibold text-sm text-foreground text-enhanced">Key Benefits:</h4>
                            <ul className="space-y-1">
                              {feature.benefits.slice(0, 3).map((benefit, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-center text-enhanced">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button className="w-full btn-premium text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-enhanced">
                            <FaPlay className="mr-2" />
                            Try Feature
                          </Button>
                        </CardContent>
                      </Card>
                    </Hover3D>
                  </ScrollScaleIn>
                ))}
              </StaggeredAnimation>
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-12">
              <StaggeredAnimation staggerDelay={150} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {advancedFeatures.map((feature, index) => (
                  <ScrollBounceIn key={index} delay={250 + index * 150}>
                    <Hover3D>
                      <Card className="h-full group-hover:shadow-2xl transition-all duration-500 border-border hover:border-brand-subtle/30 transform hover:-translate-y-2 bg-surface card-enhanced">
                        <CardHeader className="text-center">
                          <div className={`w-24 h-24 rounded-2xl ${feature.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg transform-3d-full`}>
                            <feature.icon className="text-5xl text-white drop-shadow-lg" />
                          </div>
                          <CardTitle className="text-xl font-bold text-gradient-primary text-enhanced">
                            {feature.title}
                          </CardTitle>
                          <CardDescription className="text-center leading-relaxed text-enhanced">
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4 leading-relaxed text-enhanced">
                            {feature.details}
                          </p>
                          <div className="space-y-2 mb-4">
                            <h4 className="font-semibold text-sm text-foreground text-enhanced">Key Benefits:</h4>
                            <ul className="space-y-1">
                              {feature.benefits.slice(0, 3).map((benefit, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-center text-enhanced">
                                  <div className="w-1.5 h-1.5 bg-brand-subtle rounded-full mr-2"></div>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button className="w-full btn-premium text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-enhanced">
                            <FaPlay className="mr-2" />
                            Try Feature
                          </Button>
                        </CardContent>
                      </Card>
                    </Hover3D>
                  </ScrollBounceIn>
                ))}
              </StaggeredAnimation>
            </TabsContent>
            
            <TabsContent value="additional" className="mt-12">
              <StaggeredAnimation staggerDelay={100} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {additionalFeatures.map((feature, index) => (
                  <ScrollSlideIn key={index} direction="right" delay={300 + index * 100}>
                    <Hover3D>
                      <Card className="h-full group-hover:shadow-2xl transition-all duration-500 border-border hover:border-brand-accent/30 transform hover:-translate-y-2 bg-surface card-enhanced">
                        <CardHeader className="text-center">
                          <div className={`w-24 h-24 rounded-2xl ${feature.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg transform-3d-full`}>
                            <feature.icon className="text-5xl text-white drop-shadow-lg" />
                          </div>
                          <CardTitle className="text-xl font-bold text-gradient-primary text-enhanced">
                            {feature.title}
                          </CardTitle>
                          <CardDescription className="text-center leading-relaxed text-enhanced">
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4 leading-relaxed text-enhanced">
                            {feature.details}
                          </p>
                          <div className="space-y-2 mb-4">
                            <h4 className="font-semibold text-sm text-foreground text-enhanced">Key Benefits:</h4>
                            <ul className="space-y-1">
                              {feature.benefits.slice(0, 3).map((benefit, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-center text-enhanced">
                                  <div className="w-1.5 h-1.5 bg-brand-accent rounded-full mr-2"></div>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button className="w-full btn-premium text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-enhanced">
                            <FaPlay className="mr-2" />
                            Try Feature
                          </Button>
                        </CardContent>
                      </Card>
                    </Hover3D>
                  </ScrollSlideIn>
                ))}
              </StaggeredAnimation>
            </TabsContent>
          </Tabs>
          </ScrollRotateIn>
        </div>
      </ScrollFadeIn>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-8">
              <h2 className="text-4xl md:text-6xl font-bold text-gradient-luxe mb-4 text-center">
                User Reviews
              </h2>
              <p className="text-xl text-muted-foreground font-normal leading-relaxed text-center">
                What our users say about their experience
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 group bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm card-enhanced">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 drop-shadow-sm" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 leading-relaxed text-enhanced">
                      "{testimonial.content}"
                    </p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3 shadow-lg animate-professional-float">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-enhanced">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground text-enhanced">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 z-0"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-bold text-gradient-luxe mb-4 text-center">
              Get Started Today
            </h2>
            <p className="text-xl text-muted-foreground font-normal leading-relaxed text-center">
              Experience the future of public transportation
            </p>
          </div>
            
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div>
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl text-white font-semibold px-8 py-4 text-lg btn-enhanced">
                  <Link href="/signup">
                    <FaBus className="mr-2" />
                    Get Started Free
                  </Link>
                </Button>
            </div>
            <div>
                <Button variant="outline" size="lg" asChild className="transform hover:scale-105 transition-all duration-300 border-2 border-blue-500/30 hover:border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10 text-blue-300 px-8 py-4 text-lg btn-enhanced">
                  <Link href="/find">
                    <FaSearch className="mr-2" />
                    Find Your Bus
                  </Link>
                </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}