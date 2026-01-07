import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { AiCoachType } from "@/utils/types"

type MissingSkillsProps = {
    analysis: AiCoachType;
}

const MissingSkills = ({analysis}:MissingSkillsProps) => {
  return (
    <Card className="border-l-4 border-l-amber-500">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="text-amber-500 w-5 h-5" />
        <CardTitle className="text-sm uppercase tracking-wider">
          Aandachtspunten
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        {analysis.missingSkills}
      </p>
    </CardContent>
  </Card>
  )
}

export default MissingSkills