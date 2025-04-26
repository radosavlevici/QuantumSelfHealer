import { useEffect, useState } from 'react';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface CopyrightInfo {
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
 * Component that displays a discrete watermark with copyright information
 * The watermark is semi-transparent and positioned at the bottom right of the screen
 */
export function CopyrightWatermark() {
  const [copyright, setCopyright] = useState<CopyrightInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch copyright information from the server
    const fetchCopyright = async () => {
      try {
        const response = await fetch('/api/copyright');
        if (response.ok) {
          const data = await response.json();
          setCopyright(data);
        } else {
          console.error('Failed to fetch copyright information');
        }
      } catch (error) {
        console.error('Error fetching copyright:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCopyright();
  }, []);

  if (loading || !copyright) {
    return null;
  }

  return (
    <div className="fixed bottom-2 right-2 z-50 opacity-70 hover:opacity-100 transition-opacity">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-end">
              <Badge variant="outline" className="text-xs bg-black/10 dark:bg-white/5 backdrop-blur-sm">
                <span className="mr-1">© {copyright.created}</span>
                <span className="font-semibold">{copyright.owner}</span>
              </Badge>
              {copyright.watermark && (
                <div className="text-[7px] text-gray-500 mt-0.5 font-mono">
                  {copyright.watermark}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[300px]">
            <div className="text-xs">
              <p className="font-bold">Copyright © {copyright.created}</p>
              <p className="mb-1">{copyright.owner} ({copyright.birthDate})</p>
              <p className="text-gray-500">{copyright.email}</p>
              <p className="mt-1 text-[10px] italic">{copyright.rights}</p>
              {copyright.dnaVerified && (
                <div className="mt-2 flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                  <span className="text-green-500 text-[9px]">DNA-Verified</span>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}