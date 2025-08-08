'use client';
import { useState } from 'react';
import { Send, Clock, Square } from 'lucide-react';

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

  const getButtonState = () => {
    if (isStreaming || isProcessing) {
      return 'processing';
    } else if (queueLength > 0) {
      return 'queue';
    } else if (input.trim()) {
      return 'send';
    }
    return 'send';
  };

  const buttonState = getButtonState();

  const renderButton = () => {
    const baseClasses =
      "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border";

    switch (buttonState) {
      case 'processing':
        return (
          <button
            type="button"
            onClick={handleStop}
            className={`${baseClasses} bg-gray-900 text-white border-gray-700 hover:bg-gray-800`}
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
            className={`${baseClasses} bg-gray-300 text-black border-gray-400 hover:bg-gray-200`}
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
            className={`${baseClasses} bg-white text-black border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-4 bg-black border border-gray-700 rounded-2xl px-5 py-4 shadow-xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1 border-none outline-none bg-transparent text-white placeholder-gray-500 text-sm leading-relaxed"
        />
        <div className="flex-shrink-0">
          {renderButton()}
        </div>
      </div>
    </form>
  );
}
