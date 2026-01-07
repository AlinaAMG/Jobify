import { Lightbulb, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { AiCoachType } from "@/utils/types";


export type MissieStrategyProps = {
    analysis: AiCoachType;
 }
const MissieStrategy = ({analysis}:MissieStrategyProps) => {
  return (
   
       <Card className="border-t-4 border-t-purple-500 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-purple-500 w-5 h-5" />
              <CardTitle>Interview Tip & Strategie</CardTitle>
            </div>
            <CardDescription className="italic text-base text-foreground">
              "{analysis?.mission}"
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-yellow-500 w-5 h-5" />
              <h3 className="font-semibold text-lg text-primary">
                Match Analyse
              </h3>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {analysis?.strategy}
            </p>
          </CardContent>
         </Card>
         
  )
}

export default MissieStrategy;