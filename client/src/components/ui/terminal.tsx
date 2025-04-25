import { useState, useEffect, useRef } from "react";
import { TerminalCommand } from "@/types";
import { Button } from "@/components/ui/button";
import { useTerminal } from "@/hooks/use-terminal";

interface TerminalProps {
  height?: string;
  onCommandSubmit?: (command: string) => void;
  onClear?: () => void;
}

export function Terminal({ height = "h-48", onCommandSubmit, onClear }: TerminalProps) {
  const { commands, executeCommand, clearTerminal, lastCommandTime } = useTerminal();
  const [input, setInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Scroll terminal to bottom when commands change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const handleExecuteCommand = () => {
    if (!input.trim()) return;
    
    executeCommand(input);
    if (onCommandSubmit) {
      onCommandSubmit(input);
    }
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleExecuteCommand();
    }
  };

  const handleClear = () => {
    clearTerminal();
    if (onClear) {
      onClear();
    }
  };

  return (
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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-gray-400 hover:text-white focus:outline-none h-6 px-1.5"
        >
          <span className="material-icons text-sm">clear_all</span>
        </Button>
      </div>
      
      <div ref={terminalRef} className={`p-4 font-mono text-sm text-green-400 ${height} overflow-y-auto`}>
        {commands.map((cmd, idx) => (
          <div key={idx}>
            <div className="mb-1">$ {cmd.command}</div>
            <div className="mb-1 text-gray-500">{cmd.response}</div>
          </div>
        ))}
        
        <div className="flex items-center">
          <span className="text-white mr-1">$</span>
          <div className="relative flex-grow">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full bg-transparent border-none outline-none text-white"
              placeholder="Enter command..."
            />
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-light"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
