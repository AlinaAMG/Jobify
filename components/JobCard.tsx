import { type JobType } from '@/utils/types';
import { Briefcase, CalendarDays, MapPin, RadioTower } from 'lucide-react';
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

const JobCard = ({ job }: { job: JobType }) => {
  const date = new Date(job.createdAt).toLocaleDateString();

  return (
    <Card className="bg-muted">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          {job.position}
          {/* Als er al een aiCoach analyse is, toon een klein icoontje */}
          {job.aiCoach && (
            <Badge variant="outline" className="text-primary border-primary">
              <Sparkles className="w-3 h-3 mr-1" /> AI Ready
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{job.company}</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="mt-4 grid grid-cols-2 gap-4">
        <JobInfo icon={<Briefcase />} text={job.mode} />
        <JobInfo icon={<MapPin />} text={job.location} />
        <JobInfo icon={<CalendarDays />} text={date} />
        <Badge className="w-32 justify-center">
          <JobInfo
            icon={<RadioTower className="w-4 h-4" />}
            text={job.status}
          />
        </Badge>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/jobs/${job.id}`}>Bijwerken</Link>
        </Button>

        {/* NIEUWE KNOP: AI COACH */}
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