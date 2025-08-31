"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  FaBus, 
  FaClock, 
  FaRoute, 
  FaTicketAlt, 
  FaUsers,
  FaTachometerAlt,
  FaLocationArrow,
  FaArrowRight,
  FaWifi,
  FaExclamationTriangle,
  FaUser,
  FaSpinner,
  FaCalendarAlt,
  FaMoneyBillWave
} from "react-icons/fa";

// Interfaces matching your live API response
interface BusRouteStop {
  name: string;
  time: string;
}

interface Bus {
  _id: string;
  busNumber: string;
  type: 'ac' | 'non-ac';
  capacity: number;
  route: {
    city: string;
    stops: BusRouteStop[];
  };
  status: string;
}

export default function JourneyTrackerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const busId = params.busId as string;

  const fromStop = searchParams.get('fromStop') || '';
  const toStop = searchParams.get('toStop') || '';
  
  // --- State Management ---
  const [busData, setBusData] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // State for the booking modal and fare
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [farePerSeat, setFarePerSeat] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  // --- Component Lifecycle & Data Fetching ---
  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    if(isAuthenticated && busId) {
      const fetchBusDetails = async () => {
        setLoading(true);
        setApiError(null);
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(`${API_BASE_URL}/buses/${busId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch bus details');
          }
          const data = await response.json();
          setBusData(data.bus);
        } catch (error: any) {
          setApiError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBusDetails();
    }
  }, [busId, isAuthenticated]);
  
  // EFFECT FOR DYNAMIC FARE CALCULATION
  useEffect(() => {
    if (busData && fromStop && toStop) {
      const stops = busData.route.stops.map(s => s.name);
      const fromIndex = stops.indexOf(fromStop);
      const toIndex = stops.indexOf(toStop);

      if (fromIndex !== -1 && toIndex !== -1 && toIndex > fromIndex) {
        const stopsTraveled = toIndex - fromIndex;
        let newFare = 0;
        if (stopsTraveled >= 1 && stopsTraveled <= 4) {
          newFare = 10;
        } else if (stopsTraveled >= 5 && stopsTraveled <= 7) {
          newFare = 15;
        } else if (stopsTraveled >= 8 && stopsTraveled <= 14) {
          newFare = 20;
        } else {
          newFare = 25;
        }
        setFarePerSeat(newFare);
      }
    }
  }, [busData, fromStop, toStop]);

  // Effect for the background canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = document.body.scrollHeight; };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1, opacity: Math.random() * 0.3 + 0.1,
        color: Math.random() > 0.5 ? 'rgba(59, 130, 246,' : 'rgba(139, 92, 246,'
    }));
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${p.opacity})`; ctx.fill();
        });
        animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationFrameId);
    };
  }, [busData]);

  // --- Helper Functions ---
  const findStopTime = (stops: BusRouteStop[] = [], stopName: string) => stops.find(s => s.name === stopName)?.time || "N/A";
  
  const handlePayment = async () => {
    if (!upiId.trim()) {
      alert("Please enter your UPI ID.");
      return;
    }
    setIsProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessingPayment(false);
    setIsModalOpen(false);
    alert(`Payment successful! Your ticket for ${selectedSeats} seat(s) is confirmed. Redirecting...`);
    router.push("/tickets");
  };

  // Mock data for UI elements not present in the API response
  const operator = "City Transports";
  const speed = Math.floor(Math.random() * (55 - 35) + 35);
  const seatsAvailable = busData ? Math.floor(Math.random() * (busData.capacity * 0.6)) : 0;
  const seatsBooked = busData ? busData.capacity - seatsAvailable : 0;
  const totalFare = farePerSeat * selectedSeats;
  const liveEta = Math.floor(Math.random() * (150 - 90) + 90);

  // --- RENDER LOGIC ---

  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96 text-center p-6 bg-background/80 backdrop-blur-sm">
          <FaUser className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground mb-4">Please sign in to view journey details.</p>
          <Button onClick={() => router.push("/login")}>Sign In</Button>
        </Card>
      </div>
    );
  }

  if (apiError || !busData) {
    return (
      <div className="container mx-auto px-4 py-8">
         <Card className="text-center p-8 bg-background/80 backdrop-blur-sm">
            <FaExclamationTriangle className="text-6xl text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Could Not Load Bus Details</h3>
            <p className="text-muted-foreground mb-4">
              <strong>Error:</strong> {apiError || "The requested bus could not be found."}
            </p>
            <Button onClick={() => router.push('/find')}>Find Another Bus</Button>
         </Card>
      </div>
    );
  }

  const { busNumber, type, capacity, route, status } = busData;
  const departureTime = findStopTime(route.stops, fromStop);
  const arrivalTime = findStopTime(route.stops, toStop);
  const upiPaymentLink = `upi://pay?pa=${upiId}&pn=CityBusApp&am=${totalFare}&cu=INR&tn=Booking for ${busNumber}`;
  
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  return (
    <div className="container mx-auto px-4 py-8 relative overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1 }}
      />
      <div className="relative z-10">
        <div className="mb-8 animate-fade-in">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 text-blue-300">
            🚌 Journey Details & Booking
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-text">
            {fromStop} to {toStop}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl opacity-90">
            Confirm your trip details and book your tickets instantly.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    <FaLocationArrow className="mr-2" /> Live Tracking
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={status === "ACTIVE" ? "default" : "secondary"} className="bg-green-500/20 text-green-300 border-green-500/30">
                      {status}
                    </Badge>
                    <div className="flex items-center text-sm text-green-400">
                      <FaWifi className="mr-1 animate-pulse" /> Live
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-blue-50/10 to-pink-50/10 dark:from-blue-950/20 dark:to-pink-950/20 rounded-lg border">
                  <p>Live map integration coming soon...</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <FaRoute className="mr-2" /> Route Stops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {route.stops.map((stop, index) => {
                    const isBoarding = stop.name === fromStop;
                    const isDestination = stop.name === toStop;
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full border-2 ${isBoarding ? "bg-green-500 border-green-500 shadow-lg" : isDestination ? "bg-red-500 border-red-500 shadow-lg" : "bg-gray-300 border-gray-300"}`}></div>
                          {index < route.stops.length - 1 && (<div className="w-0.5 h-10 bg-gradient-to-b from-blue-300 to-purple-300 mt-2"></div>)}
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                           <p className={`font-medium ${isBoarding ? "text-green-600 dark:text-green-400" : isDestination ? "text-red-600 dark:text-red-400" : ""}`}>
                              {stop.name}
                              {isBoarding && <Badge className="ml-2 text-xs bg-green-500/20 text-green-300 border-green-500/30">Boarding</Badge>}
                              {isDestination && <Badge className="ml-2 text-xs bg-red-500/20 text-red-300 border-red-500/30">Destination</Badge>}
                            </p>
                           <p className="text-sm font-medium">{stop.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <FaBus className="mr-2" /> Bus Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Bus Number</span><span className="font-medium">{busNumber}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Operator</span><span className="font-medium">{operator}</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Type</span><Badge variant={type === "ac" ? "default" : "secondary"} className="bg-blue-500/20 text-blue-300 border-blue-500/30">{type.toUpperCase()}</Badge></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Capacity</span><span className="font-medium">{capacity} seats</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Speed</span><span className="font-medium flex items-center"><FaTachometerAlt className="mr-1 text-blue-400" />{speed} km/h</span></div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <FaClock className="mr-2" /> Journey Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Departure</span><span className="font-medium">{departureTime}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Arrival</span><span className="font-medium">{arrivalTime}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Live ETA</span><span className="font-medium text-green-400">{Math.floor(liveEta / 60)}h {liveEta % 60}m</span></div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <FaUsers className="mr-2" /> Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>Booked</span><span>{seatsBooked}/{capacity}</span></div>
                    <Progress value={(seatsBooked / capacity) * 100} className="h-2" />
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">{seatsAvailable} seats available</Badge>
                  </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <FaTicketAlt className="mr-2" /> Book Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Number of Seats</Label>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedSeats(Math.max(1, selectedSeats - 1))} disabled={selectedSeats <= 1}>-</Button>
                    <span className="font-medium min-w-[2rem] text-center">{selectedSeats}</span>
                    <Button variant="outline" size="sm" onClick={() => setSelectedSeats(Math.min(seatsAvailable, selectedSeats + 1))} disabled={selectedSeats >= seatsAvailable}>+</Button>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total Fare</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">₹{totalFare}</span>
                  </div>
                  
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl" disabled={seatsAvailable === 0}>
                        <FaArrowRight className="mr-2" /> Book Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-background/80 backdrop-blur-sm">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Confirm Your Booking</DialogTitle>
                        <DialogDescription>
                          Please verify your journey details before payment.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="my-4 p-4 border rounded-lg bg-primary/5">
                        <h3 className="font-semibold mb-4 text-lg">Journey Summary</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                            <div className="flex items-center"><FaBus className="mr-2 text-primary" /> Bus Number:</div>
                            <div className="font-semibold">{busNumber} ({type.toUpperCase()})</div>
                            
                            <div className="flex items-center"><FaRoute className="mr-2 text-primary" /> Route:</div>
                            <div className="font-semibold">{fromStop} → {toStop}</div>
                            
                            <div className="flex items-center"><FaUsers className="mr-2 text-primary" /> Passengers:</div>
                            <div className="font-semibold">{selectedSeats}</div>
                            
                            <div className="flex items-center"><FaCalendarAlt className="mr-2 text-primary" /> Date:</div>
                            <div className="font-semibold">{formattedDate}</div>
                            
                            <div className="flex items-center font-bold text-base"><FaMoneyBillWave className="mr-2 text-primary" /> Total Fare:</div>
                            <div className="font-bold text-lg text-primary">₹{totalFare}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-4 border-t">
                         <h3 className="text-lg font-semibold">Payment via UPI</h3>
                         <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-1 w-full space-y-1">
                                <Label htmlFor="upiId">Enter UPI ID</Label>
                                <Input id="upiId" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                            </div>
                            <div className="text-muted-foreground">OR</div>
                            <div className="text-center">
                                <p className="text-sm mb-2">Scan QR</p>
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(upiPaymentLink)}`}
                                  alt="UPI QR Code"
                                  className="rounded-md mx-auto"
                                />
                            </div>
                         </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full mt-4"
                          onClick={handlePayment}
                          disabled={isProcessingPayment || !upiId}
                        >
                          {isProcessingPayment ? (
                            <><FaSpinner className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                          ) : (
                            `Confirm & Pay ₹${totalFare}`
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}