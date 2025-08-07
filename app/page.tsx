'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { Bot, User, ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const [input, setInput] = useState('');
  const isLoading = status === 'streaming';
  const hasStartedChat = messages.length > 0;

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center px-4 pb-28 pt-8 relative">
      <div
        className={`text-center mb-10 transition-all duration-500 ${hasStartedChat ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-[300px]'
          }`}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Let’s chat.
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mt-2">
          Ask me anything. I’m here to help.
        </p>
      </div>

      {/* Chat area */}
      <div className="w-full max-w-3xl flex-1">
        <div className="flex flex-col gap-6 p-4 sm:p-6 h-[calc(100vh-14rem)] overflow-y-auto rounded-2xl bg-white/30 backdrop-blur-md border border-gray-200 shadow-inner scrollbar-none">
          {messages.map((message, index) => {
            const prev = messages[index - 1];
            const isRoleChange = prev && prev.role !== message.role;

            return (
              <div key={message.id}>
                {isRoleChange && (
                  <hr className="my-2 border-t border-gray-300/40 w-full max-w-[75%] mx-auto" />
                )}

                <div
                  className={`flex items-end gap-3 animate-fadeIn ${message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 my-2 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center shadow">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-md transition-all duration-300 ease-in-out ${message.role === 'user'
                      ? 'bg-black text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                      }`}
                  >
                    {message.parts.map(
                      (part, i) =>
                        part.type === 'text' && (
                          <div key={i} className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-4" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-xl font-semibold my-3" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-lg font-semibold my-2" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                                li: ({ node, ...props }) => <li className="list-disc ml-5" {...props} />,
                              }}
                            >
                              {part.text}
                            </ReactMarkdown>
                          </div>

                        )
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 my-2 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center shadow">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-end justify-start animate-fadeIn">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-2 border border-gray-200 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-4 left-0 right-0 px-4 z-10"
      >
        <div className="max-w-3xl mx-auto flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 shadow-md">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something..."
            disabled={status !== 'ready'}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !input.trim()}
            className="w-9 h-9 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-50"
          >
            <ArrowUp className="w-4 h-4 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
}
