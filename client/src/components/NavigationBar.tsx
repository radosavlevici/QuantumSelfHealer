/**
 * !!! DNA PROTECTED COMPONENT - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987), David Cornelius Marshall, and Serena Elizabeth Thorne
 * Email: ervin210@icloud.com
 * 
 * LICENSED UNDER CUSTOM LICENSE - SEE LICENSE.txt IN PROJECT ROOT
 * This software is subject to royalty payments for commercial use.
 * Unauthorized past and present commercial use is subject to retroactive royalties.
 * 
 * SECURE NAVIGATION COMPONENT
 * This component provides navigation between different sections of the application.
 * It is part of the unified security system with DNA-based protection.
 */

import React from 'react';
import { Link, useLocation } from 'wouter';
import { generateDNASignature, generateSecurityWatermark } from '@shared/quantum-dna-security';
import { 
  TerminalSquare, 
  Shield, 
  Server, 
  Home,
  Cpu,
  CloudCog,
  BrainCircuit
} from 'lucide-react';

// Component identity
const COMPONENT_ID = 'navigation-bar';
const COMPONENT_TYPE = 'navigation';

// Generate secure identifiers
const navDNASignature = generateDNASignature(COMPONENT_ID, COMPONENT_TYPE);
const navWatermark = generateSecurityWatermark(`navigation-${COMPONENT_ID}`);

const NavigationBar: React.FC = () => {
  const [location] = useLocation();
  
  // Define navigation items
  const navItems = [
    {
      path: '/',
      label: 'Terminal',
      icon: <TerminalSquare className="h-5 w-5" />
    },
    {
      path: '/nlp',
      label: 'NLP Terminal',
      icon: <BrainCircuit className="h-5 w-5" />
    },
    {
      path: '/quantum',
      label: 'Quantum',
      icon: <Cpu className="h-5 w-5" />
    },
    {
      path: '/security',
      label: 'Security',
      icon: <Shield className="h-5 w-5" />
    },
    {
      path: '/deployment',
      label: 'Deployment',
      icon: <CloudCog className="h-5 w-5" />
    },
    {
      path: '/home',
      label: 'Home',
      icon: <Home className="h-5 w-5" />
    }
  ];
  
  return (
    <nav 
      className="flex items-center justify-center border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm"
      data-component-id={COMPONENT_ID}
      data-dna-signature={navDNASignature}
      data-watermark={navWatermark}
    >
      <div className="container mx-auto py-3 px-4">
        <ul className="flex flex-wrap items-center justify-center space-x-1 md:space-x-2">
          {navItems.map(item => (
            <li key={item.path}>
              <Link href={item.path}>
                <button 
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${location === item.path 
                      ? 'bg-blue-900/50 text-blue-300' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;