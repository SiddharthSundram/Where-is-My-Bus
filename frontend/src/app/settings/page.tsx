"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  FaBell, 
  FaMoon, 
  FaSun, 
  FaShieldAlt, 
  FaLock, 
  FaUser, 
  FaGlobe,
  FaPalette,
  FaSave,
  FaTrash,
  FaDownload
} from "react-icons/fa";
import { CSSShuttleBackground } from "@/components/shuttle-background";

interface UserSettings {
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    bookingReminders: boolean;
    delayAlerts: boolean;
    promotional: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private";
    showEmail: boolean;
    showPhone: boolean;
    dataCollection: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
  };
  language: string;
  timezone: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    theme: "dark",
    notifications: {
      email: true,
      push: true,
      sms: false,
      bookingReminders: true,
      delayAlerts: true,
      promotional: false
    },
    privacy: {
      profileVisibility: "private",
      showEmail: false,
      showPhone: false,
      dataCollection: true
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: 30
    },
    language: "en",
    timezone: "Asia/Kolkata"
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Show success message
    }, 1000);
  };

  const handleReset = () => {
    setSettings({
      theme: "dark",
      notifications: {
        email: true,
        push: true,
        sms: false,
        bookingReminders: true,
        delayAlerts: true,
        promotional: false
      },
      privacy: {
        profileVisibility: "private",
        showEmail: false,
        showPhone: false,
        dataCollection: true
      },
      security: {
        twoFactorAuth: false,
        loginAlerts: true,
        sessionTimeout: 30
      },
      language: "en",
      timezone: "Asia/Kolkata"
    });
  };

  const exportData = () => {
    // Simulate data export
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'settings-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Simulate account deletion
      console.log("Account deletion requested");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <CSSShuttleBackground />
      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your app experience and preferences</p>
        </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings Menu</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {[
                  { id: "general", label: "General", icon: FaGlobe },
                  { id: "notifications", label: "Notifications", icon: FaBell },
                  { id: "privacy", label: "Privacy", icon: FaUser },
                  { id: "security", label: "Security", icon: FaShieldAlt },
                  { id: "appearance", label: "Appearance", icon: FaPalette },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold capitalize">{activeTab} Settings</h2>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleReset}>
                Reset to Default
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                <FaSave className="mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Settings</CardTitle>
                  <CardDescription>Configure your language and timezone preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        value={settings.language}
                        onChange={(e) => setSettings({...settings, language: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="bn">বাংলা (Bengali)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                        <option value="mr">मराठी (Marathi)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        value={settings.timezone}
                        onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="Asia/Kolkata">India Standard Time (IST)</option>
                        <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
                        <option value="UTC">Coordinated Universal Time (UTC)</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Choose how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, email: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, push: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, sms: checked }
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Types</CardTitle>
                  <CardDescription>Customize which notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Booking Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminders before your journey</p>
                    </div>
                    <Switch
                      checked={settings.notifications.bookingReminders}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, bookingReminders: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Delay Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about bus delays</p>
                    </div>
                    <Switch
                      checked={settings.notifications.delayAlerts}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, delayAlerts: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Promotional Offers</Label>
                      <p className="text-sm text-muted-foreground">Receive special offers and discounts</p>
                    </div>
                    <Switch
                      checked={settings.notifications.promotional}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, promotional: checked }
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Privacy</CardTitle>
                  <CardDescription>Control who can see your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                    </div>
                    <Switch
                      checked={settings.privacy.profileVisibility === "public"}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          privacy: { 
                            ...settings.privacy, 
                            profileVisibility: checked ? "public" : "private"
                          }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">Display your email on your profile</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showEmail}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, showEmail: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Phone Number</Label>
                      <p className="text-sm text-muted-foreground">Display your phone number on your profile</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showPhone}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, showPhone: checked }
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data & Analytics</CardTitle>
                  <CardDescription>Manage how your data is used for improving the service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Collection</Label>
                      <p className="text-sm text-muted-foreground">Allow collection of anonymous usage data</p>
                    </div>
                    <Switch
                      checked={settings.privacy.dataCollection}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, dataCollection: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      We use this data to improve our services, personalize your experience, and develop new features. 
                      Your personal information is never shared with third parties without your consent.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, twoFactorAuth: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
                    </div>
                    <Switch
                      checked={settings.security.loginAlerts}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, loginAlerts: checked }
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Management</CardTitle>
                  <CardDescription>Control how long you stay logged in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: { 
                            ...settings.security, 
                            sessionTimeout: parseInt(e.target.value) || 30
                          }
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      You will be automatically logged out after this period of inactivity
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>Irreversible account actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive" onClick={deleteAccount}>
                      <FaTrash className="mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Preferences</CardTitle>
                  <CardDescription>Customize the look and feel of the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setSettings({...settings, theme: "light"})}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        settings.theme === "light" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <FaSun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <span className="font-medium">Light</span>
                    </button>
                    
                    <button
                      onClick={() => setSettings({...settings, theme: "dark"})}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        settings.theme === "dark" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <FaMoon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <span className="font-medium">Dark</span>
                    </button>
                    
                    <button
                      onClick={() => setSettings({...settings, theme: "system"})}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        settings.theme === "system" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                        <FaSun className="w-4 h-4 text-yellow-500" />
                        <FaMoon className="w-4 h-4 text-blue-500 -ml-2" />
                      </div>
                      <span className="font-medium">System</span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Export or manage your settings data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Export Settings</Label>
                      <p className="text-sm text-muted-foreground">Download your settings as a JSON file</p>
                    </div>
                    <Button variant="outline" onClick={exportData}>
                      <FaDownload className="mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}