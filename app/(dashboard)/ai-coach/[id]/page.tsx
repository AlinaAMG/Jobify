
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getSingleJobAction } from '@/utils/actions';
import { ArrowLeft, Lightbulb, Target } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const GenerateAiResultPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const job = await getSingleJobAction(id);
  if (!job) {
    redirect('/jobs');
  }

  const analysis = job?.aiCoach;
  // Geen data in Neon
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Card className="w-[450px] text-center">
          <CardHeader>
            <CardTitle>Geen AI Analyse gevonden</CardTitle>
            <CardDescription>
              Er is nog geen specifiek advies opgeslagen voor deze vacature.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href={`/ai-coach?jobId=${id}`}>Start AI Coach</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" asChild size="sm">
          <Link href="/jobs" className="capitalize flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Terug naar jobs
          </Link>
        </Button>
        <Badge variant="secondary" className="text-xl px-4 py-1">
          {analysis?.matchingScore}% Match Score
        </Badge>
      </div>
      <div className="grid gap-6">
        {/*  Strategie en Missie */}
        <Card className="border-t-4 border-t-purple-500">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-purple-500 w-5 h-5" />
              <CardTitle>Jouw Missie voor {analysis.company}</CardTitle>
            </div>
            <CardDescription className="italic text-base">
              "{analysis.mission}"
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-yellow-500 w-5 h-5" />
              <h3 className="font-semibold text-lg">Strategisch Plan</h3>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {analysis.strategy}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateAiResultPage;
