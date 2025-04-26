import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIAssistantMessage, AIAssistantConversation } from "@/types";
import { createConversation, sendMessage, getConversation } from "@/lib/ai-service";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function Assistant() {
  const [conversation, setConversation] = useState<AIAssistantConversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Root user verification is now handled on the server side
  // No need to expose this information in the UI

  // Initialize or load existing conversation
  useEffect(() => {
    const initConversation = async () => {
      try {
        // Check for active conversation in local storage
        const activeConvId = localStorage.getItem("activeConversationId");
        
        if (activeConvId) {
          const existingConv = await getConversation(activeConvId);
          if (existingConv) {
            setConversation(existingConv);
            return;
          }
        }
        
        // If no active conversation found, create a new one
        const newConversation = await createConversation("New Conversation");
        setConversation(newConversation);
        localStorage.setItem("activeConversationId", newConversation.id);
      } catch (error) {
        console.error("Error initializing conversation:", error);
        toast({
          title: "Error",
          description: "Failed to initialize conversation",
          variant: "destructive"
        });
      }
    };

    initConversation();
  }, [toast]);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !conversation) return;
    
    try {
      setLoading(true);
      
      // Add user message to UI immediately for better UX
      const userMessage: AIAssistantMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: messageInput,
        timestamp: new Date()
      };
      
      setConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, userMessage]
        };
      });
      
      setMessageInput("");
      
      // Send to AI service and get response
      const aiResponse = await sendMessage(conversation.id, messageInput);
      
      // Update conversation with AI response
      setConversation(prev => {
        if (!prev) return null;
        // Find if the message is already in the array (could have been added by sendMessage function)
        const messageExists = prev.messages.some(msg => msg.id === aiResponse.id);
        
        if (messageExists) {
          return prev;
        } else {
          return {
            ...prev,
            messages: [...prev.messages, aiResponse]
          };
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">Quantum AI Assistant</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Interact with your quantum-powered AI assistant to get help, answers, and insights.
        </p>
      </div>
      
      {/* Messages Area */}
      <div className="flex-grow overflow-auto px-4 pb-4">
        <div className="space-y-4">
          {conversation?.messages.map((message) => (
            <Card key={message.id} className={`${message.role === "user" ? "bg-primary bg-opacity-10" : "bg-white dark:bg-gray-800"}`}>
              <CardContent className="p-3">
                <div className="flex items-center mb-1">
                  <span className="font-semibold">
                    {message.role === "user" ? "You" : "Quantum AI"}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">
                    {typeof message.timestamp === 'string' 
                      ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : message.timestamp instanceof Date 
                        ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Just now'}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </CardContent>
            </Card>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-2">
          <Textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your quantum AI assistant..."
            className="resize-none min-h-[60px]"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={loading || !messageInput.trim()}
            className="mt-1"
          >
            {loading ? (
              <span className="material-icons animate-spin">sync</span>
            ) : (
              <span className="material-icons">send</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
