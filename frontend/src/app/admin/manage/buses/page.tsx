"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FaBus, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaUser,
  FaCalendar,
  FaFilter,
  FaWifi,
  FaTools
} from "react-icons/fa";
import { format } from "date-fns";
import { CSSShuttleBackground } from "@/components/shuttle-background";

interface Bus {
  id: string;
  busNumber: string;
  operator: string;
  type: "AC" | "NON_AC";
  capacity: number;
  registrationNo: string;
  gpsDeviceId: string;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  currentLocation?: {
    lat: number;
    lng: number;
  };
  lastUpdate?: string;
  totalTrips: number;
  totalBookings: number;
}

export default function AdminBusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockBuses: Bus[] = [
      {
        id: "1",
        busNumber: "MH-01-AB-1234",
        operator: "MSRTC",
        type: "AC",
        capacity: 45,
        registrationNo: "MH01AB1234",
        gpsDeviceId: "GPS001",
        status: "ACTIVE",
        currentLocation: { lat: 19.0760, lng: 72.8777 },
        lastUpdate: "2024-01-15T14:30:00",
        totalTrips: 1250,
        totalBookings: 8450
      },
      {
        id: "2",
        busNumber: "DL-01-CD-5678",
        operator: "DTC",
        type: "NON_AC",
        capacity: 40,
        registrationNo: "DL01CD5678",
        gpsDeviceId: "GPS002",
        status: "ACTIVE",
        currentLocation: { lat: 28.6139, lng: 77.2090 },
        lastUpdate: "2024-01-15T14:25:00",
        totalTrips: 980,
        totalBookings: 6200
      },
      {
        id: "3",
        busNumber: "KA-01-EF-9012",
        operator: "KSRTC",
        type: "AC",
        capacity: 35,
        registrationNo: "KA01EF9012",
        gpsDeviceId: "GPS003",
        status: "MAINTENANCE",
        lastUpdate: "2024-01-14T16:45:00",
        totalTrips: 750,
        totalBookings: 4800
      },
      {
        id: "4",
        busNumber: "TN-01-GH-3456",
        operator: "TNSTC",
        type: "NON_AC",
        capacity: 50,
        registrationNo: "TN01GH3456",
        gpsDeviceId: "GPS004",
        status: "INACTIVE",
        lastUpdate: "2024-01-10T09:15:00",
        totalTrips: 420,
        totalBookings: 2100
      },
      {
        id: "5",
        busNumber: "GJ-01-IJ-7890",
        operator: "GSRTC",
        type: "AC",
        capacity: 42,
        registrationNo: "GJ01IJ7890",
        gpsDeviceId: "GPS005",
        status: "ACTIVE",
        currentLocation: { lat: 23.0225, lng: 72.5714 },
        lastUpdate: "2024-01-15T14:20:00",
        totalTrips: 680,
        totalBookings: 3900
      }
    ];

    setTimeout(() => {
      setBuses(mockBuses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBuses = buses.filter(bus => {
    const matchesSearch = bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bus.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bus.registrationNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || bus.type === typeFilter;
    const matchesStatus = statusFilter === "all" || bus.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "INACTIVE":
        return "bg-yellow-500";
      case "MAINTENANCE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "AC":
        return "bg-blue-500";
      case "NON_AC":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleEditBus = (bus: Bus) => {
    setSelectedBus(bus);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBus = (busId: string) => {
    if (confirm("Are you sure you want to delete this bus? This action cannot be undone.")) {
      setBuses(prev => prev.filter(bus => bus.id !== busId));
    }
  };

  const handleCreateBus = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveBus = (updatedBus: Bus) => {
    setBuses(prev => prev.map(bus => bus.id === updatedBus.id ? updatedBus : bus));
    setIsEditDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
        <CSSShuttleBackground />
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Bus Management</h1>
            <p className="text-muted-foreground">Manage bus fleet and tracking devices</p>
          </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
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
            <h1 className="text-3xl font-bold mb-2">Bus Management</h1>
            <p className="text-muted-foreground">Manage bus fleet and tracking devices</p>
          </div>
          <Button onClick={handleCreateBus}>
            <FaPlus className="mr-2" />
            Add Bus
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaFilter className="mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search buses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div>
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="AC">AC</SelectItem>
                  <SelectItem value="NON_AC">Non-AC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buses Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Buses ({filteredBuses.length})</CardTitle>
              <CardDescription>Manage all buses in the fleet</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBuses.length === 0 ? (
            <div className="text-center py-12">
              <FaBus className="text-6xl text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No buses found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or add a new bus.</p>
              <Button onClick={handleCreateBus}>
                <FaPlus className="mr-2" />
                Add Bus
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bus Details</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>GPS Device</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuses.map((bus) => (
                    <TableRow key={bus.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <FaBus className="text-primary" />
                            <p className="font-medium">{bus.busNumber}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{bus.registrationNo}</p>
                          {bus.currentLocation && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <FaMapMarkerAlt />
                              <span>
                                {bus.currentLocation.lat.toFixed(3)}, {bus.currentLocation.lng.toFixed(3)}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <p className="font-medium">{bus.operator}</p>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={`${getTypeColor(bus.type)} text-white`}>
                          {bus.type}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(bus.status)} text-white`}>
                            {bus.status}
                          </Badge>
                          {bus.status === "ACTIVE" && bus.currentLocation && (
                            <FaWifi className="text-green-500 text-xs" title="GPS Online" />
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-center">
                          <p className="font-medium">{bus.capacity}</p>
                          <p className="text-xs text-muted-foreground">seats</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm">{bus.gpsDeviceId}</p>
                          {bus.lastUpdate && (
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(bus.lastUpdate), "MMM dd HH:mm")}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-right">
                          <p className="text-sm">
                            <span className="font-medium">{bus.totalTrips}</span> trips
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">{bus.totalBookings}</span> bookings
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBus(bus)}
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBus(bus.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <FaTrash className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Bus Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Bus</DialogTitle>
            <DialogDescription>
              Update bus information and configuration
            </DialogDescription>
          </DialogHeader>
          {selectedBus && (
            <div className="space-y-4">
              <div>
                <Label>Bus Number</Label>
                <Input value={selectedBus.busNumber} onChange={(e) => setSelectedBus({...selectedBus, busNumber: e.target.value})} />
              </div>
              <div>
                <Label>Operator</Label>
                <Input value={selectedBus.operator} onChange={(e) => setSelectedBus({...selectedBus, operator: e.target.value})} />
              </div>
              <div>
                <Label>Registration Number</Label>
                <Input value={selectedBus.registrationNo} onChange={(e) => setSelectedBus({...selectedBus, registrationNo: e.target.value})} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={selectedBus.type} onValueChange={(value: "AC" | "NON_AC") => setSelectedBus({...selectedBus, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="NON_AC">Non-AC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Capacity</Label>
                <Input type="number" value={selectedBus.capacity} onChange={(e) => setSelectedBus({...selectedBus, capacity: parseInt(e.target.value)})} />
              </div>
              <div>
                <Label>GPS Device ID</Label>
                <Input value={selectedBus.gpsDeviceId} onChange={(e) => setSelectedBus({...selectedBus, gpsDeviceId: e.target.value})} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={selectedBus.status} onValueChange={(value: "ACTIVE" | "INACTIVE" | "MAINTENANCE") => setSelectedBus({...selectedBus, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSaveBus(selectedBus)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Bus Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Bus</DialogTitle>
            <DialogDescription>
              Add a new bus to the fleet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Bus Number</Label>
              <Input placeholder="e.g., MH-01-AB-1234" />
            </div>
            <div>
              <Label>Operator</Label>
              <Input placeholder="e.g., MSRTC" />
            </div>
            <div>
              <Label>Registration Number</Label>
              <Input placeholder="e.g., MH01AB1234" />
            </div>
            <div>
              <Label>Type</Label>
              <Select defaultValue="AC">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC">AC</SelectItem>
                  <SelectItem value="NON_AC">Non-AC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Capacity</Label>
              <Input type="number" placeholder="Number of seats" />
            </div>
            <div>
              <Label>GPS Device ID</Label>
              <Input placeholder="e.g., GPS001" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Add Bus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
        </div>
    </div>
  );
}