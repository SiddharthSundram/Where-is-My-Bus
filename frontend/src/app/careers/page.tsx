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
  FaBriefcase, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaClock, 
  FaRupeeSign,
  FaBuilding,
  FaGraduationCap,
  FaHeart,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaRocket,
  FaStar,
  FaEnvelope
} from "react-icons/fa";

export default function CareersPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Mumbai",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₹12-18 LPA",
      description: "We're looking for a passionate Frontend Developer to join our team and help build amazing user experiences.",
      requirements: [
        "Expertise in React, Next.js, and TypeScript",
        "Experience with modern CSS frameworks like Tailwind",
        "Knowledge of responsive design and accessibility",
        "Strong problem-solving skills"
      ],
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Backend Engineer",
      department: "Engineering",
      location: "Bangalore",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₹10-16 LPA",
      description: "Join our backend team to build scalable and efficient systems that power our real-time bus tracking platform.",
      requirements: [
        "Strong experience with Node.js and Python",
        "Knowledge of databases (PostgreSQL, MongoDB)",
        "Experience with REST APIs and microservices",
        "Understanding of cloud platforms (AWS/Azure)"
      ],
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Mobile App Developer",
      department: "Engineering",
      location: "Delhi",
      type: "Full-time",
      experience: "2-5 years",
      salary: "₹8-15 LPA",
      description: "Help us create amazing mobile experiences for iOS and Android platforms.",
      requirements: [
        "Experience with React Native or Flutter",
        "Knowledge of native iOS/Android development",
        "Understanding of mobile app architecture",
        "Experience with app store deployment"
      ],
      posted: "3 days ago"
    },
    {
      id: 4,
      title: "UX/UI Designer",
      department: "Design",
      location: "Mumbai",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₹8-12 LPA",
      description: "Create intuitive and beautiful user interfaces for our web and mobile applications.",
      requirements: [
        "Proficiency in Figma, Sketch, or Adobe Creative Suite",
        "Strong portfolio demonstrating UX/UI skills",
        "Understanding of user-centered design principles",
        "Experience with design systems"
      ],
      posted: "5 days ago"
    },
    {
      id: 5,
      title: "Product Manager",
      department: "Product",
      location: "Bangalore",
      type: "Full-time",
      experience: "4-7 years",
      salary: "₹15-25 LPA",
      description: "Lead product strategy and development for our core tracking platform.",
      requirements: [
        "Experience in product management for tech products",
        "Strong analytical and problem-solving skills",
        "Experience with agile development methodologies",
        "Excellent communication and leadership skills"
      ],
      posted: "1 week ago"
    },
    {
      id: 6,
      title: "Data Scientist",
      department: "Data",
      location: "Hyderabad",
      type: "Full-time",
      experience: "3-6 years",
      salary: "₹12-20 LPA",
      description: "Leverage data to improve our tracking algorithms and user experience.",
      requirements: [
        "Strong background in statistics and machine learning",
        "Experience with Python, R, and SQL",
        "Knowledge of data visualization tools",
        "Experience with big data technologies"
      ],
      posted: "4 days ago"
    }
  ];

  const departments = ["all", "Engineering", "Design", "Product", "Data"];

  const benefits = [
    {
      title: "Competitive Salary",
      description: "Industry-leading compensation packages",
      icon: FaRupeeSign
    },
    {
      title: "Health Insurance",
      description: "Comprehensive health coverage for you and your family",
      icon: FaHeart
    },
    {
      title: "Flexible Work",
      description: "Remote and hybrid work options available",
      icon: FaClock
    },
    {
      title: "Growth Opportunities",
      description: "Continuous learning and career development",
      icon: FaGraduationCap
    },
    {
      title: "Great Culture",
      description: "Collaborative and inclusive work environment",
      icon: FaUsers
    },
    {
      title: "Modern Office",
      description: "State-of-the-art facilities and amenities",
      icon: FaBuilding
    }
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || job.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

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
              Careers at Where is My Bus
            </h1>
            <p className="text-xl text-muted-foreground font-normal leading-relaxed text-center">
              Join us in revolutionizing public transportation in India
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

      {/* Why Join Us */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Join Us?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Be part of a mission-driven team that's making a real difference in millions of lives across India
              </p>
            </div>
          </ScrollFadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <ScrollScaleIn key={index} delay={index * 100}>
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 card-enhanced">
                  <CardHeader>
                    <benefit.icon className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </ScrollScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Current Openings</h2>
              <p className="text-muted-foreground">
                We're always looking for talented people to join our team
              </p>
            </div>
          </ScrollFadeIn>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={selectedDepartment === dept ? "default" : "outline"}
                    onClick={() => setSelectedDepartment(dept)}
                    className="capitalize"
                  >
                    {dept}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <ScrollScaleIn key={job.id}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <Badge variant="secondary" className="ml-2">
                              {job.posted}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{job.description}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <FaBriefcase className="text-green-600" />
                              <span>{job.experience}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FaMapMarkerAlt className="text-blue-600" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FaClock className="text-purple-600" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FaRupeeSign className="text-orange-600" />
                              <span>{job.salary}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex lg:flex-col gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollScaleIn>
              ))
            ) : (
              <div className="text-center py-12">
                <FaSearch className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or check back later for new opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Culture & Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollFadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Culture & Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We believe in creating an environment where everyone can thrive and make a difference
              </p>
            </div>
          </ScrollFadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ScrollScaleIn>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaRocket className="text-green-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We encourage creative thinking and new ideas
                </p>
              </div>
            </ScrollScaleIn>
            
            <ScrollScaleIn delay={100}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  We work together to achieve great things
                </p>
              </div>
            </ScrollScaleIn>
            
            <ScrollScaleIn delay={200}>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-purple-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  We strive for excellence in everything we do
                </p>
              </div>
            </ScrollScaleIn>
            
            <ScrollScaleIn delay={300}>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeart className="text-orange-600 text-xl" />
                </div>
                <h3 className="font-semibold mb-2">Impact</h3>
                <p className="text-sm text-muted-foreground">
                  We're driven by making a positive difference
                </p>
              </div>
            </ScrollScaleIn>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollFadeIn>
            <h2 className="text-3xl font-bold mb-4">Don't See What You're Looking For?</h2>
            <p className="text-muted-foreground mb-8">
              We're always interested in meeting talented people. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <FaEnvelope className="mr-2" />
                  Contact HR Team
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <FaFilter className="mr-2" />
                Send Resume
              </Button>
            </div>
          </ScrollFadeIn>
        </div>
      </section>
    </div>
  );
}