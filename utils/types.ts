import { Prisma } from '@prisma/client';
import * as z from 'zod';

export type JobType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  position: string;
  description: string;
  company: string;
  location: string;
  status: string;
  interviewDate: Date | null | undefined;
  interviewTime: string | undefined | null;
  mode: string;
  aiCoach?: AiCoachType | null;
};

export type AiCoachType = {
  id: string;
  matchScore: number;
  mission: string;
  company?: string;
  strategy: string;
  missingSkills: string[] | string;
  matchingSkills: string[] | string;
  coverLetter?: string | null;
};

export type Profile = {
  id: string;
  clerkId: string;
  resume: string;
};
export enum JobStatus {
  Pending = 'pending',
  Interview = 'interview',
  Declined = 'declined',
}

export enum JobMode {
  FullTime = 'full-time',
  PartTime = 'part-time',
  Internship = 'internship',
}

export const createAndEditJobSchema = z.object({
  position: z.string().min(2, {
    message: 'Functietitel moet minimaal 2 tekens bevatten.',
  }),
  company: z.string().min(2, {
    message: 'Bedrijfsnaam moet minimaal 2 tekens bevatten.',
  }),
  location: z.string().min(2, {
    message: 'Locatie moet minimaal 2 tekens bevatten',
  }),
  status: z.nativeEnum(JobStatus),
  interviewDate: z.date().optional().nullable(),
  interviewTime: z.string().optional().nullable(),
  mode: z.nativeEnum(JobMode),
  description: z
    .string()
    .min(20, { message: 'Omschrijving moet minimaal 20 tekens bevatten.' }),
});

export type CreateAndEditJobType = z.infer<typeof createAndEditJobSchema>;

export type GetAllJobsActionTypes = {
  search?: string;
  jobStatus?: string;
  page?: number;
  limit?: number;
};

export type AiAnalysisResult = {
  skills: string[];
  strategy: string;
  mission: string;
  coverLetter: string;
  matchScore: number;
  resume: string;
  matchingSkills: string[];
  missingSkills: string[];
};

export const AiCoachFormSchema = z.object({
  description: z.string().min(20, {
    message: 'De vacatureomschrijving is te kort. Voeg minimaal 20 tekens toe.',
  }),
  resume: z.string().min(20, {
    message: 'De cv text is te kort.Voeg minimaal 20 tekens toe.',
  }),
});
export type AiCoachFormValues = z.infer<typeof AiCoachFormSchema>;

export type JobWithAiCoach = Prisma.JobGetPayload<{
  include: { aiCoach: true };
}>;
