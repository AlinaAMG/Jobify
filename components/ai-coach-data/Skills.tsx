import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AiCoachType } from '@/utils/types';
import { Badge } from '../ui/badge';

type SkillsProps = {
  analysis: AiCoachType;
};

const Skills = ({ analysis }: SkillsProps) => {
  // 1. Zorg dat we ALTIJD een array hebben (voor zowel AI als Database data)
  const skillsArray = Array.isArray(analysis.matchingSkills)
    ? analysis.matchingSkills
    : typeof analysis.matchingSkills === 'string'
    ? analysis.matchingSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
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
        <div className="flex flex-wrap gap-2">
          {skillsArray.length > 0 ? (
            skillsArray.map((skill, index) => (
              <Badge
                key={`${skill}-${index}`}
                variant="secondary"
                className="bg-green-50 text-green-700 border-green-100 px-3 py-1 hover:bg-green-100 transition-colors"
              >
                {/* Een klein vinkje in de badge voor extra detail */}
                <CheckCircle2 className="w-3 h-3 mr-1 opacity-70" />
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Geen directe matches gevonden.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Skills