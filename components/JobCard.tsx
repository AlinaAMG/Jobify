'use client';
import { type JobType } from '@/utils/types';
import { Briefcase, CalendarDays, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import Link from 'next/link';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import JobInfo from './JobInfo';
import DeleteJobBtn from './DeleteJobBtn';
import { Sparkles } from 'lucide-react';
import { getStatusColor } from '@/utils/interview-utils';
import { cn } from '@/lib/utils';
import InterviewSection from './InterviewSection';

const JobCard = ({ job }: { job: JobType }) => {
  const date = new Date(job.createdAt).toLocaleDateString();
  const score = job.aiCoach?.matchingScore;
  const status = job.status.toLowerCase();

  // We laten de score zien alleen als de status niet "declined" is
  const showScore =
    typeof score === 'number' && !isNaN(score) && status !== 'declined';

  return (
    <Card className="bg-muted flex flex-col h-full min-h-[350px]">
      <CardHeader>
        <div className="flex justify-between items-start w-full">
          {/* Linkerkant: Titel en Bedrijf */}
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-bold leading-tight">
              {job.position}
            </CardTitle>
            <CardDescription className="text-base font-medium">
              {job.company}
            </CardDescription>

            {/* AI Ready Badge onder de bedrijfsnaam */}
            {job.aiCoach && (
              <Badge
                variant="outline"
                className="w-fit text-primary border-primary mt-1"
              >
                <Sparkles className="w-3 h-3 mr-1" /> AI Ready
              </Badge>
            )}
          </div>

          {/* Rechterkant: De Match Score Cirkel */}
          {showScore && (
            <div
              className={`flex flex-col items-center justify-center shrink-0 rounded-full w-14 h-14 border-2 shadow-sm ${
                score > 75
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : score > 50
                  ? 'border-amber-500 text-amber-600 bg-amber-50'
                  : 'border-red-500 text-red-600 bg-red-50'
              }`}
            >
              <span className="text-sm font-black leading-none">{score}%</span>
              <span className="text-[9px] uppercase font-bold">Match</span>
            </div>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="mt-4 grid  gap-4 flex-grow">
        <div className="grid grid-cols-2 gap-3 items-start">
          <JobInfo icon={<Briefcase />} text={job.mode} />
          <JobInfo icon={<MapPin />} text={job.location} />
          <JobInfo icon={<CalendarDays />} text={date} />
          {/* De Badge container */}
          <div className="flex justify-start">
            <Badge
              variant="outline"
              className={cn(
                'w-fit px-3 py-1 flex items-center gap-2 font-semibold capitalize transition-all shadow-sm',
                getStatusColor(job.status)
              )}
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full animate-pulse',
                  job.status?.toLowerCase() === 'declined' && 'bg-red-700',
                  job.status?.toLowerCase() === 'pending' && 'bg-yellow-500',
                  job.status?.toLowerCase() === 'interview' && 'bg-emerald-500'
                )}
              />
              {job.status}
            </Badge>
          </div>
        </div>
      </CardContent>

      {/* INTERVIEW SECTIE  */}
      <InterviewSection job={job} />
      <CardFooter className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-200/50">
        <Button asChild size="sm" variant="outline">
          <Link href={`/jobs/${job.id}`}>Bijwerken</Link>
        </Button>

        {/* AI COACH KNOP */}
        <Button
          asChild
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Link href={`/ai-coach/${job.id}`}>
            <Sparkles className="w-4 h-4 mr-2" /> AI Coach
          </Link>
        </Button>

        <DeleteJobBtn id={job.id} />
      </CardFooter>
    </Card>
  );
};
export default JobCard;
