import { CheckCircle2, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface SkillsJobProps {
  skills?: string[];
}
const SkillsJob = ({ skills }: SkillsJobProps) => {

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold flex items-center gap-2  uppercase tracking-wider">
          <Target className="w-4 h-4" />
          Belangrijkste trefwoorden voor je CV
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {skills &&
          skills?.map((skill, index) => (
            <Badge
              variant="secondary"
              key={`${skill}-${index}`}
              className="bg-indigo-50 text-indigo-700 dark:hover:bg-indigo-200 cursor-pointer border-indigo-100 px-3 py-1 "
            >
              <CheckCircle2 className="w-3 h-3 mr-1 opacity-70" />
              {skill}
            </Badge>
          ))}
      </CardContent>
    </Card>
  );
};

export default SkillsJob;
