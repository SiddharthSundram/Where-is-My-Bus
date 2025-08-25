"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FaTicketAlt, 
  FaCalendar, 
  FaClock, 
  FaMapMarkerAlt, 
  FaRoute, 
  FaDownload,
  FaEye,
  FaTrash,
  FaUndo,
  FaQrcode,
  FaCreditCard,
  FaMobileAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import { format } from "date-fns";
import QRCode from "react-qr-code";
import { CSSShuttleBackground } from "@/components/shuttle-background";

interface Ticket {
  id: string;
  bookingId: string;
  routeName: string;
  fromStop: string;
  toStop: string;
  seatType: "AC" | "NON_AC";
  seatCount: number;
  fare: number;
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
  departureTime: string;
  arrivalTime: string;
  bookingDate: string;
  busNumber: string;
  paymentId?: string;
  qrCode?: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: "1",
        bookingId: "BK001",
        routeName: "Mumbai Central to Pune",
        fromStop: "Mumbai Central",
        toStop: "Pune Station",
        seatType: "AC",
        seatCount: 2,
        fare: 560,
        status: "PAID",
        departureTime: "2024-01-15T14:30:00",
        arrivalTime: "2024-01-15T18:45:00",
        bookingDate: "2024-01-10T10:30:00",
        busNumber: "MH-01-AB-1234",
        paymentId: "PAY001",
        qrCode: "BK001-PAID-2AC"
      },
      {
        id: "2",
        bookingId: "BK002",
        routeName: "Delhi to Gurgaon",
        fromStop: "Delhi ISBT",
        toStop: "Gurgaon Sector 29",
        seatType: "NON_AC",
        seatCount: 1,
        fare: 85,
        status: "PENDING",
        departureTime: "2024-01-16T09:15:00",
        arrivalTime: "2024-01-16T10:30:00",
        bookingDate: "2024-01-12T16:45:00",
        busNumber: "DL-01-CD-5678"
      },
      {
        id: "3",
        bookingId: "BK003",
        routeName: "Bangalore to Mysore",
        fromStop: "Bangalore Majestic",
        toStop: "Mysore City Bus Stand",
        seatType: "AC",
        seatCount: 1,
        fare: 320,
        status: "CANCELLED",
        departureTime: "2024-01-08T06:00:00",
        arrivalTime: "2024-01-08T09:30:00",
        bookingDate: "2024-01-05T14:20:00",
        busNumber: "KA-01-EF-9012"
      }
    ];
    
    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

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

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === "active") {
      return ticket.status === "PAID" || ticket.status === "PENDING";
    } else if (activeTab === "upcoming") {
      return new Date(ticket.departureTime) > new Date();
    } else if (activeTab === "past") {
      return new Date(ticket.departureTime) <= new Date();
    }
    return true;
  });

  const handlePayment = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowPaymentDialog(true);
  };

  const processPayment = async () => {
    if (!selectedTicket) return;
    
    setPaymentProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update ticket status
      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? { 
              ...ticket, 
              status: "PAID" as const,
              paymentId: `PAY${Date.now()}`,
              qrCode: `${ticket.bookingId}-PAID-${ticket.seatCount}${ticket.seatType}`
            }
          : ticket
      ));
      
      setShowPaymentDialog(false);
      alert("Payment successful! Your ticket has been confirmed.");
      
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setPaymentProcessing(false);
      setSelectedTicket(null);
    }
  };

  const handleCancelTicket = (ticketId: string) => {
    if (confirm("Are you sure you want to cancel this ticket?")) {
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: "CANCELLED" as const }
          : ticket
      ));
      alert("Ticket cancelled successfully.");
    }
  };

  const downloadTicket = (ticket: Ticket) => {
    // Simulate PDF download
    const ticketData = {
      bookingId: ticket.bookingId,
      route: ticket.routeName,
      from: ticket.fromStop,
      to: ticket.toStop,
      date: format(new Date(ticket.departureTime), "MMM dd, yyyy"),
      time: `${format(new Date(ticket.departureTime), "HH:mm")} - ${format(new Date(ticket.arrivalTime), "HH:mm")}`,
      seats: `${ticket.seatCount} ${ticket.seatType}`,
      fare: `₹${ticket.fare}`,
      status: ticket.status
    };
    
    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${ticket.bookingId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{ticket.routeName}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <FaRoute className="mr-1" />
              Bus: {ticket.busNumber}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(ticket.status)} text-white`}>
            {getStatusText(ticket.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Route Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-blue-500" />
              <span className="font-medium">{ticket.fromStop}</span>
            </div>
            <div className="flex-1 mx-4">
              <div className="h-0.5 bg-gradient-to-r from-blue-500 to-green-500"></div>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-green-500" />
              <span className="font-medium">{ticket.toStop}</span>
            </div>
          </div>

          {/* Journey Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <FaCalendar className="text-muted-foreground" />
              <span>{format(new Date(ticket.departureTime), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-muted-foreground" />
              <span>
                {format(new Date(ticket.departureTime), "HH:mm")} - {format(new Date(ticket.arrivalTime), "HH:mm")}
              </span>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div>
              <p className="text-sm text-muted-foreground">
                {ticket.seatCount} {ticket.seatType} Seat(s)
              </p>
              <p className="text-lg font-bold text-primary">₹{ticket.fare}</p>
            </div>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FaEye className="mr-1" />
                    View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ticket Details</DialogTitle>
                    <DialogDescription>
                      Booking ID: {ticket.bookingId}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center">
                      {ticket.qrCode && (
                        <div className="mb-4">
                          <QRCode 
                            value={ticket.qrCode} 
                            size={128}
                            className="mx-auto"
                          />
                          <p className="text-xs text-muted-foreground mt-2">Scan to validate</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Route:</span>
                        <span className="font-medium">{ticket.routeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">From:</span>
                        <span className="font-medium">{ticket.fromStop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">To:</span>
                        <span className="font-medium">{ticket.toStop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{format(new Date(ticket.departureTime), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">
                          {format(new Date(ticket.departureTime), "HH:mm")} - {format(new Date(ticket.arrivalTime), "HH:mm")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seats:</span>
                        <span className="font-medium">{ticket.seatCount} {ticket.seatType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fare:</span>
                        <span className="font-bold text-primary">₹{ticket.fare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                          {getStatusText(ticket.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              {ticket.status === "PAID" && (
                <Button variant="outline" size="sm" onClick={() => downloadTicket(ticket)}>
                  <FaDownload className="mr-1" />
                  PDF
                </Button>
              )}
              {ticket.status === "PENDING" && (
                <Button size="sm" onClick={() => handlePayment(ticket)}>
                  <FaCreditCard className="mr-1" />
                  Pay Now
                </Button>
              )}
              {ticket.status === "PAID" && (
                <Button variant="outline" size="sm" onClick={() => handleCancelTicket(ticket.id)}>
                  <FaUndo className="mr-1" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PaymentDialog = () => (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay for your ticket booking securely
          </DialogDescription>
        </DialogHeader>
        {selectedTicket && (
          <div className="space-y-6">
            {/* Ticket Summary */}
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Route:</span>
                    <span className="font-medium">{selectedTicket.routeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Seats:</span>
                    <span className="font-medium">{selectedTicket.seatCount} {selectedTicket.seatType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Amount:</span>
                    <span className="font-bold text-lg text-primary">₹{selectedTicket.fare}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h4 className="font-medium">Select Payment Method</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FaCreditCard className="mr-2" />
                  Credit/Debit Card
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FaMobileAlt className="mr-2" />
                  UPI Payment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FaShieldAlt className="mr-2" />
                  Net Banking
                </Button>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FaShieldAlt className="text-green-500" />
              <span>Your payment is secured with 256-bit encryption</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)} disabled={paymentProcessing}>
                Cancel
              </Button>
              <Button 
                onClick={processPayment} 
                disabled={paymentProcessing}
                className="flex-1"
              >
                {paymentProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹{selectedTicket.fare}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">Manage your bus tickets and bookings</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <CSSShuttleBackground />
      <div className="relative z-10">
        <PaymentDialog />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
          <p className="text-muted-foreground">Manage your bus tickets and bookings</p>
        </div>

      {filteredTickets.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FaTicketAlt className="text-6xl text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === "active" 
                ? "You don't have any active tickets." 
                : activeTab === "upcoming" 
                ? "You don't have any upcoming journeys." 
                : "You don't have any past journeys."
              }
            </p>
            <Button asChild>
              <a href="/find">Book a Ticket</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4">
              {filteredTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
      </div>
    </div>
  );
}