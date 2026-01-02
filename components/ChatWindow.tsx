import { Bot, Maximize2, Minimize2, X } from 'lucide-react';
import DeleteChatBtn from './DeleteChatBtn';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import AiMessageList from './AiMessageList';
import AiFormChat from './AiFormChat';

type ChatWindowProps = {
  messages: { content: string; role: string }[];
  isPending: boolean;
  input: string;
  handleClear: () => void;
  handleSend: () => void;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
};
const ChatWindow = ({
  messages,
  isPending,
  input,
  handleClear,
  handleOnChange,
  handleSend,
  setIsOpen,
  scrollRef,
  isOpen,
  onToggleExpand,
  isExpanded,
}: ChatWindowProps) => {
  const canClear = messages.length > 1;
  return (
    <div>
      {isOpen && (
        <Card
          className={`mb-4 bg-muted w-80 md:w-96 h-[500px] shadow-2xl border border-border flex flex-col animate-in slide-in-from-bottom-5 ${
            isExpanded
              ? 'w-[90vw] md:w-[600px] h-[80vh]'
              : 'w-80 md:w-96 h-[500px]'
          } `}
        >
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
            {/* delete btn */}
            <DeleteChatBtn handleClear={handleClear} isVisible={canClear} />
            {/* toggle btn */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleExpand}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
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
            <AiMessageList
              messages={messages}
              isPending={isPending}
              scrollRef={scrollRef}
            />
          </CardContent>
          <CardFooter>
            <AiFormChat
              handleOnChange={handleOnChange}
              handleSend={handleSend}
              input={input}
            />
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ChatWindow;
