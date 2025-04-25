import { useState, useEffect } from "react";
import { Feature } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const initialFeatures: Feature[] = [
  {
    id: "self-learning",
    icon: "auto_fix_high",
    title: "Self-Learning",
    description: "Continuously improving algorithms based on your usage patterns",
    enabled: true
  },
  {
    id: "self-repair",
    icon: "healing",
    title: "Self-Repair",
    description: "Automatically detects and fixes system issues and anomalies",
    enabled: true
  },
  {
    id: "persistent-memory",
    icon: "memory",
    title: "Persistent Memory",
    description: "Maintains state and learned behaviors across sessions",
    enabled: true
  },
  {
    id: "dna-security",
    icon: "security",
    title: "DNA Security",
    description: "Proprietary biometric security with cryptographic protection",
    enabled: true
  }
];

export function useFeatures() {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const { toast } = useToast();

  // Load feature states from localStorage on mount
  useEffect(() => {
    try {
      const savedFeatures = localStorage.getItem("quantumFeatures");
      if (savedFeatures) {
        setFeatures(JSON.parse(savedFeatures));
      }
    } catch (error) {
      console.error("Error loading features:", error);
      setFeatures(initialFeatures);
    }
  }, []);

  const toggleFeature = async (id: string, enabled: boolean) => {
    try {
      // Update feature in state
      const updatedFeatures = features.map(feature => 
        feature.id === id ? { ...feature, enabled } : feature
      );
      
      setFeatures(updatedFeatures);
      
      // Save to localStorage
      localStorage.setItem("quantumFeatures", JSON.stringify(updatedFeatures));
      
      // Send update to server
      await apiRequest("POST", "/api/features/toggle", { id, enabled });
      
      toast({
        title: `${enabled ? "Enabled" : "Disabled"} ${features.find(f => f.id === id)?.title}`,
        description: enabled 
          ? "Feature activated successfully" 
          : "Feature has been deactivated",
      });
    } catch (error) {
      console.error("Error toggling feature:", error);
      
      // Revert state on error
      setFeatures(prev => 
        prev.map(feature => 
          feature.id === id ? { ...feature, enabled: !enabled } : feature
        )
      );
      
      toast({
        title: "Feature toggle failed",
        description: "There was an error changing the feature state",
        variant: "destructive"
      });
    }
  };

  return {
    features,
    toggleFeature
  };
}
