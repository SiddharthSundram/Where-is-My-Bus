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
  FaCookie, 
  FaShieldAlt, 
  FaEye, 
  FaChartLine, 
  FaUserShield,
  FaArrowLeft,
  FaInfoCircle
} from "react-icons/fa";

export default function CookiesPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
              Cookie Policy
            </h1>
            <p className="text-xl text-muted-foreground font-normal leading-relaxed text-center">
              Learn how we use cookies to enhance your experience on Where is My Bus
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

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Cookie Types */}
            <ScrollScaleIn>
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 card-enhanced">
                <CardHeader>
                  <FaCookie className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <CardTitle>Essential Cookies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Required for basic website functionality and security features
                  </p>
                </CardContent>
              </Card>
            </ScrollScaleIn>

            <ScrollScaleIn delay={100}>
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 card-enhanced">
                <CardHeader>
                  <FaChartLine className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <CardTitle>Analytics Cookies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Help us understand how visitors interact with our website
                  </p>
                </CardContent>
              </Card>
            </ScrollScaleIn>

            <ScrollScaleIn delay={200}>
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 card-enhanced">
                <CardHeader>
                  <FaUserShield className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <CardTitle>Personalization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Remember your preferences and provide personalized features
                  </p>
                </CardContent>
              </Card>
            </ScrollScaleIn>
          </div>

          {/* Cookie Policy Details */}
          <div className="space-y-8">
            <ScrollFadeIn>
              <div className="bg-card rounded-lg p-8 border">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <FaInfoCircle className="mr-3 text-green-600" />
                  What Are Cookies?
                </h2>
                <p className="text-muted-foreground mb-4">
                  Cookies are small text files that websites store on your device when you visit. They help us remember your preferences, understand how you use our website, and provide you with a personalized experience.
                </p>
                <p className="text-muted-foreground">
                  At Where is My Bus, we use cookies to enhance your user experience, improve our services, and ensure the security of our platform.
                </p>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={100}>
              <div className="bg-card rounded-lg p-8 border">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <FaShieldAlt className="mr-3 text-blue-600" />
                  Types of Cookies We Use
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Essential Cookies</h3>
                    <p className="text-muted-foreground mb-2">
                      These cookies are necessary for the website to function and cannot be switched off in our systems.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Authentication</Badge>
                      <Badge variant="secondary">Security</Badge>
                      <Badge variant="secondary">Session Management</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Analytics Cookies</h3>
                    <p className="text-muted-foreground mb-2">
                      These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Google Analytics</Badge>
                      <Badge variant="secondary">User Behavior</Badge>
                      <Badge variant="secondary">Performance Metrics</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Personalization Cookies</h3>
                    <p className="text-muted-foreground mb-2">
                      These cookies enable the website to provide enhanced functionality and personalization.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Language Preferences</Badge>
                      <Badge variant="secondary">Theme Settings</Badge>
                      <Badge variant="secondary">Route History</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={200}>
              <div className="bg-card rounded-lg p-8 border">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <FaEye className="mr-3 text-purple-600" />
                  Managing Your Cookie Preferences
                </h2>
                <p className="text-muted-foreground mb-4">
                  You can manage your cookie preferences through your browser settings. Most web browsers allow you to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>View the cookies that have been stored on your device</li>
                  <li>Delete existing cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block third-party cookies</li>
                  <li>Enable or disable cookies altogether</li>
                </ul>
                <p className="text-muted-foreground">
                  Please note that blocking essential cookies may affect the functionality of our website and your user experience.
                </p>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={300}>
              <div className="bg-card rounded-lg p-8 border">
                <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  We may use third-party services that set cookies on your device for analytics, advertising, and other purposes. These include:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Google Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Helps us understand how users interact with our website
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Map Services</h4>
                    <p className="text-sm text-muted-foreground">
                      Provides location and mapping functionality
                    </p>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={400}>
              <div className="bg-card rounded-lg p-8 border">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about our Cookie Policy, please don't hesitate to contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> privacy@whereismybus.in</p>
                  <p><strong>Phone:</strong> +91 1800-123-4567</p>
                  <p><strong>Address:</strong> Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}