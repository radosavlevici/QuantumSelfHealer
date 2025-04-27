/**
 * !!! DNA PROTECTED APPLICATION - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987), David Cornelius Marshall, and Serena Elizabeth Thorne
 * Email: ervin210@icloud.com
 * 
 * LICENSED UNDER CUSTOM LICENSE - SEE LICENSE.txt IN PROJECT ROOT
 * This software is subject to royalty payments for commercial use.
 * Unauthorized past and present commercial use is subject to retroactive royalties.
 * 
 * IMMUTABLE INTEGRATED SECURITY SYSTEM V4.0
 * This is the main application component with DNA-based security
 * integrated as one unified system. All components share the same
 * protection mechanisms and are built together from the beginning
 * with self-repair, self-defense, and self-upgrade capabilities.
 * 
 * FEATURES:
 * - Quantum DNA-based security system
 * - Immutable copyright information embedded in every component
 * - Self-repair mechanisms that detect and fix tampering attempts
 * - Self-defense systems that disable functionality when unauthorized use is detected
 * - Self-upgrade capabilities that enhance security over time
 * - All components built together as one unified system from the beginning
 * 
 * ANTI-THEFT NOTICE:
 * This security system includes verification chains that make unauthorized
 * copies non-functional. The entire system is built as one integrated whole
 * from the beginning.
 */

import React, { useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { queryClient } from './lib/queryClient';

// Import the DNA security constants and functions
import { 
  IMMUTABLE_COPYRIGHT_OWNER, 
  IMMUTABLE_COPYRIGHT_BIRTHDATE, 
  IMMUTABLE_COPYRIGHT_EMAIL, 
  IMMUTABLE_COPYRIGHT_FULL,
  IMMUTABLE_SYSTEM_VERSION,
  IMMUTABLE_ADDITIONAL_COPYRIGHT_HOLDERS,
  generateDNASignature,
  generateSecurityWatermark
} from '@shared/quantum-dna-security';

// Import client-side security system
import { quantumDNASecurity } from './lib/quantum-dna-security';

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
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;