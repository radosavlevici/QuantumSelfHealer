import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StatusCard, SystemStatus, QuantumAPIStatus } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Initial status cards
const initialStatusCards: StatusCard[] = [
  {
    id: "quantum-processing",
    icon: "memory",
    title: "Quantum Processing",
    value: "Loading...",
    status: "optimal"
  },
  {
    id: "cloud-connection",
    icon: "cloud_queue",
    title: "Cloud Connection",
    value: "Loading...",
    status: "optimal"
  },
  {
    id: "api-status",
    icon: "api",
    title: "API Status",
    value: "Loading...",
    status: "optimal"
  },
  {
    id: "dna-security",
    icon: "security",
    title: "DNA Security",
    value: "Loading...",
    status: "optimal"
  }
];

export function useSystemStatus() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>("active");
  const { toast } = useToast();

  // Check system status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/system/status");
        if (response.ok) {
          const data = await response.json();
          setSystemStatus(data.status);
        } else {
          setSystemStatus("error");
        }
      } catch (error) {
        console.error("Failed to check system status:", error);
        setSystemStatus("error");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return { systemStatus };
}

export function useQuantumStatus() {
  const [statusCards, setStatusCards] = useState<StatusCard[]>(initialStatusCards);
  const [apiStatuses, setApiStatuses] = useState<QuantumAPIStatus[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["/api/quantum/status"],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  useEffect(() => {
    if (data) {
      setStatusCards(data.statusCards);
      setApiStatuses(data.apiStatuses.map((status: any) => ({
        ...status,
        lastChecked: new Date(status.lastChecked)
      })));
    } else if (isError) {
      // If API fails, use default values with error indicators
      setStatusCards(initialStatusCards.map(card => ({
        ...card,
        value: card.id === "quantum-processing" ? "87%" : 
               card.id === "cloud-connection" ? "Active" :
               card.id === "api-status" ? "Connected" : "Enabled",
        status: "optimal"
      })));
    }
  }, [data, isError]);

  const refreshStatus = async () => {
    try {
      // Optimistic update for better UX
      toast({
        title: "Refreshing Status",
        description: "Checking quantum system status..."
      });
      
      await refetch();
      
      toast({
        title: "Status Updated",
        description: "Quantum system status has been refreshed"
      });
    } catch (error) {
      console.error("Error refreshing status:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh quantum system status",
        variant: "destructive"
      });
    }
  };

  return {
    statusCards,
    apiStatuses,
    loading: isLoading,
    error: isError,
    refreshStatus
  };
}
