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
  FaRoute, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaCity,
  FaRuler,
  FaCalendar,
  FaFilter,
  FaBus
} from "react-icons/fa";
import { format } from "date-fns";
import { CSSShuttleBackground } from "@/components/shuttle-background";

interface Stop {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  index: number;
}

interface Route {
  id: string;
  name: string;
  city: string;
  distanceKm: number;
  polyline?: string;
  stops: Stop[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  totalBuses: number;
  totalBookings: number;
}

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isStopsDialogOpen, setIsStopsDialogOpen] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockRoutes: Route[] = [
      {
        id: "1",
        name: "Mumbai Central to Pune Station",
        city: "Mumbai",
        distanceKm: 150,
        stops: [
          { id: "1", name: "Mumbai Central", location: { lat: 19.0760, lng: 72.8777 }, index: 0 },
          { id: "2", name: "Dadar", location: { lat: 19.0176, lng: 72.8562 }, index: 1 },
          { id: "3", name: "Thane", location: { lat: 19.2183, lng: 72.9781 }, index: 2 },
          { id: "4", name: "Lonavala", location: { lat: 18.7500, lng: 73.4000 }, index: 3 },
          { id: "5", name: "Pune Station", location: { lat: 18.5204, lng: 73.8567 }, index: 4 }
        ],
        status: "ACTIVE",
        createdAt: "2023-01-15T10:30:00",
        totalBuses: 25,
        totalBookings: 15420
      },
      {
        id: "2",
        name: "Delhi ISBT to Gurgaon Sector 29",
        city: "Delhi",
        distanceKm: 32,
        stops: [
          { id: "6", name: "Delhi ISBT", location: { lat: 28.6139, lng: 77.2090 }, index: 0 },
          { id: "7", name: "Dhaula Kuan", location: { lat: 28.5985, lng: 77.1605 }, index: 1 },
          { id: "8", name: "Gurgaon Sector 29", location: { lat: 28.4595, lng: 77.0266 }, index: 2 }
        ],
        status: "ACTIVE",
        createdAt: "2023-02-20T14:45:00",
        totalBuses: 15,
        totalBookings: 8900
      },
      {
        id: "3",
        name: "Bangalore Majestic to Mysore City Bus Stand",
        city: "Bangalore",
        distanceKm: 145,
        stops: [
          { id: "9", name: "Bangalore Majestic", location: { lat: 12.9716, lng: 77.5946 }, index: 0 },
          { id: "10", name: "Ramanagara", location: { lat: 12.7265, lng: 77.2735 }, index: 1 },
          { id: "11", name: "Mandya", location: { lat: 12.5228, lng: 76.8953 }, index: 2 },
          { id: "12", name: "Mysore City Bus Stand", location: { lat: 12.2958, lng: 76.6394 }, index: 3 }
        ],
        status: "ACTIVE",
        createdAt: "2023-03-10T11:20:00",
        totalBuses: 18,
        totalBookings: 12300
      },
      {
        id: "4",
        name: "Chennai CMBT to Coimbatore",
        city: "Chennai",
        distanceKm: 510,
        stops: [
          { id: "13", name: "Chennai CMBT", location: { lat: 13.0827, lng: 80.2707 }, index: 0 },
          { id: "14", name: "Vellore", location: { lat: 12.9165, lng: 79.1325 }, index: 1 },
          { id: "15", name: "Salem", location: { lat: 11.6643, lng: 78.1460 }, index: 2 },
          { id: "16", name: "Coimbatore", location: { lat: 11.0168, lng: 76.9558 }, index: 3 }
        ],
        status: "INACTIVE",
        createdAt: "2023-04-05T09:30:00",
        totalBuses: 8,
        totalBookings: 2100
      },
      {
        id: "5",
        name: "Kolkata Esplanade to Digha",
        city: "Kolkata",
        distanceKm: 185,
        stops: [
          { id: "17", name: "Kolkata Esplanade", location: { lat: 22.5697, lng: 88.3697 }, index: 0 },
          { id: "18", name: "Howrah", location: { lat: 22.5958, lng: 88.2636 }, index: 1 },
          { id: "19", name: "Kharagpur", location: { lat: 22.3421, lng: 87.3119 }, index: 2 },
          { id: "20", name: "Digha", location: { lat: 21.6265, lng: 87.5496 }, index: 3 }
        ],
        status: "ACTIVE",
        createdAt: "2023-05-12T16:45:00",
        totalBuses: 12,
        totalBookings: 6800
      }
    ];

    setTimeout(() => {
      setRoutes(mockRoutes);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = cityFilter === "all" || route.city === cityFilter;
    const matchesStatus = statusFilter === "all" || route.status === statusFilter;

    return matchesSearch && matchesCity && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "INACTIVE":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleEditRoute = (route: Route) => {
    setSelectedRoute(route);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRoute = (routeId: string) => {
    if (confirm("Are you sure you want to delete this route? This action cannot be undone.")) {
      setRoutes(prev => prev.filter(route => route.id !== routeId));
    }
  };

  const handleCreateRoute = () => {
    setIsCreateDialogOpen(true);
  };

  const handleManageStops = (route: Route) => {
    setSelectedRoute(route);
    setIsStopsDialogOpen(true);
  };

  const handleSaveRoute = (updatedRoute: Route) => {
    setRoutes(prev => prev.map(route => route.id === updatedRoute.id ? updatedRoute : route));
    setIsEditDialogOpen(false);
  };

  const cities = Array.from(new Set(routes.map(route => route.city)));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
        <CSSShuttleBackground />
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Route Management</h1>
            <p className="text-muted-foreground">Manage bus routes and stops</p>
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
            <h1 className="text-3xl font-bold mb-2">Route Management</h1>
            <p className="text-muted-foreground">Manage bus routes and stops</p>
          </div>
          <Button onClick={handleCreateRoute}>
            <FaPlus className="mr-2" />
            Add Route
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
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div>
              <Label>City</Label>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
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
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setCityFilter("all");
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

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Routes ({filteredRoutes.length})</CardTitle>
              <CardDescription>Manage all bus routes in the system</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-12">
              <FaRoute className="text-6xl text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No routes found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or add a new route.</p>
              <Button onClick={handleCreateRoute}>
                <FaPlus className="mr-2" />
                Add Route
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route Details</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Stops</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <FaRoute className="text-primary" />
                            <p className="font-medium">{route.name}</p>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <FaMapMarkerAlt />
                            <span>
                              {route.stops[0]?.name} → {route.stops[route.stops.length - 1]?.name}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FaCity className="text-muted-foreground" />
                          <p className="font-medium">{route.city}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FaRuler className="text-muted-foreground" />
                          <p className="font-medium">{route.distanceKm} km</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-center">
                          <p className="font-medium">{route.stops.length}</p>
                          <p className="text-xs text-muted-foreground">stops</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={`${getStatusColor(route.status)} text-white`}>
                          {route.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-right">
                          <p className="text-sm">
                            <span className="font-medium">{route.totalBuses}</span> buses
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">{route.totalBookings}</span> bookings
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageStops(route)}
                          >
                            <FaMapMarkerAlt className="mr-1" />
                            Stops
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRoute(route)}
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRoute(route.id)}
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

      {/* Edit Route Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>
              Update route information
            </DialogDescription>
          </DialogHeader>
          {selectedRoute && (
            <div className="space-y-4">
              <div>
                <Label>Route Name</Label>
                <Input value={selectedRoute.name} onChange={(e) => setSelectedRoute({...selectedRoute, name: e.target.value})} />
              </div>
              <div>
                <Label>City</Label>
                <Input value={selectedRoute.city} onChange={(e) => setSelectedRoute({...selectedRoute, city: e.target.value})} />
              </div>
              <div>
                <Label>Distance (km)</Label>
                <Input type="number" value={selectedRoute.distanceKm} onChange={(e) => setSelectedRoute({...selectedRoute, distanceKm: parseFloat(e.target.value)})} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={selectedRoute.status} onValueChange={(value: "ACTIVE" | "INACTIVE") => setSelectedRoute({...selectedRoute, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSaveRoute(selectedRoute)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Route Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
            <DialogDescription>
              Create a new bus route
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Route Name</Label>
              <Input placeholder="e.g., Mumbai Central to Pune Station" />
            </div>
            <div>
              <Label>City</Label>
              <Input placeholder="e.g., Mumbai" />
            </div>
            <div>
              <Label>Distance (km)</Label>
              <Input type="number" placeholder="Distance in kilometers" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Add Route
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Stops Dialog */}
      <Dialog open={isStopsDialogOpen} onOpenChange={setIsStopsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Stops</DialogTitle>
            <DialogDescription>
              Configure stops for {selectedRoute?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedRoute && (
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {selectedRoute.stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{stop.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {stop.location.lat.toFixed(4)}, {stop.location.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <FaEdit className="mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <FaTrash className="mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline">
                  <FaPlus className="mr-2" />
                  Add Stop
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsStopsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsStopsDialogOpen(false)}>
                    Save Stops
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
        </div>
    </div>
  );
}