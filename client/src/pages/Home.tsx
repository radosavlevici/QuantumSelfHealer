import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusCard } from "@/components/ui/status-card";
import { FeatureToggle } from "@/components/ui/feature-toggle";
import { ActivityLog } from "@/components/ui/activity-log";
import { CommandHelpModal } from "@/components/ui/command-help-modal";
import { useQuantumStatus } from "@/hooks/use-quantum-status";
import { useFeatures } from "@/hooks/use-features";
import { useActivityLog } from "@/hooks/use-activity-log";
import { commandHelpReference } from "@/lib/quantum-service";

export default function Home() {
  const { statusCards, refreshStatus, loading } = useQuantumStatus();
  const { features, toggleFeature } = useFeatures();
  const { logs, clearLogs, loading: logsLoading } = useActivityLog();
  const [isCommandHelpOpen, setIsCommandHelpOpen] = useState(false);

  return (
    <>
      {/* Status Section */}
      <section className="px-4 py-3 bg-surface dark:bg-surface-dark shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">System Status</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshStatus}
            disabled={loading}
            className="text-primary dark:text-primary-light h-8 px-2"
          >
            <span className="material-icons text-sm">refresh</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {statusCards.map((card) => (
            <StatusCard key={card.id} card={card} />
          ))}
        </div>
      </section>
      
      {/* Terminal Info Section */}
      <section className="mt-4 px-4">
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-md">
          <div className="bg-gray-800 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex space-x-1.5 mr-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs text-gray-400">quantum-terminal</span>
            </div>
          </div>
          
          <div className="p-4 font-mono text-sm text-green-400 h-48 overflow-y-auto">
            <div className="mb-1">$ sudo apt-get install python3-pip quantum-computing-sdk cloud-ai-framework</div>
            <div className="mb-1 text-gray-500">[OK] Packages installed successfully</div>
            
            <div className="mb-1">$ pip install self-repair-ai</div>
            <div className="mb-1 text-gray-500">[OK] Successfully installed self-repair-ai-3.2.1</div>
            
            <div className="mb-1">$ configure-root --user ervin210@icloud.com --quantum true</div>
            <div className="mb-1 text-gray-500">[OK] Root configured with quantum access</div>
            <div className="mb-1 text-gray-500">[INFO] User authentication confirmed</div>
            
            <div className="mb-1">$ quantum-ai setup --device iphone</div>
            <div className="mb-1 text-gray-500">[INFO] Setting up quantum AI for iPhone device</div>
            <div className="mb-1 text-gray-500">[INFO] Configuring DNA-based security protocols</div>
            <div className="mb-1 text-gray-500">[INFO] Establishing quantum cloud connection</div>
            <div className="mb-1 text-gray-500">[INFO] Initializing self-learning parameters</div>
            <div className="mb-1 text-gray-500">[OK] Quantum AI successfully installed and running</div>
          </div>
        </div>
        
        <div className="mt-2 flex text-xs text-gray-500 dark:text-gray-400 justify-between px-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCommandHelpOpen(true)}
            className="flex items-center p-0 h-auto text-xs"
          >
            <span className="material-icons text-xs mr-1">help_outline</span>
            <span>Command Help</span>
          </Button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="mt-6 px-4">
        <h2 className="text-lg font-medium mb-3">Quantum AI Features</h2>
        
        <div className="space-y-3">
          {features.map((feature) => (
            <FeatureToggle 
              key={feature.id} 
              feature={feature} 
              onToggle={toggleFeature}
            />
          ))}
        </div>
      </section>
      
      {/* Activity Log Section */}
      <ActivityLog logs={logs} onClear={clearLogs} />
      
      {/* Command Help Modal */}
      <CommandHelpModal 
        isOpen={isCommandHelpOpen}
        onClose={() => setIsCommandHelpOpen(false)}
        commands={commandHelpReference}
      />
    </>
  );
}
