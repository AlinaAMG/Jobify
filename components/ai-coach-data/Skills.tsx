import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { type MissieStrategyProps } from "./MissieStrategy"


const Skills = ({analysis}:MissieStrategyProps) => {
  return (
    <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <CardTitle className="text-sm uppercase tracking-wider">
                  Overeenkomende Skills
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {analysis.matchingSkills}
              </p>
            </CardContent>
          </Card>
  )
}

export default Skills