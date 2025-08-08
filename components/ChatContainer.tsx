'use client';
import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import MessageList from './MessageList';
import InputBar from './InputBar';
import QueueList from './QueueList';

export default function ChatContainer() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const [queue, setQueue] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update streaming state based on chat status
  useEffect(() => {
    setIsStreaming(status === 'streaming');
  }, [status]);

  // Handle queue processing
  useEffect(() => {
    if (!isProcessing && !isStreaming && queue.length > 0) {
      const next = queue[0];
      setQueue((q) => q.slice(1));
      setIsProcessing(true);
      sendMessage({ text: next }).finally(() => {
        setIsProcessing(false);
      });
    }
  }, [isProcessing, isStreaming, queue, sendMessage]);

  const handleUserInput = (input: string) => {
    if (!input.trim()) return;
    
    if (!isProcessing && !isStreaming && status === 'ready') {
      setIsProcessing(true);
      sendMessage({ text: input }).finally(() => {
        setIsProcessing(false);
      });
    } else {
      setQueue((q) => [...q, input]);
    }
  };

  const handleStop = () => {
    stop();
    setIsProcessing(false);
    setIsStreaming(false);
  };

  const handleRemoveFromQueue = (index: number) => {
    setQueue((q) => q.filter((_, i) => i !== index));
  };

  const handleClearQueue = () => {
    setQueue([]);
  };

  const showProcessing = isProcessing || isStreaming;

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto px-4 py-6">
      <div className="flex-1 flex flex-col bg-black text-white rounded-2xl border border-gray-700 shadow-2xl">
        
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <MessageList 
            messages={messages} 
            status={status} 
            bottomRef={bottomRef as React.RefObject<HTMLDivElement>} 
          />
        </div>

        {/* Queue List */}
        <div className="px-6  bg-black">
          <QueueList
            queue={queue}
            removeFromQueue={handleRemoveFromQueue}
            clearQueue={handleClearQueue}
            isProcessing={showProcessing}
          />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-700 bg-black">
          <InputBar
            onSubmit={handleUserInput}
            disabled={false}
            isStreaming={isStreaming}
            isProcessing={isProcessing}
            onStop={handleStop}
            queueLength={queue.length}
          />
        </div>
      </div>
    </div>
  );
}
