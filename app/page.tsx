'use client';
import ChatContainer from '@/components/ChatContainer';
import { MessageCircle, Sparkles, Zap } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-black">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-700">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Chat Assistant</h1>
                <p className="text-sm text-gray-400">Powered by advanced AI technology</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span>Smart Responses</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white" />
                <span>Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <ChatContainer />
      </main>
    </div>
  );
}
