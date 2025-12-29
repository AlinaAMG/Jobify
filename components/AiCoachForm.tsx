import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Textarea } from "./ui/textarea";

type AiCoachFormProps = {
    onSubmit: () => void;
    isAnalyzing: boolean;
    text: string;
    setText: (value: string) => void;

}

 const AiCoachForm = ({onSubmit,isAnalyzing,text,setText}:AiCoachFormProps) => {
  return (
    <div>AiCoachForm</div>
  )
}

export default AiCoachForm;
