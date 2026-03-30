import { useState, useRef, useEffect } from "react";
import { Send, RefreshCw, Dumbbell, Calendar, Info, CheckCircle2, AlertCircle, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { getWorkoutResponse } from "./services/geminiService";
import { ChatMessage } from "./types";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hello! I'm FlexPlan, your personal workout architect. I'm here to help you build a custom weekly workout schedule tailored to your goals and lifestyle.\n\nTo get started, tell me a bit about what you're looking for. For example: 'I want to do strength training 3 days a week with dumbbells at home.'",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getWorkoutResponse(newMessages);
      setMessages((prev) => [...prev, { role: "model", text: response }]);
    } catch (error) {
      console.error("Error getting workout response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I'm sorry, I encountered an error while processing your request. Please try again or rephrase your input.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "model",
        text: "Hello! I'm FlexPlan, your personal workout architect. I'm here to help you build a custom weekly workout schedule tailored to your goals and lifestyle.\n\nTo get started, tell me a bit about what you're looking for. For example: 'I want to do strength training 3 days a week with dumbbells at home.'",
      },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-indigo-200 shadow-lg">
            <Dumbbell className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">FlexPlan</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Workout Architect</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 max-w-3xl mx-auto w-full space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    message.role === "user" ? "bg-indigo-100 text-indigo-600" : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  {message.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div
                  className={`rounded-2xl px-5 py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                  }`}
                >
                  <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-li:my-1">
                    <Markdown>{message.text}</Markdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-white text-slate-600 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-5 py-3 flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tell me about your workout goals..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-200"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">
          Personalized Workout Architect • Friendly & Professional
        </p>
      </div>

      {/* Sidebar Info (Desktop Only) */}
      <div className="hidden lg:block fixed left-8 top-32 w-64 space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600" />
            Guidelines
          </h3>
          <ul className="space-y-3 text-xs text-slate-600 font-medium">
            <li className="flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              Workouts: 20-120 mins
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              Frequency: Max 6 days/week
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              Hyphenated days: Mon-Wed = Mon to Wed
            </li>
            <li className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              No medical or nutritional advice
            </li>
          </ul>
        </div>
        
        <div className="bg-indigo-600 p-5 rounded-2xl shadow-lg shadow-indigo-100 text-white">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Quick Start
          </h3>
          <div className="space-y-2">
            <button 
              onClick={() => setInput("I want to do cardio 3 days a week, 30 mins each, no equipment.")}
              className="w-full text-left text-[11px] bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/10"
            >
              "3 days cardio, 30 mins, no equipment"
            </button>
            <button 
              onClick={() => setInput("Strength training Monday-Wednesday, 45 mins, full gym access.")}
              className="w-full text-left text-[11px] bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/10"
            >
              "Strength Mon-Wed, 45 mins, full gym"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
