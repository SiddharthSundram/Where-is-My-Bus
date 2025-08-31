"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import {
  FaBus,
  FaHome,
  FaSearch,
  FaInfoCircle,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus,
  FaBell,
  FaTicketAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = "http://127.0.0.1:5000";

// Define the UserProfile interface to type the fetched data
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const [notificationCount] = useState(3);

  // State to store detailed user profile fetched specifically for the navbar
  const [navUser, setNavUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Function to fetch user profile data
    const fetchUserProfileForNav = async () => {
      const token = localStorage.getItem("token");
      // If user is not authenticated or no token exists, do nothing.
      if (!isAuthenticated || !token) {
        setNavUser(null); // Clear user data if logged out
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: "GET",
          headers: {
            "Authorization": token,
          },
        });

        if (response.status === 401) {
          logout(); // Log out if token is invalid
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch profile data for navbar.");
        }

        const data = await response.json();
        setNavUser(data.user); // Store fetched user data in state
      } catch (err) {
        console.error("Error fetching profile for navbar:", err);
      }
    };

    fetchUserProfileForNav();
  }, [isAuthenticated, logout]); // Rerun this effect when authentication state changes

  // Use the freshly fetched user data (`navUser`) if available,
  // otherwise fallback to the data from AuthContext (`user`) as a placeholder.
  const displayUser = navUser || user;


  const publicNavItems = [
    { href: "/", label: "Home", icon: FaHome },
    { href: "/features", label: "Features", icon: FaSearch },
    { href: "/about", label: "About Us", icon: FaInfoCircle },
    { href: "/contact", label: "Contact Us", icon: FaEnvelope },
  ];

  const protectedNavItems = [
    { href: "/", label: "Home", icon: FaHome },
    { href: "/find", label: "Find My Bus", icon: FaSearch },
    { href: "/about", label: "About Us", icon: FaInfoCircle },
    { href: "/contact", label: "Contact Us", icon: FaEnvelope },
  ];

  const NavLinks = ({ items }: { items: typeof publicNavItems }) => (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover-3d-lift transform-3d-full ${
            pathname === item.href
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-primary hover:bg-accent hover:scale-105"
          }`}
          onClick={() => setIsOpen(false)}
        >
          <item.icon className="w-4 h-4 hover-3d-icon" />
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-primary-luxe flex items-center justify-center shadow-lg hover-glow hover-3d-rotate transform-3d-full">
                <FaBus className="text-white text-lg" />
              </div>
              <span className="font-bold text-xl text-gradient-luxe animate-text-3d-pulse">
                Where is My Bus
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <NavLinks items={protectedNavItems} />
            ) : (
              <NavLinks items={publicNavItems} />
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="hidden sm:flex"
            >
              <FaSun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <FaMoon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <Button variant="ghost" size="icon">
                    <FaBell className="h-4 w-4" />
                    {notificationCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* My Ticket */}
                <Button variant="ghost" asChild>
                  <Link href="/tickets">
                    <FaTicketAlt className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">My Ticket</span>
                  </Link>
                </Button>

                {/* User Menu dynamically populated */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        {/* Dynamic avatar image from DiceBear based on user name */}
                        <AvatarImage
                          src={displayUser?.name ? `https://api.dicebear.com/7.x/initials/svg?seed=${displayUser.name}` : undefined}
                          alt={displayUser?.name || "User"}
                        />
                        {/* Fallback to user initials if image fails or name exists */}
                        <AvatarFallback>
                          {displayUser?.name
                            ? displayUser.name.split(' ').map((n) => n[0]).join('')
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {displayUser?.name || "Loading..."}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {displayUser?.email || "..."}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <FaUser className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <FaCog className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard">
                            <FaCog className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { logout(); window.location.reload(); }}>
                      <FaSignOutAlt className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Auth Buttons */}
                <Button variant="ghost" asChild>
                  <Link href="/login">
                    <FaSignInAlt className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </Button>
                <Button asChild className="btn-premium-light">
                  <Link href="/signup">
                    <FaUserPlus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <FaBars className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Menu</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaTimes className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Mobile Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <span>Theme</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    >
                      {theme === "light" ? (
                        <FaMoon className="h-4 w-4" />
                      ) : (
                        <FaSun className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex flex-col space-y-2">
                    {isAuthenticated ? (
                      <NavLinks items={protectedNavItems} />
                    ) : (
                      <NavLinks items={publicNavItems} />
                    )}
                  </div>

                  {/* Mobile Auth Actions */}
                  {!isAuthenticated && (
                    <div className="flex flex-col space-y-2 pt-4 border-t">
                      <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                        <Link href="/login">
                          <FaSignInAlt className="mr-2 h-4 w-4" />
                          Login
                        </Link>
                      </Button>
                      <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                        <Link href="/signup">
                          <FaUserPlus className="mr-2 h-4 w-4" />
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
