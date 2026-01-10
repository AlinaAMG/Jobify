import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { AiCoachType } from "@/utils/types"

type MissingSkillsProps = {
    analysis: AiCoachType;
}

const MissingSkills = ({ analysis }: MissingSkillsProps) => {
  const skillsList = Array.isArray(analysis.missingSkills)
    ? analysis.missingSkills // Het is al een array (AI versie)
    : typeof analysis.missingSkills === 'string'
    ? analysis.missingSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean) // Het was een string (DB versie)
    : []; // Het is leeg of undefined
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
        <ul className="space-y-3">
          {skillsList.length > 0 ? (
            skillsList.map((skill, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed dark:text-slate-200"
              >
                {/* Het bolletje/bullet point */}
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500 shadow-sm" />
                <span>{skill}</span>
              </li>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Geen aandachtspunten gevonden.
            </p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default MissingSkills