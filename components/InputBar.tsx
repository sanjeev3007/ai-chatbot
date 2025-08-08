'use client';
import { useState } from 'react';
import { Send, Loader2, Clock, Square } from 'lucide-react';

interface InputBarProps {
  onSubmit: (input: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  isProcessing?: boolean;
  onStop?: () => void;
  queueLength?: number;
}

export default function InputBar({ 
  onSubmit, 
  disabled = false, 
  isStreaming = false, 
  isProcessing = false,
  onStop,
  queueLength = 0 
}: InputBarProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput('');
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSubmit(input);
    setInput('');
  };

  const handleStop = () => {
    onStop?.();
  };

  // Determine which button to show
  const getButtonState = () => {
    if (isStreaming || isProcessing) {
      return 'processing';
    } else if (queueLength > 0) {
      return 'queue';
    } else if (input.trim()) {
      return 'send';
    }
    return 'send'; // Default state
  };

  const buttonState = getButtonState();

  const renderButton = () => {
    const baseClasses = "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95";
    
    switch (buttonState) {
      case 'processing':
        return (
          <button
            type="button"
            onClick={handleStop}
            className={`${baseClasses} bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border border-red-400/20`}
            disabled={disabled}
            title="Stop processing"
          >
            <Square className="w-5 h-5" />
          </button>
        );
      
      case 'queue':
        return (
          <button
            type="button"
            className={`${baseClasses} bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border border-orange-400/20`}
            disabled={disabled}
            title={`${queueLength} question${queueLength > 1 ? 's' : ''} in queue`}
          >
            <Clock className="w-5 h-5" />
          </button>
        );
      
      case 'send':
      default:
        return (
          <button
            type="submit"
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className={`${baseClasses} bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border border-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
    <div className="flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-5 py-4 shadow-xl focus-within:ring-0 focus-within:border-gray-700 transition-all duration-200">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type your message...q"
      disabled={disabled}
      className="flex-1 border-none outline-none focus:outline-none focus:ring-0 focus:border-none bg-transparent text-gray-100 placeholder-gray-500 text-sm leading-relaxed"
    />
      
      <div className="flex-shrink-0">
        {renderButton()}
      </div>
    </div>
  </form>
  
  );
}
