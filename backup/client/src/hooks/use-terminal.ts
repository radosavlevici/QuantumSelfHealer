import { useState, useEffect } from "react";
import { TerminalCommand } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuantumStatus } from "@/hooks/use-quantum-status";
import { commandProcessor } from "@/lib/quantum-service";

export function useTerminal() {
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [lastCommandTime, setLastCommandTime] = useState<string>("No recent commands");
  const { toast } = useToast();
  const { refreshStatus } = useQuantumStatus();

  // Load command history from localStorage on mount
  useEffect(() => {
    try {
      const savedCommands = localStorage.getItem("terminalCommands");
      if (savedCommands) {
        const parsedCommands = JSON.parse(savedCommands).map((cmd: any) => ({
          ...cmd,
          timestamp: new Date(cmd.timestamp)
        }));
        setCommands(parsedCommands);
        
        if (parsedCommands.length > 0) {
          updateLastCommandTime(parsedCommands[parsedCommands.length - 1].timestamp);
        }
      }
    } catch (error) {
      console.error("Error loading terminal history:", error);
    }
  }, []);

  // Save commands to localStorage when they change
  useEffect(() => {
    if (commands.length > 0) {
      try {
        localStorage.setItem("terminalCommands", JSON.stringify(commands));
      } catch (error) {
        console.error("Error saving terminal history:", error);
      }
    }
  }, [commands]);

  const updateLastCommandTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) {
      setLastCommandTime("Last command: just now");
    } else if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      setLastCommandTime(`Last command: ${mins} ${mins === 1 ? 'min' : 'mins'} ago`);
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      setLastCommandTime(`Last command: ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`);
    } else {
      setLastCommandTime(`Last command: ${new Date(timestamp).toLocaleDateString()}`);
    }
  };

  const executeCommand = async (commandStr: string) => {
    try {
      // Process command locally first
      const localResponse = commandProcessor(commandStr);
      
      // Create new command object with local response
      const newCommand: TerminalCommand = {
        command: commandStr,
        response: localResponse.message,
        timestamp: new Date()
      };
      
      // Update state
      setCommands(prev => [...prev, newCommand]);
      updateLastCommandTime(newCommand.timestamp);
      
      // Handle special commands
      if (localResponse.type === "status") {
        refreshStatus();
      } else if (localResponse.type === "api") {
        // If it's an API command, also send to the server
        try {
          const apiResponse = await apiRequest("POST", "/api/terminal/command", {
            command: commandStr
          });
          
          const serverResponse = await apiResponse.json();
          
          // Update the command with server response
          setCommands(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              response: serverResponse.response || updated[updated.length - 1].response
            };
            return updated;
          });
        } catch (error) {
          console.error("API error:", error);
          // Keep the local response if the API call fails
        }
      }
    } catch (error) {
      toast({
        title: "Command Error",
        description: "Failed to execute command",
        variant: "destructive"
      });
      console.error("Command execution error:", error);
    }
  };

  const clearTerminal = () => {
    setCommands([]);
    setLastCommandTime("No recent commands");
    localStorage.removeItem("terminalCommands");
  };

  return {
    commands,
    executeCommand,
    clearTerminal,
    lastCommandTime
  };
}
