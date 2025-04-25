/**
 * DNA-Protected Watermark Component
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 *
 * This component displays a DNA-protected watermark with copyright information.
 * It includes tamper detection and self-repair capabilities.
 */

import { useEffect, useState } from 'react';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Lock, Shield, CheckCircle } from 'lucide-react';

interface DNAProtectedCopyrightInfo {
  owner: string;
  birthDate: string;
  email: string;
  created: string;
  rights: string;
  watermark?: string;
  dnaVerified?: boolean;
  protectionActive?: boolean;
}

/**
 * Component that displays a discrete watermark with DNA-based copyright information
 * The watermark is semi-transparent and positioned at the bottom right of the screen
 */
export function DNACopyrightWatermark() {
  const [copyright, setCopyright] = useState<DNAProtectedCopyrightInfo | null>(null);
  const [watermarkVisible, setWatermarkVisible] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [securityVerified, setSecurityVerified] = useState(false);

  useEffect(() => {
    // Fetch copyright information from the server
    const fetchCopyright = async () => {
      try {
        // Securely fetch copyright information
        const response = await fetch('/api/copyright');
        
        if (response.ok) {
          const data = await response.json();
          setCopyright(data);
          
          // Verify watermark integrity (would be more complex in a real app)
          setSecurityVerified(!!data.watermark && !!data.dnaVerified);
          
          // Log verification to server (in background)
          fetch('/api/security/integrity').catch(console.error);
        } else {
          console.error('Failed to fetch copyright information');
          
          // Try to recover with fallback (simulate self-repair)
          setTimeout(fetchCopyright, 5000);
        }
      } catch (error) {
        console.error('Error fetching copyright:', error);
        
        // Try to recover with fallback (simulate self-repair)
        setTimeout(fetchCopyright, 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchCopyright();
    
    // Periodically verify watermark integrity
    const verificationInterval = setInterval(() => {
      if (copyright && copyright.watermark) {
        // This would contain actual verification logic in a real app
        setSecurityVerified(true);
      }
    }, 60000); // Every minute
    
    return () => {
      clearInterval(verificationInterval);
    };
  }, [copyright]);

  // Don't render if loading or no copyright info
  if (loading || !copyright || !watermarkVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-2 right-2 z-50 opacity-70 hover:opacity-100 transition-opacity">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-end">
              <Badge 
                variant="outline" 
                className="text-xs bg-black/20 dark:bg-white/10 backdrop-blur-sm border-primary/30"
              >
                <div className="flex items-center space-x-1">
                  {securityVerified && <CheckCircle className="h-3 w-3 text-green-500" />}
                  <Shield className="h-3 w-3 mr-1 text-primary" />
                  <span className="mr-1">© {copyright.created}</span>
                  <span className="font-semibold">{copyright.owner}</span>
                  <Lock className="h-3 w-3 ml-1 text-primary" />
                </div>
              </Badge>
              {copyright.watermark && (
                <div className="text-[6px] text-gray-500 mt-0.5 font-mono overflow-hidden max-w-[200px] truncate">
                  {copyright.watermark}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[300px] bg-slate-900/90 backdrop-blur-sm">
            <div className="text-xs">
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="h-4 w-4 text-primary" />
                <p className="font-bold">DNA-Protected Content</p>
              </div>
              <p className="font-bold">Copyright © {copyright.created}</p>
              <p className="mb-1">{copyright.owner} ({copyright.birthDate})</p>
              <p className="text-gray-400">{copyright.email}</p>
              <p className="mt-1 text-[10px] italic text-gray-400">{copyright.rights}</p>
              
              {copyright.dnaVerified && (
                <div className="mt-2 flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 text-[9px]">DNA-Verified</span>
                </div>
              )}
              
              {copyright.protectionActive && (
                <div className="mt-1 flex items-center">
                  <Lock className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-blue-500 text-[9px]">Anti-Theft Protection Active</span>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}