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
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { useUser } from '@clerk/nextjs';
import { ChatAssistantWithGeminiAction } from '@/utils/actions';
import { toast } from 'sonner';
import DeleteChatBtn from './DeleteChatBtn';

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

  // Scroll wanneer er nieuwe berichten zijn OF wanneer de AI aan het laden is
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
      {isOpen && (
        <Card className="mb-4 bg-muted w-80 md:w-96 h-[500px] shadow-2xl border border-border flex flex-col animate-in slide-in-from-bottom-5">
          <CardHeader className="flex flex-row items-center justify-between p-4 text-white bg-violet-800 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold">
                  Ai Carrière Coach
                </CardTitle>
                <span className="text-[10px] text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Altijd online
                </span>
              </div>
            </div>
            <DeleteChatBtn handleClear={handleClear} />
            <Button
              variant="default"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isLastMessage = index === messages.length - 1;
                  const isAi = message.role === 'assistant';

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-sm border shadow-sm transition-all ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-none border-transparent'
                            : `text-slate-800 rounded-tl-none ${
                                isLastMessage && isAi
                                  ? 'animate-highlight-jobify'
                                  : 'bg-white border-border'
                              }`
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  );
                })}
                {isPending && (
                  <div className="flex justify-start">
                    <div className="p-3 text-xs bg-white border rounded-tl-none border-border rounded-2xl animate-pulse">
                      Ai Coach typt...
                    </div>
                  </div>
                )}
                <div ref={scrollRef} className="h-1" />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form
              className="flex w-full gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Input
                placeholder="Typ je vraag..."
                value={input}
                onChange={handleOnChange}
              />
              <Button type="submit" size="icon" className="bg-primary shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
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
