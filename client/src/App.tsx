/**
 * DNA-Protected Application Component
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * This is the main application component with integrated security features
 * and DNA-based watermarking protection.
 */

import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { DNACopyrightWatermark } from "@/components/ui/dna-copyright-watermark";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Terminal from "@/pages/Terminal";
import Assistant from "@/pages/Assistant";
import Settings from "@/pages/Settings";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

function Router() {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow overflow-auto pb-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/terminal" component={Terminal} />
          <Route path="/assistant" component={Assistant} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Navigation currentPath={location} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="quantum-ai-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
          <DNACopyrightWatermark />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
