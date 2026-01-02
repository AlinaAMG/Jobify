import { Bot, X } from "lucide-react";
import DeleteChatBtn from "./DeleteChatBtn"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import AiMessageList from "./AiMessageList";
import AiFormChat from "./AiFormChat";

type ChatWindowProps = {
    messages: { content: string, role: string }[],
    isPending: boolean;
    input: string;
    handleClear: () => void;
    handleSend: () => void;
    handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    scrollRef:React.RefObject<HTMLDivElement | null>;
    isOpen: boolean;
    
    
}
const ChatWindow = ({messages,isPending,input,handleClear,handleOnChange,handleSend,setIsOpen ,scrollRef,isOpen}:ChatWindowProps) => {
    return (
  <div>
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
  )
}

export default ChatWindow