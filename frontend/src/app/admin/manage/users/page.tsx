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
  FaUsers, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaEnvelope, 
  FaPhone,
  FaCalendar,
  FaFilter,
  FaCrown,
  FaUserAlt
} from "react-icons/fa";
import { format } from "date-fns";
import { CSSShuttleBackground } from "@/components/shuttle-background";

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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+91 98765 43210",
        role: "USER",
        createdAt: "2023-06-15T10:30:00",
        lastLogin: "2024-01-15T14:30:00",
        status: "ACTIVE",
        totalBookings: 15,
        totalSpent: 8450
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+91 98765 43211",
        role: "USER",
        createdAt: "2023-07-20T14:45:00",
        lastLogin: "2024-01-14T09:15:00",
        status: "ACTIVE",
        totalBookings: 8,
        totalSpent: 3200
      },
      {
        id: "3",
        name: "Admin User",
        email: "admin@whereismybus.com",
        phone: "+91 98765 43212",
        role: "ADMIN",
        createdAt: "2023-01-01T00:00:00",
        lastLogin: "2024-01-15T14:25:00",
        status: "ACTIVE",
        totalBookings: 0,
        totalSpent: 0
      },
      {
        id: "4",
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        phone: "+91 98765 43213",
        role: "USER",
        createdAt: "2023-08-10T11:20:00",
        lastLogin: "2024-01-10T16:45:00",
        status: "INACTIVE",
        totalBookings: 3,
        totalSpent: 1250
      },
      {
        id: "5",
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        phone: "+91 98765 43214",
        role: "USER",
        createdAt: "2023-09-05T09:30:00",
        lastLogin: "2024-01-12T13:20:00",
        status: "SUSPENDED",
        totalBookings: 12,
        totalSpent: 5600
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phone && user.phone.includes(searchTerm));
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "INACTIVE":
        return "bg-yellow-500";
      case "SUSPENDED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500";
      case "USER":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleCreateUser = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    setIsEditDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 relative min-h-screen">
        <CSSShuttleBackground />
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
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
                  <Skeleton className="h-10 w-10 rounded-full" />
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
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <Button onClick={handleCreateUser}>
            <FaPlus className="mr-2" />
            Add User
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div>
              <Label>Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
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
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>Manage all user accounts in the system</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <FaUsers className="text-6xl text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or create a new user.</p>
              <Button onClick={handleCreateUser}>
                <FaPlus className="mr-2" />
                Add User
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {user.role === "ADMIN" ? (
                              <FaCrown className="text-yellow-500" />
                            ) : (
                              <FaUserAlt className="text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <p className="text-sm">{user.email}</p>
                          {user.phone && (
                            <p className="text-sm text-muted-foreground">{user.phone}</p>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={`${getRoleColor(user.role)} text-white`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={`${getStatusColor(user.status)} text-white`}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-center">
                          <p className="font-medium">{user.totalBookings}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-right">
                          <p className="font-medium">₹{user.totalSpent.toLocaleString()}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {format(new Date(user.createdAt), "MMM dd, yyyy")}
                          </p>
                          {user.lastLogin && (
                            <p className="text-xs text-muted-foreground">
                              Last: {format(new Date(user.lastLogin), "MMM dd")}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={selectedUser.name} onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={selectedUser.email} onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={selectedUser.phone || ""} onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})} />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={selectedUser.role} onValueChange={(value: "USER" | "ADMIN") => setSelectedUser({...selectedUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={selectedUser.status} onValueChange={(value: "ACTIVE" | "INACTIVE" | "SUSPENDED") => setSelectedUser({...selectedUser, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSaveUser(selectedUser)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input placeholder="Enter full name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="Enter email address" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input placeholder="Enter phone number" />
            </div>
            <div>
              <Label>Role</Label>
              <Select defaultValue="USER">
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
        </div>
    </div>
  );
}