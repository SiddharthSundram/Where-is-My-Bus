"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CSSShuttleBackground } from "@/components/shuttle-background";
import { 
  FaSearch, 
  FaBus, 
  FaMapMarkerAlt, 
  FaClock, 
  FaStar,
  FaRoute, 
  FaUser,
  FaArrowRight,
  FaLocationArrow
} from "react-icons/fa";

// --- Type Definitions ---
interface BusRouteStop {
  name: string;
  order: number; // For fare calculation
  time: string;  // For displaying departure/arrival times
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

interface SearchResultBus extends Bus {
    rating: string;
    fare: number;
}

// --- Fare Calculation Helper ---
const calculateFare = (fromStopName: string, toStopName: string, stops: BusRouteStop[]): number => {
    const fromStop = stops.find(s => s.name === fromStopName);
    const toStop = stops.find(s => s.name === toStopName);

    if (!fromStop || !toStop) return 0;

    const stopsTravelled = Math.abs(toStop.order - fromStop.order);
    
    if (stopsTravelled <= 4) return 10;
    if (stopsTravelled <= 7) return 15;
    if (stopsTravelled <= 20) return 20; // 8 to 20 stops
    return 25; // More than 20 stops
};

export default function FindBusPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [allBuses, setAllBuses] = useState<Bus[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResultBus[]>([]);
  
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    city: "",
    fromStop: "",
    toStop: "",
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
      const fetchInitialData = async () => {
        try {
          const headers = { 'Authorization': `Bearer ${token}` };
          const busesRes = await fetch(`${API_BASE_URL}/buses/`, { headers });
          if (!busesRes.ok) throw new Error('Failed to fetch bus data');
          const busesData = await busesRes.json();
          const allBusData: Bus[] = busesData.buses || [];
          setAllBuses(allBusData);

          const activeBuses = allBusData.filter(bus => bus.status === 'ACTIVE');
          const activeCities = new Set(activeBuses.map(bus => bus.route.city));
          setCities(Array.from(activeCities).sort());

        } catch (error: any) {
          setApiError(error.message);
        }
      };
      fetchInitialData();
    } else {
      setIsAuthenticated(false);
    }
    setLoadingAuth(false);
  }, []);

  const availableStops = useMemo(() => {
    if (!formData.city) return [];
    
    const activeBusesInCity = allBuses.filter(bus => 
        bus.status === 'ACTIVE' && bus.route.city === formData.city
    );

    const stopsSet = new Set<string>();
    activeBusesInCity.forEach(bus => {
        bus.route.stops.forEach(stop => {
            stopsSet.add(stop.name);
        });
    });

    return Array.from(stopsSet).sort();
  }, [formData.city, allBuses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "city") {
      setFormData(prev => ({ ...prev, fromStop: "", toStop: "" }));
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError(null);
    setShowResults(false);
    
    // We search on the client side using the pre-fetched list of all buses
    const results = allBuses.filter(bus =>
        bus.status === 'ACTIVE' &&
        bus.route.city === formData.city &&
        bus.route.stops.some(stop => stop.name === formData.fromStop) &&
        bus.route.stops.some(stop => stop.name === formData.toStop)
    );

    const processedResults = results.map(bus => ({
      ...bus,
      rating: (Math.random() * (4.9 - 4.0) + 4.0).toFixed(1),
      fare: calculateFare(formData.fromStop, formData.toStop, bus.route.stops),
    }));

    setSearchResults(processedResults);
    setShowResults(true);
    setIsLoading(false);
  };

  const handleViewJourney = (busId: string) => {
    router.push(`/journey/${busId}?fromStop=${encodeURIComponent(formData.fromStop)}&toStop=${encodeURIComponent(formData.toStop)}`);
  };
  
  // Helper to find the specific time for a stop from a bus's route data
  const findStopTime = (stops: BusRouteStop[], stopName: string) => stops.find(s => s.name === stopName)?.time || "N/A";

  if (!isMounted || loadingAuth) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>;
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen"><Card className="w-96"><CardContent className="pt-6 text-center"><FaUser className="w-16 h-16 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">Authentication Required</h3><p className="text-muted-foreground mb-4">Please sign in to search for buses</p><Button onClick={() => router.push("/login")}>Sign In</Button></CardContent></Card></div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40">
        <CSSShuttleBackground />
        <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 text-blue-300">🚌 Bus Search</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-text">Find Your Bus</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto opacity-90">Search for active buses on your route</p>
        </div>
      </section>

      <section className="py-12 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10 z-0"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <Card className="shadow-2xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm border-primary/20 animate-scale-in">
            <CardHeader className="text-center"><CardTitle className="flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"><FaSearch className="mr-2" /> Search Buses</CardTitle><CardDescription className="text-base opacity-90">Find available buses from active routes</CardDescription></CardHeader>
            <CardContent>
              {apiError && <div className="mb-4 p-3 text-center text-red-800 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300"><strong>Error:</strong> {apiError}</div>}
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2"><Label htmlFor="city" className="text-sm font-semibold">Select City *</Label><select id="city" name="city" required value={formData.city} onChange={handleInputChange} className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><option value="">Select your city</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}</select></div>
                {formData.city && <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="fromStop" className="text-sm font-semibold">From *</Label><div className="relative"><FaMapMarkerAlt className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400" /><select id="fromStop" name="fromStop" required value={formData.fromStop} onChange={handleInputChange} className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 pl-12 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><option value="">Select boarding point</option>{availableStops.map((stop) => <option key={stop} value={stop}>{stop}</option>)}</select></div></div><div className="space-y-2"><Label htmlFor="toStop" className="text-sm font-semibold">To *</Label><div className="relative"><FaMapMarkerAlt className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-400" /><select id="toStop" name="toStop" required value={formData.toStop} onChange={handleInputChange} className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 pl-12 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><option value="">Select destination</option>{availableStops.map((stop) => <option key={stop} value={stop}>{stop}</option>)}</select></div></div></div>}
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-semibold" disabled={isLoading || !formData.city || !formData.fromStop || !formData.toStop}>{isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <><FaSearch className="mr-2" />Search Buses</>}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {showResults && (
        <section className="py-12 px-4 relative">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex items-center justify-between mb-8"><h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Available Buses</h2><Badge variant="outline" className="flex items-center px-4 py-2"><FaBus className="mr-2" />{searchResults.length} {searchResults.length === 1 ? 'bus' : 'buses'} found</Badge></div>
            {searchResults.length === 0 ? (<Card className="text-center p-8"><p className="text-muted-foreground">No active buses found for the selected route.</p></Card>) : (
              <div className="space-y-6">
                {searchResults.map((bus, index) => {
                  const departureTime = findStopTime(bus.route.stops, formData.fromStop);
                  const arrivalTime = findStopTime(bus.route.stops, formData.toStop);
                  return (
                    <Card 
                        key={bus._id} 
                        className="overflow-hidden border-t-4 border-primary/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm animate-scale-in" 
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CardContent className="p-4 flex flex-col md:flex-row items-stretch">
                          {/* Column 1: Bus and Journey Details */}
                          <div className="flex-grow p-2 space-y-4">
                            {/* Top Section: Bus Info */}
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-4 shadow-lg shrink-0">
                                  <FaBus className="text-2xl" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{bus.busNumber}</h3>
                                  <p className="text-sm text-muted-foreground">{bus.busCategory}</p>
                                </div>
                              </div>
                              <Badge variant={bus.type === 'AC' ? 'default' : 'secondary'}>
                                {bus.type}
                              </Badge>
                            </div>
                            
                            {/* Star Rating */}
                            <div className="flex items-center pl-1">
                              <div className="flex text-yellow-400 mr-2">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} className={i < Math.floor(Number(bus.rating)) ? "text-current drop-shadow-sm" : "text-gray-600"} />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">({bus.rating} rating)</span>
                            </div>

                            <hr className="border-border/50" />

                            {/* Bottom Section: Journey Info */}
                            <div className="flex items-center justify-around text-center">
                              <div className="w-2/5">
                                <Label className="text-xs text-muted-foreground">From</Label>
                                <p className="font-semibold truncate" title={formData.fromStop}>{formData.fromStop}</p>
                              </div>
                              <FaArrowRight className="text-primary text-lg shrink-0" />
                              <div className="w-2/5">
                                <Label className="text-xs text-muted-foreground">To</Label>
                                <p className="font-semibold truncate" title={formData.toStop}>{formData.toStop}</p>
                              </div>
                            </div>
                          </div>

                          {/* Column 2: Fare and Action */}
                          <div className="flex-shrink-0 w-full md:w-48 mt-4 md:mt-0 md:ml-4 p-4 bg-muted/50 rounded-lg flex flex-col items-center justify-center space-y-3">
                              <div className="text-center">
                                  <p className="text-xs text-muted-foreground">Fare</p>
                                  <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">₹{bus.fare}</p>
                              </div>
                              <Button onClick={() => handleViewJourney(bus._id)} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                  <FaArrowRight className="mr-2" />View Journey
                              </Button>
                          </div>
                        </CardContent>
                     </Card>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}