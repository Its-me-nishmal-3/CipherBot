import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Chat } from '@google/genai';
import { MessageInput } from './components/MessageInput';
import { ChatMessageDisplay } from './components/ChatMessageDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import * as geminiService from './services/geminiService';
import { ChatMessage, SenderType } from './types';
import { ThemeContext, themes } from './ThemeContext';


const App: React.FC = () => {
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { currentThemeDetails, themeLoaded } = useContext(ThemeContext);

  useEffect(() => {
    if (themeLoaded && currentThemeDetails) {
      const root = document.documentElement;
      Object.entries(currentThemeDetails.colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      Object.entries(currentThemeDetails.syntax).forEach(([key, value]) => {
        root.style.setProperty(`--hljs-${key.toLowerCase()}-color`, value);
      });
    }
  }, [currentThemeDetails, themeLoaded]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = useCallback(async () => {
    setIsInitializing(true);
    setError(null);
    try {
      if (!process.env.API_KEY && !geminiService.isApiKeyAvailable()) {
         throw new Error("Gemini API Key is not configured. Please set the API_KEY environment variable.");
      }
      const session = geminiService.createChatSession();
      setChatInstance(session);
    } catch (e) {
      console.error("Failed to initialize chat session:", e);
      const errorMessage = (e as Error).message || "Failed to initialize chat. Ensure API_KEY is set.";
      setError(errorMessage);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading || !chatInstance) {
      if (!chatInstance && !isInitializing) {
        setError("Chat session is not initialized. Please try reloading or check API key configuration.");
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      text: currentInput,
      sender: SenderType.User,
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setCurrentInput('');

    const botMessageId = Date.now().toString() + '-bot';
    setMessages(prevMessages => [
      ...prevMessages,
      { id: botMessageId, text: '', sender: SenderType.Bot, isStreaming: true },
    ]);

    try {
      const stream = geminiService.streamMessage(chatInstance, userMessage.text);
      let accumulatedText = '';
      for await (const chunk of stream) {
        if (chunk.text) {
          accumulatedText += chunk.text;
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === botMessageId
                ? { ...msg, text: accumulatedText, isStreaming: true }
                : msg
            )
          );
        }
      }
    } catch (e) {
      console.error("Error streaming message:", e);
      const errMessage = (e as Error).message || "An error occurred while fetching the response.";
      setError(errMessage);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === botMessageId
            ? { ...msg, text: `Error: ${errMessage}`, isStreaming: false, sender: SenderType.Bot }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    }
  };

  if (!themeLoaded || (isInitializing && !error)){
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[var(--chat-bg-gradient-from)] text-[var(--text-primary)] p-6">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-lg">Initializing Cipher Bot...</p>
        {error && <ErrorDisplay message={error} className="mt-4" />}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-[var(--chat-bg-gradient-from)] to-[var(--chat-bg-gradient-to)] text-[var(--text-primary)] font-sans">
      <ThemeSwitcher />
      <header className="p-4 bg-[var(--header-bg)] backdrop-blur-md shadow-lg border-b border-[var(--header-border)]">
        <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-text-from)] to-[var(--header-text-to)]">
          Cipher Bot
        </h1>
      </header>

      {error && (!isInitializing || (isInitializing && error)) && <ErrorDisplay message={error} onDismiss={() => setError(null)} className="m-4"/>}
      
      {!chatInstance && !isInitializing && !error && (
        <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
          <p className="text-xl text-[var(--text-secondary)]">Chat session could not be initialized.</p>
          <button 
            onClick={initializeChat} 
            className="mt-4 px-6 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-semibold rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-75"
            disabled={isLoading}
          >
            Retry Initialization
          </button>
        </div>
      )}

      {chatInstance && (
        <>
          <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map(msg => (
              <ChatMessageDisplay key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <MessageInput
            value={currentInput}
            onChange={setCurrentInput}
            onSend={handleSendMessage}
            isLoading={isLoading}
            isDisabled={!chatInstance || isInitializing}
          />
        </>
      )}
    </div>
  );
};

export default App;