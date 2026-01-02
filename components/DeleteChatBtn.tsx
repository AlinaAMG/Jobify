import {  Trash2 } from "lucide-react";
import { Button } from "./ui/button";



const DeleteChatBtn = ({
  handleClear,
  isVisible,
}: {
  handleClear: () => void;
  isVisible: boolean;
}) => {
  if (!isVisible) return null;
  return (
    <div className="flex items-center gap-1 ">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClear}
        className="text-white hover:bg-white/20 h-8 w-8 "
        title="Chat Wissen"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default DeleteChatBtn;
