"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaFileContract, FaCalendar, FaShieldAlt, FaGavel, FaUser, FaMoneyBill } from "react-icons/fa";
import { CSSShuttleBackground } from "@/components/shuttle-background";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative min-h-screen">
      <CSSShuttleBackground />
      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground">
            Last updated: January 15, 2024
          </p>
        </div>

      <div className="space-y-8">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaFileContract className="mr-2" />
              1. Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to Where is My Bus! These Terms & Conditions ("Terms") govern your use of our bus tracking and ticketing platform 
              (the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
            <p>
              Where is My Bus provides a real-time bus tracking, ticket booking, and journey management platform across India. 
              Our Service helps users track bus locations, book tickets, and receive real-time updates about their journeys.
            </p>
          </CardContent>
        </Card>

        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaGavel className="mr-2" />
              2. Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              By creating an account, accessing our platform, or using our Service, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not use our Service.
            </p>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant changes through 
              email or by posting a prominent notice on our platform. Your continued use of the Service after such changes 
              constitutes acceptance of the modified Terms.
            </p>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaUser className="mr-2" />
              3. User Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">3.1 Account Registration</h4>
              <p>
                To use certain features of our Service, you must register for an account. You agree to provide accurate, 
                current, and complete information during registration and to keep your account information updated.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">3.2 Account Security</h4>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                that occur under your account. You must notify us immediately of any unauthorized use of your account.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">3.3 Account Eligibility</h4>
              <p>
                You must be at least 13 years old to create an account. By creating an account, you represent and warrant 
                that you meet this age requirement.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaCalendar className="mr-2" />
              4. Service Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">4.1 Permitted Use</h4>
              <p>
                You may use our Service to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Track real-time bus locations</li>
                <li>Book bus tickets for personal travel</li>
                <li>Receive journey updates and notifications</li>
                <li>Manage your bookings and travel history</li>
                <li>Access customer support services</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">4.2 Prohibited Activities</h4>
              <p>
                You may not use our Service to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Engage in fraudulent activities or transactions</li>
                <li>Use automated systems or bots to access our Service</li>
                <li>Reverse engineer or decompile our platform</li>
                <li>Interfere with or disrupt our Service or servers</li>
                <li>Impersonate others or provide false information</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Booking and Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaMoneyBill className="mr-2" />
              5. Booking and Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">5.1 Booking Terms</h4>
              <p>
                All bookings are subject to availability and confirmation. We reserve the right to cancel or modify 
                bookings due to operational requirements, weather conditions, or other unforeseen circumstances.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">5.2 Payment Terms</h4>
              <p>
                Payments must be made using the methods specified on our platform. All prices are inclusive of applicable 
                taxes unless otherwise stated. We use secure payment processors to protect your financial information.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">5.3 Cancellation and Refunds</h4>
              <p>
                Cancellation policies vary by bus operator and route type. Please refer to the specific terms provided 
                during booking. Refunds, when available, will be processed according to our refund policy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaShieldAlt className="mr-2" />
              6. Privacy and Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your privacy is important to us. Our collection, use, and protection of your personal information 
              is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p>
              By using our Service, you consent to the collection and use of your information as described in 
              our Privacy Policy, including the use of cookies and similar technologies.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>7. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              All content, features, and functionality of our Service, including text, graphics, logos, and software, 
              are the property of Where is My Bus or its licensors and are protected by intellectual property laws.
            </p>
            <p>
              You may not copy, modify, distribute, or create derivative works of our Service without our express 
              written permission.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>8. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our Service is provided on an "as is" and "as available" basis. We make no warranties or representations 
              about the accuracy, reliability, or availability of our Service.
            </p>
            <p>
              To the fullest extent permitted by law, Where is My Bus shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages arising from your use of our Service.
            </p>
          </CardContent>
        </Card>

        {/* Indemnification */}
        <Card>
          <CardHeader>
            <CardTitle>9. Indemnification</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You agree to indemnify and hold harmless Where is My Bus, its officers, directors, employees, and agents 
              from any claims, damages, losses, liabilities, and expenses arising from your use of our Service or 
              violation of these Terms.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle>10. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right to suspend or terminate your account and access to our Service at any time, 
              with or without cause, and with or without notice.
            </p>
            <p>
              Upon termination, all provisions of these Terms that by their nature should survive termination, 
              including without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations 
              of liability, shall continue in effect.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>11. Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard 
              to its conflict of law principles. Any disputes arising from these Terms shall be subject to the 
              exclusive jurisdiction of the courts in Mumbai, India.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>12. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> support@whereismybus.com</p>
              <p><strong>Phone:</strong> +91 1800-123-4567</p>
              <p><strong>Address:</strong> 123 Tech Park, Mumbai, Maharashtra 400001, India</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-8">
          <Button variant="outline" asChild>
            <a href="/privacy">View Privacy Policy</a>
          </Button>
          <Button asChild>
            <a href="/contact">Contact Support</a>
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}