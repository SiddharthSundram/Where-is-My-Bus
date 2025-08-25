"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CSSShuttleBackground } from "@/components/shuttle-background";

import { 
  FaSearch, 
  FaBus, 
  FaMapMarkerAlt, 
  FaClock, 
  FaStar,
  FaFilter,
  FaRoute,  
  FaUser,
  FaArrowRight,
  FaCalendarAlt,
  FaSnowflake,
  FaSun,
  FaLocationArrow
} from "react-icons/fa";

export default function FindBusPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const [formData, setFormData] = useState({
    city: "",
    fromStop: "",
    toStop: "",
    date: "",
    time: "",
    busType: "all" // all, ac, non-ac
  });

  // const { data: session, status } = useSession();
  
  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // useEffect(() => {
  //   // Redirect to login if not authenticated
  //   if (isMounted && status === "unauthenticated") {
  //     router.push("/login");
  //   }
  // }, [isMounted, status, router]);


  useEffect(() => {
    setIsMounted(true);

    // ✅ Check if JWT exists in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);




  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Ahmedabad", "Jaipur", "Chandigarh", "Lucknow", "Kanpur"
  ];

  const stops = {
    "Mumbai": ["Churchgate", "Dadar", "Bandra", "Andheri", "Borivali", "Virar"],
    "Delhi": ["Kashmere Gate", "ISBT", "Connaught Place", "Karol Bagh", "Dwarka", "Rohini"],
    "Bangalore": ["Majestic", "Shivajinagar", "Indiranagar", "Koramangala", "Banashankari", "Electronic City"],
    "Chennai": ["Central", "Egmore", "T Nagar", "Adyar", "Velachery", "Tambaram"],
    "Kolkata": ["Esplanade", "Sealdah", "Howrah", "Gariahat", "Salt Lake", "Dum Dum"],
    "Hyderabad": ["Secunderabad", "Nampally", "Panjagutta", "Ameerpet", "Kukatpally", "LB Nagar"]
  };

  const mockBuses = [
    {
      id: "BUS001",
      number: "AC-101",
      operator: "City Bus Lines",
      type: "ac",
      departureTime: "08:00 AM",
      arrivalTime: "09:30 AM",
      duration: "1h 30m",
      fare: 45,
      seatsAvailable: 12,
      totalSeats: 40,
      rating: 4.5,
      liveStatus: "On Time",
      nextStop: "Bandra",
      eta: "15 min"
    },
    {
      id: "BUS002",
      number: "NON-AC-205",
      operator: "Metro Transport",
      type: "non-ac",
      departureTime: "08:15 AM",
      arrivalTime: "10:00 AM",
      duration: "1h 45m",
      fare: 25,
      seatsAvailable: 8,
      totalSeats: 35,
      rating: 4.2,
      liveStatus: "Delayed by 5 min",
      nextStop: "Dadar",
      eta: "20 min"
    },
    {
      id: "BUS003",
      number: "AC-302",
      operator: "Express Bus",
      type: "ac",
      departureTime: "08:30 AM",
      arrivalTime: "09:45 AM",
      duration: "1h 15m",
      fare: 50,
      seatsAvailable: 15,
      totalSeats: 45,
      rating: 4.7,
      liveStatus: "On Time",
      nextStop: "Andheri",
      eta: "10 min"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset related fields when city changes
    if (name === "city") {
      setFormData(prev => ({
        ...prev,
        fromStop: "",
        toStop: ""
      }));
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock search results
      setSearchResults(mockBuses);
      setShowResults(true);
      
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookBus = (busId: string) => {
    // Navigate to journey tracker with bus details
    router.push(`/journey/${busId}?fromStop=${encodeURIComponent(formData.fromStop)}&toStop=${encodeURIComponent(formData.toStop)}`);
  };

  const getStatusColor = (status: string) => {
    if (status.includes("On Time")) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (status.includes("Delayed")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  };

    // ✅ Show loading spinner while checking authentication
  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // ✅ If NOT authenticated, show login card
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
        
        <Card className="w-96 animate-scale-in bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 shadow-2xl relative z-10">
          <CardContent className="pt-6 text-center">
            <div className="relative inline-block mb-4">
              <FaUser className="w-16 h-16 mx-auto text-muted-foreground" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Authentication Required
            </h3>
            <p className="text-muted-foreground mb-4">Please sign in to search for buses</p>
            <Button onClick={() => router.push("/login")} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ If authenticated, show your FindBusPage content
  return (
    <div className="min-h-screen relative overflow-hidden">


      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40">
        {/* Shuttle Background Animation */}
        <CSSShuttleBackground />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 text-blue-300">
              🚌 Bus Search
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-text">
              Find Your Bus
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto opacity-90">
              Search for buses across India with real-time tracking and AI-powered predictions
            </p>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-12 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10 z-0"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <Card className="shadow-2xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <FaSearch className="mr-2" />
                Search Buses
              </CardTitle>
              <CardDescription className="text-base opacity-90">
                Enter your travel details to find available buses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                {/* City Selection */}
                <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <Label htmlFor="city" className="text-sm font-semibold">Select City *</Label>
                  <select
                    id="city"
                    name="city"
                    required
                    className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-primary/50"
                    value={formData.city}
                    onChange={handleInputChange}
                  >
                    <option value="">Select your city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Route Selection */}
                {formData.city && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="space-y-2">
                      <Label htmlFor="fromStop" className="text-sm font-semibold">From *</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-blue-400" />
                        </div>
                        <select
                          id="fromStop"
                          name="fromStop"
                          required
                          className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-12 transition-all duration-300 hover:border-primary/50"
                          value={formData.fromStop}
                          onChange={handleInputChange}
                        >
                          <option value="">Select boarding point</option>
                          {stops[formData.city as keyof typeof stops]?.map((stop) => (
                            <option key={stop} value={stop}>
                              {stop}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="toStop" className="text-sm font-semibold">To *</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-purple-400" />
                        </div>
                        <select
                          id="toStop"
                          name="toStop"
                          required
                          className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-12 transition-all duration-300 hover:border-primary/50"
                          value={formData.toStop}
                          onChange={handleInputChange}
                        >
                          <option value="">Select destination</option>
                          {stops[formData.city as keyof typeof stops]?.map((stop) => (
                            <option key={stop} value={stop}>
                              {stop}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date and Time */}
                {formData.fromStop && formData.toStop && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-semibold">Travel Date</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaCalendarAlt className="text-green-400" />
                        </div>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className="pl-12 h-12 transition-all duration-300 hover:border-primary/50"
                          value={formData.date}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-sm font-semibold">Preferred Time</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaClock className="text-orange-400" />
                        </div>
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          className="pl-12 h-12 transition-all duration-300 hover:border-primary/50"
                          value={formData.time}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bus Type Filter */}
                {formData.date && (
                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Label className="text-sm font-semibold">Bus Type</Label>
                    <Tabs value={formData.busType} onValueChange={(value) => setFormData(prev => ({ ...prev, busType: value }))}>
                      <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-1">
                        <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
                          All Buses
                        </TabsTrigger>
                        <TabsTrigger value="ac" className="flex items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
                          <FaSnowflake className="mr-1" />
                          AC
                        </TabsTrigger>
                        <TabsTrigger value="non-ac" className="flex items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
                          <FaSun className="mr-1" />
                          Non-AC
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                )}

                {/* Search Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-semibold animate-fade-in-up"
                  style={{ animationDelay: '0.5s' }}
                  disabled={isLoading || !formData.city || !formData.fromStop || !formData.toStop}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <FaSearch className="mr-2" />
                      Search Buses
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Search Results */}
      {showResults && (
        <section className="py-12 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10 z-0"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex items-center justify-between mb-8 animate-fade-in">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Available Buses
              </h2>
              <Badge variant="outline" className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 text-blue-300">
                <FaBus className="mr-2" />
                {searchResults.length} buses found
              </Badge>
            </div>

            <div className="space-y-6">
              {searchResults.map((bus, index) => (
                <Card key={bus.id} className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Bus Info */}
                      <div className="md:col-span-4">
                        <div className="flex items-center mb-3">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                            {bus.type === "ac" ? <FaSnowflake className="text-xl" /> : <FaSun className="text-xl" />}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{bus.number}</h3>
                            <p className="text-sm text-muted-foreground">{bus.operator}</p>
                          </div>
                        </div>
                        <div className="flex items-center mt-3">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < Math.floor(bus.rating) ? "text-current drop-shadow-sm" : "text-gray-300"} />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">({bus.rating})</span>
                        </div>
                      </div>

                      {/* Route Info */}
                      <div className="md:col-span-3">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <FaLocationArrow className="text-blue-400 mr-2" />
                            <span className="font-semibold">{formData.fromStop}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <FaClock className="mr-2" />
                            <span>{bus.departureTime}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <FaLocationArrow className="text-purple-400 mr-2 rotate-180" />
                            <span className="font-semibold">{formData.toStop}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <FaClock className="mr-2" />
                            <span>{bus.arrivalTime}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Badge variant="secondary" className="text-xs">
                            Duration: {bus.duration}
                          </Badge>
                        </div>
                      </div>

                      {/* Live Status */}
                      <div className="md:col-span-2">
                        <div className="space-y-2">
                          <div className="text-sm font-semibold">Live Status</div>
                          <Badge className={`${getStatusColor(bus.liveStatus)} text-xs px-2 py-1`}>
                            {bus.liveStatus}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            Next: {bus.nextStop}
                          </div>
                          <div className="text-xs text-blue-400 font-semibold">
                            ETA: {bus.eta}
                          </div>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="md:col-span-3">
                        <div className="text-center space-y-3">
                          <div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              ₹{bus.fare}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {bus.seatsAvailable}/{bus.totalSeats} seats available
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleBookBus(bus.id)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <FaArrowRight className="mr-2" />
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}