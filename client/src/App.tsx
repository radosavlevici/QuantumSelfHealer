/**
 * !!! DNA PROTECTED APPLICATION - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
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
  COPYRIGHT_OWNER, 
  COPYRIGHT_BIRTHDATE, 
  COPYRIGHT_EMAIL, 
  COPYRIGHT_FULL,
  SYSTEM_VERSION,
  SecurityLevel,
  registerClientComponent
} from './lib/dna-security-core';

// Import the DNA Protection Provider 
import DNAProtectionProvider from './components/DNAProtectionProvider';
import DNACopyrightWatermark from './components/ui/DNACopyrightWatermark';

// Import DNA-protected pages
import HomePage from './pages/HomePage';
import TerminalPage from './pages/TerminalPage';
import QuantumPage from './pages/QuantumPage';
import NotFoundPage from './pages/not-found';

// Component identity constants (using the same constants from dna-security-core)
const COMPONENT_ID = 'dna-protected-app';
const COMPONENT_NAME = 'DNAProtectedApp';

// Register the application with the security system
const appComponent = registerClientComponent(
  COMPONENT_ID,
  COMPONENT_NAME,
  SecurityLevel.MAXIMUM
);

// On application load, perform initialization verification
function initializeApplication() {
  console.log("%c QUANTUM DNA PROTECTED APPLICATION INITIALIZING ", "background: #001a33; color: #00ccff; font-weight: bold;");
  console.log(`%c ${COPYRIGHT_FULL} `, "background: #001a33; color: #ffffff;");
  console.log(`%c Quantum DNA Security v${SYSTEM_VERSION} `, "background: #001a33; color: #00ff99;");
  console.log("%c ALL COMPONENTS BUILT AS ONE UNIFIED SYSTEM ", "background: #001a33; color: #ff9900; font-weight: bold;");
  console.log("%c ANTI-THEFT PROTECTION ACTIVE ", "background: #330000; color: #ff6666; font-weight: bold;");
  
  // Set application metadata in DOM for additional protection layer
  document.documentElement.setAttribute('data-dna-protected', 'true');
  document.documentElement.setAttribute('data-copyright-owner', COPYRIGHT_OWNER);
  document.documentElement.setAttribute('data-copyright-birthdate', COPYRIGHT_BIRTHDATE);
  document.documentElement.setAttribute('data-copyright-email', COPYRIGHT_EMAIL);
  document.documentElement.setAttribute('data-security-level', SecurityLevel.MAXIMUM);
  document.documentElement.setAttribute('data-watermark', appComponent.watermark);
  document.documentElement.setAttribute('data-system-version', SYSTEM_VERSION);
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
              data-copyright-owner={COPYRIGHT_OWNER}
              data-copyright-full={COPYRIGHT_FULL}
              data-watermark={appComponent.watermark}
              data-security-level={SecurityLevel.MAXIMUM}
            >
              <Toaster />
              <main className="container mx-auto py-4 px-4">
                <Switch>
                  <Route path="/" component={HomePage} />
                  <Route path="/terminal" component={TerminalPage} />
                  <Route path="/quantum" component={QuantumPage} />
                  <Route component={NotFoundPage} />
                </Switch>
              </main>
              {/* Visible copyright watermark that cannot be removed */}
              <DNACopyrightWatermark position="bottom-right" opacity={0.6} size="small" />
            </div>
          </DNAProtectionProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;