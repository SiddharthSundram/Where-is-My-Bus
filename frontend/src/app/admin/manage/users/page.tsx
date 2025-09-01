"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FaUsers, FaSearch, FaPlus, FaEdit, FaTrash, FaCrown, FaUserAlt, FaFilter, FaShieldAlt, FaArrowLeft, FaEye } from "react-icons/fa";
import { format } from "date-fns";
import { CSSShuttleBackground } from "@/components/shuttle-background";

// --- Configuration ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

// --- Type Definitions ---
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  lastLogin?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  totalBookings: number;
  totalSpent: number;
}

type AuthStatus = "loading" | "authenticated" | "forbidden" | "unauthenticated";

// --- API Helper Function ---
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token || '',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  if (response.status === 204 || (response.status === 200 && options.method === 'DELETE')) {
    return null;
  }
  return response.json();
};

// --- Main Component ---
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Filter and Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog and Form State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", phone: "", password: "", role: "USER" });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  // --- MODIFICATION START: Added state for the view dialog ---
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  // --- MODIFICATION END ---

  const fetchUsers = useCallback(async () => {
    setError(null);
    try {
      const queryParams = new URLSearchParams({ search: searchTerm, role: roleFilter, status: statusFilter }).toString();
      const data = await apiFetch(`/admin/users?${queryParams}`);
      const mappedUsers = data.map((user: any) => ({ ...user, id: user._id }));
      setUsers(mappedUsers);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to fetch users:", err);
    }
  }, [searchTerm, roleFilter, statusFilter]);
  
  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthStatus("unauthenticated");
        return;
      }
      try {
        const data = await apiFetch(`/auth/profile`);
        if (data.user && data.user.role === 'ADMIN') {
          setAuthStatus("authenticated");
        } else {
          setAuthStatus("forbidden");
        }
      } catch (err) {
        localStorage.removeItem("token");
        setAuthStatus("unauthenticated");
      }
    };
    verifyAdmin();
  }, []);

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetchUsers();
    }
  }, [authStatus, fetchUsers]);

  // --- CRUD Handlers ---
  const handleCreateUser = async () => {
    try {
      await apiFetch(`/admin/users`, { method: 'POST', body: JSON.stringify(newUserForm) });
      setIsCreateDialogOpen(false);
      setNewUserForm({ name: "", email: "", phone: "", password: "", role: "USER" });
      await fetchUsers();
      alert("User created successfully!");
    } catch (err: any) {
      alert(`Error creating user: ${err.message}`);
    }
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    try {
      const { id, ...updateData } = selectedUser;
      await apiFetch(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(updateData) });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      await fetchUsers();
      alert("User updated successfully!");
    } catch (err: any) {
      alert(`Error updating user: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' });
        await fetchUsers();
        alert("User deleted successfully.");
      } catch (err: any) {
        alert(`Error deleting user: ${err.message}`);
      }
    }
  };

  // --- Render Logic based on Auth Status ---
  if (authStatus === "loading") {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>;
  }

  if (authStatus === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96 text-center"><CardContent className="pt-6">
          <FaUsers className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground mb-4">Please sign in as an admin to continue.</p>
          <Button onClick={() => router.push("/login")}>Sign In</Button>
        </CardContent></Card>
      </div>
    );
  }
  
  if (authStatus === "forbidden") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96 text-center"><CardContent className="pt-6">
          <FaShieldAlt className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground mb-4">You do not have permission to view this page.</p>
          <Button onClick={() => router.push("/")} variant="outline">Go to Homepage</Button>
        </CardContent></Card>
      </div>
    );
  }

  // --- Main Authenticated Render ---
  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <CSSShuttleBackground />
      <div className="relative z-10">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Oversee all user accounts and permissions.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.back()}><FaArrowLeft className="mr-2 h-4 w-4" /> Go Back</Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}><FaPlus className="mr-2" /> Add User</Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle className="flex items-center"><FaFilter className="mr-2" /> Filters</CardTitle></CardHeader>
          <CardContent><div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search name, email, phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
              <SelectItem value="all">All Roles</SelectItem><SelectItem value="USER">User</SelectItem><SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent></Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
              <SelectItem value="all">All Status</SelectItem><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="INACTIVE">Inactive</SelectItem><SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent></Select>
          </div></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Users ({users.length})</CardTitle><CardDescription>All user accounts in the system</CardDescription></CardHeader>
          <CardContent>
            {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
            <div className="overflow-x-auto"><Table>
              <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Joined</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12">No users found.</TableCell></TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell><div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {user.role === "ADMIN" ? <FaCrown className="text-yellow-500" /> : <FaUserAlt className="text-primary" />}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div></TableCell>
                      <TableCell><Badge className={user.role === 'ADMIN' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}>{user.role}</Badge></TableCell>
                      <TableCell><Badge className={user.status === 'ACTIVE' ? 'bg-green-500 text-white' : user.status === 'INACTIVE' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}>{user.status}</Badge></TableCell>
                      <TableCell><p className="text-sm">{format(new Date(user.createdAt), "MMM dd, yyyy")}</p></TableCell>
                      <TableCell>
                        {/* --- MODIFICATION START: Added View button --- */}
                        <div className="flex items-center space-x-2">
                           <Button variant="outline" size="sm" onClick={() => { setSelectedUser(user); setIsViewDialogOpen(true); }}>
                             <FaEye />
                           </Button>
                           <Button variant="outline" size="sm" onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }}>
                             <FaEdit />
                           </Button>
                           <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                             <FaTrash />
                           </Button>
                        </div>
                        {/* --- MODIFICATION END --- */}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table></div>
          </CardContent>
        </Card>

        {/* --- MODIFICATION START: Added View User Dialog --- */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogDescription>
                        Complete information for {selectedUser?.name}.
                    </DialogDescription>
                </DialogHeader>
                {selectedUser && (
                    <div className="space-y-4 pt-4 text-sm">
                        <div><Label className="font-semibold">User ID</Label><p className="text-muted-foreground break-all">{selectedUser.id}</p></div>
                        <div><Label className="font-semibold">Full Name</Label><p>{selectedUser.name}</p></div>
                        <div><Label className="font-semibold">Email Address</Label><p>{selectedUser.email}</p></div>
                        <div><Label className="font-semibold">Phone Number</Label><p>{selectedUser.phone || 'Not Provided'}</p></div>
                        <div className="flex items-center space-x-8">
                            <div><Label className="font-semibold">Role</Label><p><Badge className={selectedUser.role === 'ADMIN' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}>{selectedUser.role}</Badge></p></div>
                            <div><Label className="font-semibold">Status</Label><p><Badge className={selectedUser.status === 'ACTIVE' ? 'bg-green-500 text-white' : selectedUser.status === 'INACTIVE' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}>{selectedUser.status}</Badge></p></div>
                        </div>
                        <div><Label className="font-semibold">Account Created</Label><p>{format(new Date(selectedUser.createdAt), "PPP p")}</p></div>
                        <div><Label className="font-semibold">Last Login</Label><p>{selectedUser.lastLogin ? format(new Date(selectedUser.lastLogin), "PPP p") : 'Never'}</p></div>
                        <div className="border-t pt-4 grid grid-cols-2 gap-4">
                            <div><Label className="font-semibold">Total Bookings</Label><p className="text-lg font-bold">{selectedUser.totalBookings}</p></div>
                            <div><Label className="font-semibold">Total Spent</Label><p className="text-lg font-bold">₹{(selectedUser.totalSpent ?? 0).toLocaleString()}</p></div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
        {/* --- MODIFICATION END --- */}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}><DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit User: {selectedUser?.name}</DialogTitle><DialogDescription>Update user information and permissions.</DialogDescription></DialogHeader>
          {selectedUser && <div className="space-y-4 pt-4">
            <div><Label>Name</Label><Input value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}/></div>
            <div><Label>Email</Label><Input value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}/></div>
            <div><Label>Role</Label><Select value={selectedUser.role} onValueChange={(v: "USER"|"ADMIN") => setSelectedUser({...selectedUser, role:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
              <SelectItem value="USER">User</SelectItem><SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent></Select></div>
            <div><Label>Status</Label><Select value={selectedUser.status} onValueChange={(v: "ACTIVE"|"INACTIVE"|"SUSPENDED") => setSelectedUser({...selectedUser, status:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="INACTIVE">Inactive</SelectItem><SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent></Select></div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveUser}>Save Changes</Button>
            </div>
          </div>}
        </DialogContent></Dialog>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}><DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New User</DialogTitle><DialogDescription>Create a new user account.</DialogDescription></DialogHeader>
          <div className="space-y-4 pt-4">
            <div><Label>Name *</Label><Input placeholder="Full name" value={newUserForm.name} onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}/></div>
            <div><Label>Email *</Label><Input type="email" placeholder="Email address" value={newUserForm.email} onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}/></div>
            <div><Label>Password *</Label><Input type="password" placeholder="Create a strong password" value={newUserForm.password} onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}/></div>
            <div><Label>Role</Label><Select value={newUserForm.role} onValueChange={(v: "USER"|"ADMIN") => setNewUserForm({...newUserForm, role:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>
              <SelectItem value="USER">User</SelectItem><SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent></Select></div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </div>
          </div>
        </DialogContent></Dialog>
      </div>
    </div>
  );
}