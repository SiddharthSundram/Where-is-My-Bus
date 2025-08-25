"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CSSShuttleBackground } from "@/components/shuttle-background";
import { 
  EnhancedScrollAnimation, 
  ScrollSlideIn, 
  ScrollFadeIn, 
  ScrollScaleIn
} from "@/components/enhanced-scroll-animation";
import { 
  FaSitemap, 
  FaHome, 
  FaBus, 
  FaUser, 
  FaCog, 
  FaQuestionCircle,
  FaShieldAlt,
  FaFileAlt,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaChartLine,
  FaUsers,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
  FaChevronRight,
  FaHeadset,
  FaSearch
} from "react-icons/fa";

export default function SitemapPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const siteStructure = [
    {
      title: "Main Pages",
      icon: FaHome,
      color: "text-green-600",
      links: [
        { href: "/", label: "Home", description: "Main landing page" },
        { href: "/features", label: "Features", description: "App features and capabilities" },
        { href: "/about", label: "About Us", description: "Company information" },
        { href: "/contact", label: "Contact Us", description: "Get in touch with us" },
      ]
    },
    {
      title: "User Services",
      icon: FaBus,
      color: "text-blue-600",
      links: [
        { href: "/find", label: "Find My Bus", description: "Track your bus in real-time" },
        { href: "/tickets", label: "My Tickets", description: "View and manage your tickets" },
        { href: "/journey", label: "Journey Planner", description: "Plan your route" },
        { href: "/optimizer", label: "Route Optimizer", description: "Find the best route" },
      ]
    },
    {
      title: "Account & Profile",
      icon: FaUser,
      color: "text-purple-600",
      links: [
        { href: "/login", label: "Login", description: "Sign in to your account" },
        { href: "/signup", label: "Sign Up", description: "Create a new account" },
        { href: "/profile", label: "Profile", description: "Manage your profile" },
        { href: "/settings", label: "Settings", description: "App preferences" },
      ]
    },
    {
      title: "Support & Help",
      icon: FaQuestionCircle,
      color: "text-orange-600",
      links: [
        { href: "/support", label: "Support Center", description: "Get help and support" },
        { href: "/faq", label: "FAQ", description: "Frequently asked questions" },
        { href: "/contact", label: "Contact Us", description: "Reach out to us" },
        { href: "/help", label: "Help Center", description: "Comprehensive help guide" },
      ]
    },
    {
      title: "Legal & Policies",
      icon: FaShieldAlt,
      color: "text-red-600",
      links: [
        { href: "/terms", label: "Terms of Service", description: "Website terms and conditions" },
        { href: "/privacy", label: "Privacy Policy", description: "How we protect your data" },
        { href: "/cookies", label: "Cookie Policy", description: "Cookie usage information" },
        { href: "/accessibility", label: "Accessibility", description: "Accessibility statement" },
      ]
    },
    {
      title: "Company",
      icon: FaInfoCircle,
      color: "text-teal-600",
      links: [
        { href: "/about", label: "About Us", description: "Company information" },
        { href: "/careers", label: "Careers", description: "Job opportunities" },
        { href: "/press", label: "Press", description: "Press releases and media" },
        { href: "/blog", label: "Blog", description: "Latest news and updates" },
      ]
    },
    {
      title: "Advanced Features",
      icon: FaChartLine,
      color: "text-indigo-600",
      links: [
        { href: "/analytics", label: "Analytics", description: "Travel analytics and insights" },
        { href: "/notifications", label: "Notifications", description: "Manage your alerts" },
        { href: "/loading-demo", label: "Loading Demo", description: "See our loading animations" },
        { href: "/api/health", label: "API Status", description: "System health status" },
      ]
    },
    {
      title: "Admin Panel",
      icon: FaCog,
      color: "text-gray-600",
      links: [
        { href: "/admin/dashboard", label: "Admin Dashboard", description: "Admin control panel" },
        { href: "/admin/analytics", label: "Admin Analytics", description: "System analytics" },
        { href: "/admin/manage/buses", label: "Manage Buses", description: "Bus management" },
        { href: "/admin/manage/routes", label: "Manage Routes", description: "Route management" },
        { href: "/admin/manage/users", label: "Manage Users", description: "User management" },
      ]
    }
  ];

  const quickLinks = [
    { href: "/", label: "Home", icon: FaHome },
    { href: "/features", label: "Features", icon: FaBus },
    { href: "/contact", label: "Contact", icon: FaEnvelope },
    { href: "/support", label: "Support", icon: FaQuestionCircle },
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
      <div className="relative py-20 px-4 bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-teal-900/20">
        <CSSShuttleBackground />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4 text-center">
              Sitemap
            </h1>
            <p className="text-xl text-muted-foreground font-normal leading-relaxed text-center">
              Navigate through all pages and features of Where is My Bus
            </p>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" size="lg" asChild className="btn-enhanced">
              <Link href="/">
                <FaArrowLeft className="mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-2xl font-bold text-center mb-8">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <ScrollScaleIn key={index} delay={index * 100}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 p-4 bg-card rounded-lg border hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <link.icon className="text-green-600" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </ScrollScaleIn>
              ))}
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Site Structure */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">Complete Site Structure</h2>
          </ScrollFadeIn>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {siteStructure.map((section, sectionIndex) => (
              <ScrollScaleIn key={sectionIndex} delay={sectionIndex * 100}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 card-enhanced">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <section.icon className={`w-8 h-8 ${section.color}`} />
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="block p-3 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200 group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm group-hover:text-green-600 transition-colors duration-200">
                                {link.label}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {link.description}
                              </p>
                            </div>
                            <FaChevronRight className="text-muted-foreground group-hover:text-green-600 transition-colors duration-200 text-xs mt-1" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <ScrollFadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Need Help Finding Something?</h2>
              <p className="text-muted-foreground">
                If you can't find what you're looking for, our support team is here to help you navigate our website.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Search</h3>
                <p className="text-sm text-muted-foreground">
                  Use our search feature to quickly find what you need
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaQuestionCircle className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">FAQ</h3>
                <p className="text-sm text-muted-foreground">
                  Check our FAQ section for common questions and answers
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeadset className="text-purple-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Support</h3>
                <p className="text-sm text-muted-foreground">
                  Contact our support team for personalized assistance
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <FaEnvelope className="mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </ScrollFadeIn>
        </div>
      </section>
    </div>
  );
}