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
  FaQuestionCircle, 
  FaBus, 
  FaMapMarkerAlt, 
  FaTicketAlt, 
  FaUser,
  FaMobile,
  FaClock,
  FaMoneyBill,
  FaShieldAlt,
  FaArrowLeft,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaHeadset
} from "react-icons/fa";

export default function FAQPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqCategories = [
    {
      title: "General Questions",
      icon: FaQuestionCircle,
      color: "text-blue-600",
      questions: [
        {
          question: "What is Where is My Bus?",
          answer: "Where is My Bus is a real-time bus tracking application that helps users track the exact location of buses, get accurate arrival times, and plan their journeys efficiently across Indian cities."
        },
        {
          question: "How does the app work?",
          answer: "Our app uses GPS technology installed in buses to provide real-time location updates. This data is processed through our AI algorithms to give you accurate ETAs and route information."
        },
        {
          question: "Is the app free to use?",
          answer: "Yes, the basic features of Where is My Bus are completely free to use. We also offer premium features for advanced users and frequent travelers."
        },
        {
          question: "Which cities are currently covered?",
          answer: "We currently cover 75+ major cities across India including Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, and many more. We're constantly expanding our network."
        }
      ]
    },
    {
      title: "Tracking & Navigation",
      icon: FaMapMarkerAlt,
      color: "text-green-600",
      questions: [
        {
          question: "How accurate is the bus tracking?",
          answer: "Our tracking system is 99.9% accurate with real-time updates every 10-30 seconds, depending on the bus type and location conditions."
        },
        {
          question: "Can I track multiple buses at once?",
          answer: "Yes, you can track up to 5 buses simultaneously on your device. This is useful for comparing routes or finding the best option."
        },
        {
          question: "What if the GPS signal is lost?",
          answer: "In case of GPS signal loss, our system uses the last known location and predictive algorithms to estimate the bus position until the signal is restored."
        },
        {
          question: "Does the app work offline?",
          answer: "Basic route information and schedules can be accessed offline. However, real-time tracking requires an internet connection for live updates."
        }
      ]
    },
    {
      title: "Tickets & Payment",
      icon: FaTicketAlt,
      color: "text-purple-600",
      questions: [
        {
          question: "Can I book tickets through the app?",
          answer: "Yes, you can book digital tickets for various bus services directly through our app. We support multiple payment methods including UPI, credit/debit cards, and digital wallets."
        },
        {
          question: "What payment methods are accepted?",
          answer: "We accept UPI, credit cards, debit cards, net banking, and popular digital wallets like Paytm, PhonePe, and Google Pay."
        },
        {
          question: "How do I cancel my ticket?",
          answer: "You can cancel your ticket through the app up to 30 minutes before the departure time. Refund policies vary based on the bus operator and timing."
        },
        {
          question: "Are there any booking fees?",
          answer: "We charge a minimal convenience fee for digital bookings. This fee is clearly displayed before you complete your payment."
        }
      ]
    },
    {
      title: "Account & Profile",
      icon: FaUser,
      color: "text-orange-600",
      questions: [
        {
          question: "Do I need to create an account?",
          answer: "While you can use basic features without an account, creating one allows you to save favorite routes, view travel history, and access personalized features."
        },
        {
          question: "How do I reset my password?",
          answer: "Click on 'Forgot Password' on the login screen, enter your registered email, and follow the instructions sent to your email to reset your password."
        },
        {
          question: "Can I use the app on multiple devices?",
          answer: "Yes, you can use your account on multiple devices. Your data will be synchronized across all logged-in devices."
        },
        {
          question: "How do I update my profile information?",
          answer: "Go to Profile Settings in the app, where you can update your personal information, contact details, and preferences."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: FaMobile,
      color: "text-red-600",
      questions: [
        {
          question: "What are the system requirements?",
          answer: "Our app works on Android 6.0+ and iOS 12.0+. You need a stable internet connection for real-time tracking features."
        },
        {
          question: "The app is not loading properly. What should I do?",
          answer: "Try restarting the app, checking your internet connection, clearing the app cache, or reinstalling the app. If issues persist, contact our support team."
        },
        {
          question: "How much data does the app use?",
          answer: "The app uses approximately 50-100 MB per month for regular use. Real-time tracking consumes more data than basic route checking."
        },
        {
          question: "Is my data secure?",
          answer: "Yes, we use industry-standard encryption and security measures to protect your personal data and travel information."
        }
      ]
    },
    {
      title: "Safety & Security",
      icon: FaShieldAlt,
      color: "text-teal-600",
      questions: [
        {
          question: "How do I report an emergency?",
          answer: "Use the SOS button in the app to report emergencies. This will alert our support team and share your location with emergency services if needed."
        },
        {
          question: "What safety features are available?",
          answer: "We offer real-time tracking, SOS emergency button, route sharing with family, driver verification, and 24/7 customer support."
        },
        {
          question: "How are bus drivers verified?",
          answer: "All bus drivers undergo thorough background checks and verification processes before being added to our platform."
        },
        {
          question: "Can I share my trip with family?",
          answer: "Yes, you can share your live trip status with family members through the app. They can track your journey in real-time."
        }
      ]
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
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground font-normal leading-relaxed text-center">
              Find answers to common questions about Where is My Bus
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

      {/* Search Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full px-4 py-3 pl-12 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqCategories.map((category, categoryIndex) => (
              <ScrollScaleIn key={categoryIndex} delay={categoryIndex * 100}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 card-enhanced">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <category.icon className={`w-8 h-8 ${category.color}`} />
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.questions.map((item, questionIndex) => (
                        <div key={questionIndex} className="border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleQuestion(`${categoryIndex}-${questionIndex}`)}
                            className="w-full px-4 py-3 text-left bg-muted/50 hover:bg-muted transition-colors duration-200 flex items-center justify-between"
                          >
                            <span className="font-medium text-sm">{item.question}</span>
                            {openQuestion === `${categoryIndex}-${questionIndex}` ? (
                              <FaChevronUp className="text-muted-foreground" />
                            ) : (
                              <FaChevronDown className="text-muted-foreground" />
                            )}
                          </button>
                          {openQuestion === `${categoryIndex}-${questionIndex}` && (
                            <div className="px-4 py-3 bg-background border-t border-border">
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <ScrollScaleIn>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">75+</div>
                <div className="text-muted-foreground">Cities Covered</div>
              </div>
            </ScrollScaleIn>
            <ScrollScaleIn delay={100}>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">25K+</div>
                <div className="text-muted-foreground">Buses Tracked</div>
              </div>
            </ScrollScaleIn>
            <ScrollScaleIn delay={200}>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10M+</div>
                <div className="text-muted-foreground">Happy Users</div>
              </div>
            </ScrollScaleIn>
            <ScrollScaleIn delay={300}>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-muted-foreground">Support Available</div>
              </div>
            </ScrollScaleIn>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <FaHeadset className="mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/support">
                  <FaQuestionCircle className="mr-2" />
                  Help Center
                </Link>
              </Button>
            </div>
          </ScrollFadeIn>
        </div>
      </section>
    </div>
  );
}