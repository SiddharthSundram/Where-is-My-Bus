"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaExclamationTriangle, FaHome, FaSearch, FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-yellow-600 text-2xl" />
            </div>
            <CardTitle className="text-2xl">404 - Page Not Found</CardTitle>
            <CardDescription>
              Oops! The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                The URL you entered may be incorrect, or the page may have been
                removed or renamed.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/">
                  <FaHome className="mr-2" />
                  Go to Home
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/find">
                  <FaSearch className="mr-2" />
                  Find My Bus
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={handleGoBack}
              >
                <span>
                  <FaArrowLeft className="mr-2" />
                  Go Back
                </span>
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                If you believe this is an error, please contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}