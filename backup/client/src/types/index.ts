export type SystemStatus = "active" | "inactive" | "error" | "maintenance";

export interface StatusCard {
  id: string;
  icon: string;
  title: string;
  value: string;
  status: "optimal" | "warning" | "error" | "secure" | string;
  color?: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface ActivityLog {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: "primary" | "info" | "success" | "warning" | "error";
}

export interface TerminalCommand {
  command: string;
  response: string;
  timestamp: Date;
}

export interface CommandHelp {
  command: string;
  description: string;
}

export type QuantumConnectionStatus = "connected" | "connecting" | "disconnected" | "error";

export interface QuantumAPIStatus {
  provider: string;
  status: "connected" | "error" | "disconnected";
  lastChecked: Date;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: "text" | "image" | "audio" | "multimodal";
  status: "available" | "unavailable";
}

export interface AIAssistantMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface AIAssistantConversation {
  id: string;
  title: string;
  messages: AIAssistantMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  dataCollection: boolean;
  cloudSync: boolean;
  apiIntegrations: {
    [key: string]: {
      enabled: boolean;
      apiKey?: string;
    }
  };
}
