import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/ui/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { syncToServer, restoreFromServer, repairStorage } from "@/lib/storage-service";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: true,
    dataCollection: true,
    cloudSync: true,
    quantumApis: true,
    dnaBasedSecurity: true
  });
  
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [repairStatus, setRepairStatus] = useState<"idle" | "repairing" | "success" | "error">("idle");
  
  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("quantumSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("quantumSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }, [settings]);
  
  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleSync = async () => {
    setSyncStatus("syncing");
    try {
      await syncToServer();
      setSyncStatus("success");
      toast({
        title: "Sync Complete",
        description: "Your data has been synced to the server"
      });
    } catch (error) {
      setSyncStatus("error");
      toast({
        title: "Sync Failed",
        description: "Failed to sync data to the server",
        variant: "destructive"
      });
    }
  };
  
  const handleRestore = async () => {
    setSyncStatus("syncing");
    try {
      await restoreFromServer();
      setSyncStatus("success");
      toast({
        title: "Restore Complete",
        description: "Your data has been restored from the server"
      });
    } catch (error) {
      setSyncStatus("error");
      toast({
        title: "Restore Failed",
        description: "Failed to restore data from the server",
        variant: "destructive"
      });
    }
  };
  
  const handleRepair = async () => {
    setRepairStatus("repairing");
    try {
      const wasRepaired = repairStorage();
      setRepairStatus("success");
      toast({
        title: "Repair Complete",
        description: wasRepaired 
          ? "Some issues were found and fixed" 
          : "No issues found, storage is healthy"
      });
    } catch (error) {
      setRepairStatus("error");
      toast({
        title: "Repair Failed",
        description: "Failed to complete storage repair",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <div className="space-y-4">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the Quantum AI interface looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle">Dark Mode</Label>
                <Switch 
                  id="theme-toggle" 
                  checked={theme === "dark"}
                  onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Data</CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications-toggle">Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive alerts about system status
                  </p>
                </div>
                <Switch 
                  id="notifications-toggle" 
                  checked={settings.notifications}
                  onCheckedChange={() => handleToggle("notifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-collection-toggle">Data Collection</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow anonymous usage data collection
                  </p>
                </div>
                <Switch 
                  id="data-collection-toggle" 
                  checked={settings.dataCollection}
                  onCheckedChange={() => handleToggle("dataCollection")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cloud-sync-toggle">Cloud Sync</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sync data with cloud services
                  </p>
                </div>
                <Switch 
                  id="cloud-sync-toggle" 
                  checked={settings.cloudSync}
                  onCheckedChange={() => handleToggle("cloudSync")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Configure security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dna-security-toggle">DNA-Based Security</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable advanced biometric protection
                  </p>
                </div>
                <Switch 
                  id="dna-security-toggle" 
                  checked={settings.dnaBasedSecurity}
                  onCheckedChange={() => handleToggle("dnaBasedSecurity")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="quantum-apis-toggle">Quantum APIs</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable quantum computing API access
                  </p>
                </div>
                <Switch 
                  id="quantum-apis-toggle" 
                  checked={settings.quantumApis}
                  onCheckedChange={() => handleToggle("quantumApis")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* System Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>Maintain and repair your quantum AI system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Data Sync</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sync or restore your data with the cloud
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSync}
                    disabled={syncStatus === "syncing"}
                  >
                    {syncStatus === "syncing" ? "Syncing..." : "Sync"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRestore}
                    disabled={syncStatus === "syncing"}
                  >
                    Restore
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Self-Repair</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Run automated repair routine on storage
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRepair}
                  disabled={repairStatus === "repairing"}
                >
                  {repairStatus === "repairing" ? "Repairing..." : "Repair Now"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Quantum AI Assistant v1.0.0</p>
              <p className="mt-1">User ID: Authenticated</p>
              <p className="mt-1">Authentication: Secure</p>
              <p className="mt-1">Quantum Processing: Advanced</p>
              <p className="mt-4 text-xs">© 2025 Quantum AI Technologies</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
