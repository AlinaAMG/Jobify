'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';


const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hoi! Ik ben je AI Coach. Heb je hulp nodig bij je sollicitatie of  bij het schrijven van je solicitaiebrief?',
    },
  ]);
  const [input, setInput] = useState('');


  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSend = () => { };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Het Chat Window */}
      {isOpen && (
        <Card className="mb-4 bg-muted w-80 md:w-96 h-[500px] shadow-2xl border border-border flex flex-col animate-in slide-in-from-bottom-5">
          <CardHeader className="bg-violet-800 text-white rounded-t-xl p-4 flex flex-row items-center justify-between">
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
                {messages &&
                  messages.map((message, index) => (
                    <div key={index} className="flex justify-end">
                      <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-violet-600 text-white rounded-tr-none">
                        {message.content}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form className="flex w-full gap-2" onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}>
              <Input placeholder="Typ je vraag..." value={input} onChange={handleOnChange} />
              <Button type="submit" size="icon" className="bg-primary shrink-0">
                <Send  className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'rotate-90 bg-slate-800 hover:bg-slate-900' : 'bg-primary '}`}
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </Button>
    </div>
  );
};

export default ChatAssistant;
