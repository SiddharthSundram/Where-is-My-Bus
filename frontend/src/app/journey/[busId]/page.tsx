"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  FaBus, 
  FaMapMarkerAlt, 
  FaClock, 
  FaRoute, 
  FaTicketAlt, 
  FaUsers,
  FaTachometerAlt,
  FaLocationArrow,
  FaCalendar,
  FaMoneyBill,
  FaArrowRight,
  FaWifi,
  FaExclamationTriangle
} from "react-icons/fa";
import { format } from "date-fns";

interface Bus {
  id: string;
  busNumber: string;
  operator: string;
  type: "AC" | "NON_AC";
  capacity: number;
  currentLocation: {
    lat: number;
    lng: number;
  };
  speed: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
}

interface Stop {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  eta?: number;
  isCurrent?: boolean;
  isBoarding?: boolean;
  isDestination?: boolean;
}

interface JourneyData {
  bus: Bus;
  route: {
    id: string;
    name: string;
    distanceKm: number;
    fromCity: string;
    toCity: string;
  };
  stops: Stop[];
  schedule: {
    departureTime: string;
    arrivalTime: string;
    estimatedArrival: string;
  };
  occupancy: {
    booked: number;
    available: number;
  };
}

export default function JourneyTrackerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const busId = params.busId as string;
  const fromStop = searchParams.get('fromStop') || '';
  const toStop = searchParams.get('toStop') || '';
  
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [seatType, setSeatType] = useState<"AC" | "NON_AC">("AC");
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [liveEta, setLiveEta] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Mouse tracking for 3D effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initialize 3D canvas animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const resizeCanvas = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle system
        const particles = Array.from({ length: 40 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1,
          color: Math.random() > 0.5 ? 'rgba(59, 130, 246,' : 'rgba(139, 92, 246,'
        }));

        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `${particle.color}${particle.opacity})`;
            ctx.fill();
          });
          
          requestAnimationFrame(animate);
        };
        
        animate();
      }
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockJourneyData: JourneyData = {
      bus: {
        id: busId,
        busNumber: "MH-01-AB-1234",
        operator: "MSRTC",
        type: "AC",
        capacity: 45,
        currentLocation: { lat: 19.0760, lng: 72.8777 }, // Mumbai
        speed: 45,
        status: "ACTIVE"
      },
      route: {
        id: "route1",
        name: `${fromStop} to ${toStop}`,
        distanceKm: 150,
        fromCity: fromStop,
        toCity: toStop
      },
      stops: [
        { id: "1", name: fromStop, location: { lat: 19.0760, lng: 72.8777 }, isCurrent: true, isBoarding: true },
        { id: "2", name: "Dadar", location: { lat: 19.0176, lng: 72.8562 }, eta: 15 },
        { id: "3", name: "Thane", location: { lat: 19.2183, lng: 72.9781 }, eta: 35 },
        { id: "4", name: "Lonavala", location: { lat: 18.7500, lng: 73.4000 }, eta: 90 },
        { id: "5", name: toStop, location: { lat: 18.5204, lng: 73.8567 }, eta: 150, isDestination: true }
      ],
      schedule: {
        departureTime: "2024-01-15T14:30:00",
        arrivalTime: "2024-01-15T18:45:00",
        estimatedArrival: "2024-01-15T19:15:00"
      },
      occupancy: {
        booked: 38,
        available: 7
      }
    };

    setTimeout(() => {
      setJourneyData(mockJourneyData);
      setLiveEta(150); // Initial ETA in minutes
      setLoading(false);
    }, 1500);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (liveEta > 0) {
        setLiveEta(prev => Math.max(0, prev - 1));
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [busId, fromStop, toStop]);

  const calculateFare = () => {
    if (!journeyData) return 0;
    const baseFare = journeyData.route.distanceKm * 3; // ₹3 per km
    const multiplier = seatType === "AC" ? 1.5 : 1;
    return Math.round(baseFare * multiplier * selectedSeats);
  };

  const handleBookTicket = () => {
    setShowBookingPanel(true);
  };

  const handleConfirmBooking = () => {
    // Simulate booking process
    alert(`Booking confirmed! ${selectedSeats} ${seatType} seat(s) for ₹${calculateFare()}`);
    setShowBookingPanel(false);
    router.push("/tickets");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 relative overflow-hidden">
        {/* 3D Canvas Background */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: -1 }}
        />
        
        <div className="mb-8 animate-fade-in">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-blue-50/10 to-green-50/10 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg border flex items-center justify-center">
                  <div className="text-center">
                    <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!journeyData) {
    return (
      <div className="container mx-auto px-4 py-8 relative overflow-hidden">
        {/* 3D Canvas Background */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: -1 }}
        />
        
        <Card className="text-center py-12 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in">
          <CardContent>
            <div className="relative inline-block mb-4">
              <FaBus className="text-6xl text-muted-foreground mx-auto" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Bus not found
            </h3>
            <p className="text-muted-foreground mb-4">The bus you're looking for doesn't exist or is not available.</p>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300">
              <a href="/find">Find Another Bus</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { bus, route, stops, schedule, occupancy } = journeyData;
  const fare = calculateFare();

  return (
    <div className="container mx-auto px-4 py-8 relative overflow-hidden">
      {/* 3D Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1 }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-blue-500/20 animate-pulse"
            style={{
              width: `${30 + Math.random() * 50}px`,
              height: `${30 + Math.random() * 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="mb-8 animate-fade-in">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 text-blue-300">
            🚌 Live Journey Tracker
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-text">
            {route.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl opacity-90">
            Track your bus in real-time and book tickets instantly
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Map */}
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      <FaLocationArrow className="mr-2" />
                      Live Tracking
                    </CardTitle>
                    <CardDescription className="opacity-90">Real-time bus location and route</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={bus.status === "ACTIVE" ? "default" : "secondary"} className="bg-green-500/20 text-green-300 border-green-500/30">
                      {bus.status === "ACTIVE" ? "Active" : bus.status}
                    </Badge>
                    <div className="flex items-center text-sm text-green-400">
                      <FaWifi className="mr-1 animate-pulse" />
                      Live
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-blue-50/10 via-purple-50/10 to-pink-50/10 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 rounded-lg border relative overflow-hidden">
                  {/* Enhanced 3D map representation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative mb-8">
                        {/* Animated route line */}
                        <div className="w-80 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full animate-pulse"></div>
                        
                        {/* Animated bus marker */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="relative animate-bounce">
                            <FaBus className="text-4xl text-blue-500 drop-shadow-lg" />
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                          </div>
                        </div>
                        
                        {/* Stop markers */}
                        <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white shadow-lg"></div>
                        </div>
                        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white shadow-lg"></div>
                        </div>
                      </div>
                      
                      <div className="mt-16 space-y-3">
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {bus.busNumber}
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-sm">
                          <div className="flex items-center text-blue-400">
                            <FaTachometerAlt className="mr-1" />
                            <span className="font-semibold">{bus.speed} km/h</span>
                          </div>
                          <div className="flex items-center text-purple-400">
                            <FaLocationArrow className="mr-1" />
                            <span className="font-semibold">Live</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground opacity-90">
                          Current Location: {bus.currentLocation.lat.toFixed(4)}, {bus.currentLocation.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stop List */}
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <FaRoute className="mr-2" />
                  Route Stops
                </CardTitle>
                <CardDescription className="opacity-90">Upcoming stops and estimated arrival times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center space-x-4 group hover:bg-primary/5 rounded-lg p-2 transition-all duration-300">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          stop.isCurrent ? "bg-blue-500 border-blue-500 animate-pulse shadow-lg" :
                          stop.isBoarding ? "bg-green-500 border-green-500 shadow-lg" :
                          stop.isDestination ? "bg-red-500 border-red-500 shadow-lg" :
                          "bg-gray-300 border-gray-300"
                        }`}></div>
                        {index < stops.length - 1 && (
                          <div className="w-0.5 h-10 bg-gradient-to-b from-blue-300 to-purple-300 mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${
                              stop.isCurrent ? "text-blue-600 dark:text-blue-400" :
                              stop.isBoarding ? "text-green-600 dark:text-green-400" :
                              stop.isDestination ? "text-red-600 dark:text-red-400" : ""
                            }`}>
                              {stop.name}
                              {stop.isBoarding && <Badge className="ml-2 text-xs bg-green-500/20 text-green-300 border-green-500/30">Boarding</Badge>}
                              {stop.isDestination && <Badge className="ml-2 text-xs bg-red-500/20 text-red-300 border-red-500/30">Destination</Badge>}
                            </p>
                            {stop.eta && (
                              <p className="text-sm text-muted-foreground opacity-90">
                                ETA: {stop.eta} min
                              </p>
                            )}
                          </div>
                          
                          {stop.eta && (
                            <div className="text-right">
                              <p className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {format(new Date(Date.now() + stop.eta * 60000), "HH:mm")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bus Info */}
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <FaBus className="mr-2" />
                  Bus Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bus Number</span>
                  <span className="font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{bus.busNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Operator</span>
                  <span className="font-medium">{bus.operator}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <Badge variant={bus.type === "AC" ? "default" : "secondary"} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {bus.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Capacity</span>
                  <span className="font-medium">{bus.capacity} seats</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Speed</span>
                  <span className="font-medium flex items-center">
                    <FaTachometerAlt className="mr-1 text-blue-400" />
                    {bus.speed} km/h
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Journey Info */}
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <FaClock className="mr-2" />
                  Journey Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Distance</span>
                  <span className="font-medium">{route.distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Departure</span>
                  <span className="font-medium">
                    {format(new Date(schedule.departureTime), "HH:mm")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Arrival</span>
                  <span className="font-medium">
                    {format(new Date(schedule.arrivalTime), "HH:mm")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Live ETA</span>
                  <span className="font-medium text-green-400">
                    {Math.floor(liveEta / 60)}h {liveEta % 60}m
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Occupancy */}
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <FaUsers className="mr-2" />
                  Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Booked</span>
                    <span>{occupancy.booked}/{bus.capacity}</span>
                  </div>
                  <Progress value={(occupancy.booked / bus.capacity) * 100} className="h-2" />
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                    {occupancy.available} seats available
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Booking Panel */}
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <FaTicketAlt className="mr-2" />
                  Book Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Seat Type</Label>
                  <Tabs value={seatType} onValueChange={(value) => setSeatType(value as "AC" | "NON_AC")}>
                    <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                      <TabsTrigger value="AC" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                        AC
                      </TabsTrigger>
                      <TabsTrigger value="NON_AC" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
                        Non-AC
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Number of Seats</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedSeats(Math.max(1, selectedSeats - 1))}
                      disabled={selectedSeats <= 1}
                    >
                      -
                    </Button>
                    <span className="font-medium min-w-[2rem] text-center">{selectedSeats}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedSeats(Math.min(occupancy.available, selectedSeats + 1))}
                      disabled={selectedSeats >= occupancy.available}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total Fare</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      ₹{fare}
                    </span>
                  </div>
                  <Button 
                    onClick={handleBookTicket}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={occupancy.available === 0}
                  >
                    <FaArrowRight className="mr-2" />
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}