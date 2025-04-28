/**
 * Quantum AI Assistant
 * 
 * MIT License (Royalty-Free)
 * Copyright (c) 2025 Quantum AI Assistant Contributors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * ROYALTY-FREE PROVISION:
 * This software is provided completely royalty-free. No payment, fee, or royalty
 * of any kind is required for any use of this software, including commercial use, 
 * redistribution, or creation of derivative works.
 * 
 * INTEGRATED SECURITY SYSTEM V4.0
 * This is the main application component with DNA-based security
 * integrated as one unified system. All components share the same
 * protection mechanisms and are built together as a cohesive system.
 * 
 * FEATURES:
 * - Quantum DNA-based security system
 * - Open source MIT license
 * - Self-repair mechanisms that detect and fix issues
 * - Comprehensive security monitoring
 * - Advanced hybrid AI integration
 */

import React, { useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { queryClient } from './lib/queryClient';
import { DNAProtectionProvider } from '@/components/DNAProtectionProvider';

// Import the DNA security constants and functions
import { 
  IMMUTABLE_COPYRIGHT_OWNER, 
  IMMUTABLE_COPYRIGHT_BIRTHDATE, 
  IMMUTABLE_COPYRIGHT_EMAIL, 
  IMMUTABLE_COPYRIGHT_FULL,
  IMMUTABLE_SYSTEM_VERSION,
  IMMUTABLE_ADDITIONAL_COPYRIGHT_HOLDERS,
  generateDNASignature,
  generateSecurityWatermark,
  verifySecuritySystemIntegrity
} from '@shared/quantum-dna-security';

// Import client-side security system
import { quantumDNASecurity } from '@/lib/quantum-dna-security';

// Import integration services
import { adobeCreativeCloudService } from './lib/adobe-creative-cloud';
import { integratedConnectionSystem } from './lib/integrated-connection-system';

// Import the DNA Protection Provider components
import NavigationBar from './components/NavigationBar';

// Import DNA-protected pages
import HomePage from './pages/HomePage';
import TerminalPage from './pages/TerminalPage';
import QuantumPage from './pages/QuantumPage';
import QuantumTerminal from './pages/QuantumTerminal';
import QuantumNLPTerminal from './pages/QuantumNLPTerminal';
import SecurityDashboard from './pages/SecurityDashboard';
import DeploymentDashboard from './pages/DeploymentDashboard';
import NotFound from './pages/not-found';

// Component identity constants
const COMPONENT_ID = 'dna-protected-app';
const COMPONENT_NAME = 'DNAProtectedApp';

// Generate secure identifiers for the application
const appDNASignature = generateDNASignature(COMPONENT_ID, COMPONENT_NAME);
const appWatermark = generateSecurityWatermark(`app-${COMPONENT_ID}`);

// On application load, perform initialization verification
async function initializeApplication() {
  console.log("QUANTUM AI ASSISTANT INITIALIZING - DNA: " + appDNASignature.slice(0, 10) + "...");
  
  try {
    // Initialize the quantum DNA security system
    await quantumDNASecurity.initialize();
    
    // Initialize the integrated connection system
    await integratedConnectionSystem.initialize();
    
    // Initialize the Adobe Creative Cloud service
    await adobeCreativeCloudService.initialize();
    
    // Set application metadata in DOM for additional protection layer
    document.documentElement.setAttribute('data-dna-protected', 'true');
    document.documentElement.setAttribute('data-copyright-owner', IMMUTABLE_COPYRIGHT_OWNER);
    document.documentElement.setAttribute('data-copyright-birthdate', IMMUTABLE_COPYRIGHT_BIRTHDATE);
    document.documentElement.setAttribute('data-copyright-email', IMMUTABLE_COPYRIGHT_EMAIL);
    document.documentElement.setAttribute('data-security-level', 'maximum');
    document.documentElement.setAttribute('data-watermark', appWatermark);
    document.documentElement.setAttribute('data-system-version', IMMUTABLE_SYSTEM_VERSION);
    document.documentElement.setAttribute('data-adobe-integration', 'enabled');
    
    console.log("Application initialization complete - All systems integrated and operational");
  } catch (error) {
    console.error('Error initializing application:', error);
  }
}

/**
 * Main Application Component with integrated DNA protection system
 * Built from the beginning as one unified security system
 */
function App() {
  // Initialize the application once
  useEffect(() => {
    initializeApplication();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="quantum-dna-theme">
        <TooltipProvider>
          <DNAProtectionProvider>
            <div 
              className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white"
              data-component-id={COMPONENT_ID}
              data-copyright-owner={IMMUTABLE_COPYRIGHT_OWNER}
              data-copyright-full={IMMUTABLE_COPYRIGHT_FULL}
              data-watermark={appWatermark}
              data-security-level="maximum"
            >
              <Toaster />
              <NavigationBar />
              <main className="container mx-auto py-4 px-4">
                <Switch>
                  <Route path="/" component={QuantumNLPTerminal} />
                  <Route path="/nlp" component={QuantumNLPTerminal} />
                  <Route path="/security" component={SecurityDashboard} />
                  <Route path="/deployment" component={DeploymentDashboard} />
                  <Route path="/terminal" component={TerminalPage} />
                  <Route path="/quantum" component={QuantumPage} />
                  <Route path="/home" component={HomePage} />
                  <Route component={NotFound} />
                </Switch>
              </main>
              {/* Copyright notice in footer */}
              <footer className="w-full border-t border-gray-800 mt-8 py-4 px-6 text-center text-xs text-gray-500">
                <p>{IMMUTABLE_COPYRIGHT_FULL}</p>
                <p className="mt-1">Protected by Quantum DNA Security v{IMMUTABLE_SYSTEM_VERSION}</p>
              </footer>
            </div>
          </DNAProtectionProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;