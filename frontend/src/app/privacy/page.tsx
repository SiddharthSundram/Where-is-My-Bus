"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FaShieldAlt, 
  FaUser, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaCookie, 
  FaEnvelope,
  FaPhone,
  FaLock,
  FaDatabase,
  FaTrash,
  FaEye
} from "react-icons/fa";
import { CSSShuttleBackground } from "@/components/shuttle-background";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative min-h-screen">
      <CSSShuttleBackground />
      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: January 15, 2024
          </p>
        </div>

      <div className="space-y-8">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaShieldAlt className="mr-2" />
              1. Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              At Where is My Bus, we are committed to protecting your privacy and ensuring the security of your 
              personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you use our bus tracking and ticketing platform (the "Service").
            </p>
            <p>
              By using our Service, you agree to the collection and use of information in accordance with this 
              policy. This Privacy Policy applies to all users of our Service across India.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaUser className="mr-2" />
              2. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">2.1 Personal Information</h4>
              <p>
                We may collect personal information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials (password, security questions)</li>
                <li>Payment information (for ticket bookings)</li>
                <li>Government-issued identification (for verification purposes)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2.2 Automatically Collected Information</h4>
              <p>
                When you use our Service, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Device information (device type, operating system, browser information)</li>
                <li>Location data (for real-time bus tracking and route optimization)</li>
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Technical information (IP address, cookies, device identifiers)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2.3 Booking and Travel Information</h4>
              <p>
                To provide our services, we collect information related to your travel:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Booking details (routes, dates, seat preferences)</li>
                <li>Payment transaction history</li>
                <li>Travel patterns and preferences</li>
                <li>Feedback and ratings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaDatabase className="mr-2" />
              3. How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>To provide and maintain our Service:</strong> Process bookings, provide real-time tracking, and send journey updates</li>
              <li><strong>To improve our Service:</strong> Analyze usage patterns, optimize routes, and enhance user experience</li>
              <li><strong>To communicate with you:</strong> Send booking confirmations, journey updates, and customer support responses</li>
              <li><strong>To ensure security:</strong> Prevent fraud, protect accounts, and maintain platform integrity</li>
              <li><strong>To comply with legal obligations:</strong> Meet regulatory requirements and respond to legal requests</li>
              <li><strong>For marketing purposes:</strong> With your consent, send promotional offers and service updates</li>
            </ul>
          </CardContent>
        </Card>

        {/* Location Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              4. Location Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our Service requires access to your location to provide real-time bus tracking and route optimization. 
              We collect location data:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>When you actively use the tracking feature</li>
              <li>To provide accurate ETA predictions and journey updates</li>
              <li>To optimize bus routes and improve service efficiency</li>
              <li>To enhance safety and security features</li>
            </ul>
            <p>
              We do not sell your location data to third parties. Location data is retained only as long as 
              necessary to provide our services and is anonymized for analytical purposes.
            </p>
          </CardContent>
        </Card>

        {/* Data Sharing and Disclosure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaEye className="mr-2" />
              5. Data Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your 
              information only in the following circumstances:
            </p>
            
            <div>
              <h4 className="font-semibold mb-2">5.1 Service Providers</h4>
              <p>
                We share information with third-party service providers who perform services on our behalf, such as:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Payment processing companies</li>
                <li>Cloud storage and hosting providers</li>
                <li>Customer support platforms</li>
                <li>Analytics and data processing services</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">5.2 Legal Requirements</h4>
              <p>
                We may disclose your information when required by law, regulation, or legal process, or when 
                we believe in good faith that disclosure is necessary to protect our rights, safety, or the 
                rights of others.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">5.3 Bus Operators and Partners</h4>
              <p>
                We share necessary booking and travel information with bus operators and transportation partners 
                to fulfill your travel bookings and provide the services you request.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaLock className="mr-2" />
              6. Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security assessments and vulnerability testing</li>
              <li>Employee training on data protection practices</li>
              <li>Incident response and breach notification procedures</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or method of electronic storage is 
              100% secure. While we strive to use commercially acceptable means to protect your personal 
              information, we cannot guarantee its absolute security.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaCalendar className="mr-2" />
              7. Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We retain your personal information only as long as necessary to fulfill the purposes for 
              which it was collected, including for the purposes of satisfying any legal, accounting, 
              or reporting requirements.
            </p>
            
            <div>
              <h4 className="font-semibold mb-2">Retention Periods</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Account Information:</strong> Retained while your account is active</li>
                <li><strong>Booking History:</strong> Retained for 7 years for accounting and legal purposes</li>
                <li><strong>Location Data:</strong> Retained for 30 days for service optimization</li>
                <li><strong>Payment Information:</strong> Retained for 7 years as required by law</li>
                <li><strong>Marketing Communications:</strong> Retained until you opt-out</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights and Choices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaUser className="mr-2" />
              8. Your Rights and Choices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You have certain rights regarding your personal information. These rights may vary depending 
              on your location and applicable laws.
            </p>
            
            <div>
              <h4 className="font-semibold mb-2">8.1 Access and Correction</h4>
              <p>
                You can access and update your personal information through your account settings. You may 
                also request corrections to inaccurate or incomplete information.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">8.2 Data Deletion</h4>
              <p>
                You can request the deletion of your personal information, subject to certain legal 
                obligations. We may retain necessary information to complete transactions or comply with 
                legal requirements.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">8.3 Marketing Communications</h4>
              <p>
                You can opt-out of receiving marketing communications at any time by following the 
                unsubscribe instructions in our emails or through your account settings.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">8.4 Location Services</h4>
              <p>
                You can control location data collection through your device settings. However, disabling 
                location services may limit the functionality of our tracking features.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaCookie className="mr-2" />
              9. Cookies and Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to enhance your experience, analyze usage, 
              and provide personalized content. Our Cookie Policy provides detailed information about 
              the types of cookies we use and your choices regarding them.
            </p>
            <p>
              You can control cookie preferences through your browser settings. However, disabling 
              certain cookies may affect the functionality of our Service.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>10. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our Service is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If we become aware that we have collected 
              personal information from a child under 13, we will take steps to delete such information.
            </p>
          </CardContent>
        </Card>

        {/* International Data Transfers */}
        <Card>
          <CardHeader>
            <CardTitle>11. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your information may be transferred to and processed in countries other than your country 
              of residence, including India and other countries where our service providers operate. 
              We ensure that such transfers comply with applicable data protection laws and include 
              appropriate safeguards.
            </p>
          </CardContent>
        </Card>

        {/* Changes to This Policy */}
        <Card>
          <CardHeader>
            <CardTitle>12. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes 
              by posting the new policy on this page and updating the "Last updated" date. We encourage you 
              to review this policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaEnvelope className="mr-2" />
              13. Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about this Privacy Policy, please contact our Data Protection 
              Officer at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@whereismybus.com</p>
              <p><strong>Phone:</strong> +91 1800-123-4567</p>
              <p><strong>Address:</strong> 123 Tech Park, Mumbai, Maharashtra 400001, India</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Grievance Officer</h4>
              <p>
                For any privacy-related complaints or grievances, please contact our Grievance Officer 
                at the above address or email privacy@whereismybus.com with the subject line "Privacy Grievance".
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-8">
          <Button variant="outline" asChild>
            <a href="/terms">View Terms & Conditions</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/cookies">Cookie Policy</a>
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