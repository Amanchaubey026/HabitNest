import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatbot, PREDEFINED_PROMPTS } from '../../contexts/ChatbotContext';
import { mockChatCompletion, getSuggestionsByTopic } from '../../services/chatbotService';
import { format } from 'date-fns';
import { 
  FaTimes, FaRobot, FaPaperPlane, FaUser, 
  FaVolumeUp, FaMicrophone, FaMicrophoneSlash,
  FaImage, FaLink, FaEllipsisH, FaTrash,
  FaThumbtack, FaStar, FaLightbulb, FaQuestionCircle
} from 'react-icons/fa';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface StreamingResponseProps {
  content: string;
  isCompleted: boolean;
}

// Streaming response component with markdown support
const StreamingResponse: React.FC<StreamingResponseProps> = ({ content, isCompleted }) => {
  const [displayContent, setDisplayContent] = useState('');
  const [cursor, setCursor] = useState(true);
  
  useEffect(() => {
    setDisplayContent(content);
  }, [content]);
  
  // Blinking cursor effect
  useEffect(() => {
    if (!isCompleted) {
      const cursorInterval = setInterval(() => {
        setCursor(prev => !prev);
      }, 500);
      
      return () => clearInterval(cursorInterval);
    }
  }, [isCompleted]);
  
  return (
    <div className="markdown-content prose-xs sm:prose-sm prose-indigo dark:prose-invert max-w-none text-xs sm:text-sm">
      <Markdown
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}
      >
        {displayContent}
      </Markdown>
      {!isCompleted && cursor && <span className="animate-pulse">▌</span>}
    </div>
  );
};

// Suggestion chip component
interface SuggestionProps {
  text: string;
  onClick: (text: string) => void;
  icon?: React.ReactNode;
}

const Suggestion: React.FC<SuggestionProps> = ({ text, onClick, icon }) => (
  <motion.button
    className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 
               text-indigo-700 dark:text-indigo-300 rounded-full text-xs sm:text-sm whitespace-nowrap 
               hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800/50 dark:hover:to-purple-800/50 
               transition-all flex items-center gap-1 sm:gap-1.5 shadow-sm border border-indigo-100 dark:border-indigo-800 
               flex-shrink-0"
    onClick={() => onClick(text)}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    {icon && <span className="text-[10px] sm:text-xs">{icon}</span>}
    {text.length > 25 ? text.substring(0, 22) + '...' : text}
  </motion.button>
);

