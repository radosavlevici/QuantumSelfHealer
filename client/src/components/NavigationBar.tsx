/**
 * !!! NAVIGATION BAR - DNA PROTECTED COMPONENT !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987), David Cornelius Marshall, and Serena Elizabeth Thorne
 * Email: ervin210@icloud.com
 * 
 * LICENSED UNDER CUSTOM LICENSE - SEE LICENSE.txt IN PROJECT ROOT
 * This software is subject to royalty payments for commercial use.
 * Unauthorized past and present commercial use is subject to retroactive royalties.
 * 
 * NAVIGATION BAR
 * 
 * Main navigation component for the application.
 * Built as one integrated system with DNA-based security from the beginning.
 */

import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  TerminalSquare, 
  Shield, 
  Box, 
  UploadCloud, 
  Settings, 
  Home, 
  Lock, 
  Menu, 
  X 
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDNAProtection } from '@/components/DNAProtectionProvider';

// Component identity constants
const COMPONENT_ID = 'navigation-bar';
const COMPONENT_NAME = 'NavigationBar';

/**
 * Navigation Bar Component
 * Main navigation for the application with DNA-based security
 */
const NavigationBar: React.FC = () => {
  // Use DNA Protection context
  const dnaProtection = useDNAProtection();
  
  // Location hook for active route
  const [location] = useLocation();
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Generate secure identifiers for the component
  const componentDNASignature = dnaProtection.generateComponentSignature(COMPONENT_ID, COMPONENT_NAME);
  
  // Navigation links with icons
  const navLinks = [
    { href: '/', label: 'Quantum NLP', icon: <TerminalSquare className="h-4 w-4 mr-2" /> },
    { href: '/quantum', label: 'Quantum Interface', icon: <Box className="h-4 w-4 mr-2" /> },
    { href: '/terminal', label: 'Terminal', icon: <TerminalSquare className="h-4 w-4 mr-2" /> },
    { href: '/security', label: 'Security', icon: <Shield className="h-4 w-4 mr-2" /> },
    { href: '/deployment', label: 'Deployment', icon: <UploadCloud className="h-4 w-4 mr-2" /> },
  ];
  
  return (
    <nav 
      className="bg-gray-900 border-b border-gray-800 shadow-lg"
      id={COMPONENT_ID}
      data-security-id={COMPONENT_ID}
      data-security-signature={componentDNASignature}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 inline-block text-transparent bg-clip-text">
                Quantum Assistant
              </span>
              <span className="ml-2 text-xs text-gray-400">v{dnaProtection.systemVersion}</span>
            </div>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className={`flex items-center py-2 px-3 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                  location === link.href 
                    ? 'bg-blue-900/50 text-blue-300'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}>
                  {link.icon}
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMobileMenu}
              className="text-gray-300"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 pb-3 pt-2">
          <div className="space-y-1 px-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a 
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    location === link.href 
                      ? 'bg-blue-900/50 text-blue-300'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;