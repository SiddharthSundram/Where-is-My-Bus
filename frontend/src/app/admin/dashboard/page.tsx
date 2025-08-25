"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FaUsers, 
  FaBus, 
  FaTicketAlt, 
  FaMoneyBill, 
  FaMapMarkerAlt, 
  FaChartLine,
  FaExclamationTriangle,
  FaCog,
  FaRoute,
  FaCalendar,
  FaClock,
  FaLocationArrow
} from "react-icons/fa";
import { CSSShuttleBackground } from "@/components/shuttle-background";

interface DashboardStats {
  totalUsers: number;
  totalBuses: number;
  totalBookings: number;
  totalRevenue: number;
  activeBuses: number;
  todayBookings: number;
  todayRevenue: number;
}

interface LiveBus {
  id: string;
  busNumber: string;
  route: string;
  location: {
    lat: number;
    lng: number;
  };
  speed: number;
  status: "ACTIVE" | "INACTIVE" | "DELAYED";
  lastUpdate: string;
}

interface RecentActivity {
  id: string;
  type: "BOOKING" | "PAYMENT" | "USER_REGISTRATION" | "BUS_UPDATE";
  description: string;
  timestamp: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [liveBuses, setLiveBuses] = useState<LiveBus[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockStats: DashboardStats = {
      totalUsers: 15420,
      totalBuses: 850,
      totalBookings: 45630,
      totalRevenue: 2345000,
      activeBuses: 720,
      todayBookings: 1245,
      todayRevenue: 84500
    };

    const mockLiveBuses: LiveBus[] = [
      {
        id: "1",
        busNumber: "MH-01-AB-1234",
        route: "Mumbai-Pune",
        location: { lat: 19.0760, lng: 72.8777 },
        speed: 45,
        status: "ACTIVE",
        lastUpdate: "2024-01-15T14:30:00"
      },
      {
        id: "2",
        busNumber: "DL-01-CD-5678",
        route: "Delhi-Gurgaon",
        location: { lat: 28.6139, lng: 77.2090 },
        speed: 35,
        status: "DELAYED",
        lastUpdate: "2024-01-15T14:25:00"
      },
      {
        id: "3",
        busNumber: "KA-01-EF-9012",
        route: "Bangalore-Mysore",
        location: { lat: 12.9716, lng: 77.5946 },
        speed: 50,
        status: "ACTIVE",
        lastUpdate: "2024-01-15T14:28:00"
      },
      {
        id: "4",
        busNumber: "TN-01-GH-3456",
        route: "Chennai-Coimbatore",
        location: { lat: 13.0827, lng: 80.2707 },
        speed: 0,
        status: "INACTIVE",
        lastUpdate: "2024-01-15T14:15:00"
      }
    ];

    const mockRecentActivity: RecentActivity[] = [
      {
        id: "1",
        type: "BOOKING",
        description: "New booking for Mumbai-Pune route (BK001234)",
        timestamp: "2024-01-15T14:28:00",
        status: "SUCCESS"
      },
      {
        id: "2",
        type: "PAYMENT",
        description: "Payment received for booking BK001233 - ₹560",
        timestamp: "2024-01-15T14:25:00",
        status: "SUCCESS"
      },
      {
        id: "3",
        type: "USER_REGISTRATION",
        description: "New user registration: john.doe@email.com",
        timestamp: "2024-01-15T14:20:00",
        status: "SUCCESS"
      },
      {
        id: "4",
        type: "BUS_UPDATE",
        description: "Bus MH-01-AB-1234 location updated",
        timestamp: "2024-01-15T14:18:00",
        status: "SUCCESS"
      },
      {
        id: "5",
        type: "PAYMENT",
        description: "Payment failed for booking BK001232",
        timestamp: "2024-01-15T14:15:00",
        status: "FAILED"
      }
    ];

    setTimeout(() => {
      setStats(mockStats);
      setLiveBuses(mockLiveBuses);
      setRecentActivity(mockRecentActivity);
      setLoading(false);
    }, 1500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "SUCCESS":
        return "bg-green-500";
      case "DELAYED":
      case "PENDING":
        return "bg-yellow-500";
      case "INACTIVE":
      case "FAILED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "DELAYED":
        return "Delayed";
      case "INACTIVE":
        return "Inactive";
      case "SUCCESS":
        return "Success";
      case "PENDING":
        return "Pending";
      case "FAILED":
        return "Failed";
      default:
        return status;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "BOOKING":
        return <FaTicketAlt className="text-blue-500" />;
      case "PAYMENT":
        return <FaMoneyBill className="text-green-500" />;
      case "USER_REGISTRATION":
        return <FaUsers className="text-purple-500" />;
      case "BUS_UPDATE":
        return <FaBus className="text-orange-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
        <CSSShuttleBackground />
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage your bus tracking system</p>
          </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="live">Live Tracking</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
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
          </TabsContent>
        </Tabs>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
        <CSSShuttleBackground />
        <div className="relative z-10">
          <Card className="text-center py-12">
            <CardContent>
              <FaExclamationTriangle className="text-6xl text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Failed to load dashboard</h3>
              <p className="text-muted-foreground mb-4">Please try refreshing the page.</p>
              <Button onClick={() => window.location.reload()}>Refresh</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <CSSShuttleBackground />
      <div className="relative z-10">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage your bus tracking system</p>
            </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <FaLocationArrow className="mr-1" />
              System Online
            </Badge>
            <Button variant="outline" size="sm">
              <FaCog className="mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="live">Live Tracking</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <FaUsers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
                <FaBus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBuses}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeBuses} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <FaTicketAlt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.todayBookings} today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <FaMoneyBill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
                <p className="text-xs text-muted-foreground">
                  +₹{stats.todayRevenue} today
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <FaUsers className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <CardTitle className="text-lg">Manage Users</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  View and manage user accounts
                </p>
                <Button className="w-full" asChild>
                  <a href="/admin/manage/users">View Users</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <FaBus className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <CardTitle className="text-lg">Manage Buses</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Add, edit, and monitor buses
                </p>
                <Button className="w-full" asChild>
                  <a href="/admin/manage/buses">View Buses</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <FaRoute className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <CardTitle className="text-lg">Manage Routes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure routes and stops
                </p>
                <Button className="w-full" asChild>
                  <a href="/admin/manage/routes">View Routes</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <FaChartLine className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <CardTitle className="text-lg">Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  View reports and insights
                </p>
                <Button className="w-full" asChild>
                  <a href="/admin/analytics">View Analytics</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Live Tracking Tab */}
        <TabsContent value="live" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                Live Bus Tracking
              </CardTitle>
              <CardDescription>Real-time location and status of all active buses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg border relative overflow-hidden mb-6">
                {/* Simplified live map representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative mb-8">
                      {/* Map background with grid */}
                      <div className="w-80 h-80 bg-blue-100 dark:bg-blue-900 rounded-lg relative overflow-hidden">
                        {/* Grid lines */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
                            {[...Array(16)].map((_, i) => (
                              <div key={i} className="border border-gray-300"></div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Bus markers */}
                        {liveBuses.map((bus, index) => (
                          <div
                            key={bus.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: `${20 + (index * 20)}%`,
                              top: `${20 + (index * 15)}%`
                            }}
                          >
                            <div className="relative">
                              <FaBus className={`text-2xl ${
                                bus.status === "ACTIVE" ? "text-green-600" :
                                bus.status === "DELAYED" ? "text-yellow-600" :
                                "text-red-600"
                              }`} />
                              <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                                bus.status === "ACTIVE" ? "bg-green-500 animate-pulse" :
                                bus.status === "DELAYED" ? "bg-yellow-500" :
                                "bg-red-500"
                              }`}></div>
                            </div>
                            <div className="text-xs mt-1 bg-white dark:bg-gray-800 px-1 rounded whitespace-nowrap">
                              {bus.busNumber}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Active ({liveBuses.filter(b => b.status === "ACTIVE").length})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Delayed ({liveBuses.filter(b => b.status === "DELAYED").length})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Inactive ({liveBuses.filter(b => b.status === "INACTIVE").length})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Bus List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Active Buses</h3>
                <div className="grid gap-4">
                  {liveBuses.map((bus) => (
                    <div key={bus.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <FaBus className={`text-xl ${
                            bus.status === "ACTIVE" ? "text-green-600" :
                            bus.status === "DELAYED" ? "text-yellow-600" :
                            "text-red-600"
                          }`} />
                          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                            bus.status === "ACTIVE" ? "bg-green-500 animate-pulse" :
                            bus.status === "DELAYED" ? "bg-yellow-500" :
                            "bg-red-500"
                          }`}></div>
                        </div>
                        <div>
                          <p className="font-medium">{bus.busNumber}</p>
                          <p className="text-sm text-muted-foreground">{bus.route}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Speed</p>
                          <p className="font-medium">{bus.speed} km/h</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge className={`${getStatusColor(bus.status)} text-white`}>
                            {getStatusText(bus.status)}
                          </Badge>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Last Update</p>
                          <p className="font-medium text-xs">
                            {new Date(bus.lastUpdate).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaClock className="mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest system activities and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(activity.status)} text-white`}>
                          {getStatusText(activity.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Weekly booking patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaChartLine className="text-4xl text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Booking chart visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaMoneyBill className="text-4xl text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Revenue chart visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaUsers className="text-4xl text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">User growth chart visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Route Performance</CardTitle>
                <CardDescription>Most popular routes and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaRoute className="text-4xl text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Route performance chart visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">98.5%</p>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-green-600">2.3s</p>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">94%</p>
                  <p className="text-sm text-muted-foreground">On-Time Performance</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">4.8</p>
                  <p className="text-sm text-muted-foreground">User Rating</p>
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