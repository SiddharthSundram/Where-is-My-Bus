"use client";

import { useState, useEffect } from 'react';

interface Bus {
  id: number;
  bus_number: string;
  route_id: number;
  capacity: number;
  current_location: string;
  status: string;
  created_at: string;
}

interface Route {
  id: number;
  name: string;
  start_point: string;
  end_point: string;
  distance: number;
  estimated_time: number;
  fare: number;
  created_at: string;
}

interface Stop {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  route_id: number;
  order: number;
  created_at: string;
}

interface Booking {
  id: number;
  user_id: number;
  bus_id: number;
  route_id: number;
  departure_stop: number;
  arrival_stop: number;
  departure_time: string;
  arrival_time: string;
  fare: number;
  status: string;
  payment_status: string;
  booking_reference: string;
  created_at: string;
}

interface Analytics {
  total_buses: number;
  active_routes: number;
  daily_bookings: number;
  revenue: number;
  user_growth: string;
  on_time_performance: string;
}

interface AIInsight {
  peak_hours: string[];
  popular_routes: string[];
  revenue_trends: string;
  recommendations: string[];
}

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:5000/api';

export function useFlaskAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async <T,>(endpoint: string, options?: RequestInit): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${FLASK_API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Bus operations
  const getBuses = () => fetchData<Bus[]>('/buses');
  const getBus = (id: number) => fetchData<Bus>(`/buses/${id}`);

  // Route operations
  const getRoutes = () => fetchData<Route[]>('/routes');
  const getRoute = (id: number) => fetchData<Route>(`/routes/${id}`);

  // Stop operations
  const getStops = () => fetchData<Stop[]>('/stops');
  const getStop = (id: number) => fetchData<Stop>(`/stops/${id}`);

  // Booking operations
  const getBookings = () => fetchData<Booking[]>('/bookings');
  const createBooking = (bookingData: Omit<Booking, 'id' | 'booking_reference' | 'created_at'>) =>
    fetchData<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });

  // Analytics operations
  const getAnalytics = () => fetchData<{ analytics: Analytics; insights: AIInsight }>('/analytics');

  // AI operations
  const predictArrival = (busId: number, stopId: number) =>
    fetchData('/ai/predict-arrival', {
      method: 'POST',
      body: JSON.stringify({ bus_id: busId, stop_id: stopId }),
    });

  const optimizeRoute = (routeId: number) =>
    fetchData('/ai/optimize-route', {
      method: 'POST',
      body: JSON.stringify({ route_id: routeId }),
    });

  // Real-time operations
  const getRealtimeBusLocations = () => fetchData('/realtime/bus-location');

  return {
    loading,
    error,
    getBuses,
    getBus,
    getRoutes,
    getRoute,
    getStops,
    getStop,
    getBookings,
    createBooking,
    getAnalytics,
    predictArrival,
    optimizeRoute,
    getRealtimeBusLocations,
  };
}

// React hook for real-time bus locations
export function useRealtimeBusLocations() {
  const [locations, setLocations] = useState<any[]>([]);
  const { getRealtimeBusLocations, loading, error } = useFlaskAPI();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getRealtimeBusLocations();
        setLocations(data);
      } catch (err) {
        console.error('Error fetching bus locations:', err);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [getRealtimeBusLocations]);

  return { locations, loading, error };
}

// React hook for analytics
export function useAnalytics() {
  const [analytics, setAnalytics] = useState<{ analytics: Analytics; insights: AIInsight } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${FLASK_API_URL}/analytics`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { analytics, loading, error };
}