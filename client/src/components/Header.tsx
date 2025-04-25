import { useState } from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { useSystemStatus } from "@/hooks/use-quantum-status";

export default function Header() {
  const { theme } = useTheme();
  const { systemStatus } = useSystemStatus();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="bg-primary dark:bg-primary-dark text-white py-4 px-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-2">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <span className="material-icons text-sm">psychology</span>
            </div>
          </div>
          <h1 className="text-xl font-semibold">Quantum AI</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-xs bg-primary-dark px-2 py-1 rounded-full">
            <span className={`inline-block w-2 h-2 rounded-full ${systemStatus === "active" ? "bg-success" : "bg-error"} mr-1`}></span>
            <span>{systemStatus === "active" ? "Active" : "Inactive"}</span>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className="focus:outline-none"
          >
            <span className="material-icons">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
