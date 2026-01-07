import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type AiFormChatProps = {
    handleSend: () => void;
    input: string;
    handleOnChange:(e: React.ChangeEvent<HTMLInputElement>) => void
    
}

const AiFormChat = ({handleSend,input,handleOnChange}:AiFormChatProps) => {
  return (
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
  )
}

export default AiFormChat