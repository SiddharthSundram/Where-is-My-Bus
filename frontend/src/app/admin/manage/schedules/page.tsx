"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaCalendarAlt, FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaBus, FaArrowLeft, FaShieldAlt, FaEye } from "react-icons/fa";
import { CSSShuttleBackground } from "@/components/shuttle-background";

// --- Configuration ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

// --- Type Definitions ---
interface Schedule {
  _id: string;
  busId: string;
  departureTime: string;
  arrivalTime: string;
  daysActive: string[];
  frequencyMin?: number;
  bus?: Bus; // Populated client-side
}

// Updated Bus interface to include more details
interface Bus {
  _id: string;
  busNumber: string;
  busCategory: string;
  type: "AC" | "NON_AC";
  capacity: number;
  registrationNo: string;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
}

type AuthStatus = "loading" | "authenticated" | "forbidden" | "unauthenticated";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// --- API Helper Function ---
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const headers = { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '', ...options.headers };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    if (response.status === 200 && (options.method === 'DELETE')) {
        return response.json(); 
    }
    return response.json();
};

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [busFilter, setBusFilter] = useState("all");

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [newScheduleForm, setNewScheduleForm] = useState({ busId: "", departureTime: "09:00", arrivalTime: "17:00", daysActive: [] as string[] });
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const fetchSchedulesAndBuses = useCallback(async () => {
    setError(null);
    try {
        const scheduleEndpoint = busFilter === "all" ? "/schedules/" : `/schedules/?busId=${busFilter}`;
        const [schedulesData, busesData] = await Promise.all([
            apiFetch(scheduleEndpoint),
            apiFetch("/buses/")
        ]);
        
        const busMap = new Map(busesData.buses.map((bus: Bus) => [bus._id, bus]));
        const populatedSchedules = schedulesData.map((schedule: Schedule) => ({
            ...schedule,
            bus: busMap.get(schedule.busId)
        }));

        setSchedules(populatedSchedules);
        setBuses(busesData.buses || []);
    } catch (err: any) {
        setError(err.message);
        console.error("Failed to fetch data:", err);
    }
  }, [busFilter]);

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
        fetchSchedulesAndBuses();
    }
  }, [authStatus, fetchSchedulesAndBuses]);

  const filteredSchedules = useMemo(() => {
    if (!searchTerm) return schedules;
    return schedules.filter(schedule => 
        schedule.bus?.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.bus?.busCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [schedules, searchTerm]);

  const handleCreateSchedule = async () => {
    if (!newScheduleForm.busId || newScheduleForm.daysActive.length === 0) {
        alert("Please select a bus and at least one active day.");
        return;
    }
    try {
      await apiFetch(`/schedules/`, { method: 'POST', body: JSON.stringify(newScheduleForm) });
      setIsCreateDialogOpen(false);
      setNewScheduleForm({ busId: "", departureTime: "09:00", arrivalTime: "17:00", daysActive: [] });
      await fetchSchedulesAndBuses();
      alert("Schedule created successfully!");
    } catch (err: any) {
      alert(`Error creating schedule: ${err.message}`);
    }
  };

  const handleSaveSchedule = async () => {
    if (!selectedSchedule) return;
    try {
      const { _id, bus, ...updateData } = selectedSchedule;
      await apiFetch(`/schedules/${_id}`, { method: 'PUT', body: JSON.stringify(updateData) });
      setIsEditDialogOpen(false);
      setSelectedSchedule(null);
      await fetchSchedulesAndBuses();
      alert("Schedule updated successfully!");
    } catch (err: any) {
      alert(`Error updating schedule: ${err.message}`);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (confirm("Are you sure you want to delete this schedule? This action cannot be undone.")) {
      try {
        await apiFetch(`/schedules/${scheduleId}`, { method: 'DELETE' });
        await fetchSchedulesAndBuses();
        alert("Schedule deleted successfully.");
      } catch (err: any) {
        alert(`Error deleting schedule: ${err.message}`);
      }
    }
  };

  if (authStatus === "loading") return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>;

  if (authStatus !== "authenticated") {
    const isForbidden = authStatus === 'forbidden';
    return (<div className="flex items-center justify-center min-h-screen"><Card className="w-96 text-center"><CardContent className="pt-6">
        {isForbidden ? <FaShieldAlt className="w-16 h-16 mx-auto text-red-500 mb-4" /> : <FaCalendarAlt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />}
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
            <div><h1 className="text-3xl font-bold mb-2">Schedule Management</h1><p className="text-muted-foreground">Manage bus schedules and operating days</p></div>
            <div className="flex items-center space-x-2"><Button variant="outline" onClick={() => router.back()}><FaArrowLeft className="mr-2 h-4 w-4" /> Go Back</Button><Button onClick={() => setIsCreateDialogOpen(true)}><FaPlus className="mr-2" /> Add Schedule</Button></div>
        </div>
        <Card className="mb-6">
            <CardHeader><CardTitle className="flex items-center"><FaFilter className="mr-2" /> Filters</CardTitle></CardHeader>
            <CardContent><div className="grid gap-4 md:grid-cols-3">
                <div className="relative"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search by bus number or operator..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/></div>
                <Select value={busFilter} onValueChange={setBusFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
                    <SelectItem value="all">All Buses</SelectItem>
                    {buses.map(bus => <SelectItem key={bus._id} value={bus._id}>{bus.busNumber} ({bus.busCategory})</SelectItem>)}
                </SelectContent></Select>
                <Button variant="outline" onClick={() => { setSearchTerm(""); setBusFilter("all"); }}>Clear Filters</Button>
            </div></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Schedules ({filteredSchedules.length})</CardTitle><CardDescription>All active and inactive bus schedules</CardDescription></CardHeader>
            <CardContent>
                {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
                <div className="overflow-x-auto"><Table>
                    <TableHeader><TableRow><TableHead>Bus</TableHead><TableHead>Departure Time</TableHead><TableHead>Arrival Time</TableHead><TableHead>Active Days</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {filteredSchedules.length === 0 ? (<TableRow><TableCell colSpan={5} className="text-center py-12">No schedules found.</TableCell></TableRow>) : (
                            filteredSchedules.map((schedule) => (
                                <TableRow key={schedule._id}>
                                    <TableCell><div className="font-medium">{schedule.bus?.busNumber || 'N/A'}</div><div className="text-sm text-muted-foreground">{schedule.bus?.busCategory}</div></TableCell>
                                    <TableCell>{schedule.departureTime}</TableCell>
                                    <TableCell>{schedule.arrivalTime}</TableCell>
                                    <TableCell><div className="flex flex-wrap gap-1">{schedule.daysActive.map(day => <Badge key={day} variant="secondary">{day.substring(0,3)}</Badge>)}</div></TableCell>
                                    <TableCell><div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => { setSelectedSchedule(schedule); setIsViewDialogOpen(true); }}><FaEye /></Button>
                                        <Button variant="outline" size="sm" onClick={() => { setSelectedSchedule(schedule); setIsEditDialogOpen(true); }}><FaEdit /></Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteSchedule(schedule._id)}><FaTrash /></Button>
                                    </div></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table></div>
            </CardContent>
        </Card>

        {/* --- MODIFICATION START: Updated View Dialog --- */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Schedule Details</DialogTitle><DialogDescription>Full schedule and bus details.</DialogDescription></DialogHeader>
                {selectedSchedule && selectedSchedule.bus && (
                    <div className="space-y-6 pt-4 text-sm">
                        <div>
                            <Label className="font-semibold text-base flex items-center mb-2"><FaBus className="mr-2"/>Bus Information</Label>
                            <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                                <div>
                                    <p className="text-lg font-bold">{selectedSchedule.bus.busNumber}</p>
                                    <p className="text-muted-foreground">{selectedSchedule.bus.busCategory} - {selectedSchedule.bus.registrationNo}</p>
                                </div>
                                <div className="flex items-center space-x-6 text-xs">
                                    <div><Label>Type</Label><p><Badge className={selectedSchedule.bus.type === 'AC' ? 'bg-blue-500' : 'bg-gray-500'}>{selectedSchedule.bus.type}</Badge></p></div>
                                    <div><Label>Capacity</Label><p className="font-semibold">{selectedSchedule.bus.capacity} seats</p></div>
                                    <div><Label>Status</Label><p><Badge className={selectedSchedule.bus.status === 'ACTIVE' ? 'bg-green-500' : selectedSchedule.bus.status === 'INACTIVE' ? 'bg-yellow-500' : 'bg-red-500'}>{selectedSchedule.bus.status}</Badge></p></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label className="font-semibold text-base flex items-center mb-2"><FaCalendarAlt className="mr-2"/>Schedule</Label>
                            <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                                <div className="grid grid-cols-2">
                                    <p><span className="font-semibold">Departure:</span> {selectedSchedule.departureTime}</p>
                                    <p><span className="font-semibold">Arrival:</span> {selectedSchedule.arrivalTime}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Active Days</p>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {selectedSchedule.daysActive.sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b)).map(day => <Badge key={day} variant="default">{day}</Badge>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
        {/* --- MODIFICATION END --- */}

        {/* Edit and Create Dialogs also updated for bus details */}
        {[
            { isOpen: isEditDialogOpen, onOpenChange: setIsEditDialogOpen, type: 'edit', title: 'Edit Schedule', data: selectedSchedule, handler: handleSaveSchedule, setData: setSelectedSchedule as React.Dispatch<React.SetStateAction<any>> },
            { isOpen: isCreateDialogOpen, onOpenChange: setIsCreateDialogOpen, type: 'new', title: 'Add New Schedule', data: newScheduleForm, handler: handleCreateSchedule, setData: setNewScheduleForm }
        ].map(dialog => {
            const selectedBusForForm = buses.find(b => b._id === dialog.data?.busId);
            return (
            <Dialog key={dialog.type} open={dialog.isOpen} onOpenChange={dialog.onOpenChange}>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>{dialog.title}</DialogTitle><DialogDescription>{dialog.type === 'edit' ? 'Update the schedule details.' : 'Create a new schedule for a bus.'}</DialogDescription></DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div><Label>Bus *</Label><Select value={dialog.data?.busId ?? ''} onValueChange={(v) => dialog.setData(s => ({...s!, busId: v}))}><SelectTrigger><SelectValue placeholder="Select a bus..."/></SelectTrigger><SelectContent>
                            {buses.map(bus => <SelectItem key={bus._id} value={bus._id}>{bus.busNumber} ({bus.busCategory})</SelectItem>)}
                        </SelectContent></Select>
                        {selectedBusForForm && <Card className="mt-2 text-xs p-3 bg-muted/50"><CardContent className="p-0 flex justify-around"><p>Type: <b>{selectedBusForForm.type}</b></p><p>Capacity: <b>{selectedBusForForm.capacity}</b></p><p>Status: <b>{selectedBusForForm.status}</b></p></CardContent></Card>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Departure Time *</Label><Input type="time" value={dialog.data?.departureTime ?? '09:00'} onChange={(e) => dialog.setData(s => ({...s!, departureTime: e.target.value}))}/></div>
                            <div><Label>Arrival Time *</Label><Input type="time" value={dialog.data?.arrivalTime ?? '17:00'} onChange={(e) => dialog.setData(s => ({...s!, arrivalTime: e.target.value}))}/></div>
                        </div>
                        <div><Label>Active Days *</Label><div className="grid grid-cols-3 gap-2 pt-2">
                            {WEEKDAYS.map(day => <div key={day} className="flex items-center space-x-2">
                                <Checkbox id={`${dialog.type}-${day}`} checked={dialog.data?.daysActive.includes(day)} onCheckedChange={(checked) => {
                                    dialog.setData(s => {
                                        if (!s) return null;
                                        const days = new Set(s.daysActive);
                                        checked ? days.add(day) : days.delete(day);
                                        return {...s, daysActive: Array.from(days)};
                                    });
                                }}/><Label htmlFor={`${dialog.type}-${day}`}>{day}</Label>
                            </div>)}
                        </div></div>
                        <DialogFooter><Button variant="outline" onClick={() => dialog.onOpenChange(false)}>Cancel</Button><Button onClick={dialog.handler as () => void}>{dialog.type === 'edit' ? 'Save Changes' : 'Add Schedule'}</Button></DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        )})}
      </div>
    </div>
  );
}