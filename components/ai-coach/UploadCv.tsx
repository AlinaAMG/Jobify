import { Paperclip } from "lucide-react";
import { useRef } from "react";
import { Button } from "../ui/button";


type UploadCvProps = {
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UploadCv = ({onFileUpload}:UploadCvProps) => {
    // Binnen je component:
const fileInputRef = useRef<HTMLInputElement>(null);

const handleButtonClick = () => {
  fileInputRef.current?.click(); // Opent het upload-schermpje
};
  return (
  
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-sm font-medium">Upload je CV</label>
          
          {/* De onzichtbare echte input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileUpload}
            accept=".pdf"
            className="hidden" 
          />
      
          {/* De knop die de gebruiker ziet */}
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleButtonClick}
            className="w-full flex gap-2 border-dashed border-2 py-6 hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <Paperclip className="h-4 w-4" />
            Klik om PDF te uploaden
          </Button>
          
          <p className="text-xs text-muted-foreground italic">
            De tekst wordt automatisch uit je PDF gehaald en hierboven geplakt.
          </p>
        </div>
      );
  
}

export default UploadCv;