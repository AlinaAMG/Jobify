import { getSingleJobAction } from '@/utils/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText } from 'lucide-react';
import GenerateLetterBtn from '@/components/ai-coach-data/GenerateLetterBtn';
import CardBtn from '@/components/ai-coach-data/CardBtn';
import MissieStrategy from '@/components/ai-coach-data/MissieStrategy';
import Skills from '@/components/ai-coach-data/Skills';
import MissingSkills from '@/components/ai-coach-data/MissingSkills';
import CoverLetter from '@/components/ai-coach-data/CoverLetter';

const GenerateAiResultPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const job = await getSingleJobAction(id);

  if (!job) {
    redirect('/jobs');
  }

  const analysis = job.aiCoach;

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <CardBtn job={job} />
      </div>
    );
  }

  let badgeColor = 'bg-red-600';
  if (analysis.matchingScore >= 80) {
    badgeColor = 'bg-green-600';
  } else if (analysis.matchingScore >= 50) {
    badgeColor = 'bg-orange-500';
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" asChild size="sm">
          <Link href="/jobs" className="capitalize flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Terug naar vacatures
          </Link>
        </Button>
        <Badge
          className={`text-xl px-4 py-1 text-white border-none ${badgeColor}`}
        >
          {analysis.matchingScore}% Match Score
        </Badge>
      </div>
      <div className="grid gap-6">
        {/* Missie & Strategie */}
        <MissieStrategy analysis={analysis} />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Skills Sectie */}
          <Skills analysis={analysis} />
          {/* Missing skills */}
          <MissingSkills analysis={analysis} />
        </div>

        {/* Sollicitatiebrief */}
        <CoverLetter analysis={analysis} />
      </div>
    </div>
  );
};

export default GenerateAiResultPage;
