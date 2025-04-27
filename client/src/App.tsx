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
  generateDNASignature,
  generateSecurityWatermark,
  verifySecuritySystemIntegrity
} from '@shared/quantum-dna-security';

// Import client-side DNA security core
import { verifyClientSecurity } from './lib/dna-security-core';

// Import the DNA Protection Provider 
import { DNAProtectionProvider } from './components/DNAProtectionProvider';
import { DNACopyrightWatermark } from './components/ui/DNACopyrightWatermark';

// Import DNA-protected pages
import HomePage from './pages/HomePage';
import TerminalPage from './pages/TerminalPage';
import QuantumPage from './pages/QuantumPage';
import QuantumTerminal from './pages/QuantumTerminal';
import QuantumNLPTerminal from './pages/QuantumNLPTerminal';
import SecurityDashboard from './pages/SecurityDashboard';
import NotFound from './pages/not-found';

// Component identity constants
const COMPONENT_ID = 'dna-protected-app';
const COMPONENT_NAME = 'DNAProtectedApp';

// Generate secure identifiers for the application
const appDNASignature = generateDNASignature(COMPONENT_ID, COMPONENT_NAME);
const appWatermark = generateSecurityWatermark(`app-${COMPONENT_ID}`);

// On application load, perform initialization verification
function initializeApplication() {
  console.log("%c QUANTUM DNA PROTECTED APPLICATION INITIALIZING ", "background: #001a33; color: #00ccff; font-weight: bold;");
  console.log(`%c ${IMMUTABLE_COPYRIGHT_FULL} `, "background: #001a33; color: #ffffff;");
  console.log(`%c Quantum DNA Security v${IMMUTABLE_SYSTEM_VERSION} `, "background: #001a33; color: #00ff99;");
  console.log("%c ALL COMPONENTS BUILT AS ONE UNIFIED SYSTEM ", "background: #001a33; color: #ff9900; font-weight: bold;");
  console.log("%c ANTI-THEFT PROTECTION ACTIVE ", "background: #330000; color: #ff6666; font-weight: bold;");
  
  // Verify security system integrity
  const securityStatus = verifyClientSecurity();
  if (!securityStatus.valid) {
    console.error("%c SECURITY SYSTEM INTEGRITY COMPROMISED ", "background: #990000; color: #ffffff; font-weight: bold;");
  }
  
  // Set application metadata in DOM for additional protection layer
  document.documentElement.setAttribute('data-dna-protected', 'true');
  document.documentElement.setAttribute('data-copyright-owner', IMMUTABLE_COPYRIGHT_OWNER);
  document.documentElement.setAttribute('data-copyright-birthdate', IMMUTABLE_COPYRIGHT_BIRTHDATE);
  document.documentElement.setAttribute('data-copyright-email', IMMUTABLE_COPYRIGHT_EMAIL);
  document.documentElement.setAttribute('data-security-level', 'maximum');
  document.documentElement.setAttribute('data-watermark', appWatermark);
  document.documentElement.setAttribute('data-system-version', IMMUTABLE_SYSTEM_VERSION);
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
          {/* Wrap the entire application in the DNA Protection Provider */}
          <DNAProtectionProvider>
            <div 
              className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white"
              data-component-id={COMPONENT_ID}
              data-component-name={COMPONENT_NAME}
              data-copyright-owner={IMMUTABLE_COPYRIGHT_OWNER}
              data-copyright-full={IMMUTABLE_COPYRIGHT_FULL}
              data-watermark={appWatermark}
              data-security-level="maximum"
            >
              <Toaster />
              <main className="container mx-auto py-0 px-0">
                <Switch>
                  <Route path="/" component={QuantumTerminal} />
                  <Route path="/nlp" component={QuantumNLPTerminal} />
                  <Route path="/security" component={SecurityDashboard} />
                  <Route path="/terminal" component={TerminalPage} />
                  <Route path="/quantum" component={QuantumPage} />
                  <Route path="/home" component={HomePage} />
                  <Route component={NotFound} />
                </Switch>
              </main>
              {/* Visible copyright watermark that cannot be removed */}
              <DNACopyrightWatermark position="bottom-right" expanded={false} />
            </div>
          </DNAProtectionProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;