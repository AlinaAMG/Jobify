import { MessageCircle, X } from "lucide-react"
import { Button } from "./ui/button"

type AiChatBtnProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
 }

const AiChatBtn = ({ setIsOpen, isOpen }:AiChatBtnProps) => {
  return (
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
  )
}

export default AiChatBtn;