import { useState, useEffect } from "react";
import { ActivityLog } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/activity-log");
      
      if (!response.ok) {
        throw new Error(`Error fetching logs: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert string timestamps to Date objects
      const formattedLogs = data.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
      
      setLogs(formattedLogs);
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
      // If API fails, use locally stored logs
      try {
        const savedLogs = localStorage.getItem("activityLogs");
        if (savedLogs) {
          const parsedLogs = JSON.parse(savedLogs).map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp)
          }));
          setLogs(parsedLogs);
        }
      } catch (storageError) {
        console.error("Error loading local logs:", storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Save logs to localStorage when they change
  useEffect(() => {
    if (logs.length > 0) {
      try {
        localStorage.setItem("activityLogs", JSON.stringify(logs));
      } catch (error) {
        console.error("Error saving activity logs:", error);
      }
    }
  }, [logs]);

  const addLog = async (log: Omit<ActivityLog, "id" | "timestamp">) => {
    try {
      const newLog: ActivityLog = {
        ...log,
        id: crypto.randomUUID(),
        timestamp: new Date()
      };
      
      setLogs(prev => [newLog, ...prev]);
      
      // Sync with server
      await apiRequest("POST", "/api/activity-log", newLog);
      
    } catch (error) {
      console.error("Error adding activity log:", error);
      toast({
        title: "Activity Log Error",
        description: "Failed to add activity to the log",
        variant: "destructive"
      });
    }
  };

  const clearLogs = async () => {
    try {
      setLogs([]);
      localStorage.removeItem("activityLogs");
      
      // Sync with server
      await apiRequest("DELETE", "/api/activity-log");
      
      toast({
        title: "Activity Log Cleared",
        description: "All activity logs have been cleared"
      });
    } catch (error) {
      console.error("Error clearing activity logs:", error);
      toast({
        title: "Clear Failed",
        description: "Failed to clear activity logs",
        variant: "destructive"
      });
    }
  };

  return {
    logs,
    loading,
    addLog,
    clearLogs,
    refreshLogs: fetchLogs
  };
}
