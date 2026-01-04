import { Card } from './ui/card';

const MatchScore = ({ score }: { score: number }) => {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (s >= 60 && s <= 80) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };
  return (
    <Card className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border-border shadow-sm">
      <div className="relative w-32 h-32">
        {/* SVG voor de cirkel */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={364}
            strokeDashoffset={364 - (364 * score) / 100}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${getColor(
              score
            )}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold dark:text-white">{score}%</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">
        Match Score
      </p>
    </Card>
  );
};

export default MatchScore;
