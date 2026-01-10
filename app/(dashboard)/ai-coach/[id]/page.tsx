import { getSingleJobAction } from '@/utils/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

import CardBtn from '@/components/ai-coach-data/CardBtn';
import MissieStrategy from '@/components/ai-coach-data/MissieStrategy';
import Skills from '@/components/ai-coach-data/Skills';
import MissingSkills from '@/components/ai-coach-data/MissingSkills';
import CoverLetter from '@/components/ai-coach-data/CoverLetter';

const GenerateAiResultPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // 1. Data ophalen
  let job = null;
  if (id && id !== 'result') {
    job = await getSingleJobAction(id);
  }

  // 2. Als de job echt niet bestaat in de database
  if (!job && id !== 'result') {
    redirect('/jobs');
  }

  // 3. Situatie A: Er is GEEN job data (bijv. route is /ai-coach/result)
  // Toon het start-formulier
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p>Plak eerst je CV en vacature om een analyse te starten.</p>
        <Button asChild>
          <Link href="/ai-coach">Ga naar invoer</Link>
        </Button>
      </div>
    );
  }

  // 4. Situatie B: De job bestaat, maar er is nog GEEN AI-analyse gedaan
  // Toon de knop om de analyse nu uit te voeren
  if (!job.aiCoach) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-xl font-semibold">
          Vacature gevonden: {job.position}
        </h2>
        <p className="text-muted-foreground">
          Er is nog geen AI-analyse beschikbaar voor deze job.
        </p>
        <CardBtn job={job} />
      </div>
    );
  }

  // 5. Situatie C: De job EN de analyse bestaan.
  // Nu bouwen we het analysis object veilig op.
  const analysis = {
    id: job.aiCoach.id,
    mission: job.aiCoach.mission,
    strategy: job.aiCoach.strategy,
    matchScore: job.aiCoach.matchingScore ?? 0,
    summary: job.aiCoach.strategy,
    interviewTip: job.aiCoach.mission,
    coverLetter: job.aiCoach.coverLetter || '',
    matchingSkills: job.aiCoach.matchingSkills
      ? job.aiCoach.matchingSkills.split(', ')
      : [],
    missingSkills: job.aiCoach.missingSkills
      ? job.aiCoach.missingSkills.split(', ')
      : [],
    skills: job.aiCoach.matchingSkills
      ? job.aiCoach.matchingSkills.split(', ')
      : [],
  };

  let badgeColor = 'bg-red-600';
  if (analysis.matchScore >= 80) {
    badgeColor = 'bg-green-600';
  } else if (analysis.matchScore >= 50) {
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
          {analysis.matchScore}% Match Score
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
