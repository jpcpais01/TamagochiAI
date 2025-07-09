'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { Message, Mood } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Pet from '@/components/Pet';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizonal, Paperclip, X } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mood, setMood] = useState<Mood>('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateMood = useCallback(async (currentMessages: Message[]) => {
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages }),
      });
      if (!response.ok) return;
      const { mood: newMood } = await response.json();
      setMood(newMood);
    } catch (error) {
      console.error('Failed to update mood:', error);
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !imageFile) || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      ...(imageUrl && { imageUrl }),
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    setInput('');
    setImageFile(null);
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Chat API response failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonString = line.slice(6);
            try {
              const parsed = JSON.parse(jsonString);
              assistantResponse += parsed.text || '';
            } catch (e) {
              console.error('Failed to parse stream chunk:', jsonString, e);
            }
          }
        }
      }
      
      if (assistantResponse.trim()) {
        const newAssistantMessage: Message = { role: 'assistant', content: assistantResponse };
        const finalMessages = [...newMessages, newAssistantMessage];
        setMessages(finalMessages);
        updateMood(finalMessages);
      } else {
        setIsLoading(false);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Something went wrong. Please try again.');
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  // Initial autonomous message on page load
  useEffect(() => {
    const initialMessage = async () => {
      if (messages.length === 0) {
        // Wait a moment for the component to settle
        setTimeout(() => {
          generateSpontaneousMessage();
        }, 2000);
      }
    };
    initialMessage();
  }, []); // Only run once on mount

  const generateSpontaneousMessage = async () => {
    if (isLoading || isThinking) return;
    setIsThinking(true);
    let finalResponse = '';

    try {
      const thinkResponse = await fetch('/api/think', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      if (!thinkResponse.ok) throw new Error('Think API failed');
      const { thought } = await thinkResponse.json();

      if (!thought || thought.trim() === '') {
        setIsThinking(false);
        return;
      }

              // Use the thought directly as Aero's spontaneous message
        const spontaneousMessage: Message = { role: 'assistant', content: thought, isSpontaneous: true };
        const finalMessages = [...messages, spontaneousMessage];
        setMessages(finalMessages);
        updateMood(finalMessages);
    } catch (error) {
      console.error('Spontaneous message failed:', error);
    } finally {
      setIsThinking(false);
    }
  };
  
  useEffect(() => {

    if (isLoading || isThinking) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const setRandomTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const randomDelay = Math.random() * (30000 - 15000) + 15000;
      timeoutRef.current = setTimeout(generateSpontaneousMessage, randomDelay);
    };

    setRandomTimeout();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [messages, isLoading, isThinking, updateMood]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/90 to-slate-900"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-gradient-radial from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-gradient-radial from-purple-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-radial from-teal-500/15 via-emerald-500/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/[0.02] backdrop-blur-[1px]"></div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat bg-center opacity-[0.03] mix-blend-overlay"></div>
      


              <div className="w-full h-full lg:w-[70%] mx-auto flex flex-col relative z-10">
          <div className="flex flex-col h-full text-foreground overflow-visible relative">
          <div className="flex-grow flex flex-col justify-between p-4 md:p-6 relative z-10">
            <div className="flex justify-center items-start pt-8">
              <Pet mood={mood} />
            </div>

            <div className="flex-grow flex flex-col justify-end pb-4">
              <div
                className="h-[50vh] overflow-y-auto pr-2 pb-6 no-scrollbar [mask-image:linear-gradient(to_bottom,transparent,black_2rem,black_calc(100%-2rem),transparent)]"
                ref={chatContainerRef}
              >
                <AnimatePresence>
                  {messages.map((m, index) => (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start gap-3 my-4 ${
                        m.role === 'user' ? 'justify-end' : ''
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 backdrop-blur-xl
                          ${
                            m.role === 'user'
                              ? 'max-w-xs md:max-w-md bg-gradient-to-br from-purple-500/20 via-indigo-500/15 to-purple-600/20 text-white rounded-br-none border border-purple-400/20 shadow-[0_8px_32px_rgba(139,92,246,0.15)]'
                              : m.isSpontaneous
                              ? 'max-w-[256px] md:max-w-[358px] text-xs bg-gradient-to-br from-cyan-400/20 via-teal-500/15 to-emerald-500/20 text-white/80 rounded-bl-none border border-cyan-400/20 shadow-[0_8px_32px_rgba(6,182,212,0.2)]'
                              : 'max-w-xs md:max-w-md bg-gradient-to-br from-slate-600/20 via-slate-700/15 to-slate-800/20 text-white rounded-bl-none border border-slate-400/20 shadow-[0_8px_32px_rgba(71,85,105,0.15)]'
                          }`}
                      >
                        {m.imageUrl && (
                          <img
                            src={m.imageUrl}
                            alt="User upload"
                            className="rounded-lg mb-2 max-w-xs border border-white/10"
                          />
                        )}
                        <p className="whitespace-pre-wrap">
                          {m.content ||
                            (m.role === 'assistant' && (
                              <span className="animate-pulse">...</span>
                            ))}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <Toaster position="top-center" theme="dark" />
          <form
            onSubmit={handleSendMessage}
            className="p-4 md:p-6 pb-8 sticky bottom-0 z-20 overflow-visible"
          >
            <div className="relative">
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-teal-400 rounded-full transition-all duration-300 blur-lg 
                ${isInputFocused ? 'opacity-70 blur-xl' : 'opacity-40'}`}
              ></div>
              <div className="relative flex items-center bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-full p-2 transition-all duration-300 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <Button
                  type="button"
                  onClick={triggerFileSelect}
                  className="p-2 rounded-full bg-transparent hover:bg-white/10 transition-colors"
                  aria-label="Attach image"
                >
                  <Paperclip className="text-slate-400" />
                </Button>
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Talk to Aero..."
                  className="flex-grow bg-transparent focus:ring-0 focus:outline-none border-none text-lg text-white placeholder:text-slate-400 px-4"
                  disabled={isLoading}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  type="submit"
                  disabled={isLoading || (!input.trim() && !imageFile)}
                  className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shrink-0 disabled:opacity-50 disabled:saturate-50"
                  aria-label="Send message"
                >
                  <SendHorizonal className="text-white" />
                </Button>
              </div>
            </div>
            {imageUrl && (
              <div className="mt-4 ml-2 relative w-28 h-28 group backdrop-blur-sm bg-black/20 p-1.5 rounded-xl border border-white/10">
                <img
                  src={imageUrl}
                  alt="Image preview"
                  className="rounded-lg object-cover w-full h-full"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-0 right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/80 hover:bg-red-700/80 rounded-full"
                  onClick={() => {
                    setImageUrl(null);
                    setImageFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
