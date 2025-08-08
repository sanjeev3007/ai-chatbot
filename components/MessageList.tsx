'use client';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessagePart {
  type: string;
  text?: string;
  [key: string]: unknown;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
}

interface MessageListProps {
  messages: Message[];
  status: string;
  bottomRef: React.RefObject<HTMLDivElement>;
}

export default function MessageList({ messages, status, bottomRef }: MessageListProps) {
  const isLoading = status === 'streaming';

  return (
    <div className="flex flex-col gap-6 p-6 h-[calc(100vh-20.5rem)] overflow-y-auto">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Welcome to QueueChat AI</h3>
        <p className="text-gray-400 max-w-md">
          Your AI assistant is ready!  
          Send multiple questions at once and get answers queued up instantly.  
          Perfect for research, brainstorming, or rapid problem-solving.
        </p>
      </div>
      
      )}

      {messages.map((message: Message, index: number) => {
        const prev = messages[index - 1];
        const isRoleChange = prev && prev.role !== message.role;

        return (
          <div key={message.id} className="animate-slideIn">
            {isRoleChange && (
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-700"></div>
                <div className="text-xs text-gray-500 px-3 py-1 bg-gray-800 rounded-full">
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>
            )}

            <div
              className={`flex items-end gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-md'
                    : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-md'
                }`}
              >
                {message.parts.map(
                  (part: MessagePart, i: number) =>
                    part.type === 'text' && (
                      <div key={i} className="prose prose-sm max-w-none prose-invert">
                        <ReactMarkdown 
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            code: ({ children }) => (
                              <code className="bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-gray-700 p-3 rounded-lg overflow-x-auto text-xs">
                                {children}
                              </pre>
                            ),
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-gray-300">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                            em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    )
                )}
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex gap-3 items-end justify-start animate-fadeIn">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-gray-800 rounded-2xl px-5 py-4 border border-gray-700 shadow-lg">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
