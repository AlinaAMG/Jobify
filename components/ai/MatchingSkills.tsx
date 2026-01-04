import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"

type MatchingSkillsProps = {
    matchingSkills: string[];
 }
const MatchingSkills = ({matchingSkills}:MatchingSkillsProps) => {
  return (
    
        <Card className="border-green-100 bg-green-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm dark:text-green-100 font-bold flex items-center gap-2 text-green-700 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Jouw Sterke Punten
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {matchingSkills?.map((skill) => (
              <Badge
                key={skill}
                className="bg-green-100 hover:bg-green-200 cursor-pointer text-green-800 border-green-200"
              >
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>
  )
}

export default MatchingSkills