// Message component
interface MessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    isFavorite?: boolean;
    reaction?: 'like' | 'dislike' | null;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const [isActionsVisible, setIsActionsVisible] = useState(false);
  const { favoriteMessage, setMessageReaction } = useChatbot();
  
  // Text-to-speech handler
  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Copy to clipboard handler
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };
  
  // Toggle favorite
  const handleFavorite = () => {
    favoriteMessage(message.id);
  };
  
  // Set reaction
  const handleReaction = (reaction: 'like' | 'dislike' | null) => {
    setMessageReaction(message.id, reaction);
  };
  
  return (
    <div 
      className={`group mb-3 sm:mb-4 ${message.role === 'user' ? 'ml-auto' : 'mr-auto'} max-w-[80%] sm:max-w-xs md:max-w-sm`}
      onMouseEnter={() => setIsActionsVisible(true)}
      onMouseLeave={() => setIsActionsVisible(false)}
      onTouchStart={() => setIsActionsVisible(true)}
    >
      <div className={`
        rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 shadow-sm
        ${message.role === 'user' 
          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white ml-auto rounded-tr-sm' 
          : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'
        }
        ${message.isFavorite ? 'ring-1 sm:ring-2 ring-accent ring-offset-1 sm:ring-offset-2 dark:ring-offset-gray-900' : ''}
      `}>
        <div className="flex items-start">
          {message.role === 'assistant' && (
            <div className="mr-2 mt-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-1 sm:p-1.5 rounded-full flex-shrink-0 shadow-md">
              <FaRobot className="text-[10px] sm:text-xs" />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <div className={`${message.role === 'user' ? 'text-white' : 'text-current'} text-xs sm:text-sm`}>
              {message.role === 'assistant' ? (
                <div className="markdown-content prose-xs sm:prose-sm dark:prose-invert max-w-none">
                  <Markdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]}
                  >
                    {message.content}
                  </Markdown>
                </div>
              ) : (
                message.content
              )}
            </div>
            <div className="text-[10px] sm:text-xs opacity-70 mt-1 sm:mt-1.5 flex justify-between items-center">
              <span>{format(message.timestamp, 'HH:mm')}</span>
              
              {/* Message actions */}
              <AnimatePresence>
                {isActionsVisible && (
                  <motion.div 
                    className="flex gap-1.5 sm:gap-2 items-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    {message.role === 'assistant' && (
                      <>
                        <button 
                          onClick={() => handleReaction(message.reaction === 'like' ? null : 'like')} 
                          className={`text-[10px] sm:text-xs ${message.reaction === 'like' 
                            ? 'text-green-500 dark:text-green-400' 
                            : 'opacity-60 hover:opacity-100 text-gray-600 dark:text-gray-300'}`}
                          aria-label="Like message"
                          title="Like"
                        >
                          👍
                        </button>
                        <button 
                          onClick={() => handleReaction(message.reaction === 'dislike' ? null : 'dislike')} 
                          className={`text-[10px] sm:text-xs ${message.reaction === 'dislike' 
                            ? 'text-red-500 dark:text-red-400' 
                            : 'opacity-60 hover:opacity-100 text-gray-600 dark:text-gray-300'}`}
                          aria-label="Dislike message"
                          title="Dislike"
                        >
                          👎
                        </button>
                      </>
                    )}
                    <button 
                      onClick={handleTextToSpeech} 
                      className={`text-[10px] sm:text-xs opacity-60 hover:opacity-100 ${message.role === 'user' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}
                      aria-label="Text to speech"
                      title="Read aloud"
                    >
                      <FaVolumeUp />
                    </button>
                    <button 
                      onClick={handleCopy} 
                      className={`text-[10px] sm:text-xs opacity-60 hover:opacity-100 ${message.role === 'user' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}
                      aria-label="Copy message"
                      title="Copy"
                    >
                      <FaLink />
                    </button>
                    <button 
                      onClick={handleFavorite} 
                      className={`text-[10px] sm:text-xs ${message.isFavorite 
                        ? 'text-yellow-500 dark:text-yellow-400' 
                        : 'opacity-60 hover:opacity-100 ' + (message.role === 'user' ? 'text-white' : 'text-gray-600 dark:text-gray-300')}`}
                      aria-label={message.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      title={message.isFavorite ? "Unfavorite" : "Favorite"}
                    >
                      <FaStar />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Time divider component
const TimeDivider: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center my-3 sm:my-4">
    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
    <div className="mx-2 sm:mx-4 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{text}</div>
    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
  </div>
);

// Add a custom hook for responsive positioning
const useResponsivePosition = () => {
  const [position, setPosition] = useState({
    bottom: '0px',
    right: '0px'
  });

  useEffect(() => {
    const updatePosition = () => {
      if (window.innerWidth >= 1400) {
        setPosition({
          bottom: '80px',
          right: '24px'
        });
      } else if (window.innerWidth >= 768) {
        setPosition({
          bottom: '80px',
          right: '20px'
        });
      } else {
        setPosition({
          bottom: '0px',
          right: '0px'
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  return position;
};

// Check if element is visible in viewport
const useVisibilityCheck = (isOpen: boolean) => {
  const [isPartiallyCovered, setIsPartiallyCovered] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !chatbotRef.current) return;

    // Check if the component is partially hidden
    const checkVisibility = () => {
      const rect = chatbotRef.current?.getBoundingClientRect();
      
      if (!rect) return;
      
      // Check if component is close to the edge of the viewport or partially off-screen
      const isPartiallyHidden = 
        rect.right > window.innerWidth - 10 || 
        rect.bottom > window.innerHeight - 10;
      
      setIsPartiallyCovered(isPartiallyHidden);
    };

    // Check visibility after the component has rendered
    setTimeout(checkVisibility, 500);
    
    // Check on window resize
    window.addEventListener('resize', checkVisibility);
    
    return () => {
      window.removeEventListener('resize', checkVisibility);
    };
  }, [isOpen]);

  return { chatbotRef, isPartiallyCovered };
};

// Main chatbot component
const Chatbot: React.FC = () => {
  const { isOpen, messages, isLoading, toggleChatbot, sendMessage, clearMessages } = useChatbot();
  const [inputValue, setInputValue] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreamingComplete, setIsStreamingComplete] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([
    "How can I stay motivated?",
    "What's habit stacking?",
    "Track my progress"
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const responsivePosition = useResponsivePosition();
  const { chatbotRef, isPartiallyCovered } = useVisibilityCheck(isOpen);
  
  // Calculate adjusted position when covered
  const adjustedPosition = useMemo(() => {
    if (isPartiallyCovered) {
      return {
        bottom: '120px',
        right: '70px'
      };
    }
    return responsivePosition;
  }, [responsivePosition, isPartiallyCovered]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);
  
  // Handle input resize
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`;
    }
  }, [inputValue]);
  
  // Speech recognition setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;
    
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0] as SpeechRecognitionAlternative)
        .map(result => result.transcript)
        .join('');
      
      setInputValue(transcript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    // Start/stop recognition based on state
    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }
    
    return () => {
      recognition.stop();
    };
  }, [isListening]);
  
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const messageContent = inputValue;
    setInputValue('');
    
    // Generate dynamic suggestions based on the message
    generateSuggestions(messageContent);
    
    // Send via context to handle state updates
    await sendMessage(messageContent);
    
    // Mock streaming for demonstration purposes
    setIsStreamingComplete(false);
    setStreamingContent('');
    
    const mockMessages = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: messageContent }
    ];
    
    // Use mock function since we don't have a real backend yet
    mockChatCompletion(
      mockMessages,
      (chunk) => {
        setStreamingContent(chunk);
      },
      (fullResponse) => {
        setIsStreamingComplete(true);
      }
    );
  };
  
  // Generate contextual suggestions based on the conversation
  const generateSuggestions = (lastMessage: string) => {
    // Get dynamic suggestions from the chatbot service
    setQuickSuggestions(getSuggestionsByTopic(lastMessage));
  };
  
  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const toggleListening = () => {
    setIsListening(!isListening);
  };
  
  // Handle keypress (Ctrl+Enter or Cmd+Enter to submit)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  // Group messages by day for time dividers
  const groupedMessages = messages.reduce((acc, message) => {
    const date = new Date(message.timestamp);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    acc[dateKey].push(message);
    return acc;
  }, {} as Record<string, typeof messages>);
  
  // Floating button to toggle chatbot
  const ChatbotButton = () => (
    <motion.button
      className="chatbot-toggle fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl z-[9999]"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleChatbot}
      aria-label="Toggle chatbot"
    >
      <FaRobot className="text-lg sm:text-xl" />
    </motion.button>
  );
  
  // Variants for animations
  const chatbotVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 350, 
        damping: 25, 
        staggerChildren: 0.1
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  if (!isOpen) {
    return <ChatbotButton />;
  }
  
  return (
    <>
      <ChatbotButton />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            ref={chatbotRef}
            className="chatbot-container fixed bottom-0 right-0 md:bottom-20 md:right-6 w-full sm:w-96 h-[85vh] sm:h-[600px] max-h-[90vh] 
                     bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col 
                     z-[9999] overflow-hidden border border-gray-200 dark:border-gray-700"
            variants={chatbotVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ 
              maxHeight: 'calc(100vh - 40px)',
              ...adjustedPosition
            }}
          >
            {/* Header */}
            <div className="relative flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center">
                <div className="mr-2 sm:mr-3 bg-white/20 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg">
                  <FaRobot className="text-base sm:text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">HabitNest Assistant</h3>
                  <div className="text-[10px] sm:text-xs text-indigo-100 flex items-center">
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1 sm:mr-1.5 animate-pulse"></span>
                    Powered by AI
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1 sm:gap-2">
                <motion.button 
                  onClick={clearMessages}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1 sm:p-1.5 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Clear conversation"
                  title="Clear conversation"
                >
                  <FaTrash className="sm:hidden" size={12} />
                  <FaTrash className="hidden sm:block" size={14} />
                </motion.button>
                <motion.button 
                  onClick={toggleChatbot}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1 sm:p-1.5 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close chatbot"
                  title="Close chatbot"
                >
                  <FaTimes className="sm:hidden" size={12} />
                  <FaTimes className="hidden sm:block" size={14} />
                </motion.button>
              </div>
              
              {/* Decorative gradient orbs */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-400/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 relative">
              {/* Welcome message when empty */}
              {messages.length === 0 ? (
                <motion.div 
                  className="h-full flex flex-col items-center justify-center px-4"
                  variants={chatbotVariants}
                >
                  <motion.div 
                    className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center"
                    variants={itemVariants}
                  >
                    <FaRobot className="text-2xl sm:text-3xl text-indigo-500" />
                  </motion.div>
                  <motion.h3 
                    className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2"
                    variants={itemVariants}
                  >
                    Your Habit Assistant
                  </motion.h3>
                  <motion.p 
                    className="text-xs sm:text-sm text-center text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-xs"
                    variants={itemVariants}
                  >
                    I can help you build better habits, stay motivated, and achieve your goals!
                  </motion.p>
                  <motion.div 
                    className="grid grid-cols-2 gap-2"
                    variants={itemVariants}
                  >
                    <button 
                      onClick={() => handlePromptClick("How do I build a new habit?")}
                      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs sm:text-sm hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors flex items-center gap-1 sm:gap-2"
                    >
                      <FaLightbulb className="text-[10px] sm:text-xs" /> New Habit
                    </button>
                    <button 
                      onClick={() => handlePromptClick("How do I track my progress?")}
                      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs sm:text-sm hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors flex items-center gap-1 sm:gap-2"
                    >
                      <FaStar className="text-[10px] sm:text-xs" /> Track Progress
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                // Display messages grouped by day
                Object.entries(groupedMessages).map(([dateKey, dayMessages], dateIndex) => (
                  <div key={dateKey}>
                    {dateIndex > 0 && (
                      <TimeDivider text={format(new Date(dateKey), 'MMMM d, yyyy')} />
                    )}
                    
                    {dayMessages.map((message) => (
                      <Message key={message.id} message={message} />
                    ))}
                  </div>
                ))
              )}
              
              {/* Currently streaming response */}
              {!isStreamingComplete && (
                <div className="mb-4 mr-auto max-w-[80%] sm:max-w-xs md:max-w-sm">
                  <div className="rounded-2xl p-2.5 sm:p-3.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm">
                    <div className="flex items-start">
                      <div className="mr-2 mt-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-1 sm:p-1.5 rounded-full flex-shrink-0 shadow-md">
                        <FaRobot className="text-[10px] sm:text-xs" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs sm:text-sm">
                          <StreamingResponse
                            content={streamingContent}
                            isCompleted={isStreamingComplete}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
              
              {/* Dynamic background pattern */}
              <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern-light dark:bg-grid-pattern-dark"></div>
              </div>
            </div>
            
            {/* Quick suggestions */}
            {messages.length > 0 && (
              <div className="px-2 sm:px-3 pt-1.5 sm:pt-2 pb-1 border-t border-gray-200 dark:border-gray-700 flex flex-nowrap overflow-x-auto gap-1.5 sm:gap-2 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
                {quickSuggestions.map((suggestion, index) => (
                  <Suggestion 
                    key={index}
                    text={suggestion} 
                    onClick={handlePromptClick}
                    icon={index === 0 ? <FaLightbulb /> : undefined} 
                  />
                ))}
              </div>
            )}
            
            {/* Predefined prompts */}
            <div className="px-2 sm:px-3 pt-1 pb-1.5 sm:pb-2 border-t border-gray-200 dark:border-gray-700 flex flex-nowrap overflow-x-auto gap-1.5 sm:gap-2 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
              {PREDEFINED_PROMPTS.map((prompt, index) => (
                <Suggestion 
                  key={index}
                  text={prompt} 
                  onClick={handlePromptClick} 
                />
              ))}
            </div>
            
            {/* Input with emoji picker */}
            <div className="relative p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-16 sm:pr-24 rounded-xl border border-gray-300 dark:border-gray-600 
                          bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                          placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all"
                />
                
                <div className="absolute right-1.5 sm:right-2 bottom-0.5 sm:bottom-1 flex items-center gap-1">
                  <motion.button
                    type="button"
                    onClick={toggleListening}
                    className={`p-1.5 sm:p-2 rounded-full ${
                      isListening 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    } hover:shadow-md transition-all`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={isListening ? "Stop recording" : "Start voice input"}
                    title={isListening ? "Stop recording" : "Start voice input"}
                  >
                    {isListening 
                      ? <FaMicrophoneSlash className="sm:hidden" size={14} /> 
                      : <FaMicrophone className="sm:hidden" size={14} />}
                    {isListening 
                      ? <FaMicrophoneSlash className="hidden sm:block" size={16} /> 
                      : <FaMicrophone className="hidden sm:block" size={16} />}
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className={`p-1.5 sm:p-2 rounded-full ${
                      isLoading || !inputValue.trim() 
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-md'
                    } transition-all`}
                    whileHover={isLoading || !inputValue.trim() ? {} : { scale: 1.1 }}
                    whileTap={isLoading || !inputValue.trim() ? {} : { scale: 0.9 }}
                  >
                    <FaPaperPlane className={`${isLoading || !inputValue.trim() ? 'opacity-50' : ''} sm:hidden`} size={14} />
                    <FaPaperPlane className={`${isLoading || !inputValue.trim() ? 'opacity-50' : ''} hidden sm:block`} size={16} />
                  </motion.button>
                </div>
                
                <div className="mt-1 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 text-right">
                  Press Ctrl+Enter to send
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot; 