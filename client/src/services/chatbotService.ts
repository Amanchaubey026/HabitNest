import axios from 'axios';

// Message interface
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Context info interface
interface ContextInfo {
  habitData?: any;
  userProfile?: any;
  userPreferences?: any;
}

// Create a chat completion with streaming
export const createChatCompletion = async (
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  onComplete: (fullResponse: string) => void,
  onError: (error: Error) => void,
  contextInfo?: ContextInfo
): Promise<void> => {
  try {
    // Add system message if not already present
    const systemMessage = messages.find(m => m.role === 'system');
    const messagesToSend = [...messages];
    
    if (!systemMessage) {
      messagesToSend.unshift({
        role: 'system',
        content: `You are HabitNest's intelligent assistant that helps users build better habits and achieve their goals. 
        Be supportive, motivational, and science-based in your recommendations. 
        Keep responses concise and actionable. Provide specific, practical advice.
        Speak directly to the user in a friendly, conversational tone.`
      });
    }
    
    // Add context info if available
    if (contextInfo) {
      const contextMessage = {
        role: 'system' as const,
        content: `Additional user context: ${JSON.stringify(contextInfo)}`
      };
      messagesToSend.push(contextMessage);
    }
    
    // The API key would normally be handled securely on the server side
    // This is a client-side implementation for demonstration purposes only
    const response = await axios({
      method: 'post',
      url: '/api/chatbot/chat',
      data: {
        messages: messagesToSend,
      },
      responseType: 'stream',
      onDownloadProgress: (progressEvent) => {
        // This is a simplified version - in a real implementation,
        // you would parse the SSE stream properly
        const chunk = progressEvent.event?.target?.response || '';
        if (chunk) {
          onChunk(chunk);
        }
      },
      timeout: 30000, // 30 second timeout
    });

    // Call onComplete with the full response
    onComplete(response.data);
  } catch (error) {
    console.error('Error in chat completion:', error);
    onError(error as Error);
  }
};

// Enhanced mock responses with markdown support
const ENHANCED_RESPONSES = {
  morningRoutine: `## Morning Routine Blueprint 🌅

A science-backed morning routine can set you up for an incredibly productive day:

1. **Wake consistently** (5:30-7:00 AM) - Your body loves predictability
2. **Hydrate immediately** - 16oz water with lemon to kickstart metabolism
3. **Move for 5-10 minutes** - Light stretching or yoga to activate your body
4. **Meditate briefly** - Just 5 minutes reduces cortisol by up to 20%
5. **Journal gratitude** - Write 3 things you're grateful for
6. **Set 3 priorities** for your day

**Would you like me to help you design a custom morning routine based on your specific goals?**`,

  focus: `## Focus-Boosting Habits 🧠

Research shows these habits can dramatically improve focus:

1. **Daily meditation** - Even 10 minutes improves attention span by up to 14%
2. **"Deep work" blocks** - 90-minute focused sessions with no distractions
3. **Pomodoro technique** - 25 minutes work + 5 minutes rest
4. **Proper hydration** - Just 1% dehydration reduces cognitive performance by 5%
5. **Consistent sleep schedule** - Aim for 7-9 hours within the same timeframe

**The most impactful habit is probably creating dedicated "deep work" blocks. Would you like tips on implementing this?**`,

  consistency: `## Consistency Framework 🔄

Here's how behavioral science says we stay consistent:

1. **Start tiny** - A 2-minute version of your habit is more sustainable
2. **Habit stacking** - Attach new habits to existing routines (e.g., "After I brush my teeth, I will meditate for 1 minute")
3. **Track visually** - Use a habit tracker or calendar to create a "don't break the chain" effect
4. **Accountability partner** - 95% higher completion rate with social accountability
5. **Environment design** - Make good habits obvious and easy; bad habits invisible and difficult

> "We don't rise to the level of our goals, we fall to the level of our systems." - James Clear

**Which of these would you like me to explain in more detail?**`,

  motivation: `## Motivation Mastery 🔥

When motivation fades (and it will), use these evidence-based strategies:

1. **Connect to your "why"** - Write down your deeper purpose behind the habit
2. **Visualize future you** - Spend 2 minutes daily imagining your improved future self
3. **Identity-based habits** - Focus on becoming the type of person who does X
4. **Celebrate small wins** - Your brain needs regular dopamine hits to stay motivated
5. **Adjust difficulty** - If you're struggling, make the habit easier temporarily

**Remember: Motivation is what gets you started, but systems keep you going.**`,

  progress: `## Tracking Progress Effectively 📊

Here are the most effective ways to track your habit progress:

1. **HabitNest tracker** - Use our built-in tools to visualize your streak
2. **Habit journal** - Rate your habits daily (1-10) and note observations
3. **Weekly reviews** - Schedule Sunday reviews to assess what's working
4. **Measurable metrics** - Define specific numbers to track (minutes, reps, etc.)
5. **Progress photos** - Visual evidence is incredibly motivating

**Would you like me to help you set up a tracking system for a specific habit?**`,

  default: `Hi, I'm your HabitNest assistant! 👋

I can help you build better habits and achieve your goals through science-backed strategies. Here are a few things I can help with:

- Creating personalized habit routines
- Overcoming motivation and consistency challenges
- Tracking your progress effectively
- Understanding the psychology behind habit formation

**What specific habit or goal are you working on right now?**`
};

