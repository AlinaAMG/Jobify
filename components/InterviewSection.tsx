"use client";

import { cn } from "@/lib/utils"
import { getDifferenceDaysHours } from "@/utils/interview-utils";
import { JobType } from "@/utils/types";
import { CalendarIcon, Clock } from "lucide-react"
import { Badge } from "./ui/badge";

type InterviewSectionProps= {
    job: JobType;
}

const InterviewSection = ({job}:InterviewSectionProps) => {
    const urgency = job.interviewDate
    ? getDifferenceDaysHours(new Date(job.interviewDate))
        : null;
       
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
    )
}

export default InterviewSection