"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  FaUserPlus, 
  FaSignInAlt, 
  FaEye, 
  FaEyeSlash,
  FaBus,
  FaFacebook,
  FaApple,
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from "react-icons/fa";
import { CSSShuttleBackground } from "@/components/shuttle-background";

export default function SignupPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    terms: ""
  });

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Ahmedabad", "Jaipur", "Chandigarh", "Lucknow", "Kanpur",
    "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad",
    "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik"
  ];

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password)) strength += 12.5;
    if (/[A-Z]/.test(password)) strength += 12.5;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 30) return "bg-red-500";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 30) return "Weak";
    if (strength < 70) return "Medium";
    return "Strong";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate password strength
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateStep1 = () => {
    let isValid = true;
    const newErrors = { 
      firstName: "", 
      lastName: "", 
      email: "", 
      phone: "", 
      password: "",
      confirmPassword: "",
      city: "",
      terms: ""
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    if (!formData.city) {
      newErrors.city = "Please select your city";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    let isValid = true;
    const newErrors = { 
      firstName: "", 
      lastName: "", 
      email: "", 
      phone: "", 
      password: "", 
      confirmPassword: "",
      city: "",
      terms: ""
    };

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (passwordStrength < 50) {
      newErrors.password = "Password is too weak";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      handleNextStep();
      return;
    }

    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          preferences: {
            city: formData.city,
            marketing: agreeMarketing,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Account created successfully!");
        router.push("/login");
      } else {
        alert(`❌ ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("⚠️ Cannot connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSocialSignup = (provider: string) => {
    setIsLoading(true);
    // Simulate social signup
    setTimeout(() => {
      setIsLoading(false);
      alert(`${provider} signup clicked! (Demo)`);
    }, 1500);
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 py-12 px-4 relative">
      <CSSShuttleBackground />
      <div className="w-full max-w-md relative z-10">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <FaBus className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Where is My Bus
          </h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm">Personal Info</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm">Security</span>
            </div>
          </div>
        </div>

        {/* Signup Card */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              {step === 1 ? "Enter your personal information" : "Set up your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-muted-foreground" />
                        </div>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="First name"
                          className={`pl-10 ${errors.firstName ? "border-red-500" : ""}`}
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-sm text-red-500 flex items-center">
                          <FaExclamationTriangle className="mr-1" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-muted-foreground" />
                        </div>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Last name"
                          className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`}
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-sm text-red-500 flex items-center">
                          <FaExclamationTriangle className="mr-1" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-muted-foreground" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-muted-foreground" />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-500 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-muted-foreground" />
                      </div>
                      <select
                        id="city"
                        name="city"
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 ${errors.city ? "border-red-500" : ""}`}
                        value={formData.city}
                        onChange={handleSelectChange}
                      >
                        <option value="">Select your city</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.city && (
                      <p className="text-sm text-red-500 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-muted-foreground" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-muted-foreground" />
                        ) : (
                          <FaEye className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Password Strength: {getPasswordStrengthText(passwordStrength)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {passwordStrength}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {errors.password && (
                      <p className="text-sm text-red-500 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-muted-foreground" />
                      </div>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="text-muted-foreground" />
                        ) : (
                          <FaEye className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeTerms}
                        onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm leading-tight">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.terms && (
                      <p className="text-sm text-red-500 flex items-center">
                        <FaExclamationTriangle className="mr-1" />
                        {errors.terms}
                      </p>
                    )}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="marketing"
                        checked={agreeMarketing}
                        onCheckedChange={(checked) => setAgreeMarketing(checked as boolean)}
                      />
                      <Label htmlFor="marketing" className="text-sm leading-tight">
                        I would like to receive updates and promotional offers via email
                      </Label>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={handlePrevStep}>
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaUserPlus className="mr-2" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>

            {step === 1 && (
              <>
                <div className="mt-6">
                  <Separator className="my-4" />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSocialSignup("Google")}
                      disabled={isLoading}
                      className="flex items-center justify-center"
                    >
                      <FaGoogle className="text-red-500" />
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSocialSignup("Facebook")}
                      disabled={isLoading}
                      className="flex items-center justify-center"
                    >
                      <FaFacebook className="text-blue-600" />
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSocialSignup("Apple")}
                      disabled={isLoading}
                      className="flex items-center justify-center"
                    >
                      <FaApple />
                    </Button>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}