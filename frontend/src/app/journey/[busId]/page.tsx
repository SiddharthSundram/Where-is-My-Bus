"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  FaUsers,
  FaLocationArrow,
  FaWifi,
  FaExclamationTriangle,
  FaUser,
  FaTicketAlt,
  FaArrowRight,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaSpinner
} from "react-icons/fa";

interface StopTiming {
  stop_id: string;
  stop_name: string;
  arrivalTime: string;
  departureTime: string;
}

interface Schedule {
  _id: string;
  busId: string;
  daysActive: string[];
  stop_timings: StopTiming[];
}

interface BusRouteStop {
  name: string;
  order: number;
}

interface Bus {
  _id: string;
  busNumber: string;
  busCategory: string;
  type: 'AC' | 'NON_AC';
  capacity: number;
  route: {
    name: string;
    city: string;
    stops: BusRouteStop[];
  };
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

export default function JourneyTrackerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const busId = params.busId as string;

  const fromStop = searchParams.get('fromStop') || '';
  const toStop = searchParams.get('toStop') || '';
  
  const [busData, setBusData] = useState<Bus | null>(null);
  const [scheduleData, setScheduleData] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [selectedSeats, setSelectedSeats] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [farePerSeat, setFarePerSeat] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
    else setLoading(false); 
  }, []);

  useEffect(() => {
      if(isAuthenticated && busId) {
        const fetchJourneyDetails = async () => {
          setLoading(true);
          setApiError(null);
          const token = localStorage.getItem("token");
          try {
            const [busResponse, scheduleResponse] = await Promise.all([
              fetch(`${API_BASE_URL}/buses/${busId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
              fetch(`${API_BASE_URL}/schedules/?busId=${busId}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!busResponse.ok) {
              const errorData = await busResponse.json();
              throw new Error(errorData.error || 'Failed to fetch bus details');
            }
            if (!scheduleResponse.ok) {
              const errorData = await scheduleResponse.json();
              throw new Error(errorData.error || 'Failed to fetch schedule details');
            }

            const busResult = await busResponse.json();
            const scheduleResult = await scheduleResponse.json();
            
            console.log("BUS DATA RECEIVED:", busResult.bus);
            console.log("SCHEDULE DATA RECEIVED:", scheduleResult);

            setBusData(busResult.bus);
            setScheduleData(scheduleResult[0] || null);
            
          } catch (error: any) {
            setApiError(error.message);
          } finally {
            setLoading(false);
          }
        };
        fetchJourneyDetails();
      }
  }, [busId, isAuthenticated]);
  
  useEffect(() => {
    if (busData && fromStop && toStop) {
        const stops = busData.route.stops;
        const fromStopObj = stops.find(s => s.name === fromStop);
        const toStopObj = stops.find(s => s.name === toStop);

        if (fromStopObj && toStopObj) {
            const stopsTravelled = Math.abs(toStopObj.order - fromStopObj.order);
            let newFare = 0;
            if (stopsTravelled <= 4) newFare = 10;
            else if (stopsTravelled <= 7) newFare = 15;
            else if (stopsTravelled <= 20) newFare = 20;
            else newFare = 25;
            setFarePerSeat(newFare);
        }
    }
  }, [busData, fromStop, toStop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !busData) return;
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

  if (!isMounted || loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>;
  }

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen"><Card className="w-96 text-center p-6"><FaUser className="w-16 h-16 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">Authentication Required</h3><p className="text-muted-foreground mb-4">Please sign in to view journey details.</p><Button onClick={() => router.push("/login")}>Sign In</Button></Card></div>;
  }

  if (apiError || !busData) {
    return <div className="container mx-auto px-4 py-8"><Card className="text-center p-8"><FaExclamationTriangle className="text-6xl text-destructive mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">Could Not Load Journey Details</h3><p className="text-muted-foreground mb-4"><strong>Error:</strong> {apiError || "The bus or its schedule could not be found."}</p><Button onClick={() => router.push('/find')}>Find Another Bus</Button></Card></div>;
  }

  const { busNumber, busCategory, type, capacity, route, status } = busData;
  const departureTime = scheduleData?.stop_timings.find(s => s.stop_name === fromStop)?.departureTime || "N/A";
  const arrivalTime = scheduleData?.stop_timings.find(s => s.stop_name === toStop)?.arrivalTime || "N/A";
  
  const totalFare = farePerSeat * selectedSeats;
  const upiPaymentLink = `upi://pay?pa=${upiId}&pn=CityBusApp&am=${totalFare}&cu=INR&tn=Booking for ${busNumber}`;
  const formattedDate = new Date().toLocaleDateString('en-GB');

  return (
    <div className="container mx-auto px-4 py-8 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }} />
      <div className="relative z-10">
        <div className="mb-8 animate-fade-in">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 text-blue-300">🚌 Journey Details & Booking</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-text">{fromStop} to {toStop}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl opacity-90">Confirm your trip details and book your tickets instantly.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in">
              <CardHeader><div className="flex justify-between items-center"><CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"><FaLocationArrow className="mr-2" /> Live Tracking</CardTitle><div className="flex items-center space-x-2"><Badge variant={status === "ACTIVE" ? "default" : "secondary"} className="bg-green-500/20 text-green-300 border-green-500/30">{status}</Badge><div className="flex items-center text-sm text-green-400"><FaWifi className="mr-1 animate-pulse" /> Live</div></div></div></CardHeader>
              <CardContent><div className="h-64 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-blue-50/10 to-pink-50/10 dark:from-blue-950/20 dark:to-pink-950/20 rounded-lg border"><p>Live map integration coming soon...</p></div></CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader><CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"><FaRoute className="mr-2" /> Route Stops & Schedule</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {route.stops.map((stop, index) => {
                    const isBoarding = stop.name === fromStop;
                    const isDestination = stop.name === toStop;
                    const timings = scheduleData?.stop_timings.find(t => t.stop_name === stop.name);
                    return (
                      // START: MODIFIED SECTION
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 ${isBoarding ? "bg-green-500 border-green-500 shadow-lg" : isDestination ? "bg-red-500 border-red-500 shadow-lg" : "border-gray-500"}`}></div>
                          {index < route.stops.length - 1 && (<div className="w-0.5 h-full min-h-[5rem] bg-gradient-to-b from-blue-500/50 to-purple-500/50 mt-1"></div>)}
                        </div>

                        <div className="flex-1 flex justify-between items-start pt-0.5">
                          {/* Left side: Stop Name + Arrival Times */}
                          <div>
                            <p className={`font-medium ${isBoarding ? "text-green-400" : isDestination ? "text-red-400" : ""}`}>
                              {stop.name}
                              {isBoarding && <Badge className="ml-2 text-xs bg-green-500/20 text-green-300 border-green-500/30">Boarding</Badge>}
                              {isDestination && <Badge className="ml-2 text-xs bg-red-500/20 text-red-300 border-red-500/30">Destination</Badge>}
                            </p>

                            {/* Arrival Times (Below Stop Name) */}
                            {index > 0 && ( // Don't show for the first stop
                                <div className="mt-2 text-sm">
                                    <div className="flex items-baseline justify-start space-x-2">
                                        <span className="font-semibold text-foreground">{timings?.arrivalTime || '--:--'}</span>
                                        <span className="text-xs text-muted-foreground">(Sch. Arrival)</span>
                                    </div>
                                    <div className="flex items-baseline justify-start space-x-2 text-green-400">
                                        <span className="font-semibold">--:--</span>
                                        <span className="text-xs opacity-80">(ETA Arrival)</span>
                                    </div>
                                </div>
                            )}
                          </div>

                          {/* Right side: Departure Times */}
                          <div className="text-right text-sm flex-shrink-0 pl-4">
                            {index < route.stops.length - 1 && ( // Don't show for the last stop
                                <>
                                    <div className="flex items-baseline justify-end space-x-2">
                                        <span className="font-semibold text-foreground">{timings?.departureTime || '--:--'}</span>
                                        <span className="text-xs text-muted-foreground">(Sch. Departure)</span>
                                    </div>
                                    <div className="flex items-baseline justify-end space-x-2 text-orange-400">
                                        <span className="font-semibold">--:--</span>
                                        <span className="text-xs opacity-80">(ETA Departure)</span>
                                    </div>
                                </>
                            )}
                          </div>
                        </div>
                      </div>
                      // END: MODIFIED SECTION
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader><CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"><FaBus className="mr-2" /> Bus Details</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm"><div className="flex items-center justify-between"><span className="text-muted-foreground">Bus Number</span><span className="font-medium">{busNumber}</span></div><div className="flex items-center justify-between"><span className="text-muted-foreground">Operator</span><span className="font-medium">{busCategory}</span></div><div className="flex items-center justify-between"><span className="text-muted-foreground">Type</span><Badge variant={type === "AC" ? "default" : "secondary"} className="bg-blue-500/20 text-blue-300 border-blue-500/30">{type}</Badge></div><div className="flex items-center justify-between"><span className="text-muted-foreground">Capacity</span><span className="font-medium flex items-center"><FaUsers className="mr-2 text-primary" /> {capacity} seats</span></div></CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader><CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"><FaClock className="mr-2" /> Journey Info</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm"><div className="flex items-center justify-between"><span className="text-muted-foreground">Departure from {fromStop}</span><span className="font-medium">{departureTime}</span></div><div className="flex items-center justify-between"><span className="text-muted-foreground">Arrival at {toStop}</span><span className="font-medium">{arrivalTime}</span></div>{scheduleData?.daysActive && (<div className="flex items-center justify-between pt-2 border-t border-border/50"><span className="text-muted-foreground">Runs On</span><div className="flex flex-wrap gap-1 justify-end">{scheduleData.daysActive.map(day => <Badge key={day} variant="secondary">{day.substring(0,3)}</Badge>)}</div></div>)}</CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in" style={{ animationDelay: '0.4s' }}>
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
                    <Button variant="outline" size="sm" onClick={() => setSelectedSeats(Math.min(capacity, selectedSeats + 1))} disabled={selectedSeats >= capacity}>+</Button>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total Fare</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">₹{totalFare}</span>
                  </div>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <FaArrowRight className="mr-2" /> Book Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-background/80 backdrop-blur-sm">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Confirm Your Booking</DialogTitle>
                        <DialogDescription>Please verify your journey details before payment.</DialogDescription>
                      </DialogHeader>
                      <div className="my-4 p-4 border rounded-lg bg-primary/5">
                        <h3 className="font-semibold mb-4 text-lg">Journey Summary</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                            <div className="flex items-center"><FaBus className="mr-2 text-primary" /> Bus Number:</div>
                            <div className="font-semibold">{busNumber} ({type})</div>
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
                      <div className="space-y-3 pt-4 border-t border-border/50">
                          <h3 className="text-lg font-semibold">Payment via UPI</h3>
                          <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-1 w-full space-y-1"><Label htmlFor="upiId">Enter UPI ID</Label><Input id="upiId" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} /></div>
                            <div className="text-muted-foreground">OR</div>
                            <div className="text-center"><p className="text-sm mb-2">Scan QR</p><img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(upiPaymentLink)}`} alt="UPI QR Code" className="rounded-md mx-auto" /></div>
                          </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" size="lg" className="w-full mt-4" onClick={handlePayment} disabled={isProcessingPayment || !upiId.trim()}>
                          {isProcessingPayment ? (<><FaSpinner className="mr-2 h-4 w-4 animate-spin" /> Processing...</>) : (`Confirm & Pay ₹${totalFare}`)}
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