import { Lightbulb, MessageSquareQuote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type StrategyProps = {
    summary: string;
    interviewTip: string;
}

const Strategy = ({ summary,interviewTip}:StrategyProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-500 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            De Kernmissie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed font-medium">{summary}</p>
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
          <p className="font-medium leading-relaxed">{interviewTip}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Strategy;
