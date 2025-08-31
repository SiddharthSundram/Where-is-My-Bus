"use client";

import Link from "next/link";
import { FaBus, FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export function Footer() {
  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { href: "/", label: "Home" },
        { href: "/features", label: "Features" },
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact Us" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/terms", label: "Terms & Conditions" },
        { href: "/privacy", label: "Privacy Policy" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/contact", label: "Help Center" },
        { href: "/contact", label: "Contact Support" },
        { href: "/faq", label: "FAQ" },
      ],
    },
  ];
  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  ];
  return (
    <footer className="bg-surface border-t border-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl gradient-primary-luxe flex items-center justify-center shadow-lg hover-glow hover-3d-rotate transform-3d-full transition-all duration-300">
                <FaBus className="text-white text-xl" />
              </div>
              <span className="font-bold text-2xl text-gradient-luxe animate-text-3d-pulse">
                Where is My Bus
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg max-w-lg">
              Experience the future of public transportation with real-time tracking and AI-powered insights across Indian cities.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-all duration-300 hover-3d-link transform-3d-full group">
                <FaEnvelope className="w-5 h-5 hover-3d-icon group-hover:scale-110 transition-transform" />
                <span className="font-medium">support@whereismybus.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-all duration-300 hover-3d-link transform-3d-full group">
                <FaPhone className="w-5 h-5 hover-3d-icon group-hover:scale-110 transition-transform" />
                <span className="font-medium">+91 6202067088</span>
              </div>
            </div>
          </div>
          {/* Footer Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-lg text-primary animate-text-3d-wave">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks[0].links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 link-premium hover-3d-link transform-3d-full group flex items-center space-x-2"
                  >
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Legal Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-lg text-primary animate-text-3d-wave">Legal</h3>
            <ul className="space-y-3">
              {footerLinks[1].links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 link-premium hover-3d-link transform-3d-full group flex items-center space-x-2"
                  >
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Support Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-lg text-primary animate-text-3d-wave">Support</h3>
            <ul className="space-y-3">
              {footerLinks[2].links.map((link, index) => (
              <li key={`${link.href}-${index}`}>

                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 link-premium hover-3d-link transform-3d-full group flex items-center space-x-2"
                  >
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Social & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            {/* Follow Us */}
            <div className="space-y-6">
              <h3 className="font-bold text-lg text-primary animate-text-3d-glow">Follow Us</h3>
              <div className="grid grid-cols-4 gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="aspect-square rounded-xl bg-surface-elevated border-2 border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent hover:border-primary/50 transition-all duration-300 hover:scale-110 hover-3d-rotate transform-3d-full group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 hover-3d-icon group-hover:scale-110 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="space-y-4 bg-surface/50 rounded-2xl p-6 border border-border/50">
              <div className="flex items-center space-x-2 mb-3">
                <h4 className="font-bold text-primary animate-text-3d-pulse">Stay Updated</h4>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Get the latest updates on new features and cities.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-foreground focus-3d-ring transform-3d-full placeholder:text-muted-foreground/50 text-sm"
                />
                <button className="w-full px-6 py-3 btn-premium-light rounded-lg hover:scale-105 transition-all duration-300 hover-3d-button transform-3d-full font-medium text-sm">
                  Subscribe Now
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Join 50,000+ subscribers
              </p>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground animate-text-3d-float text-center md:text-left">
              © 2025 Where is My Bus. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-muted-foreground">
              <Link href="/terms" className="hover:text-primary transition-all duration-300 link-premium hover-3d-link transform-3d-full font-medium">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-primary transition-all duration-300 link-premium hover-3d-link transform-3d-full font-medium">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-primary transition-all duration-300 link-premium hover-3d-link transform-3d-full font-medium">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}