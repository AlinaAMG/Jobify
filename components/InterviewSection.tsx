"use client";

import { cn } from "@/lib/utils"
import { getDifferenceDaysHours } from "@/utils/interview-utils";
import { JobType } from "@/utils/types";
import { CalendarIcon, Clock } from "lucide-react"
import { Badge } from "./ui/badge";
import { useEffect, useState } from 'react';

type InterviewSectionProps = {
  job: JobType;
};

const InterviewSection = ({ job }: InterviewSectionProps) => {
  const [mounted, setMounted] = useState(false);

  // 1. Zodra de component in de browser geladen is, zetten we mounted op true
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Als we nog op de server zijn, renderen we even niets (voorkomt de crash)
  if (!mounted) return <div className="h-6" />;

  // 3. Pas nu berekenen we de urgentie, inclusief de tijd!
  const urgency = job.interviewDate
    ? getDifferenceDaysHours(job.interviewDate, job.interviewTime || undefined)
    : null;

  if (!urgency) return null;

  return (
    <>
      {job.status === 'interview' && job.interviewDate && urgency && (
        <div className="mx-6 mb-4 p-3 rounded-xl border border-dashed flex flex-col gap-2 ">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Interview Gepland
            </span>
            <Badge className={cn('text-[10px] px-2 py-0', urgency.color)}>
              {urgency.text}
            </Badge>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center text-xs text-slate-600">
              <CalendarIcon className="w-3 h-3 mr-1" />
              {new Date(job.interviewDate).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'short',
              })}
            </div>
            <div className="flex items-center text-xs text-slate-600">
              <Clock className="w-3 h-3 mr-1" />
              {job.interviewTime || '--:--'}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewSection