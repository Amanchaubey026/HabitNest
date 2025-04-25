import React, { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';

// Message type definition
type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isFavorite?: boolean;
  reaction?: 'like' | 'dislike' | null;
};

// Context info type
type ContextInfoType = {
  habitData?: any;
  userProfile?: any;
  userPreferences?: any;
};

// History storage keys
const STORAGE_KEYS = {
  MESSAGES: 'habitnest_chatbot_messages',
  IS_OPEN: 'habitnest_chatbot_open'
};

// Predefined prompts
export const PREDEFINED_PROMPTS = [
  "I want to build a morning routine",
  "What's a good habit for focus?",
  "How do I stay consistent with my habits?",
  "Remind me why this habit matters",
  "How do I track my progress?"
];

// Context type definition
type ChatbotContextType = {
  isOpen: boolean;
  messages: MessageType[];
  isLoading: boolean;
  contextInfo: ContextInfoType;
  toggleChatbot: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  favoriteMessage: (id: string) => void;
  setMessageReaction: (id: string, reaction: 'like' | 'dislike' | null) => void;
  setContextInfo: (info: Partial<ContextInfoType>) => void;
};

// Create context with default values
const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// Generate unique ID for messages
const generateId = () => Math.random().toString(36).substring(2, 15);

// Chatbot provider component
export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try to load saved messages from localStorage
  const getSavedMessages = (): MessageType[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })) : [];
      }
    } catch (e) {
      console.error('Error loading saved messages:', e);
    }
    return [];
  };
  
  const getSavedIsOpen = (): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_OPEN) === 'true';
    } catch (e) {
      return false;
    }
  };

  const [isOpen, setIsOpen] = useState<boolean>(getSavedIsOpen());
  const [messages, setMessages] = useState<MessageType[]>(getSavedMessages());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contextInfo, setContextInfo] = useState<ContextInfoType>({});
  
  // Save messages to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving messages:', e);
    }
  }, [messages]);
  
  // Save isOpen state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.IS_OPEN, isOpen.toString());
    } catch (e) {
      console.error('Error saving open state:', e);
    }
  }, [isOpen]);

  // Toggle chatbot open/close
  const toggleChatbot = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Favorite/unfavorite a message
  const favoriteMessage = useCallback((id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isFavorite: !msg.isFavorite } : msg
    ));
  }, []);
  
  // Set reaction on a message
  const setMessageReaction = useCallback((id: string, reaction: 'like' | 'dislike' | null) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, reaction } : msg
    ));
  }, []);
  
  // Update context info
  const updateContextInfo = useCallback((info: Partial<ContextInfoType>) => {
    setContextInfo(prev => ({ ...prev, ...info }));
  }, []);

  // Send message to API
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to chat
    const userMessage: MessageType = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Placeholder for API call - will be implemented in services layer
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content,
          history: messages.slice(-10), // Send last 10 messages for context
          contextInfo // Send any additional context
        }),
        signal: AbortSignal.timeout(30000), // 30 second timeoutt
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Add assistant response
      const assistantMessage: MessageType = {
        id: generateId(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      // Determine appropriate error message
      let errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later.";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "The request took too long to complete. Please try again with a shorter message.";
        } else if (error.message.includes('NetworkError') || !navigator.onLine) {
          errorMessage = "You appear to be offline. Please check your internet connection and try again.";
        }
      }
      
      // Add error message
      const errorResponse: MessageType = {
        id: generateId(),
        content: errorMessage,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, contextInfo]);

  return (
    <ChatbotContext.Provider value={{ 
      isOpen, 
      messages, 
      isLoading,
      contextInfo,
      toggleChatbot, 
      sendMessage,
      clearMessages,
      favoriteMessage,
      setMessageReaction,
      setContextInfo: updateContextInfo
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};

// Custom hook to use the chatbot context
export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}; 