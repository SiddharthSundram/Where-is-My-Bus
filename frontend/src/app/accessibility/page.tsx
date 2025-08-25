"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CSSShuttleBackground } from "@/components/shuttle-background";
import { 
  EnhancedScrollAnimation, 
  ScrollSlideIn, 
  ScrollFadeIn, 
  ScrollScaleIn
} from "@/components/enhanced-scroll-animation";
import { 
  FaUniversalAccess, 
  FaEye, 
  FaKeyboard, 
  FaVolumeUp, 
  FaTextHeight,
  FaMoon,
  FaSun,
  FaWheelchair,
  FaBraille,
  FaSignLanguage,
  FaArrowLeft,
  FaCheckCircle,
  FaInfoCircle,
  FaEnvelope,
  FaPhone
} from "react-icons/fa";

export default function AccessibilityPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [largeText]);

  const accessibilityFeatures = [
    {
      title: "Visual Accessibility",
      icon: FaEye,
      color: "text-blue-600",
      features: [
        "High contrast mode for better visibility",
        "Adjustable text sizes",
        "Clear color combinations",
        "Screen reader compatibility",
        "Alternative text for all images"
      ]
    },
    {
      title: "Motor Accessibility",
      icon: FaKeyboard,
      color: "text-green-600",
      features: [
        "Full keyboard navigation",
        "Large clickable areas",
        "Gesture support for mobile devices",
        "Voice control compatibility",
        "Reduced motion options"
      ]
    },
    {
      title: "Hearing Accessibility",
      icon: FaVolumeUp,
      color: "text-purple-600",
      features: [
        "Video captions and transcripts",
        "Visual alerts for audio notifications",
        "Text alternatives for audio content",
        "Adjustable volume controls",
        "Sign language video support"
      ]
    },
    {
      title: "Cognitive Accessibility",
      icon: FaTextHeight,
      color: "text-orange-600",
      features: [
        "Clear and simple language",
        "Consistent navigation structure",
        "Error prevention and recovery",
        "Help and documentation",
        "Adjustable time limits"
      ]
    }
  ];

  const commitmentPoints = [
    {
      title: "WCAG 2.1 Compliance",
      description: "We follow the Web Content Accessibility Guidelines (WCAG) 2.1 at AA level",
      icon: FaCheckCircle
    },
    {
      title: "Continuous Testing",
      description: "Regular accessibility testing with real users and assistive technologies",
      icon: FaCheckCircle
    },
    {
      title: "User Feedback",
      description: "We actively seek and incorporate feedback from users with disabilities",
      icon: FaCheckCircle
    },
    {
      title: "Staff Training",
      description: "Our development team receives regular accessibility training",
      icon: FaCheckCircle
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
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <div className="relative py-20 px-4 bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-teal-900/20">
        <CSSShuttleBackground />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4 text-center">
              Accessibility Statement
            </h1>
            <p className="text-xl text-muted-foreground font-normal leading-relaxed text-center">
              We're committed to making Where is My Bus accessible to everyone
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

      {/* Accessibility Tools */} 
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-2xl font-bold text-center mb-8">Accessibility Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <FaMoon className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                  <CardTitle>High Contrast Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Toggle high contrast mode for better visibility
                  </p>
                  <Button
                    onClick={() => setHighContrast(!highContrast)}
                    variant={highContrast ? "default" : "outline"}
                    className="w-full"
                  >
                    {highContrast ? "Disable High Contrast" : "Enable High Contrast"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <FaTextHeight className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <CardTitle>Large Text Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Increase text size for better readability
                  </p>
                  <Button
                    onClick={() => setLargeText(!largeText)}
                    variant={largeText ? "default" : "outline"}
                    className="w-full"
                  >
                    {largeText ? "Normal Text Size" : "Large Text Size"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">Accessibility Features</h2>
          </ScrollFadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {accessibilityFeatures.map((feature, index) => (
              <ScrollScaleIn key={index} delay={index * 100}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 card-enhanced">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">Our Commitment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {commitmentPoints.map((point, index) => (
                <ScrollScaleIn key={index} delay={index * 100}>
                  <div className="flex items-start space-x-4 p-6 bg-card rounded-lg border">
                    <point.icon className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">{point.title}</h3>
                      <p className="text-muted-foreground">{point.description}</p>
                    </div>
                  </div>
                </ScrollScaleIn>
              ))}
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Technical Standards */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">Technical Standards</h2>
            <div className="bg-card rounded-lg p-8 border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <FaUniversalAccess className="mr-3 text-blue-600" />
                    WCAG 2.1 Guidelines
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Perceivable: Information must be presentable in ways users can perceive</li>
                    <li>• Operable: Interface components must be operable by all users</li>
                    <li>• Understandable: Information and UI operation must be understandable</li>
                    <li>• Robust: Content must be robust enough for various assistive technologies</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <FaKeyboard className="mr-3 text-green-600" />
                    Supported Technologies
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Screen Readers</Badge>
                      <span className="text-muted-foreground text-sm">JAWS, NVDA, VoiceOver</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Speech Recognition</Badge>
                      <span className="text-muted-foreground text-sm">Dragon NaturallySpeaking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Screen Magnifiers</Badge>
                      <span className="text-muted-foreground text-sm">ZoomText, MAGic</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Switch Devices</Badge>
                      <span className="text-muted-foreground text-sm">Various switch input devices</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Getting Help */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <ScrollFadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Need Accessibility Assistance?</h2>
              <p className="text-muted-foreground">
                If you encounter any accessibility barriers while using our website, please let us know. We're here to help.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  accessibility@whereismybus.in
                </p>
                <p className="text-xs text-muted-foreground">
                  Response within 24 hours
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPhone className="text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  +91 1800-123-4567
                </p>
                <p className="text-xs text-muted-foreground">
                  Mon-Fri, 9AM-6PM IST
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaInfoCircle className="text-purple-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Available on our website
                </p>
                <p className="text-xs text-muted-foreground">
                  Instant assistance
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Contact Accessibility Team
                </Link>
              </Button>
            </div>
          </ScrollFadeIn>
        </div>
      </section>
    </div>
  );
}