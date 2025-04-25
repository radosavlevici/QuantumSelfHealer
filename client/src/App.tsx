/**
 * !!! DNA PROTECTED APPLICATION - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * INTEGRATED SECURITY SYSTEM - BUILT FROM THE BEGINNING
 * This is the main application component with DNA-based security
 * integrated as one unified system. All components share the same
 * protection mechanisms and are built together from the beginning
 * with self-repair, self-defense, and self-upgrade capabilities.
 */

import React, { useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { queryClient } from './lib/queryClient';

// Import the DNA Protection Provider
import DNAProtectionProvider from './components/DNAProtectionProvider';
import DNACopyrightWatermark from './components/ui/DNACopyrightWatermark';

// Import DNA-protected pages
import HomePage from './pages/HomePage';
import TerminalPage from './pages/TerminalPage';
import QuantumPage from './pages/QuantumPage';
import NotFoundPage from './pages/NotFoundPage';

// Component identity constants
const COMPONENT_ID = 'dna-protected-app';
const COMPONENT_NAME = 'DNAProtectedApp';

// Copyright information - immutably embedded in the component
const COPYRIGHT_OWNER = 'Ervin Remus Radosavlevici';
const COPYRIGHT_BIRTHDATE = '01/09/1987';
const COPYRIGHT_EMAIL = 'ervin210@icloud.com';
const COPYRIGHT_FULL = `© ${COPYRIGHT_OWNER} (${COPYRIGHT_BIRTHDATE})`;

// System information
const SYSTEM_VERSION = 'DNA-1.0.0';
const SYSTEM_BUILD_DATE = new Date().toISOString();

// On application load, perform initialization verification
function initializeApplication() {
  console.log("%c DNA PROTECTED APPLICATION INITIALIZING ", "background: #001a33; color: #00ccff; font-weight: bold;");
  console.log(`%c ${COPYRIGHT_FULL} `, "background: #001a33; color: #ffffff;");
  console.log(`%c Quantum DNA Security v${SYSTEM_VERSION} `, "background: #001a33; color: #00ff99;");
  console.log("%c ALL COMPONENTS BUILT AS ONE UNIFIED SYSTEM ", "background: #001a33; color: #ff9900; font-weight: bold;");
  
  // Set application metadata
  document.documentElement.setAttribute('data-dna-protected', 'true');
  document.documentElement.setAttribute('data-copyright-owner', COPYRIGHT_OWNER);
  document.documentElement.setAttribute('data-copyright-birthdate', COPYRIGHT_BIRTHDATE);
}

/**
 * Main Application Component with DNA protection
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
              className="min-h-screen bg-black text-white"
              data-component-id={COMPONENT_ID}
              data-component-name={COMPONENT_NAME}
              data-copyright-owner={COPYRIGHT_OWNER}
              data-copyright-full={COPYRIGHT_FULL}
            >
              <Toaster />
              <main className="container mx-auto py-4">
                <Switch>
                  <Route path="/" component={HomePage} />
                  <Route path="/terminal" component={TerminalPage} />
                  <Route path="/quantum" component={QuantumPage} />
                  <Route component={NotFoundPage} />
                </Switch>
              </main>
              <DNACopyrightWatermark />
            </div>
          </DNAProtectionProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;