import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Terminal as TerminalComponent } from "@/components/ui/terminal";
import { CommandHelpModal } from "@/components/ui/command-help-modal";
import { useTerminal } from "@/hooks/use-terminal";
import { commandHelpReference } from "@/lib/quantum-service";

export default function Terminal() {
  const { lastCommandTime } = useTerminal();
  const [isCommandHelpOpen, setIsCommandHelpOpen] = useState(false);

  const handleCommandSubmit = (command: string) => {
    if (command.toLowerCase() === "help") {
      setIsCommandHelpOpen(true);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quantum Terminal</h1>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Access advanced quantum computing features and system controls through command line interface.
      </p>
      
      <TerminalComponent 
        height="h-[60vh]" 
        onCommandSubmit={handleCommandSubmit} 
      />
      
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
        <div>
          <span>{lastCommandTime}</span>
        </div>
      </div>
      
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-medium mb-2">Terminal Tips</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>Use <code className="font-mono text-primary-dark dark:text-primary-light">status --all</code> to check system status</li>
          <li>Connect to quantum services with <code className="font-mono text-primary-dark dark:text-primary-light">quantum-connect --service [name]</code></li>
          <li>Toggle AI learning with <code className="font-mono text-primary-dark dark:text-primary-light">learning --toggle [on|off]</code></li>
          <li>Press <code className="font-mono text-primary-dark dark:text-primary-light">help</code> to see all available commands</li>
        </ul>
      </div>
      
      {/* Command Help Modal */}
      <CommandHelpModal 
        isOpen={isCommandHelpOpen}
        onClose={() => setIsCommandHelpOpen(false)}
        commands={commandHelpReference}
      />
    </div>
  );
}
