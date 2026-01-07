import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"


type MissingSkillsProps = {
    missingSkills: string[];
}
const MissingSkills = ({missingSkills}:MissingSkillsProps) => {
  return (
    <Card className="border-slate-200 dark:border-amber-900/50 bg-slate-50/50 dark:bg-amber-700/10">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-600 dark:text-amber-400 uppercase tracking-wider">
        <AlertCircle className="w-4 h-4" />
        Focuspunten voor je CV
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-wrap gap-2">
      {missingSkills.map((skill) => (
        <Badge
          key={skill}
          variant="outline"
          className="text-slate-500 dark:text-amber-200 border-slate-300 dark:border-amber-800 bg-transparent"
        >
          {skill}
        </Badge>
      ))}
    </CardContent>
  </Card>
  )
}

export default MissingSkills