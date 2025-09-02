"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaBus, FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaArrowLeft, FaShieldAlt, FaEye, FaRoute } from "react-icons/fa";
import { CSSShuttleBackground } from "@/components/shuttle-background";

// --- Configuration ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

// --- Type Definitions ---
interface Stop {
  name: string;
  lat: number;
  lng: number;
  order: number;
}
interface Route {
  name: string;
  city: string;
  stops: Stop[];
}
interface Bus {
  _id: string;
  busCategory: string; 
  busNumber: string;
  type: "AC" | "NON_AC";
  capacity: number;
  registrationNo: string;
  gpsDeviceId: string;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  route: Route;
}
type AuthStatus = "loading" | "authenticated" | "forbidden" | "unauthenticated";

const initialNewBusFormState = {
    busCategory: "", busNumber: "", type: "AC" as "AC" | "NON_AC", capacity: 40,
    registrationNo: "", gpsDeviceId: "",
    route: {
        name: "", city: "", stops: [{ name: "", lat: 0, lng: 0, order: 1 }]
    }
};

// --- API Helper Function ---
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const headers = { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '', ...options.headers };
    const response = await fetch(`${API_BASE_URL}/buses${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    if (response.status === 200 && (options.method === 'DELETE' || options.method === 'PUT' || options.method === 'POST')) {
        return response.json(); 
    }
    return response.json();
};

export default function AdminBusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [newBusForm, setNewBusForm] = useState(initialNewBusFormState);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const fetchBuses = useCallback(async () => {
    setError(null);
    try {
        const data = await apiFetch("/");
        setBuses(data.buses || []);
    } catch (err: any) {
        setError(err.message);
        console.error("Failed to fetch buses:", err);
    }
  }, []);

  useEffect(() => {
    const verifyAdmin = async () => {
        const token = localStorage.getItem("token");
        if (!token) { setAuthStatus("unauthenticated"); return; }
        try {
            const profileResponse = await fetch(`${API_BASE_URL}/auth/profile`, { headers: { 'Authorization': token } });
            const data = await profileResponse.json();
            if (data.user && data.user.role === 'ADMIN') { setAuthStatus("authenticated"); } 
            else { setAuthStatus("forbidden"); }
        } catch (err) {
            localStorage.removeItem("token");
            setAuthStatus("unauthenticated");
        }
    };
    verifyAdmin();
  }, []);

  useEffect(() => {
    if (authStatus === "authenticated") {
        fetchBuses();
    }
  }, [authStatus, fetchBuses]);

  const filteredBuses = useMemo(() => buses.filter(bus => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (bus.busNumber || '').toLowerCase().includes(search) ||
                            (bus.busCategory || '').toLowerCase().includes(search) ||
                            (bus.registrationNo || '').toLowerCase().includes(search) ||
                            (bus.route?.name || '').toLowerCase().includes(search);
      const matchesType = typeFilter === "all" || bus.type === typeFilter;
      const matchesStatus = statusFilter === "all" || bus.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
  }), [buses, searchTerm, typeFilter, statusFilter]);

  const handleCreateBus = async () => {
    try {
      await apiFetch(`/`, { method: 'POST', body: JSON.stringify(newBusForm) });
      setIsCreateDialogOpen(false);
      setNewBusForm(initialNewBusFormState);
      await fetchBuses();
      alert("Bus created successfully!");
    } catch (err: any) {
      alert(`Error creating bus: ${err.message}`);
    }
  };

  const handleSaveBus = async () => {
    if (!selectedBus) return;
    try {
      const { _id, ...updateData } = selectedBus;
      await apiFetch(`/${_id}`, { method: 'PUT', body: JSON.stringify(updateData) });
      setIsEditDialogOpen(false);
      setSelectedBus(null);
      await fetchBuses();
      alert("Bus updated successfully!");
    } catch (err: any) {
      alert(`Error updating bus: ${err.message}`);
    }
  };

  const handleDeleteBus = async (busId: string) => {
    if (confirm("Are you sure you want to delete this bus? This action cannot be undone.")) {
      try {
        await apiFetch(`/${busId}`, { method: 'DELETE' });
        await fetchBuses();
        alert("Bus deleted successfully.");
      } catch (err: any) {
        alert(`Error deleting bus: ${err.message}`);
      }
    }
  };
  
  const handleStopChange = (index: number, field: keyof Stop, value: string | number, formType: 'new' | 'edit') => {
      const updater = formType === 'new' ? setNewBusForm : setSelectedBus as React.Dispatch<React.SetStateAction<any>>;
      updater(prev => {
          if (!prev) return null;
          const newStops = [...(prev.route?.stops || [])];
          newStops[index] = { ...newStops[index], [field]: value };
          return { ...prev, route: { ...(prev.route!), stops: newStops } };
      });
  };

  const handleAddStop = (formType: 'new' | 'edit') => {
      const updater = formType === 'new' ? setNewBusForm : setSelectedBus as React.Dispatch<React.SetStateAction<any>>;
      updater(prev => {
          if (!prev) return null;
          const newStops = [...(prev.route?.stops || [])];
          const newOrder = newStops.length > 0 ? Math.max(...newStops.map(s => s.order)) + 1 : 1;
          newStops.push({ name: "", lat: 0, lng: 0, order: newOrder });
          return { ...prev, route: { ...(prev.route!), stops: newStops } };
      });
  };

  const handleRemoveStop = (index: number, formType: 'new' | 'edit') => {
      const updater = formType === 'new' ? setNewBusForm : setSelectedBus as React.Dispatch<React.SetStateAction<any>>;
      updater(prev => {
          if (!prev) return null;
          let newStops = [...(prev.route?.stops || [])];
          newStops.splice(index, 1);
          newStops = newStops.map((stop, i) => ({ ...stop, order: i + 1 }));
          return { ...prev, route: { ...(prev.route!), stops: newStops } };
      });
  };

  if (authStatus === "loading") return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>;

  if (authStatus !== "authenticated") {
    const isForbidden = authStatus === 'forbidden';
    return (<div className="flex items-center justify-center min-h-screen"><Card className="w-96 text-center"><CardContent className="pt-6">
        {isForbidden ? <FaShieldAlt className="w-16 h-16 mx-auto text-red-500 mb-4" /> : <FaBus className="w-16 h-16 mx-auto text-muted-foreground mb-4" />}
        <h3 className="text-lg font-semibold mb-2">{isForbidden ? "Access Denied" : "Authentication Required"}</h3>
        <p className="text-muted-foreground mb-4">{isForbidden ? "You do not have permission to view this page." : "Please sign in as an admin to continue."}</p>
        <Button onClick={() => router.push(isForbidden ? "/" : "/login")} variant={isForbidden ? "outline" : "default"}>{isForbidden ? "Go to Homepage" : "Sign In"}</Button>
    </CardContent></Card></div>);
  }

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <CSSShuttleBackground />
      <div className="relative z-10">
        <div className="mb-8 flex justify-between items-center">
            <div><h1 className="text-3xl font-bold mb-2">Bus Management</h1><p className="text-muted-foreground">Manage bus fleet, routes, and tracking devices</p></div>
            <div className="flex items-center space-x-2"><Button variant="outline" onClick={() => router.back()}><FaArrowLeft className="mr-2 h-4 w-4" /> Go Back</Button><Button onClick={() => setIsCreateDialogOpen(true)}><FaPlus className="mr-2" /> Add Bus</Button></div>
        </div>
        <Card className="mb-6">
            <CardHeader><CardTitle className="flex items-center"><FaFilter className="mr-2" /> Filters</CardTitle></CardHeader>
            <CardContent><div className="grid gap-4 md:grid-cols-4">
                <div className="relative"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search buses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/></div>
                <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="AC">AC</SelectItem><SelectItem value="NON_AC">Non-AC</SelectItem></SelectContent></Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="INACTIVE">Inactive</SelectItem><SelectItem value="MAINTENANCE">Maintenance</SelectItem></SelectContent></Select>
                <Button variant="outline" onClick={() => { setSearchTerm(""); setTypeFilter("all"); setStatusFilter("all"); }}>Clear Filters</Button>
            </div></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Buses ({filteredBuses.length})</CardTitle><CardDescription>Manage all buses in the fleet</CardDescription></CardHeader>
            <CardContent>
                {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
                <div className="overflow-x-auto"><Table>
                    <TableHeader><TableRow><TableHead>Bus Details</TableHead><TableHead>Route</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {filteredBuses.length === 0 ? (<TableRow><TableCell colSpan={5} className="text-center py-12">No buses found.</TableCell></TableRow>) : (
                            filteredBuses.map((bus) => (
                                <TableRow key={bus._id}>
                                    <TableCell><div className="font-medium">{bus.busNumber}</div><div className="text-sm text-muted-foreground">{bus.busCategory}</div></TableCell>
                                    <TableCell>{bus.route?.name || 'N/A'}</TableCell>
                                    <TableCell><Badge className={bus.type === 'AC' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>{bus.type}</Badge></TableCell>
                                    <TableCell><Badge className={bus.status === 'ACTIVE' ? 'bg-green-500 text-white' : bus.status === 'INACTIVE' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}>{bus.status}</Badge></TableCell>
                                    <TableCell><div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => { setSelectedBus(bus); setIsViewDialogOpen(true); }}><FaEye /></Button>
                                        <Button variant="outline" size="sm" onClick={() => { setSelectedBus(bus); setIsEditDialogOpen(true); }}><FaEdit /></Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteBus(bus._id)}><FaTrash /></Button>
                                    </div></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table></div>
            </CardContent>
        </Card>

        {/* View Bus Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Bus Details</DialogTitle>
                    <DialogDescription>
                        Complete information for bus {selectedBus?.busNumber}.
                    </DialogDescription>
                </DialogHeader>
                {selectedBus && (
                    <ScrollArea className="max-h-[70vh] pr-6">
                        <div className="space-y-6 py-4 text-sm">
                            <div className="flex items-center space-x-4">
                                <FaBus className="h-10 w-10 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">{selectedBus.busNumber}</p>
                                    <p className="text-muted-foreground">{selectedBus.busCategory} - {selectedBus.registrationNo}</p>
                                </div>
                            </div>
                            <div className="border-t"></div>
                            <div>
                                <h4 className="font-semibold text-base mb-2">Specifications</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div><Label>GPS Device ID</Label><p className="font-mono text-muted-foreground">{selectedBus.gpsDeviceId}</p></div>
                                    <div><Label>Capacity</Label><p className="font-semibold">{selectedBus.capacity} seats</p></div>
                                    <div><Label>Type</Label><p><Badge className={selectedBus.type === 'AC' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>{selectedBus.type}</Badge></p></div>
                                    <div><Label>Status</Label><p><Badge className={selectedBus.status === 'ACTIVE' ? 'bg-green-500 text-white' : selectedBus.status === 'INACTIVE' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}>{selectedBus.status}</Badge></p></div>
                                </div>
                            </div>
                            <div className="border-t"></div>
                            <div>
                                <h4 className="font-semibold text-base flex items-center mb-4"><FaRoute className="mr-2"/>Route Details</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Route Name</Label><p>{selectedBus.route?.name || 'N/A'}</p></div>
                                    <div><Label>City</Label><p>{selectedBus.route?.city || 'N/A'}</p></div>
                                </div>
                                <div className="mt-4">
                                    <Label className="font-semibold">Stops ({selectedBus.route?.stops?.length || 0})</Label>
                                    <div className="mt-2 space-y-2">
                                        {(selectedBus.route?.stops || []).sort((a,b) => a.order - b.order).map((stop, index) => (
                                            <div key={index} className="flex items-center space-x-3 p-2 border rounded-md bg-muted/50">
                                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">{stop.order}</div>
                                                <div>
                                                    <p className="font-medium">{stop.name}</p>
                                                    {/* --- MODIFICATION IS HERE: Comma removed --- */}
                                                    <p className="text-xs text-muted-foreground">{stop.lat} {stop.lng}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>

        {[
            { isOpen: isEditDialogOpen, onOpenChange: setIsEditDialogOpen, type: 'edit', title: 'Edit Bus', data: selectedBus, handler: handleSaveBus, setData: setSelectedBus as React.Dispatch<React.SetStateAction<any>> },
            { isOpen: isCreateDialogOpen, onOpenChange: setIsCreateDialogOpen, type: 'new', title: 'Add New Bus', data: newBusForm, handler: handleCreateBus, setData: setNewBusForm }
        ].map(dialog => (
        <Dialog key={dialog.type} open={dialog.isOpen} onOpenChange={dialog.onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>{dialog.title}</DialogTitle><DialogDescription>Fill in all the details for the bus and its route.</DialogDescription></DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-6">
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-3"><Label>Bus Number *</Label><Input value={dialog.data?.busNumber ?? ''} onChange={e => dialog.setData(d => ({ ...d!, busNumber: e.target.value }))} /></div>
                        <div className="space-y-3"><Label>Operator (Category) *</Label><Input value={dialog.data?.busCategory ?? ''} onChange={e => dialog.setData(d => ({ ...d!, busCategory: e.target.value }))} /></div>
                        <div className="space-y-3"><Label>Registration No. *</Label><Input value={dialog.data?.registrationNo ?? ''} onChange={e => dialog.setData(d => ({ ...d!, registrationNo: e.target.value }))} /></div>
                        <div className="space-y-3"><Label>GPS Device ID *</Label><Input value={dialog.data?.gpsDeviceId ?? ''} onChange={e => dialog.setData(d => ({ ...d!, gpsDeviceId: e.target.value }))} /></div>
                        <div className="space-y-3"><Label>Capacity *</Label><Input type="number" value={dialog.data?.capacity ?? 0} onChange={e => dialog.setData(d => ({ ...d!, capacity: parseInt(e.target.value) || 0 }))} /></div>
                        <div className="space-y-3"><Label>Type</Label><Select value={dialog.data?.type ?? 'AC'} onValueChange={(v: "AC"|"NON_AC") => dialog.setData(d => ({...d!, type: v}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="AC">AC</SelectItem><SelectItem value="NON_AC">Non-AC</SelectItem></SelectContent></Select></div>
                         {dialog.type === 'edit' && <div className="space-y-3">
                            <Label>Status</Label><Select value={selectedBus?.status ?? 'INACTIVE'} onValueChange={(v: "ACTIVE"|"INACTIVE"|"MAINTENANCE") => setSelectedBus(d => ({...d!, status:v}))}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="INACTIVE">Inactive</SelectItem><SelectItem value="MAINTENANCE">Maintenance</SelectItem></SelectContent></Select>
                        </div>}
                        <div className="col-span-2 border-t mt-4 pt-4 space-y-3">
                            <h4 className="font-semibold text-lg">Route Details</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Route Name *</Label><Input value={dialog.data?.route?.name ?? ''} onChange={e => dialog.setData(d => ({...d!, route: {...d!.route, name: e.target.value}}))}/></div>
                                <div><Label>City *</Label><Input value={dialog.data?.route?.city ?? ''} onChange={e => dialog.setData(d => ({...d!, route: {...d!.route, city: e.target.value}}))}/></div>
                            </div>
                        </div>
                        <div className="col-span-2 space-y-3">
                            <h4 className="font-semibold">Stops</h4>
                            {(dialog.data?.route?.stops || []).map((stop, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg">
                                    <div className="col-span-1 text-center font-bold text-lg">{index + 1}</div>
                                    <div className="col-span-5"><Label>Stop Name *</Label><Input value={stop.name ?? ''} onChange={e => handleStopChange(index, 'name', e.target.value, dialog.type as 'new'|'edit')}/></div>
                                    <div className="col-span-2"><Label>Lat *</Label><Input type="number" value={stop.lat ?? 0} onChange={e => handleStopChange(index, 'lat', parseFloat(e.target.value) || 0, dialog.type as 'new'|'edit')}/></div>
                                    <div className="col-span-2"><Label>Lng *</Label><Input type="number" value={stop.lng ?? 0} onChange={e => handleStopChange(index, 'lng', parseFloat(e.target.value) || 0, dialog.type as 'new'|'edit')}/></div>
                                    <div className="col-span-2"><Button variant="destructive" size="sm" onClick={() => handleRemoveStop(index, dialog.type as 'new'|'edit')}>Remove</Button></div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => handleAddStop(dialog.type as 'new'|'edit')}><FaPlus className="mr-2"/>Add Stop</Button>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button variant="outline" onClick={() => dialog.onOpenChange(false)}>Cancel</Button>
                    <Button onClick={dialog.handler as () => void}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        ))}
      </div>
    </div>
  );
}