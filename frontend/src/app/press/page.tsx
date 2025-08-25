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
  FaNewspaper, 
  FaMicrophone, 
  FaDownload, 
  FaCalendar, 
  FaUser,
  FaBuilding,
  FaChartLine,
  FaAward,
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaLink,
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaMapMarkerAlt,
  FaUsers,
  FaBus
} from "react-icons/fa";

export default function PressPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pressReleases = [
    {
      id: 1,
      title: "Where is My Bus Reaches 10 Million Users Milestone",
      date: "December 15, 2024",
      category: "Company News",
      excerpt: "Leading real-time bus tracking platform celebrates major user growth milestone across 75+ Indian cities.",
      content: "Where is My Bus, India's premier real-time bus tracking platform, today announced that it has reached 10 million active users nationwide. This milestone represents a significant achievement in the company's mission to revolutionize public transportation in India.",
      image: "/api/placeholder/800/400"
    },
    {
      id: 2,
      title: "Launch of AI-Powered Route Optimization Feature",
      date: "November 28, 2024",
      category: "Product Launch",
      excerpt: "New AI feature helps users find the most efficient routes, reducing travel time by up to 30%.",
      content: "Where is My Bus has launched an innovative AI-powered route optimization feature that analyzes real-time traffic data, historical patterns, and user preferences to suggest the most efficient routes for commuters.",
      image: "/api/placeholder/800/400"
    },
    {
      id: 3,
      title: "Strategic Partnership with Mumbai Transport Authority",
      date: "October 10, 2024",
      category: "Partnership",
      excerpt: "Major collaboration to enhance public transportation experience in Mumbai with real-time tracking integration.",
      content: "Where is My Bus has entered into a strategic partnership with the Mumbai Transport Authority to integrate real-time tracking across the city's entire bus fleet, benefiting over 5 million daily commuters.",
      image: "/api/placeholder/800/400"
    },
    {
      id: 4,
      title: "Series B Funding Round of $50 Million Led by Top Investors",
      date: "September 5, 2024",
      category: "Funding",
      excerpt: "Major investment to fuel expansion across India and development of new AI-powered transportation solutions.",
      content: "Where is My Bus has successfully closed a Series B funding round of $50 million, led by prominent venture capital firms. The investment will be used to accelerate the company's expansion plans and enhance its technology platform.",
      image: "/api/placeholder/800/400"
    }
  ];

  const mediaCoverage = [
    {
      id: 1,
      publication: "The Economic Times",
      title: "How Where is My Bus is Transforming Urban Mobility in India",
      date: "December 1, 2024",
      author: "Tech Correspondent",
      link: "#",
      excerpt: "An in-depth look at the technology and vision behind India's leading bus tracking platform."
    },
    {
      id: 2,
      publication: "TechCrunch",
      title: "Indian Startup Where is My Bus Raises $50M to Revolutionize Public Transport",
      date: "September 8, 2024",
      author: "Sarah Johnson",
      link: "#",
      excerpt: "The Mumbai-based company is using AI and real-time data to make public transportation more efficient."
    },
    {
      id: 3,
      publication: "YourStory",
      title: "From Idea to Impact: The Journey of Where is My Bus",
      date: "August 15, 2024",
      author: "Startup Desk",
      link: "#",
      excerpt: "Exclusive interview with the founders about their mission to transform public transportation in India."
    },
    {
      id: 4,
      publication: "Times of India",
      title: "Mumbai Commuters Save 30% Travel Time with New Bus Tracking App",
      date: "July 20, 2024",
      author: "City Reporter",
      link: "#",
      excerpt: "How real-time bus tracking is changing the way Mumbaikars commute."
    }
  ];

  const mediaKit = [
    {
      title: "Company Logo",
      description: "Official company logos in various formats",
      icon: FaFileImage,
      formats: ["PNG", "SVG", "EPS"]
    },
    {
      title: "Press Kit",
      description: "Complete press kit with company information",
      icon: FaFilePdf,
      formats: ["PDF"]
    },
    {
      title: "Product Screenshots",
      description: "High-quality screenshots of our mobile app",
      icon: FaFileImage,
      formats: ["PNG", "JPG"]
    },
    {
      title: "Video Assets",
      description: "Product demos and promotional videos",
      icon: FaFileVideo,
      formats: ["MP4", "MOV"]
    }
  ];

  const companyStats = [
    { label: "Cities Covered", value: "75+", icon: FaMapMarkerAlt },
    { label: "Active Users", value: "10M+", icon: FaUsers },
    { label: "Buses Tracked", value: "25K+", icon: FaBus },
    { label: "Daily Trips", value: "500K+", icon: FaChartLine }
  ];

  const pressContacts = [
    {
      name: "Priya Sharma",
      role: "Head of Communications",
      email: "press@whereismybus.in",
      phone: "+91 98765 43210",
      location: "Mumbai"
    },
    {
      name: "Rahul Kumar",
      role: "PR Manager",
      email: "pr@whereismybus.in",
      phone: "+91 87654 32109",
      location: "Bangalore"
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
              Press Center
            </h1>
            <p className="text-xl text-muted-foreground font-normal leading-relaxed text-center">
              Latest news, press releases, and media resources about Where is My Bus
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

      {/* Company Stats */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Press Releases */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Latest Press Releases</h2>
              <p className="text-muted-foreground">
                Stay updated with our latest announcements and company news
              </p>
            </div>
          </ScrollFadeIn>
          
          <div className="space-y-8">
            {pressReleases.map((release, index) => (
              <ScrollScaleIn key={release.id} delay={index * 100}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-1/4">
                        <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
                          <FaNewspaper className="w-16 h-16 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="lg:w-3/4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{release.category}</Badge>
                          <span className="text-sm text-muted-foreground">{release.date}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                        <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm">
                            <FaFilePdf className="mr-2" />
                            Download PDF
                          </Button>
                          <Button size="sm">
                            Read More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Media Coverage</h2>
              <p className="text-muted-foreground">
                What the media is saying about Where is My Bus
              </p>
            </div>
          </ScrollFadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaCoverage.map((coverage, index) => (
              <ScrollScaleIn key={coverage.id} delay={index * 100}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline">{coverage.publication}</Badge>
                      <span className="text-sm text-muted-foreground">{coverage.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{coverage.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{coverage.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">By {coverage.author}</span>
                      <Button variant="ghost" size="sm">
                        <FaLink className="mr-1" />
                        Read Article
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Media Kit</h2>
              <p className="text-muted-foreground">
                Download official logos, images, and company information
              </p>
            </div>
          </ScrollFadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaKit.map((item, index) => (
              <ScrollScaleIn key={index} delay={index * 100}>
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6">
                    <item.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {item.formats.map((format, formatIndex) => (
                        <Badge key={formatIndex} variant="secondary" className="text-xs">
                          {format}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="w-full">
                      <FaDownload className="mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </ScrollScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contacts */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <ScrollFadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Press Contacts</h2>
              <p className="text-muted-foreground">
                Get in touch with our communications team for media inquiries
              </p>
            </div>
          </ScrollFadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pressContacts.map((contact, index) => (
              <ScrollScaleIn key={index} delay={index * 100}>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUser className="text-green-600 text-xl" />
                    </div>
                    <h3 className="font-semibold mb-1">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{contact.role}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <FaEnvelope className="text-green-600" />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <FaPhone className="text-green-600" />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <FaBuilding className="text-green-600" />
                        <span>{contact.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollFadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Awards & Recognition</h2>
              <p className="text-muted-foreground">
                Honored for innovation and impact in transportation technology
              </p>
            </div>
          </ScrollFadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollScaleIn>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaAward className="text-yellow-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Best Startup 2024</h3>
                <p className="text-sm text-muted-foreground">Indian Startup Awards</p>
              </div>
            </ScrollScaleIn>
            
            <ScrollScaleIn delay={100}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaAward className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Tech Innovation Award</h3>
                <p className="text-sm text-muted-foreground">Tech Excellence Awards 2024</p>
              </div>
            </ScrollScaleIn>
            
            <ScrollScaleIn delay={200}>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaAward className="text-purple-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Social Impact Award</h3>
                <p className="text-sm text-muted-foreground">Sustainable Tech Awards 2024</p>
              </div>
            </ScrollScaleIn>
          </div>
        </div>
      </section>
    </div>
  );
}