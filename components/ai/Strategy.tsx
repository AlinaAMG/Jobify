import { Lightbulb, MessageSquareQuote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type StrategyProps = {
    summary: string;
    interviewTip: string;
}

const Strategy = ({ summary,interviewTip}:StrategyProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 dark:text-slate-400 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            De Kernmissie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed font-medium dark:text-slate-300">
            {summary}
          </p>
        </CardContent>
      </Card>

      {/* 4. Coach's Strategy Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2  uppercase tracking-wider dark:text-slate-400">
            <MessageSquareQuote className="w-4 h-4" />
            Coach Strategie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium leading-relaxed dark:text-slate-300">
            {interviewTip}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Strategy;
