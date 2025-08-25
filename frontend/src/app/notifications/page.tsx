"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FaBell, 
  FaCheck, 
  FaTrash, 
  FaCalendar, 
  FaTicketAlt, 
  FaClock, 
  FaRoute,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";
import { format } from "date-fns";
import { CSSShuttleBackground } from "@/components/shuttle-background";

interface Notification {
  id: string;
  type: "BOOKING_CONFIRMATION" | "PAYMENT_SUCCESS" | "PAYMENT_FAILURE" | "ETA_UPDATE" | "DELAY_ALERT" | "ROUTE_CHANGE" | "ADMIN_MESSAGE";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    bookingId?: string;
    busId?: string;
    routeId?: string;
    eta?: number;
    delay?: number;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "BOOKING_CONFIRMATION",
        title: "Booking Confirmed",
        body: "Your booking for Mumbai Central to Pune has been confirmed. Booking ID: BK001",
        read: false,
        createdAt: "2024-01-15T10:30:00",
        metadata: { bookingId: "BK001" }
      },
      {
        id: "2",
        type: "ETA_UPDATE",
        title: "Bus Arrival Update",
        body: "Your bus MH-01-AB-1234 is expected to arrive in 15 minutes",
        read: false,
        createdAt: "2024-01-15T14:15:00",
        metadata: { busId: "bus1", eta: 15 }
      },
      {
        id: "3",
        type: "DELAY_ALERT",
        title: "Bus Delayed",
        body: "Your bus DL-01-CD-5678 is delayed by 20 minutes due to traffic",
        read: true,
        createdAt: "2024-01-14T09:45:00",
        metadata: { busId: "bus2", delay: 20 }
      },
      {
        id: "4",
        type: "PAYMENT_SUCCESS",
        title: "Payment Successful",
        body: "Your payment of ₹560 for booking BK001 has been processed successfully",
        read: true,
        createdAt: "2024-01-10T10:35:00",
        metadata: { bookingId: "BK001" }
      },
      {
        id: "5",
        type: "ROUTE_CHANGE",
        title: "Route Change Alert",
        body: "Your bus route has been modified due to road closure. Please check the updated route.",
        read: true,
        createdAt: "2024-01-08T16:20:00",
        metadata: { routeId: "route1" }
      }
    ];
    
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BOOKING_CONFIRMATION":
        return <FaTicketAlt className="text-green-500" />;
      case "PAYMENT_SUCCESS":
        return <FaCheckCircle className="text-green-500" />;
      case "PAYMENT_FAILURE":
        return <FaExclamationTriangle className="text-red-500" />;
      case "ETA_UPDATE":
        return <FaClock className="text-blue-500" />;
      case "DELAY_ALERT":
        return <FaExclamationTriangle className="text-yellow-500" />;
      case "ROUTE_CHANGE":
        return <FaRoute className="text-orange-500" />;
      case "ADMIN_MESSAGE":
        return <FaInfoCircle className="text-purple-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "BOOKING_CONFIRMATION":
      case "PAYMENT_SUCCESS":
        return "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800";
      case "PAYMENT_FAILURE":
      case "DELAY_ALERT":
        return "border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800";
      case "ETA_UPDATE":
        return "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800";
      case "ROUTE_CHANGE":
        return "border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800";
      case "ADMIN_MESSAGE":
        return "border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800";
      default:
        return "border-gray-200 bg-gray-50 dark:bg-gray-950 dark:border-gray-800";
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "unread") {
      return !notification.read;
    } else if (activeTab === "read") {
      return notification.read;
    }
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card className={`hover:shadow-md transition-all duration-300 ${getNotificationColor(notification.type)} ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">{notification.title}</CardTitle>
              <CardDescription className="text-sm mt-1">
                {format(new Date(notification.createdAt), "MMM dd, yyyy 'at' HH:mm")}
              </CardDescription>
            </div>
          </div>
          {!notification.read && (
            <Badge variant="secondary" className="text-xs">
              New
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm mb-4">{notification.body}</p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {!notification.read && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => markAsRead(notification.id)}
              >
                <FaCheck className="mr-1" />
                Mark Read
              </Button>
            )}
            {notification.metadata?.bookingId && (
              <Button variant="outline" size="sm" asChild>
                <a href={`/tickets`}>View Ticket</a>
              </Button>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => deleteNotification(notification.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <FaTrash />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
        <CSSShuttleBackground />
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your bus journey alerts</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-5 w-5" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-1" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-8" />
                    </div>
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <CSSShuttleBackground />
      <div className="relative z-10">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your bus journey alerts</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FaBell className="text-6xl text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === "unread" ? "No unread notifications" : 
               activeTab === "read" ? "No read notifications" : 
               "No notifications"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === "unread" ? "You're all caught up!" :
               activeTab === "read" ? "You haven't read any notifications yet." :
               "You don't have any notifications yet."}
            </p>
            {activeTab === "all" && (
              <Button asChild>
                <a href="/find">Book a Ticket</a>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Unread ({unreadCount})
                </TabsTrigger>
                <TabsTrigger value="read">
                  Read ({notifications.length - unreadCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {activeTab === "all" && notifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                <FaTrash className="mr-1" />
                Clear All
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      )}
        </div>
    </div>
  );
}