import { ScrollArea } from './ui/scroll-area';

type AiMessageListProps = {
  messages: { role: string; content: string }[];
  isPending: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

const AiMessageList = ({
  messages,
  isPending,
  scrollRef,
}: AiMessageListProps) => {
  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1;
          const isAi = message.role === 'assistant';

          return (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
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
        <div
          ref={scrollRef as React.RefObject<HTMLDivElement>}
          className="h-1"
        />
      </div>
    </ScrollArea>
  );
};

export default AiMessageList;
