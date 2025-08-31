"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  FaCog,
  FaHistory,
  FaBell
} from "react-icons/fa";
import { format } from "date-fns";
import { CSSShuttleBackground } from "@/components/shuttle-background";

const API_BASE_URL = "http://127.0.0.1:5000";

// --- MODIFICATION START ---
// Reverted UserProfile interface to include the 'preferences' object for the UI
interface UserProfile {
  id: string; 
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  preferences: {
    theme: "light" | "dark";
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}
// --- MODIFICATION END ---

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
  const [error, setError] = useState<string | null>(null); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setLoading(false); 
    }
  }, []);

  // --- MODIFICATION START ---
  // Added a page reload after logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login").then(() => {
        window.location.reload();
      });
    }
  };
  // --- MODIFICATION END ---

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        handleLogout();
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: "GET",
          headers: {
            "Authorization": token
          }
        });

        if (response.status === 401) {
          handleLogout();
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const data = await response.json();
        const fetchedUser = data.user;
        
        // --- MODIFICATION START ---
        // Augment the fetched user data with mock preferences to restore the UI
        fetchedUser.preferences = {
          theme: "dark",
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        };
        // --- MODIFICATION END ---
        
        setUser(fetchedUser);
        setEditForm({
          name: fetchedUser.name,
          email: fetchedUser.email,
          phone: fetchedUser.phone || ""
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchBookingHistory = () => {
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
        ];
        setBookingHistory(mockBookingHistory);
    }

    if (isAuthenticated && isMounted) {
      fetchUserProfile();
      fetchBookingHistory();
    }
  }, [isAuthenticated, isMounted]);


  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
      return;
    }

    setError(null);
    setSuccessMessage(null);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(editForm),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update profile.');
        }

        // Keep the existing preferences when updating user state
        const updatedUser = { ...data.user, preferences: user?.preferences };
        setUser(updatedUser as UserProfile); 
        setEditing(false);

        setSuccessMessage("Profile updated successfully! ✅");
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);

    } catch (err: any) {
        console.error("Update error:", err);
        setError(err.message);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-500";
      case "PENDING": return "bg-yellow-500";
      case "CANCELLED": return "bg-red-500";
      case "REFUNDED": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
        case "PAID": return "Paid";
        case "PENDING": return "Payment Pending";
        case "CANCELLED": return "Cancelled";
        case "REFUNDED": return "Refunded";
        default: return status;
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            <p className="text-muted-foreground mb-4">Please sign in to view your profile</p>
            <Button onClick={() => router.push("/login")} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
         <CSSShuttleBackground />
         <div className="relative z-10">
           <div className="mb-8">
             <h1 className="text-3xl font-bold mb-2">Profile</h1>
             <p className="text-muted-foreground">Manage your account settings and preferences</p>
           </div>
           {/* Skeleton UI can be placed here */}
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
          <div className="lg-col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
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
                  {/* --- MODIFICATION START --- */}
                  {/* Restored the notification count display */}
                  <div className="flex items-center space-x-2 text-sm">
                    <FaBell className="text-muted-foreground" />
                    <span>
                      {Object.values(user.preferences.notifications).filter(Boolean).length} notification types enabled
                    </span>
                  </div>
                  {/* --- MODIFICATION END --- */}
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
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {/* --- MODIFICATION START --- */}
            {/* Restored 3-column tab layout and Preferences trigger */}
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="history">Booking History</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
            {/* --- MODIFICATION END --- */}

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Personal Information</CardTitle>
                      {!editing ? (
                        <Button variant="outline" onClick={() => {
                          setEditing(true);
                          setError(null);
                          setSuccessMessage(null);
                        }}>
                          <FaEdit className="mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="space-x-2">
                          <Button variant="outline" onClick={() => {
                            setEditing(false);
                            setError(null);
                            setSuccessMessage(null);
                            setEditForm({ name: user.name, email: user.email, phone: user.phone || "" });
                          }}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave}>
                            <FaSave className="mr-2" />
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                    {successMessage && <p className="text-sm text-green-600 mt-2">{successMessage}</p>}
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
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

              {/* --- MODIFICATION START --- */}
              {/* Restored the Preferences tab content */}
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
                      <div className={`w-12 h-6 ${user.preferences.notifications.email ? 'bg-primary' : 'bg-muted'} rounded-full relative transition-colors`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${user.preferences.notifications.email ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                      </div>
                      <div className={`w-12 h-6 ${user.preferences.notifications.push ? 'bg-primary' : 'bg-muted'} rounded-full relative transition-colors`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${user.preferences.notifications.push ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                      </div>
                      <div className={`w-12 h-6 ${user.preferences.notifications.sms ? 'bg-primary' : 'bg-muted'} rounded-full relative transition-colors`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${user.preferences.notifications.sms ? 'right-1' : 'left-1'}`}></div>
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
              {/* --- MODIFICATION END --- */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}