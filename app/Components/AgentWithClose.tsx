"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { useRouter } from "next/navigation";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Phone, 
  PhoneOff, 
  Mic, 
  Volume2, 
  MessageSquare,
  Brain,
  Loader2,
  CheckCircle,
  AlertCircle,
  Home
} from 'lucide-react';

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE", 
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
  timestamp: Date;
}

interface AgentProps {
  userName: string;
  userId?: string;
  type: "interview" | "generate";
  interviewId?: string;
  questions?: string[];
}

const AgentWithClose: React.FC<AgentProps> = ({
  userName,
  userId,
  type,
  interviewId,
  questions,
}) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isProcessingFeedback, setIsProcessingFeedback] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setConnectionError(null);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      setIsSpeaking(false);
      setIsListening(false);
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
      setIsListening(false);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
      setIsListening(true);
    };

    const onError = (error: Error) => {
      console.error('VAPI Error:', error);
      setConnectionError(error.message || "Connection failed");
      setCallStatus(CallStatus.INACTIVE);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    if (!userId || !interviewId) return;
    
    setIsProcessingFeedback(true);
    
    try {
      const { success, feedbackId: id } = await createFeedback({
        userId,
        interviewId,
        transcript: messages,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.error('Failed to save feedback');
        setConnectionError("Failed to save interview feedback");
        setTimeout(() => router.push("/"), 3000);
      }
    } catch (error) {
      console.error('Feedback generation error:', error);
      setConnectionError("Error processing feedback");
      setTimeout(() => router.push("/"), 3000);
    } finally {
      setIsProcessingFeedback(false);
    }
  };

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED && messages.length > 0) {
      if (type === "interview") {
        handleGenerateFeedback(messages);
      } else {
        router.push("/");
      }
    }
  }, [callStatus, messages, type, userId, interviewId]);

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);
      setConnectionError(null);

      if (type === "interview") {
        let formattedQuestions = "";

        if (questions && questions.length > 0) {
          formattedQuestions = questions
            .map((question, index) => `${index + 1}. ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
            userName: userName,
          },
        });
      } else {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            userid: userId,
            username: userName,
          },
        });
      }
    } catch (error) {
      console.error('Failed to start call:', error);
      setConnectionError("Failed to start interview session");
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = async () => {
    try {
      setCallStatus(CallStatus.FINISHED);
      vapi.stop();
    } catch (error) {
      console.error('Failed to stop call:', error);
    }
  };

  const handleClose = () => {
    if (callStatus === CallStatus.ACTIVE) {
      setShowConfirmClose(true);
    } else {
      router.push('/');
    }
  };

  const confirmClose = () => {
    if (callStatus === CallStatus.ACTIVE) {
      handleDisconnect();
    }
    setShowConfirmClose(false);
    router.push('/');
  };

  const getStatusIcon = () => {
    switch (callStatus) {
      case CallStatus.CONNECTING:
        return <Loader2 size={20} className="animate-spin text-yellow-500" />;
      case CallStatus.ACTIVE:
        return <CheckCircle size={20} className="text-green-500" />;
      case CallStatus.FINISHED:
        return <CheckCircle size={20} className="text-blue-500" />;
      default:
        return <Phone size={20} className="text-gray-500" />;
    }
  };

  const latestMessage = messages[messages.length - 1]?.content;

  return (
    <div className="space-y-6">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Interview Session</h2>
            <p className="text-sm text-gray-600">
              {type === "interview" ? "Practice Interview" : "Interview Generation"}
            </p>
          </div>
        </div>

        <Button
          onClick={handleClose}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
        >
          <X size={16} />
          <span>Close</span>
        </Button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmClose && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                End Interview Session?
              </h3>
              <p className="text-gray-600 mb-6">
                Your interview is currently active. Closing will end the session and you may lose your progress.
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowConfirmClose(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Continue Interview
                </Button>
                <Button
                  onClick={confirmClose}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  End & Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <span className="font-medium text-gray-900">
              {callStatus === CallStatus.CONNECTING && "Connecting..."}
              {callStatus === CallStatus.ACTIVE && "Interview Active"}
              {callStatus === CallStatus.FINISHED && (isProcessingFeedback ? "Processing Feedback..." : "Interview Complete")}
              {callStatus === CallStatus.INACTIVE && "Ready to Start"}
            </span>
          </div>
          
          {callStatus === CallStatus.ACTIVE && (
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {isSpeaking && (
                <div className="flex items-center space-x-2">
                  <Volume2 size={16} className="text-blue-500" />
                  <span>AI Speaking</span>
                </div>
              )}
              {isListening && (
                <div className="flex items-center space-x-2">
                  <Mic size={16} className="text-green-500" />
                  <span>Listening</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {connectionError && (
          <div className="mt-3 flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{connectionError}</span>
          </div>
        )}
      </div>

      {/* Interview Participants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Interviewer */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 text-center relative">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4 mx-auto border-4 border-white shadow-lg">
              <Image
                src="/ai-avatar.png"
                alt="AI Interviewer"
                width={80}
                height={80}
                className="object-cover rounded-xl"
              />
            </div>
            
            {isSpeaking && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <Volume2 size={16} className="text-white" />
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Interviewer</h3>
          <div className="flex items-center justify-center space-x-2">
            <Brain size={16} className="text-blue-600" />
            <span className="text-sm text-gray-600">Powered by AI</span>
          </div>
        </div>

        {/* User */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 text-center relative">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center mb-4 mx-auto border-4 border-white shadow-lg">
              <Image
                src="/user-avatar-2.png"
                alt={userName}
                width={80}
                height={80}
                className="object-cover rounded-xl"
              />
            </div>
            
            {isListening && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Mic size={16} className="text-white" />
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{userName}</h3>
          <div className="flex items-center justify-center space-x-2">
            <MessageSquare size={16} className="text-green-600" />
            <span className="text-sm text-gray-600">Interviewee</span>
          </div>
        </div>
      </div>

      {/* Live Transcript */}
      {messages.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare size={20} className="text-purple-600" />
            <h4 className="text-lg font-semibold text-gray-900">Live Conversation</h4>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto scrollbar-thin">
            {latestMessage && (
              <p className="text-gray-700 leading-relaxed animate-fadeIn">
                {latestMessage}
              </p>
            )}
            
            {messages.length > 1 && (
              <p className="text-blue-600 text-sm mt-2">
                View full conversation ({messages.length} messages)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button 
            onClick={handleCall} 
            disabled={callStatus === CallStatus.CONNECTING || isProcessingFeedback}
            className={cn(
              "relative flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg",
              callStatus === CallStatus.CONNECTING || isProcessingFeedback
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 text-white"
            )}
          >
            {callStatus === CallStatus.CONNECTING && (
              <Loader2 size={24} className="animate-spin" />
            )}
            {callStatus === CallStatus.INACTIVE && (
              <Phone size={24} />
            )}
            {isProcessingFeedback && (
              <Loader2 size={24} className="animate-spin" />
            )}
            
            <span>
              {callStatus === CallStatus.CONNECTING 
                ? "Connecting..." 
                : isProcessingFeedback 
                ? "Processing..." 
                : "Start Interview"}
            </span>
          </button>
        ) : (
          <button 
            onClick={handleDisconnect}
            className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg hover:scale-105"
          >
            <PhoneOff size={24} />
            <span>End Interview</span>
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center">
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
          disabled={callStatus === CallStatus.ACTIVE}
        >
          <Home size={16} />
          <span>Return to Dashboard</span>
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {callStatus === CallStatus.INACTIVE && "Click 'Start Interview' to begin your AI-powered interview session"}
          {callStatus === CallStatus.CONNECTING && "Establishing connection with AI interviewer..."}
          {callStatus === CallStatus.ACTIVE && "Speak clearly and naturally. The AI will guide you through the interview."}
          {callStatus === CallStatus.FINISHED && !isProcessingFeedback && "Interview completed! Generating your personalized feedback..."}
          {isProcessingFeedback && "Analyzing your performance and generating detailed feedback..."}
        </p>
      </div>
    </div>
  );
};

export default AgentWithClose;
