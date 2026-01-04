import { AiAnalysisResult } from '@/utils/types';
import CoverLetter from '@/components/CoverLetter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Target,
  Lightbulb,
  MessageSquareQuote,
  CheckCircle2,
} from 'lucide-react';
import MatchScore from './MatchScore';

type AiCoachResultProps = {
  data: AiAnalysisResult | null;
};

const AiCoachResult = ({ data }: AiCoachResultProps) => {
  if (!data) return null;

  return (
    <div className="grid  gap-6 mt-8 animate-in fade-in">
      {/* 1. Key Skills / Keywords Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2  uppercase tracking-wider">
            <Target className="w-4 h-4" />
            Belangrijkste trefwoorden voor je CV
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-indigo-50 text-indigo-700 dark:hover:bg-primary cursor-pointer border-indigo-100 px-3 py-1"
            >
              <CheckCircle2 className="w-3 h-3 mr-1 opacity-70" />
              {skill}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {/*2. Match Score sectie */}
      <div className="md:col-span-1">
        <MatchScore score={data.matchScore || 85} />
      </div>

      {/* 3. De kernmissie Sectie */}
      <div className="grid md:grid-cols-2 gap-3">
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-500 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              De Kernmissie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed font-medium">{data.summary}</p>
          </CardContent>
        </Card>

        {/* 4. Coach's Strategy Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2  uppercase tracking-wider text-slate-500">
              <MessageSquareQuote className="w-4 h-4" />
              Coach Strategie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium leading-relaxed">{data.interviewTip}</p>
          </CardContent>
        </Card>
      </div>

      <CoverLetter description={data.summary} skills={data.skills} />
    </div>
  );
};

export default AiCoachResult;
