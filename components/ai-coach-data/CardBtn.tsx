import Link from "next/link"
import { Button } from "../ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Sparkles } from "lucide-react";

type CardBtnProps  = {
    job: {
      id: string;
      company: string;
    };
  }

const CardBtn = ({ job }: CardBtnProps)  => {
  return (
    <Card className="w-[450px] text-center shadow-lg border-t-4 border-t-primary">
    <CardHeader>
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
      </div>
      <CardTitle>AI Coach voor {job.company}</CardTitle>
      <CardDescription>
        Er is nog geen analyse voor deze vacature. Laat Gemini je helpen
        met een diepe analyse en een brief.
      </CardDescription>
    </CardHeader>
    <CardFooter className="justify-center">
      <Button asChild size="lg" className="gap-2">
        <Link href={`/ai-coach?id=${job.id}`}>Start AI Analyse</Link>
      </Button>
    </CardFooter>
  </Card>
  )
}

export default CardBtn;