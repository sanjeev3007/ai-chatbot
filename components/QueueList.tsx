'use client';
import { Clock, X, AlertCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface QueueListProps {
  queue: string[];
  removeFromQueue: (index: number) => void;
  clearQueue?: () => void;
  isProcessing?: boolean;
}

export default function QueueList({
  queue,
  removeFromQueue,
  clearQueue,
  isProcessing = false,
}: QueueListProps) {
  const [expanded, setExpanded] = useState(false);

  if (queue.length === 0) return null;

  return (
    <div className="mb-4 bg-gray-900 border border-gray-700 rounded-xl shadow-lg animate-fadeIn">
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">
            {queue.length} Pending {queue.length > 1 ? 'Questions' : 'Question'}
          </h3>
          <p className="text-xs text-gray-400">
            {isProcessing ? 'Processing current question...' : 'Waiting to process'}
          </p>
        </div>
        {clearQueue && queue.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearQueue();
            }}
            className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
            title="Clear all questions"
          >
            <Trash2 className="w-3 h-3 text-gray-400 hover:text-white transition-colors" />
          </button>
        )}
        <div className="flex items-center gap-1 text-xs text-gray-400 select-none">
          <AlertCircle className="w-3 h-3 text-gray-400" />
          <span>Queue</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {/* Expanded List */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-700">
          {queue.map((question, index) => (
            <div
              key={index}
              className="group bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300 hover:border-gray-500 transition-all duration-200 animate-slideIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 font-mono">
                      #{index + 1}
                    </span>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse-slow"></div>
                    {index === 0 && isProcessing && (
                      <span className="text-xs text-gray-400 font-medium">
                        Processing...
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed break-words">
                    {question}
                  </p>
                </div>

                <button
                  onClick={() => removeFromQueue(index)}
                  className="flex-shrink-0 w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:bg-gray-600"
                  title="Remove from queue"
                >
                  <X className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
