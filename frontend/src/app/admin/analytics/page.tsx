"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FaChartLine, 
  FaMoneyBill, 
  FaUsers, 
  FaBus, 
  FaRoute, 
  FaCalendar,
  FaDownload,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaStar,
  FaMapMarkerAlt,
  FaTicketAlt
} from "react-icons/fa";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { CSSShuttleBackground } from "@/components/shuttle-background";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalBuses: number;
    totalRoutes: number;
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
  };
  bookings: {
    daily: Array<{ date: string; count: number; revenue: number }>;
    weekly: Array<{ week: string; count: number; revenue: number }>;
    monthly: Array<{ month: string; count: number; revenue: number }>;
  };
  revenue: {
    byRoute: Array<{ routeName: string; revenue: number; bookings: number }>;
    byCity: Array<{ city: string; revenue: number; bookings: number }>;
    byBusType: Array<{ type: string; revenue: number; bookings: number }>;
  };
  performance: {
    onTimePerformance: number;
    averageDelay: number;
    customerSatisfaction: number;
    routeUtilization: Array<{ routeName: string; utilization: number }>;
  };
  userBehavior: {
    newUsers: Array<{ date: string; count: number }>;
    topUsers: Array<{ name: string; bookings: number; spent: number }>;
    bookingPatterns: Array<{ time: string; count: number }>;
  };
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedRoute, setSelectedRoute] = useState("all");

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockAnalyticsData: AnalyticsData = {
      overview: {
        totalUsers: 15420,
        totalBuses: 850,
        totalRoutes: 125,
        totalBookings: 45630,
        totalRevenue: 2345000,
        averageRating: 4.8
      },
      bookings: {
        daily: [
          { date: "2024-01-09", count: 145, revenue: 8450 },
          { date: "2024-01-10", count: 168, revenue: 9200 },
          { date: "2024-01-11", count: 132, revenue: 7800 },
          { date: "2024-01-12", count: 189, revenue: 11200 },
          { date: "2024-01-13", count: 156, revenue: 8900 },
          { date: "2024-01-14", count: 178, revenue: 10500 },
          { date: "2024-01-15", count: 195, revenue: 12450 }
        ],
        weekly: [
          { week: "Week 1", count: 890, revenue: 52000 },
          { week: "Week 2", count: 945, revenue: 58000 },
          { week: "Week 3", count: 1020, revenue: 64000 },
          { week: "Week 4", count: 1150, revenue: 72000 }
        ],
        monthly: [
          { month: "Oct", count: 3200, revenue: 185000 },
          { month: "Nov", count: 3800, revenue: 220000 },
          { month: "Dec", count: 4200, revenue: 245000 },
          { month: "Jan", count: 4000, revenue: 234500 }
        ]
      },
      revenue: {
        byRoute: [
          { routeName: "Mumbai-Pune", revenue: 450000, bookings: 8500 },
          { routeName: "Delhi-Gurgaon", revenue: 320000, bookings: 6200 },
          { routeName: "Bangalore-Mysore", revenue: 280000, bookings: 4800 },
          { routeName: "Chennai-Coimbatore", revenue: 195000, bookings: 3200 },
          { routeName: "Kolkata-Digha", revenue: 180000, bookings: 2800 }
        ],
        byCity: [
          { city: "Mumbai", revenue: 520000, bookings: 9800 },
          { city: "Delhi", revenue: 480000, bookings: 9200 },
          { city: "Bangalore", revenue: 380000, bookings: 7200 },
          { city: "Chennai", revenue: 290000, bookings: 5600 },
          { city: "Kolkata", revenue: 220000, bookings: 4200 }
        ],
        byBusType: [
          { type: "AC", revenue: 1450000, bookings: 28000 },
          { type: "NON_AC", revenue: 895000, bookings: 17630 }
        ]
      },
      performance: {
        onTimePerformance: 94.2,
        averageDelay: 8.5,
        customerSatisfaction: 4.8,
        routeUtilization: [
          { routeName: "Mumbai-Pune", utilization: 87 },
          { routeName: "Delhi-Gurgaon", utilization: 92 },
          { routeName: "Bangalore-Mysore", utilization: 78 },
          { routeName: "Chennai-Coimbatore", utilization: 65 },
          { routeName: "Kolkata-Digha", utilization: 71 }
        ]
      },
      userBehavior: {
        newUsers: [
          { date: "2024-01-09", count: 45 },
          { date: "2024-01-10", count: 52 },
          { date: "2024-01-11", count: 38 },
          { date: "2024-01-12", count: 67 },
          { date: "2024-01-13", count: 43 },
          { date: "2024-01-14", count: 58 },
          { date: "2024-01-15", count: 71 }
        ],
        topUsers: [
          { name: "John Doe", bookings: 25, spent: 12500 },
          { name: "Jane Smith", bookings: 18, spent: 8900 },
          { name: "Mike Johnson", bookings: 15, spent: 7200 },
          { name: "Sarah Wilson", bookings: 12, spent: 5600 },
          { name: "David Brown", bookings: 10, spent: 4800 }
        ],
        bookingPatterns: [
          { time: "06:00", count: 45 },
          { time: "09:00", count: 120 },
          { time: "12:00", count: 85 },
          { time: "15:00", count: 95 },
          { time: "18:00", count: 140 },
          { time: "21:00", count: 65 }
        ]
      }
    };

    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData);
      setLoading(false);
    }, 1500);
  }, []);

  const handleExportReport = () => {
    // Simulate report export
    const reportData = {
      dateRange,
      selectedCity,
      selectedRoute,
      exportDate: new Date().toISOString(),
      data: analyticsData
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
        <CSSShuttleBackground />
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
            <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
          </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
        <CSSShuttleBackground />
        <div className="relative z-10">
          <Card className="text-center py-12">
          <CardContent>
            <FaChartLine className="text-6xl text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Failed to load analytics</h3>
            <p className="text-muted-foreground mb-4">Please try refreshing the page.</p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  const { overview, bookings, revenue, performance, userBehavior } = analyticsData;

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <CSSShuttleBackground />
      <div className="relative z-10">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
            <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label>Date Range:</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExportReport}>
              <FaDownload className="mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <FaUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <FaArrowUp className="inline mr-1 text-green-500" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
            <FaBus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalBuses}</div>
            <p className="text-xs text-muted-foreground">
              <FaArrowUp className="inline mr-1 text-green-500" />
              +5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <FaRoute className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalRoutes}</div>
            <p className="text-xs text-muted-foreground">
              <FaArrowUp className="inline mr-1 text-green-500" />
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <FaTicketAlt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <FaArrowUp className="inline mr-1 text-green-500" />
              +15% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FaMoneyBill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(overview.totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              <FaArrowUp className="inline mr-1 text-green-500" />
              +18% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <FaStar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Customer satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">User Behavior</TabsTrigger>
        </TabsList>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Daily Bookings</CardTitle>
                <CardDescription>Booking trends over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaChartLine className="text-4xl text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Daily bookings chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Bookings</CardTitle>
                <CardDescription>Weekly booking patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaChartLine className="text-4xl text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Weekly bookings chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Bookings</CardTitle>
                <CardDescription>Monthly booking trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaChartLine className="text-4xl text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Monthly bookings chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking Patterns</CardTitle>
              <CardDescription>Peak booking times throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FaClock className="text-4xl text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Booking patterns chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Route</CardTitle>
                <CardDescription>Top performing routes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenue.byRoute.slice(0, 5).map((route, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{route.routeName}</p>
                        <p className="text-sm text-muted-foreground">{route.bookings} bookings</p>
                      </div>
                      <p className="font-semibold">₹{route.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by City</CardTitle>
                <CardDescription>Revenue distribution across cities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaMapMarkerAlt className="text-4xl text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Revenue by city chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Bus Type</CardTitle>
                <CardDescription>AC vs Non-AC revenue comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenue.byBusType.map((type, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{type.type}</p>
                        <p className="text-sm text-muted-foreground">{type.bookings} bookings</p>
                      </div>
                      <p className="font-semibold">₹{type.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">On-Time Performance</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {performance.onTimePerformance}%
                </div>
                <p className="text-sm text-muted-foreground">Buses arriving on time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Average Delay</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {performance.averageDelay} min
                </div>
                <p className="text-sm text-muted-foreground">Average delay time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {performance.customerSatisfaction}/5
                </div>
                <p className="text-sm text-muted-foreground">Average rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Active Buses</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {Math.round(overview.totalBuses * 0.85)}
                </div>
                <p className="text-sm text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Route Utilization</CardTitle>
              <CardDescription>Capacity utilization across routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.routeUtilization.map((route, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{route.routeName}</p>
                      <p className="text-sm">{route.utilization}%</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          route.utilization > 80 ? 'bg-red-500' :
                          route.utilization > 60 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${route.utilization}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Behavior Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>New User Acquisition</CardTitle>
                <CardDescription>Daily new user signups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaUsers className="text-4xl text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">New user acquisition chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Users</CardTitle>
                <CardDescription>Most active users by bookings and spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userBehavior.topUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.bookings} bookings</p>
                      </div>
                      <p className="font-semibold">₹{user.spent.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Booking Time Distribution</CardTitle>
              <CardDescription>When users book their tickets throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FaClock className="text-4xl text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Booking time distribution chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
    </div>
  );
}