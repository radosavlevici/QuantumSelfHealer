/**
 * !!! DNA-PROTECTED COMPONENT - DO NOT COPY !!!
 * DNA-Protected Navigation Component - Unified Security Build
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 * 
 * This component is part of the integrated DNA-based security system
 * built from the beginning as a unified component, not as a separate piece.
 */

import { Link } from "wouter";
import { COPYRIGHT_OWNER, COPYRIGHT_BIRTHDATE, SYSTEM_VERSION_ID } from "@/lib/dna-security-core";

// DNA signature generation and verification constants
// These MUST match the values in other components or protection will fail
const DNA_SIGNATURE = `dna-protected-navigation-v2-${SYSTEM_VERSION_ID}`;
const VERIFY_TOKEN = `${COPYRIGHT_OWNER}-${COPYRIGHT_BIRTHDATE}-${SYSTEM_VERSION_ID}`;

// Types
interface NavItem {
  id: string;
  path: string;
  icon: string;
  label: string;
}

interface DNAProtectedNavigationProps {
  currentPath: string;
}

const navItems: NavItem[] = [
  {
    id: "home",
    path: "/",
    icon: "dashboard",
    label: "Dashboard"
  },
  {
    id: "terminal",
    path: "/terminal",
    icon: "terminal",
    label: "Terminal"
  },
  {
    id: "quantum",
    path: "/quantum-terminal",
    icon: "blur_circular",
    label: "Quantum"
  },
  {
    id: "assistant",
    path: "/assistant",
    icon: "smart_toy",
    label: "Assistant"
  },
  {
    id: "settings",
    path: "/settings",
    icon: "settings",
    label: "Settings"
  }
];

export default function DNAProtectedNavigation({ currentPath }: DNAProtectedNavigationProps) {
  return (
    <nav 
      className="fixed bottom-0 w-full bg-gray-900 border-t border-gray-800 px-2 py-1 z-10"
      data-dna-signature={DNA_SIGNATURE}
      data-verify-token={VERIFY_TOKEN}
      data-copyright={`© ${COPYRIGHT_OWNER} (${COPYRIGHT_BIRTHDATE})`}
    >
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            
            return (
              <Link 
                key={item.id}
                href={item.path}
                className={`flex flex-col items-center p-1 ${
                  isActive 
                    ? "text-cyan-400" 
                    : "text-gray-400 hover:text-cyan-300"
                }`}
                data-nav-id={item.id}
                data-protected="true"
              >
                <span className="material-icons text-lg">
                  {item.icon}
                </span>
                <span className="text-xs mt-0.5">{item.label}</span>
                
                {isActive && (
                  <div className="absolute -top-1 w-1 h-1 rounded-full bg-cyan-400"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}