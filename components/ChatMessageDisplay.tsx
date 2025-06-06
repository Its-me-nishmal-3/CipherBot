import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, SenderType } from '../types';

interface ChatMessageDisplayProps {
  message: ChatMessage;
}

const UserIcon: React.FC = () => (
  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--message-user-icon-bg)] flex items-center justify-center text-white text-sm font-semibold shadow-sm">
    U
  </div>
);

const BotIcon: React.FC = () => (
  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--message-bot-icon-bg)] flex items-center justify-center text-white text-sm font-semibold shadow-sm">
    AI
  </div>
);

const TYPING_SPEED_MS = 30; 

const highlightCode = (code: string, language?: string): string => {
  let highlightedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (language?.toLowerCase() === 'javascript' || language?.toLowerCase() === 'js') {
    highlightedCode = highlightedCode.replace(/(\/\/.*)/g, '<span class="hljs-comment">$1</span>');
    highlightedCode = highlightedCode.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="hljs-comment">$1</span>');
    highlightedCode = highlightedCode.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, '<span class="hljs-string">$1</span>');
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'default', 'break', 'continue', 'new', 'this', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'finally', 'class', 'extends', 'super', 'true', 'false', 'null', 'undefined', 'yield', 'typeof', 'instanceof', 'delete', 'in', 'void', 'debugger', 'with'];
    keywords.forEach(kw => {
      highlightedCode = highlightedCode.replace(new RegExp(`\\b${kw}\\b`, 'g'), `<span class="hljs-keyword">${kw}</span>`);
    });
    highlightedCode = highlightedCode.replace(/\b(0x[0-9a-fA-F]+|\d+(\.\d+)?([eE][+-]?\d+)?)\b/g, '<span class="hljs-number">$1</span>');
    highlightedCode = highlightedCode.replace(/([a-zA-Z_]\w*)\s*(?=\()/g, (match, p1) => {
        if (keywords.includes(p1)) return match;
        return `<span class="hljs-function">${p1}</span>`;
    });
    highlightedCode = highlightedCode.replace(/([+\-*/%=&|<>!^~?:.,;(){}\[\]])/g, '<span class="hljs-punctuation">$1</span>');
  }
  return highlightedCode;
};

const parseInlineFormatting = (text: string, depth = 0): React.ReactNode[] => {
  if (depth > 10) return [text]; 

  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.*?)\*\*)|(\*(.*?)\*)|((?<!\\)`(.*?)(?<!\\)`)/;
  let remainingText = text;
  let keyCounter = 0;

  while (remainingText.length > 0) {
    const match = remainingText.match(regex);
    if (!match || match.index === undefined) {
      parts.push(remainingText);
      break;
    }

    const prefix = remainingText.substring(0, match.index);
    if (prefix) {
      parts.push(prefix);
    }

    const key = `fmt-${depth}-${keyCounter++}-${match.index}`;
    const fullMatchText = match[0];

    if (match[1] && match[2] !== undefined) { 
      parts.push(<strong key={key}>{parseInlineFormatting(match[2], depth + 1)}</strong>);
    } else if (match[3] && match[4] !== undefined) { 
      parts.push(<em key={key}>{parseInlineFormatting(match[4], depth + 1)}</em>);
    } else if (match[5] && match[6] !== undefined) { 
      parts.push(<code key={key} className="px-1 py-0.5 bg-[var(--inline-code-bg)] rounded text-sm font-mono text-[var(--inline-code-text)] mx-0.5">{match[6]}</code>);
    } else {
      parts.push(fullMatchText);
    }
    
    remainingText = remainingText.substring(match.index + fullMatchText.length);
  }
  
  return parts.length > 0 ? parts : (text ? [text] : []);
};

