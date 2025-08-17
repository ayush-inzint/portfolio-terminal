'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Command {
  name: string;
  description: string;
  response: string | string[];
}

interface CommandHistory {
  command: string;
  response: any;
  isLoading?: boolean;
  isAiResponse?: boolean;
  isError?: boolean;
}

const LoadingDots = ({ command }: { command: string }) => {
  return (
    <>
      <span className="text-red-500">bash: {command}: command not found</span>
      <div className="mt-1">
        <span className="inline-flex items-center">
          Fetching information from AI assistant
          <span className="inline-flex pl-1">
            <span className="animate-[pulseDot_1s_infinite_0ms]">.</span>
            <span className="animate-[pulseDot_1s_infinite_200ms]">.</span>
            <span className="animate-[pulseDot_1s_infinite_400ms]">.</span>
          </span>
        </span>
      </div>
    </>
  );
};

export default function Terminal({ commands }: { commands: Command[] }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const availableCommands = commands.map(cmd => cmd.name);

  const formatResponse = (text: string): any => {
    if (!text) return '';

    // Pattern for social links like @username or /in/username [url]
    const socialLinkPattern = /(@[\w./-]+|\/(in)\/[\w./-]+)\s+\[(https?:\/\/[^\]]+)\]/g;
    // Pattern for regular URLs
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    // Pattern for certification links (Link)[url]
    const certLinkPattern = /\(Link\)\[(https?:\/\/[^\]]+)\]/g;

    // Handle certification links
    if (text.match(certLinkPattern)) {
      const parts: any[] = [];
      let lastIndex = 0;
      let match;
      const regex = new RegExp(certLinkPattern);

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        
        const url = match[1];
        parts.push(
          <a
            key={`cert-link-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Link
          </a>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
      
      return parts;
    }

    // Handle social links
    if (text.match(socialLinkPattern)) {
      const parts: any[] = [];
      let lastIndex = 0;
      let match;
      const regex = new RegExp(socialLinkPattern);

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        
        const displayText = match[1];
        const url = match[3];
        
        parts.push(
          <a
            key={`social-link-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {displayText}
          </a>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
      
      return parts;
    }

    // Handle regular URLs
    if (text.match(urlPattern)) {
      const parts: any[] = [];
      let lastIndex = 0;
      let match;
      const regex = new RegExp(urlPattern);

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        
        const url = match[0];
        parts.push(
          <a
            key={`link-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {url}
          </a>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
      
      return parts;
    }

    return text;
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (trimmedCmd === '') return;
    
    if (trimmedCmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    // Add to command history for arrow navigation
    if (trimmedCmd !== '') {
      setCommandHistory(prev => [...prev, trimmedCmd]);
      setHistoryIndex(-1);
    }

    const command = commands.find(c => c.name === trimmedCmd);
    
    if (command) {
      setIsTyping(true);
      setTypewriterIndex(0);
      const response = command.response;
      const responseText = Array.isArray(response) ? response.join('\n') : response;
      setTypewriterText(responseText);
      
      setHistory(prev => [...prev, {
        command: trimmedCmd,
        response: ''
      }]);
    } else {
      // Command not found, call AI
      const historyIndex = history.length;
      setHistory(prev => [...prev, {
        command: trimmedCmd,
        response: `bash: ${trimmedCmd}: command not found\nFetching information from AI assistant`,
        isLoading: true
      }]);
      
      scrollToBottom();
      setIsProcessing(true);
      
      axios.post('/api/chat', { prompt: trimmedCmd })
        .then(res => {
          setIsTyping(true);
          setTypewriterIndex(0);
          setTypewriterText(res.data.message);
          
          setHistory(prev => {
            const newHistory = [...prev];
            if (newHistory.length > historyIndex) {
              newHistory[historyIndex] = {
                command: trimmedCmd,
                response: `bash: ${trimmedCmd}: command not found\n\n`,
                isAiResponse: true
              };
            }
            return newHistory;
          });
        })
        .catch(err => {
          console.error('Error calling AI API:', err);
          setHistory(prev => {
            const newHistory = [...prev];
            if (newHistory.length > historyIndex) {
              newHistory[historyIndex] = {
                command: trimmedCmd,
                response: `bash: ${trimmedCmd}: command not found\n\nSorry, I couldn't process that request.`,
                isError: true
              };
            }
            return newHistory;
          });
          setIsProcessing(false);
        });
    }
    
    setInput('');
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return;

    const timer = setInterval(() => {
      if (typewriterIndex < typewriterText.length) {
        setTypewriterIndex(prev => prev + 1);
        
        setHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length > 0) {
            const lastIndex = newHistory.length - 1;
            const lastEntry = newHistory[lastIndex];
            const currentText = typewriterText.substring(0, typewriterIndex + 1);
            
            if (lastEntry.isAiResponse) {
              newHistory[lastIndex] = {
                ...lastEntry,
                response: `bash: ${lastEntry.command}: command not found\n\n${formatResponse(currentText)}`,
                isLoading: false
              };
            } else {
              newHistory[lastIndex] = {
                ...lastEntry,
                response: formatResponse(currentText)
              };
            }
          }
          return newHistory;
        });
        
        scrollToBottom();
      } else {
        clearInterval(timer);
        setIsTyping(false);
        setTypewriterIndex(0);
        setIsProcessing(false);
        
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.disabled = false;
          }
        }, 50);
      }
    }, 10);

    return () => {
      clearInterval(timer);
    };
  }, [isTyping, typewriterIndex, typewriterText]);

  // Initial welcome message
  useEffect(() => {
    setHistory([{
      command: 'welcome',
      response: formatResponse("Hi, I'm Mark Gatere, a Software & AI Engineer.\n\nWelcome to my interactive 'AI powered' portfolio terminal!\nType 'help' to see available commands.")
    }]);
    focusInput();
    
    const handleClick = focusInput;
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div 
      className="terminal-container w-full h-full overflow-y-auto scrollbar-hide bg-black text-green-500 font-mono pb-6"
      onClick={focusInput}
    >
      <div className="sticky top-0 bg-black z-10 px-4 pt-4 pb-2">
        <div className="text-sm text-gray-400">
          {availableCommands.join(' | ')}
        </div>
        <div className="border-b border-green-700 mt-2"></div>
      </div>
      
      <div className="command-history px-4 pt-2">
        {history.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="command-line flex items-center">
              <span className="text-blue-400 mr-2">gatere@portfolio:~$</span>
              <span>{item.command}</span>
            </div>
            <div className={`response mt-1 ${item.isError ? 'text-red-500' : 'text-white'} whitespace-pre-wrap`}>
              {item.isLoading ? (
                <LoadingDots command={item.command} />
              ) : (
                item.response
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="command-input flex items-center px-4">
        <span className="text-blue-400 mr-2">gatere@portfolio:~$</span>
        <div className="fake-input flex-1 relative">
          <span className="text-green-500">{input.substring(0, cursorPosition)}</span>
          <span className="cursor"></span>
          <span className="text-green-500">{input.substring(cursorPosition)}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              const newValue = e.target.value;
              setInput(newValue);
              if (e.target.selectionStart === newValue.length) {
                setCursorPosition(newValue.length);
              } else {
                setCursorPosition(e.target.selectionStart || 0);
              }
            }}
            onKeyDown={(e) => {
              if (isTyping) {
                e.preventDefault();
                return;
              }
              
              if (e.key === 'Enter') {
                handleCommand(input);
                setCursorPosition(0);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                  const newIndex = historyIndex + 1;
                  setHistoryIndex(newIndex);
                  const command = commandHistory[commandHistory.length - 1 - newIndex];
                  setInput(command);
                  setCursorPosition(command.length);
                }
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex > 0) {
                  const newIndex = historyIndex - 1;
                  setHistoryIndex(newIndex);
                  const command = commandHistory[commandHistory.length - 1 - newIndex];
                  setInput(command);
                  setCursorPosition(command.length);
                } else if (historyIndex === 0) {
                  setHistoryIndex(-1);
                  setInput('');
                  setCursorPosition(0);
                }
              } else if (e.key === 'Tab') {
                e.preventDefault();
                if (input) {
                  const matches = availableCommands.filter(cmd => 
                    cmd.startsWith(input.toLowerCase())
                  );
                  if (matches.length === 1) {
                    setInput(matches[0]);
                    setCursorPosition(matches[0].length);
                  }
                }
              } else if (e.key === 'ArrowLeft' && cursorPosition > 0) {
                setCursorPosition(cursorPosition - 1);
              } else if (e.key === 'ArrowRight' && cursorPosition < input.length) {
                setCursorPosition(cursorPosition + 1);
              } else if (e.key === 'Home') {
                setCursorPosition(0);
              } else if (e.key === 'End') {
                setCursorPosition(input.length);
              }
            }}
            disabled={isTyping || isProcessing}
            className="absolute top-0 left-0 w-full h-full opacity-0"
            autoFocus
            aria-label="Terminal input"
            spellCheck={false}
          />
        </div>
      </div>
      
      <div ref={scrollRef} />
    </div>
  );
}