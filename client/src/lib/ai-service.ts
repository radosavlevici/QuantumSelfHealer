import { AIAssistantMessage, AIAssistantConversation } from "@/types";

const AI_STORAGE_KEY = "quantum-ai-conversations";

// Helper to save conversations to local storage
function saveConversations(conversations: AIAssistantConversation[]): void {
  try {
    localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error("Error saving AI conversations:", error);
  }
}

// Helper to load conversations from local storage
function loadConversations(): AIAssistantConversation[] {
  try {
    const saved = localStorage.getItem(AI_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Convert string dates to Date objects
      return parsed.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    }
  } catch (error) {
    console.error("Error loading AI conversations:", error);
  }
  
  return [];
}

// Creates a new conversation
export async function createConversation(title: string = "New Conversation"): Promise<AIAssistantConversation> {
  try {
    // Create locally first for immediate feedback
    const newConversation: AIAssistantConversation = {
      id: crypto.randomUUID(),
      title,
      messages: [
        {
          id: crypto.randomUUID(),
          role: "system",
          content: "I am Quantum AI, an advanced artificial intelligence assistant with quantum computing capabilities. How can I help you today?",
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to stored conversations
    const conversations = loadConversations();
    conversations.unshift(newConversation);
    saveConversations(conversations);
    
    // Also try to sync with server
    try {
      const response = await fetch("/api/assistant/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
        credentials: "include"
      });
      
      if (response.ok) {
        const serverConversation = await response.json();
        // Update local storage with server data
        const updatedConversations = loadConversations().map(c => 
          c.id === newConversation.id ? {
            ...serverConversation,
            createdAt: new Date(serverConversation.createdAt),
            updatedAt: new Date(serverConversation.updatedAt),
            messages: serverConversation.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          } : c
        );
        saveConversations(updatedConversations);
        return serverConversation;
      }
    } catch (error) {
      console.error("Error syncing conversation with server:", error);
    }
    
    return newConversation;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
}

// Gets all conversations
export async function getConversations(): Promise<AIAssistantConversation[]> {
  try {
    // Try to fetch from server first
    try {
      const response = await fetch("/api/assistant/conversations", {
        credentials: "include"
      });
      
      if (response.ok) {
        const serverConversations = await response.json();
        
        // Format and save to local storage
        const formatted = serverConversations.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        
        saveConversations(formatted);
        return formatted;
      }
    } catch (error) {
      console.error("Error fetching conversations from server:", error);
    }
    
    // Fall back to local storage
    return loadConversations();
  } catch (error) {
    console.error("Error getting conversations:", error);
    throw error;
  }
}

// Sends a message in a conversation
export async function sendMessage(
  conversationId: string, 
  content: string
): Promise<AIAssistantMessage> {
  try {
    // Add user message locally for immediate feedback
    const userMessage: AIAssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date()
    };
    
    // Update conversation in local storage
    const conversations = loadConversations();
    const conversationIndex = conversations.findIndex(c => c.id === conversationId);
    
    if (conversationIndex === -1) {
      throw new Error("Conversation not found");
    }
    
    conversations[conversationIndex].messages.push(userMessage);
    conversations[conversationIndex].updatedAt = new Date();
    saveConversations(conversations);
    
    // Send to server for AI response
    try {
      const response = await fetch(`/api/assistant/conversations/${conversationId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include"
      });
      
      if (response.ok) {
        const aiResponse = await response.json();
        
        // Add AI response to local storage
        const aiMessage: AIAssistantMessage = {
          id: aiResponse.id,
          role: "assistant",
          content: aiResponse.content,
          timestamp: new Date(aiResponse.timestamp)
        };
        
        const updatedConversations = loadConversations();
        const updatedIndex = updatedConversations.findIndex(c => c.id === conversationId);
        
        if (updatedIndex !== -1) {
          updatedConversations[updatedIndex].messages.push(aiMessage);
          updatedConversations[updatedIndex].updatedAt = new Date();
          saveConversations(updatedConversations);
        }
        
        return aiMessage;
      } else {
        // If server request fails, add a fallback AI message
        const fallbackMessage: AIAssistantMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I'm having trouble connecting to my quantum processing backend. Please try again later.",
          timestamp: new Date()
        };
        
        const updatedConversations = loadConversations();
        const updatedIndex = updatedConversations.findIndex(c => c.id === conversationId);
        
        if (updatedIndex !== -1) {
          updatedConversations[updatedIndex].messages.push(fallbackMessage);
          updatedConversations[updatedIndex].updatedAt = new Date();
          saveConversations(updatedConversations);
        }
        
        return fallbackMessage;
      }
    } catch (error) {
      console.error("Error sending message to server:", error);
      
      // Add fallback AI response for offline scenario
      const fallbackMessage: AIAssistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm currently working in offline mode due to connectivity issues. My responses will be limited until connection is restored.",
        timestamp: new Date()
      };
      
      const updatedConversations = loadConversations();
      const updatedIndex = updatedConversations.findIndex(c => c.id === conversationId);
      
      if (updatedIndex !== -1) {
        updatedConversations[updatedIndex].messages.push(fallbackMessage);
        updatedConversations[updatedIndex].updatedAt = new Date();
        saveConversations(updatedConversations);
      }
      
      return fallbackMessage;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Deletes a conversation
export async function deleteConversation(conversationId: string): Promise<void> {
  try {
    // Remove from local storage first
    const conversations = loadConversations();
    const updatedConversations = conversations.filter(c => c.id !== conversationId);
    saveConversations(updatedConversations);
    
    // Try to sync with server
    try {
      await fetch(`/api/assistant/conversations/${conversationId}`, {
        method: "DELETE",
        credentials: "include"
      });
    } catch (error) {
      console.error("Error deleting conversation from server:", error);
    }
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
}

// Gets a conversation by ID
export async function getConversation(conversationId: string): Promise<AIAssistantConversation | null> {
  try {
    // Try to fetch from server first
    try {
      const response = await fetch(`/api/assistant/conversations/${conversationId}`, {
        credentials: "include"
      });
      
      if (response.ok) {
        const serverConversation = await response.json();
        
        return {
          ...serverConversation,
          createdAt: new Date(serverConversation.createdAt),
          updatedAt: new Date(serverConversation.updatedAt),
          messages: serverConversation.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        };
      }
    } catch (error) {
      console.error("Error fetching conversation from server:", error);
    }
    
    // Fall back to local storage
    const conversations = loadConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    
    return conversation || null;
  } catch (error) {
    console.error("Error getting conversation:", error);
    throw error;
  }
}
