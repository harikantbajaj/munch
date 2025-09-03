'use client';

import React, { useState } from 'react';
import GeminiChatbot from '@/app/Components/GeminiChatbot';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ChatbotPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    // Navigate back to main page
    router.push('/');
  };

  if (!isOpen) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Button onClick={() => setIsOpen(true)} variant="outline">
          Open Chatbot
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI Interview Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ask me anything about job interviews, Data Structures & Algorithms, and interview preparation!
          </p>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close chatbot"
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>

        <GeminiChatbot />
      </div>
    </div>
  );
};

export default ChatbotPage;