// Advanced mock function with markdown responses and typing effect
export const mockChatCompletion = async (
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  onComplete: (fullResponse: string) => void
): Promise<void> => {
  // Get the last user message
  const userMessage = messages.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';
  
  // Generate mock responses based on the user's question with better text
  let mockResponse = '';
  
  if (userMessage.includes('morning routine') || userMessage.includes('morning habit')) {
    mockResponse = ENHANCED_RESPONSES.morningRoutine;
  } else if (userMessage.includes('focus') || userMessage.includes('concentrate') || userMessage.includes('attention')) {
    mockResponse = ENHANCED_RESPONSES.focus;
  } else if (userMessage.includes('consistent') || userMessage.includes('consistency') || userMessage.includes('stick')) {
    mockResponse = ENHANCED_RESPONSES.consistency;
  } else if (userMessage.includes('why') && (userMessage.includes('matter') || userMessage.includes('important'))) {
    mockResponse = ENHANCED_RESPONSES.motivation;
  } else if (userMessage.includes('track') || userMessage.includes('progress') || userMessage.includes('measure')) {
    mockResponse = ENHANCED_RESPONSES.progress;
  } else if (userMessage.includes('hello') || userMessage.includes('hi ') || userMessage.length < 5) {
    mockResponse = ENHANCED_RESPONSES.default;
  } else {
    // Intelligent response based on keywords
    if (userMessage.includes('motivation') || userMessage.includes('inspired')) {
      mockResponse = ENHANCED_RESPONSES.motivation;
    } else if (userMessage.includes('track') || userMessage.includes('journal')) {
      mockResponse = ENHANCED_RESPONSES.progress;
    } else {
      mockResponse = ENHANCED_RESPONSES.default;
    }
  }
  
  // Simulate more realistic streaming response with varying delays
  const characters = mockResponse.split('');
  let accumulatedResponse = '';
  
  for (let i = 0; i < characters.length; i++) {
    // Vary typing speed to seem more natural
    let delay = 5; // Base typing speed
    
    // Slow down at punctuation
    if ('.,:;?!'.includes(characters[i])) {
      delay = 30 + Math.random() * 20;
    } 
    // Brief pause at new lines
    else if (characters[i] === '\n') {
      delay = 50 + Math.random() * 30;
    } 
    // Speed up during common words
    else if ('etaoinshrd'.includes(characters[i])) {
      delay = 5;
    }
    
    // Add random variation
    delay += Math.random() * 10;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    accumulatedResponse += characters[i];
    
    // Update more efficiently by not sending every character
    // Send on punctuation or every few characters
    if (
      '.,:;?!\n'.includes(characters[i]) || 
      i % 3 === 0 || 
      i === characters.length - 1
    ) {
      onChunk(accumulatedResponse);
    }
  }
  
  onComplete(mockResponse);
}; 

// Export helper functions
export const getSuggestionsByTopic = (topic: string): string[] => {
  const suggestions = {
    morning: [
      "What time should I wake up?",
      "Best morning exercises?",
      "Morning journaling tips"
    ],
    focus: [
      "How long should deep work sessions be?",
      "Best apps for focus?",
      "Focus foods and supplements"
    ],
    motivation: [
      "How to restart a failed habit?",
      "Motivation vs discipline?",
      "Creating habit triggers"
    ],
    default: [
      "How do I build a new habit?",
      "What's the science behind habits?",
      "Tips for tracking progress"
    ]
  };
  
  if (topic.includes('morning')) return suggestions.morning;
  if (topic.includes('focus') || topic.includes('concentrate')) return suggestions.focus;
  if (topic.includes('motivat') || topic.includes('inspir')) return suggestions.motivation;
  
  return suggestions.default;
}; 