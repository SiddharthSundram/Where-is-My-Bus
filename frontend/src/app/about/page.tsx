"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCountUp } from "@/hooks/use-count-up";
import { StatCard } from "@/components/stat-card";
import { TimelineItem } from "@/components/timeline-item";
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
  FaBus, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaAward, 
  FaLightbulb, 
  FaRocket,
  FaHeart,
  FaArrowRight,
  FaStar,
  FaCheckCircle
} from "react-icons/fa";

export default function AboutPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      description: "Started with a vision to revolutionize public transportation in India"
    },
    {
      year: "2021",
      title: "First Launch",
      description: "Launched in Mumbai with 100 buses and 10,000 users"
    },
    {
      year: "2022",
      title: "Expansion",
      description: "Expanded to 5 major cities with AI-powered predictions"
    },
    {
      year: "2023",
      title: "Growth",
      description: "Reached 1 million users and covered 25 cities across India"
    },
    {
      year: "2024",
      title: "Innovation",
      description: "Launched 3D tracking and advanced analytics features"
    },
    {
      year: "2025",
      title: "National Leader",
      description: "Became India's leading public transportation platform with nationwide coverage"
    }
  ];

  const values = [
    {
      icon: FaHeart,
      title: "User-Centric",
      description: "We put our users first in every decision we make"
    },
    {
      icon: FaLightbulb,
      title: "Innovation",
      description: "Continuously pushing the boundaries of technology"
    },
    {
      icon: FaCheckCircle,
      title: "Reliability",
      description: "Dependable service you can count on every day"
    },
    {
      icon: FaRocket,
      title: "Excellence",
      description: "Striving for excellence in everything we do"
    }
  ];

  const stats = [
    { number: 75, label: "Cities Covered", icon: FaMapMarkerAlt, suffix: "+" },
    { number: 25000, label: "Buses Tracked", icon: FaBus, suffix: "+" },
    { number: 10000, label: "Happy Users", icon: FaUsers, suffix: "+" },
    { number: 99.9, label: "Accuracy Rate", icon: FaAward, suffix: "%" }
  ];

  const team = [
    {
      name: "Siddharth Sundram",
      role: "CEO & Founder",
      bio: "Visionary leader with expertise in transportation technology and urban mobility solutions"
    },
    {
      name: "Saptarshi Chowdhury",
      role: "CTO",
      bio: "Tech expert specializing in AI, machine learning and real-time tracking systems"
    },
    {
      name: "Pallavi Srivastav",
      role: "Head of Operations",
      bio: "Operations guru ensuring smooth service across all cities with 10+ years experience"
    },
    {
      name: "Gaurav Kundan",
      role: "Head of Design",
      bio: "Creative mind behind our user-friendly interface and mobile app experiences"
    },
    {
      name: "Jhilik Thakur",
      role: "Head of Marketing",
      bio: "Marketing strategist driving user engagement and brand growth across India"
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
      <ParallaxContainer speed={0.3} className="relative py-20 px-4 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20">
        {/* Shuttle Background Animation */}
        <CSSShuttleBackground />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 text-center">
              About Where is My Bus
            </h1>
            <p className="text-xl text-muted-foreground font-normal leading-relaxed text-center">
              Revolutionizing public transportation in India through technology and innovation
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div>
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 btn-enhanced">
                <Link href="/find">
                  <FaBus className="mr-2" />
                  Try Our Service
                </Link>
              </Button>
            </div>
            <div>
              <Button variant="outline" size="lg" asChild className="btn-enhanced">
                <Link href="/contact">
                  <FaArrowRight className="mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </ParallaxContainer>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 text-center">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground text-center">
                  At Where is My Bus, we're on a mission to transform public transportation in India by making it more accessible, reliable, and efficient for everyone.
                </p>
              </div>
              <p className="text-lg text-muted-foreground mb-6 text-enhanced">
                We believe that everyone deserves access to real-time, accurate information about their public transportation options. Our innovative technology platform brings together AI-powered predictions, real-time tracking, and seamless ticketing to create a superior commuting experience.
              </p>
              <div className="flex flex-wrap gap-3">
                <div>
                  <Badge variant="secondary" className="text-sm btn-enhanced">
                    <FaStar className="mr-1" />
                    Innovation
                  </Badge>
                </div>
                <div>
                  <Badge variant="secondary" className="text-sm btn-enhanced">
                    <FaHeart className="mr-1" />
                    User-Focused
                  </Badge>
                </div>
                <div>
                  <Badge variant="secondary" className="text-sm btn-enhanced">
                    <FaCheckCircle className="mr-1" />
                    Reliable
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center transform-3d-full hover-3d-lift">
                  <div className="text-white text-center">
                    <FaBus className="text-6xl mx-auto mb-4 animate-professional-float" />
                    <p className="text-xl font-semibold text-enhanced">Transforming Transportation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 text-center">
                By the Numbers
              </h2>
              <p className="text-xl text-muted-foreground font-normal text-center">
                Our growth and impact across India
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index}>
                <StatCard
                  number={stat.number}
                  label={stat.label}
                  icon={stat.icon}
                  suffix={stat.suffix}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 text-center">
                Our Values
              </h2>
              <p className="text-xl text-muted-foreground font-normal text-center">
                The principles that guide everything we do
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index}>
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 card-enhanced">
                  <CardContent className="pt-6">
                    <value.icon className="w-16 h-16 mx-auto mb-4 text-primary animate-professional-float" />
                    <h3 className="text-xl font-bold mb-2 text-enhanced">{value.title}</h3>
                    <p className="text-muted-foreground text-enhanced">{value.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 text-center">
                Our Journey
              </h2>
              <p className="text-xl text-muted-foreground font-normal text-center">
                Key milestones in our mission to transform transportation
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index}>
                  <TimelineItem
                    year={milestone.year}
                    title={milestone.title}
                    description={milestone.description}
                    index={index}
                    isEven={index % 2 === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 text-center">
                Meet Our Team
              </h2>
              <p className="text-xl text-muted-foreground font-normal text-center">
                The passionate individuals behind our mission
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {team.map((member, index) => (
              <div key={index}>
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 card-enhanced">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-professional-float">
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-enhanced">{member.name}</h3>
                    <p className="text-primary font-medium mb-3 text-enhanced">{member.role}</p>
                    <p className="text-muted-foreground text-sm text-enhanced">{member.bio}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-12 text-white transform-3d-full hover-3d-lift">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                Join Our Mission
              </h2>
              <p className="text-xl opacity-90 font-normal text-center">
                Be part of the transportation revolution in India
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div>
                <Button size="lg" variant="secondary" asChild className="btn-enhanced">
                  <Link href="/signup">
                    <FaRocket className="mr-2" />
                    Get Started
                  </Link>
                </Button>
              </div>
              <div>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 btn-enhanced" asChild>
                  <Link href="/contact">
                    <FaArrowRight className="mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}