'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useUser } from '@clerk/nextjs';
import { ChatAssistantWithGeminiAction } from '@/utils/actions';
import { toast } from 'sonner';
import DeleteChatBtn from './DeleteChatBtn';
import AiMessageList from './AiMessageList';
import AiFormChat from './AiFormChat';
import ChatWindow from './ChatWindow';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userName = useUser().user?.firstName || 'Gebruiker';

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hoi ${userName}! Welkom op je Jobify dashboard. Hoe kan ik je vandaag helpen met je carrière?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (input.trim() === '' || isPending) return;
    const userMessage = { role: 'user', content: input };
    const currentInput = input;

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      try {
        const result = await ChatAssistantWithGeminiAction(
          messages,
          currentInput
        );

        if (result.success) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: result.content },
          ]);
        } else {
          toast.error('Ai Coach online:' + result.content);
        }
      } catch (error) {
        toast.error('Systeemfout:Probeer het later opnieeuw.');
      }
    });
  };

  const handleClear = () => {
    if (confirm('Weet je zeker dat je de chat wil wissen?'))
      setMessages([
        {
          role: 'assistant',
          content: `Hoi ${userName}! De chat is gewist.Hoe kan ik je opnieuw helpen?`,
        },
      ]);
  };

  return (
    <div className="fixed z-50 flex flex-col items-end bottom-6 right-6">
      {/* Het Chat Window */}
      <ChatWindow
        messages={messages}
        isPending={isPending}
        input={input}
        handleClear={handleClear}
        handleOnChange={handleOnChange}
        handleSend={handleSend}
        setIsOpen={setIsOpen}
        scrollRef={scrollRef}
        isOpen={isOpen}
      />

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen ? 'rotate-90 bg-violet-900' : 'bg-primary '
        }`}
        size="icon"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>
    </div>
  );
};

export default ChatAssistant;
