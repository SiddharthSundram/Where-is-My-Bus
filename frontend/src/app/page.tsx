"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProfessionalBackground from "@/components/professional-background";
import { CSSShuttleBackground } from "@/components/shuttle-background";
import { 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight, 
  ScaleIn, 
  RotateIn, 
  BounceIn,
  StaggeredContainer
} from "@/components/smooth-3d-scroll";

import { 
  FaBus, 
  FaRoute, 
  FaBrain, 
  FaBell, 
  FaTicketAlt, 
  FaSearch, 
  FaChartLine,
  FaChevronDown,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaStar,
  FaArrowRight,
  FaWifi,
  FaShieldAlt,
  FaBolt,
  FaCity,
  FaMobileAlt,
  FaGlobeAsia
} from "react-icons/fa";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const features = [
    {
      icon: FaRoute,
      title: "Live Tracking",
      description: "Real-time bus positions with intelligent route optimization",
      gradient: "gradient-primary-luxe",
      backDescription: "Experience real-time bus tracking with advanced AI-powered route optimization and accurate ETA predictions.",
      backAction: "Explore Now"
    },
    {
      icon: FaBrain,
      title: "AI Predictions",
      description: "Machine learning algorithms with 95% accuracy",
      gradient: "gradient-ocean-violet",
      backDescription: "Our AI analyzes traffic patterns, weather, and historical data for highly accurate arrival predictions.",
      backAction: "Try AI"
    },
    {
      icon: FaBell,
      title: "Smart Notifications",
      description: "Real-time alerts for arrivals, delays, and changes",
      gradient: "gradient-primary-luxe",
      backDescription: "Customize your notification preferences and never miss your bus with intelligent alert systems.",
      backAction: "Set Alerts"
    },
    {
      icon: FaTicketAlt,
      title: "Digital Tickets",
      description: "Instant mobile ticketing with secure payments",
      gradient: "gradient-amber-edge",
      backDescription: "Skip the queue and buy tickets directly from your phone with enterprise-grade security.",
      backAction: "Buy Now"
    }
  ];

  const stats = [
    { number: "50+", label: "Cities Covered", icon: FaMapMarkerAlt },
    { number: "10K+", label: "Buses Tracked", icon: FaBus },
    { number: "5M+", label: "Happy Users", icon: FaUsers },
    { number: "99%", label: "Accuracy Rate", icon: FaStar }
  ];

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Ahmedabad", "Jaipur", "Chandigarh"
  ];

  const ticketFeatures = [
    {
      icon: FaMobileAlt,
      title: "Mobile Tickets",
      description: "Buy and store tickets directly on your phone. No need to print or carry physical tickets."
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payments",
      description: "Multiple payment options with end-to-end encryption for your security and peace of mind."
    },
    {
      icon: FaBolt,
      title: "Instant Confirmation",
      description: "Get your tickets instantly after purchase. No waiting, no hassle."
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
  

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Professional Background */}
        <div className="absolute inset-0 gradient-calm-horizon z-0"></div>
        <div className="hero-overlay"></div>
        
        {/* Shuttle Background Animation */}
        <CSSShuttleBackground />
        
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <BounceIn delay={200} className="transform-3d-full">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient-luxe animate-text-3d-float text-enhanced text-center">
                Where is My Bus
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-3xl mx-auto leading-relaxed text-enhanced animate-text-3d-wave text-center">
                Real-time bus tracking across Indian cities
              </p>
            </div>
          </BounceIn>
          
          <StaggeredContainer staggerDelay={150} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="btn-premium text-white font-semibold px-8 py-4 text-lg shadow-lg transform-3d-full btn-enhanced hover-3d-button">
              <Link href="/find">
                <FaSearch className="mr-2" />
                Find My Bus
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="transform hover:scale-105 transition-all duration-300 border-2 border-border hover:border-primary/50 bg-surface/5 hover:bg-surface/10 text-foreground px-8 py-4 text-lg hover:shadow-lg transform-3d-full btn-enhanced hover-3d-button">
              <Link href="/optimizer">
                <FaRoute className="mr-2" />
                Optimize Route
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="transform hover:scale-105 transition-all duration-300 bg-surface hover:bg-surface-elevated border-border text-primary px-8 py-4 text-lg hover:shadow-lg transform-3d-full btn-enhanced hover-3d-button">
              <Link href="/support">
                <FaBrain className="mr-2" />
                AI Support
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="transform hover:scale-105 transition-all duration-300 border-2 border-border hover:border-primary/50 bg-surface/5 hover:bg-surface/10 text-foreground px-8 py-4 text-lg hover:shadow-lg transform-3d-full btn-enhanced hover-3d-button">
              <Link href="/analytics">
                <FaChartLine className="mr-2" />
                Analytics
              </Link>
            </Button>
          </StaggeredContainer>

          {/* Stats Section */}
          <StaggeredContainer staggerDelay={100} className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, index) => (
              <ScaleIn key={index} delay={800 + index * 100}>
                <div className="text-center group transform-3d-full hover-3d-card bg-surface/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 rounded-full gradient-primary-luxe flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl transform-3d-full hover-3d-lift">
                      <stat.icon className="text-2xl text-white drop-shadow-lg" />
                    </div>
                    <div className="absolute -inset-3 bg-primary/20 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gradient-primary animate-text-3d-pulse text-enhanced mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300 text-enhanced leading-relaxed">
                    {stat.label}
                  </div>
                </div>
              </ScaleIn>
            ))}
          </StaggeredContainer>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover-3d-link">
            <FaChevronDown className="text-3xl" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-surface z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="mb-8">
              <h2 className="text-4xl md:text-6xl font-bold text-gradient-luxe text-enhanced mb-4 text-center">
                Features
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground opacity-90 font-normal text-center">
                Smart transportation solutions for modern cities
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index}>
                <Card className="h-full group-hover:shadow-2xl transition-all duration-500 border-border hover:border-primary/30 transform hover:-translate-y-2 bg-surface hover:shadow-xl card-enhanced hover-3d-card">
                  <CardHeader className="text-center">
                    <div className={`w-24 h-24 rounded-2xl ${feature.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl transform-3d-full hover-3d-lift`}>
                      <feature.icon className="text-5xl text-white drop-shadow-lg" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gradient-primary text-enhanced mb-3">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-center leading-relaxed text-muted-foreground text-enhanced text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button className="w-full btn-premium text-white font-semibold shadow-lg hover:shadow-xl transform-3d-full btn-enhanced hover-3d-button">
                      {feature.backAction}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-surface z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="mb-8">
              <h2 className="text-4xl md:text-6xl font-bold text-gradient-luxe text-enhanced mb-4 text-center">
                Cities
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground opacity-90 font-normal text-center">
                Available across major Indian cities
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {cities.map((city, index) => (
              <div key={index}>
                <Card className="h-full group-hover:shadow-xl transition-all duration-500 border-border hover:border-brand-secondary/30 transform hover:-translate-y-2 bg-surface hover:shadow-lg card-enhanced hover-3d-card">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full gradient-primary-luxe flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl transform-3d-full hover-3d-lift">
                      <FaCity className="text-2xl text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gradient-primary group-hover:text-primary transition-colors duration-300 text-enhanced">
                      {city}
                    </h3>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticket System Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-surface z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="mb-8">
              <h2 className="text-4xl md:text-6xl font-bold text-gradient-luxe text-enhanced mb-4 text-center">
                Digital Tickets
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground opacity-90 font-normal text-center">
                Convenient mobile ticketing system
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ticketFeatures.map((feature, index) => (
              <div key={index}>
                <Card className="h-full group-hover:shadow-xl transition-all duration-500 border-border hover:border-brand-accent/30 transform hover:-translate-y-2 bg-surface hover:shadow-lg card-enhanced hover-3d-card">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 rounded-2xl gradient-amber-edge flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl transform-3d-full hover-3d-rotate">
                      <feature.icon className="text-4xl text-white drop-shadow-lg" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gradient-primary text-enhanced mb-3">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-center leading-relaxed text-muted-foreground text-enhanced text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}