"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { optimizeRoute } from '@/lib/ai-service';
import { CSSShuttleBackground } from '@/components/shuttle-background';
import { 
  FaRoute, 
  FaBrain, 
  FaClock, 
  FaGasPump, 
  FaLightbulb, 
  FaMapMarkerAlt,
  FaSync,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';

interface Stop {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
}

interface OptimizationResult {
  optimized_stops: Stop[];
  time_saved: number;
  fuel_saved: number;
  recommendations: string[];
}

export default function AIRouteOptimizer() {
  const [selectedRoute, setSelectedRoute] = useState('1');
  const [currentStops, setCurrentStops] = useState<Stop[]>([
    { id: 1, name: 'Mumbai Central', latitude: 19.0760, longitude: 72.8777, order: 1 },
    { id: 2, name: 'Dadar', latitude: 19.0170, longitude: 72.8440, order: 2 },
    { id: 3, name: 'Bandra', latitude: 19.0596, longitude: 72.8295, order: 3 },
    { id: 4, name: 'Andheri', latitude: 19.1136, longitude: 72.8697, order: 4 },
    { id: 5, name: 'Borivali', latitude: 19.2317, longitude: 72.8577, order: 5 },
  ]);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [trafficData, setTrafficData] = useState('moderate');
  const [passengerData, setPassengerData] = useState('high');

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await optimizeRoute(
        parseInt(selectedRoute),
        currentStops,
        { traffic: trafficData },
        { passengers: passengerData }
      );
      setOptimizationResult(result);
    } catch (error) {
      console.error('Route optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const addStop = () => {
    const newStop: Stop = {
      id: currentStops.length + 1,
      name: `Stop ${currentStops.length + 1}`,
      latitude: 19.0000 + Math.random() * 0.5,
      longitude: 72.8000 + Math.random() * 0.5,
      order: currentStops.length + 1
    };
    setCurrentStops([...currentStops, newStop]);
  };

  const removeStop = (id: number) => {
    setCurrentStops(currentStops.filter(stop => stop.id !== id));
  };

  const updateStopName = (id: number, name: string) => {
    setCurrentStops(currentStops.map(stop => 
      stop.id === id ? { ...stop, name } : stop
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Shuttle Background Animation */}
      <CSSShuttleBackground />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-2 bg-gradient-to-r from-slate-700/10 to-blue-700/10 border-slate-600/30 text-slate-300">
            <FaBrain className="mr-2" />
            AI-Powered Route Optimization
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Smart Route Optimizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Use artificial intelligence to optimize bus routes for maximum efficiency and passenger satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Route Configuration */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-300">
                <FaRoute className="text-blue-400" />
                Route Configuration
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure your route and stops for optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Route ID
                </label>
                <Input
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/30 text-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Traffic Conditions
                </label>
                <select
                  value={trafficData}
                  onChange={(e) => setTrafficData(e.target.value)}
                  className="w-full bg-slate-700/50 border-slate-600/30 text-slate-300 rounded-md px-3 py-2"
                >
                  <option value="low">Low Traffic</option>
                  <option value="moderate">Moderate Traffic</option>
                  <option value="high">High Traffic</option>
                  <option value="severe">Severe Traffic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Passenger Volume
                </label>
                <select
                  value={passengerData}
                  onChange={(e) => setPassengerData(e.target.value)}
                  className="w-full bg-slate-700/50 border-slate-600/30 text-slate-300 rounded-md px-3 py-2"
                >
                  <option value="low">Low Volume</option>
                  <option value="moderate">Moderate Volume</option>
                  <option value="high">High Volume</option>
                  <option value="very-high">Very High Volume</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-slate-300">
                    Route Stops
                  </label>
                  <Button
                    onClick={addStop}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Add Stop
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {currentStops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <Input
                          value={stop.name}
                          onChange={(e) => updateStopName(stop.id, e.target.value)}
                          className="bg-slate-600/50 border-slate-500/30 text-slate-300 text-sm"
                        />
                      </div>
                      <div className="text-xs text-slate-400">
                        {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                      </div>
                      <Button
                        onClick={() => removeStop(stop.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleOptimize}
                disabled={isOptimizing || currentStops.length < 2}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isOptimizing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Optimizing Route...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaBrain />
                    Optimize Route with AI
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Optimization Results */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-300">
                <FaSync className="text-blue-400" />
                Optimization Results
              </CardTitle>
              <CardDescription className="text-slate-400">
                AI-powered recommendations and efficiency improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {optimizationResult ? (
                <div className="space-y-6">
                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-lg p-4 border border-green-600/30">
                      <div className="flex items-center gap-2 mb-2">
                        <FaClock className="text-green-400" />
                        <span className="text-green-300 font-medium">Time Saved</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {optimizationResult.time_saved} min
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg p-4 border border-blue-600/30">
                      <div className="flex items-center gap-2 mb-2">
                        <FaGasPump className="text-blue-400" />
                        <span className="text-blue-300 font-medium">Fuel Saved</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {optimizationResult.fuel_saved} L
                      </div>
                    </div>
                  </div>

                  {/* Optimized Route */}
                  <div>
                    <h4 className="text-slate-300 font-medium mb-3">Optimized Route</h4>
                    <div className="space-y-2">
                      {optimizationResult.optimized_stops.map((stop, index) => (
                        <div key={stop.id} className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-slate-300 font-medium">{stop.name}</div>
                          </div>
                          {index < optimizationResult.optimized_stops.length - 1 && (
                            <FaArrowRight className="text-slate-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-slate-300 font-medium mb-3">AI Recommendations</h4>
                    <div className="space-y-3">
                      {optimizationResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 bg-slate-700/30 rounded-lg p-3">
                          <FaLightbulb className="text-yellow-400 mt-1 flex-shrink-0" />
                          <div className="text-slate-300 text-sm">{recommendation}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-green-400">
                    <FaCheckCircle />
                    <span className="text-sm">Route optimized successfully</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaBrain className="text-6xl text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-slate-400 mb-2">
                    Ready to Optimize
                  </h3>
                  <p className="text-slate-500">
                    Configure your route and click "Optimize Route with AI" to see intelligent recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}