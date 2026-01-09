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

  return (
    <Card className="bg-muted flex flex-col h-full min-h-[350px]">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          {job.position}

          {job.aiCoach && (
            <Badge variant="outline" className="text-primary border-primary">
              <Sparkles className="w-3 h-3 mr-1" /> AI Ready
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{job.company}</CardDescription>
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