export const ChatMessageDisplay: React.FC<ChatMessageDisplayProps> = ({ message }) => {
  const isUser = message.sender === SenderType.User;
  const [animatedText, setAnimatedText] = useState<string>(isUser ? message.text : '');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  
  const animationTimeoutRef = useRef<number | null>(null);
  const currentTargetTextRef = useRef<string>(message.text); 
  const displayedLengthRef = useRef<number>(isUser ? message.text.length : 0);

  useEffect(() => {
    currentTargetTextRef.current = message.text;

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (isUser) {
      if (animatedText !== message.text) {
        setAnimatedText(message.text);
      }
      displayedLengthRef.current = message.text.length;
      return; 
    }

    if (displayedLengthRef.current > 0 &&
        (!currentTargetTextRef.current.startsWith(animatedText.substring(0, displayedLengthRef.current)) ||
         (currentTargetTextRef.current.length < displayedLengthRef.current && displayedLengthRef.current > 0) 
        )
       ) {
      setAnimatedText(''); 
      displayedLengthRef.current = 0; 
    }
    
    const animate = () => {
      if (displayedLengthRef.current < currentTargetTextRef.current.length) {
        const newLength = displayedLengthRef.current + 1;
        setAnimatedText(currentTargetTextRef.current.substring(0, newLength));
        displayedLengthRef.current = newLength;
        
        if (displayedLengthRef.current < currentTargetTextRef.current.length) {
          animationTimeoutRef.current = window.setTimeout(animate, TYPING_SPEED_MS);
        }
      }
    };

    if (displayedLengthRef.current < currentTargetTextRef.current.length) {
      animate();
    } else if (animatedText !== currentTargetTextRef.current) { 
      setAnimatedText(currentTargetTextRef.current);
      displayedLengthRef.current = currentTargetTextRef.current.length;
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [message.text, message.id, isUser, animatedText]); 

  const showTypingPlaceholder = message.sender === SenderType.Bot && message.isStreaming && animatedText === '';
  const showBlinkingCursor = message.sender === SenderType.Bot && message.isStreaming && 
                             (animatedText.length > 0 && displayedLengthRef.current === currentTargetTextRef.current.length || 
                              displayedLengthRef.current < currentTargetTextRef.current.length && animatedText.length > 0);

  const handleCopyCode = async (codeToCopy: string, blockKey: string) => {
    try {
      await navigator.clipboard.writeText(codeToCopy);
      setCopiedStates(prev => ({ ...prev, [blockKey]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [blockKey]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const renderMessageContent = (content: string): React.ReactNode[] => {
    const outputNodes: React.ReactNode[] = [];
    const lines = content.split('\n');
    let i = 0;
    let keyCounter = 0; 

    while (i < lines.length) {
      const currentLine = lines[i];
      const blockKey = `${isUser ? 'user' : 'bot'}-block-${message.id}-${keyCounter++}`;

      const codeBlockStartMatch = currentLine.match(/^```(\w*)\s*$/);
      if (codeBlockStartMatch && !isUser) { 
        const language = codeBlockStartMatch[1] || '';
        const codeLines: string[] = [];
        i++; 
        
        while (i < lines.length && !lines[i].match(/^```\s*$/)) {
          codeLines.push(lines[i]);
          i++;
        }
        const codeContent = codeLines.join('\n');
        
        if (i < lines.length && lines[i].match(/^```\s*$/)) {
          i++; 
        }

        outputNodes.push(
          <div key={blockKey} className="my-2 text-left relative group">
            <div className="flex justify-between items-center bg-[var(--code-block-header-bg)] px-3 py-1 rounded-t-md border-b border-[var(--border-primary)]">
              <span className="text-xs text-[var(--code-block-header-text)] font-sans select-none">
                {language || 'code'}
              </span>
              <button
                onClick={() => handleCopyCode(codeContent, blockKey)}
                className="text-xs text-[var(--code-block-header-text)] hover:text-[var(--code-block-header-hover-text)] transition-colors opacity-50 group-hover:opacity-100 focus:opacity-100 px-2 py-0.5 rounded flex items-center"
                aria-label="Copy code"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copiedStates[blockKey] ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre 
              className={`font-mono bg-[var(--code-block-bg)] p-3 ${language ? 'rounded-b-md' : 'rounded-md'} text-sm text-[var(--code-block-text)] overflow-x-auto whitespace-pre`}
            >
              <code dangerouslySetInnerHTML={{ __html: highlightCode(codeContent, language) }} />
            </pre>
          </div>
        );
        continue; 
      }

      const blockquoteMatch = currentLine.match(/^>\s(.*)/);
      if (blockquoteMatch) {
        const [, quoteContent] = blockquoteMatch;
        outputNodes.push(
          <blockquote
            key={blockKey}
            className="pl-3 md:pl-4 border-l-4 border-[var(--blockquote-border-color)] italic text-[var(--blockquote-text-color)] my-1 text-sm md:text-base"
          >
            {parseInlineFormatting(quoteContent)}
          </blockquote>
        );
        i++;
        continue;
      }
      
      const listItemMatch = currentLine.match(/^(\*|-|\d+\.)\s+(.*)/);
      if (listItemMatch) {
        const [, prefix, itemContent] = listItemMatch;
        const bullet = (prefix === '*' || prefix === '-') ? '•' : prefix;
        outputNodes.push(
          <div key={blockKey} className="flex items-start ml-2 md:ml-4 my-0.5">
            <span className="mr-2 text-[var(--list-bullet-color)] shrink-0 pt-1 select-none">{bullet}</span>
            <div className="flex-grow text-sm md:text-base">{parseInlineFormatting(itemContent)}</div>
          </div>
        );
        i++;
        continue;
      }
      
      if (currentLine.trim() === '') {
        outputNodes.push(<div key={blockKey} className="h-2 md:h-3" aria-hidden="true"></div>);
        i++;
        continue;
      }

      outputNodes.push(
        <div key={blockKey} className="text-sm md:text-base my-0.5">
          {parseInlineFormatting(currentLine)}
        </div>
      );
      i++;
    }
    return outputNodes;
  };

  return (
    <div className={`flex items-end space-x-2 md:space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <BotIcon />}
      <div
        className={`
          max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl p-3 md:p-4 rounded-xl shadow-md
          ${isUser ? 'bg-[var(--message-user-bg)] text-[var(--message-user-text)] rounded-br-none' : 'bg-[var(--message-bot-bg)] text-[var(--message-bot-text)] rounded-bl-none'}
        `}
      >
        <div 
          className="break-words" 
          aria-live={isUser ? "off" : "polite"}
        >
          {isUser ? renderMessageContent(message.text) : renderMessageContent(animatedText)}
          {showTypingPlaceholder && (
            <span className="italic text-[var(--message-typing-indicator)]">Cipher Bot is typing...</span>
          )}
          {showBlinkingCursor && (
             <span className="blinking-cursor-animation" aria-hidden="true"></span>
          )}
        </div>
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};