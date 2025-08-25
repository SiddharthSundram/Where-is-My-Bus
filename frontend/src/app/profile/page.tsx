"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendar, 
  FaTicketAlt, 
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaSignOutAlt,
  FaBell,
  FaCog,
  FaHistory
} from "react-icons/fa";
import { format } from "date-fns";
import { CSSShuttleBackground } from "@/components/shuttle-background";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  preferences: {
    theme: "light" | "dark";
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

interface BookingHistory {
  id: string;
  bookingId: string;
  routeName: string;
  fromStop: string;
  toStop: string;
  departureTime: string;
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
  fare: number;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUser: UserProfile = {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 98765 43210",
      role: "USER",
      createdAt: "2023-06-15T10:30:00",
      preferences: {
        theme: "dark",
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      }
    };

    const mockBookingHistory: BookingHistory[] = [
      {
        id: "1",
        bookingId: "BK001",
        routeName: "Mumbai Central to Pune",
        fromStop: "Mumbai Central",
        toStop: "Pune Station",
        departureTime: "2024-01-15T14:30:00",
        status: "PAID",
        fare: 560,
        createdAt: "2024-01-10T10:30:00"
      },
      {
        id: "2",
        bookingId: "BK002",
        routeName: "Delhi to Gurgaon",
        fromStop: "Delhi ISBT",
        toStop: "Gurgaon Sector 29",
        departureTime: "2024-01-16T09:15:00",
        status: "PENDING",
        fare: 85,
        createdAt: "2024-01-12T16:45:00"
      },
      {
        id: "3",
        bookingId: "BK003",
        routeName: "Bangalore to Mysore",
        fromStop: "Bangalore Majestic",
        toStop: "Mysore City Bus Stand",
        departureTime: "2024-01-08T06:00:00",
        status: "CANCELLED",
        fare: 320,
        createdAt: "2024-01-05T14:20:00"
      }
    ];

    setTimeout(() => {
      setUser(mockUser);
      setBookingHistory(mockBookingHistory);
      setEditForm({
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone || ""
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone
      });
      setEditing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      case "REFUNDED":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Paid";
      case "PENDING":
        return "Payment Pending";
      case "CANCELLED":
        return "Cancelled";
      case "REFUNDED":
        return "Refunded";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
        <CSSShuttleBackground />
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
        <CSSShuttleBackground />
        <div className="relative z-10">
          <Card className="text-center py-12">
            <CardContent>
              <FaUser className="text-6xl text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">User not found</h3>
              <p className="text-muted-foreground mb-4">Please log in to view your profile.</p>
              <Button asChild>
                <a href="/login">Login</a>
              </Button>
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
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src="/avatars/01.png" alt={user.name} />
                <AvatarFallback className="text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center justify-center">
                <FaEnvelope className="mr-1" />
                {user.email}
              </CardDescription>
              {user.role === "ADMIN" && (
                <Badge className="mt-2">Admin</Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <FaCalendar className="text-muted-foreground" />
                  <span>Member since {format(new Date(user.createdAt), "MMM yyyy")}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <FaPhone className="text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <FaBell className="text-muted-foreground" />
                  <span>
                    {Object.values(user.preferences.notifications).filter(Boolean).length} notification types enabled
                  </span>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/settings">
                    <FaCog className="mr-2" />
                    Settings
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/tickets">
                    <FaTicketAlt className="mr-2" />
                    My Tickets
                  </a>
                </Button>
                <Button variant="destructive" className="w-full">
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="history">Booking History</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Personal Information</CardTitle>
                    {!editing ? (
                      <Button variant="outline" onClick={() => setEditing(true)}>
                        <FaEdit className="mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="space-x-2">
                        <Button variant="outline" onClick={() => setEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          <FaSave className="mr-2" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {editing ? (
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                      ) : (
                        <p className="p-2 bg-muted rounded-md">{user.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {editing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        />
                      ) : (
                        <p className="p-2 bg-muted rounded-md">{user.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {editing ? (
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          placeholder="+91 98765 43210"
                        />
                      ) : (
                        <p className="p-2 bg-muted rounded-md">
                          {user.phone || "Not provided"}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <p className="p-2 bg-muted rounded-md">
                        {user.role === "ADMIN" ? "Administrator" : "User"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Booking History */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FaHistory className="mr-2" />
                    Recent Bookings
                  </CardTitle>
                  <CardDescription>Your latest bus ticket bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookingHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <FaTicketAlt className="text-4xl text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No booking history found</p>
                      <Button className="mt-4" asChild>
                        <a href="/find">Book Your First Ticket</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookingHistory.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <FaMapMarkerAlt className="text-blue-500" />
                              <span className="font-medium">{booking.fromStop}</span>
                              <span className="text-muted-foreground">→</span>
                              <FaMapMarkerAlt className="text-green-500" />
                              <span className="font-medium">{booking.toStop}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {booking.routeName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(booking.departureTime), "MMM dd, yyyy HH:mm")}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(booking.status)} text-white mb-2`}>
                              {getStatusText(booking.status)}
                            </Badge>
                            <p className="font-semibold">₹{booking.fare}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                    </div>
                    <div className="w-12 h-6 bg-muted rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the app appearance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant={user.preferences.theme === "light" ? "default" : "outline"} size="sm">
                        Light
                      </Button>
                      <Button variant={user.preferences.theme === "dark" ? "default" : "outline"} size="sm">
                        Dark
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </div>
    </div>
  );
}