"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUser } from "react-icons/fa";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // ✅ If NOT authenticated, show login card
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
            <p className="text-muted-foreground mb-4">Please sign in to continue</p>
            <Button
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ If authenticated, render the protected page
  return <>{children}</>;
}
